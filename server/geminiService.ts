import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { estimateMealFromText } from "../src/utils/mealEstimator.ts";

let genAIClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAIClient;
}

export interface UserContext {
  name?: string;
  currentWeightKg?: number;
  targetWeightKg?: number;
  goal?: string;
  targetCalories?: number;
  caloriesConsumed?: number;
  caloriesRemaining?: number;
  waterMl?: number;
  waterTargetMl?: number;
  steps?: number;
  language?: string;
}

export interface ChatHistoryItem {
  sender: "user" | "coach";
  text: string;
}

// Timeout helper to avoid any hanging serverless function
function withTimeout<T>(promise: Promise<T>, timeoutMs = 25000): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Délai d'attente dépassé pour l'analyse IA.")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    if (timer) clearTimeout(timer);
  });
}

function parseBase64Image(imageBase64?: string): { mimeType: string; data: string } | null {
  if (!imageBase64 || typeof imageBase64 !== "string") return null;
  const trimmed = imageBase64.trim();
  if (!trimmed) return null;

  const dataUrlMatch = trimmed.match(/^data:([^;]+);base64,(.+)$/s);
  if (dataUrlMatch) {
    const rawMime = dataUrlMatch[1].toLowerCase().trim();
    const mimeType = rawMime.startsWith("image/") ? rawMime : "image/jpeg";
    const data = dataUrlMatch[2].replace(/\s+/g, "");
    if (!data) return null;
    return { mimeType, data };
  }

  // Fallback for raw base64 without data URL prefix
  const cleaned = trimmed.replace(/\s+/g, "");
  if (cleaned.length > 64 && /^[A-Za-z0-9+/=]+$/.test(cleaned)) {
    return { mimeType: "image/jpeg", data: cleaned };
  }

  return null;
}

function formatGeminiErrorMessage(error: any): string {
  const raw = String(error?.message || error || "");
  if (/403|PERMISSION_DENIED|API_KEY_INVALID|API key not valid/i.test(raw)) {
    return "Clé API Gemini invalide ou manquante. Vérifiez la configuration dans Settings > Secrets.";
  }
  if (/429|RESOURCE_EXHAUSTED|quota/i.test(raw)) {
    return "Quota de requêtes IA temporairement atteint. Veuillez réessayer dans quelques secondes.";
  }
  if (/404|NOT_FOUND/i.test(raw)) {
    return "Modèle IA indisponible pour cette requête.";
  }
  if (/Délai d'attente|Timeout/i.test(raw)) {
    return "L'analyse IA a pris trop de temps. Essayez avec une image plus légère ou réessayez.";
  }
  return raw || "Erreur lors de l'analyse par l'intelligence artificielle.";
}

function getFallbackReply(params: {
  message?: string;
  userContext?: UserContext;
  language?: string;
}): string {
  const { message, userContext, language } = params;
  const targetLang = (language || userContext?.language || "auto").toLowerCase();

  const isEnglish = targetLang === "en" || /^(hi|hello|how|what|can|please|weight|diet)/i.test(message || "");
  const isSpanish = targetLang === "es" || /^(hola|cómo|que|puedo|peso|dieta)/i.test(message || "");
  const isGerman = targetLang === "de" || /^(hallo|guten|wie|kann|gewicht)/i.test(message || "");
  const isNorwegian = targetLang === "no" || /^(hei|hallo|hvordan|hva|kan)/i.test(message || "");
  const isItalian = targetLang === "it" || /^(ciao|come|cosa|posso|peso)/i.test(message || "");
  const isPortuguese = targetLang === "pt" || /^(olá|como|o que|posso|peso)/i.test(message || "");

  let fallbackReply = `Bonjour ${userContext?.name || ""} ! En tant que votre coach nutritionnel, je vous conseille de privilégier des aliments à forte densité nutritionnelle et faible indice glycémique : légumes colorés, protéines maigres (poulet, poisson blanc, œufs, tofu) et glucides complexes (quinoa, lentilles, avoine). Pensez également à boire vos ${userContext?.waterTargetMl || 2000} ml d'eau quotidiens pour stimuler votre métabolisme !`;

  if (isEnglish) {
    fallbackReply = `Hello ${userContext?.name || ""}! As your nutrition coach, I recommend focusing on nutrient-dense foods with a low glycemic index: vibrant vegetables, lean proteins (chicken, white fish, eggs, tofu), and complex carbs (quinoa, lentils, oats). Don't forget to drink your ${userContext?.waterTargetMl || 2000} ml of water daily to support your metabolism!`;
  } else if (isSpanish) {
    fallbackReply = `¡Hola ${userContext?.name || ""}! Como tu coach nutricional, te recomiendo alimentos de alta densidad nutricional y bajo índice glucémico: verduras variadas, proteínas magras (pollo, pescado, huevos, tofu) y carbohidratos complejos (quinoa, lentejas, avena). ¡Recuerda beber tus ${userContext?.waterTargetMl || 2000} ml de agua diarios!`;
  } else if (isGerman) {
    fallbackReply = `Hallo ${userContext?.name || ""}! Als dein Ernährungscoach empfehle ich nährstoffreiche Lebensmittel: buntes Gemüse, magere Proteine (Geflügel, weißer Fisch, Eier, Tofu) und komplexe Kohlenhydrate (Quinoa, Linsen, Haferflocken). Denk auch daran, täglich ${userContext?.waterTargetMl || 2000} ml Wasser zu trinken!`;
  } else if (isNorwegian) {
    fallbackReply = `Hei ${userContext?.name || ""}! Som din ernæringscoach anbefaler jeg næringsrik mat med lav glykemisk indeks: fargerike grønnsaker, magert protein (kylling, hvit fisk, egg, tofu) og komplekse karbohydrater (quinoa, linser, havre). Husk også å drikke dine ${userContext?.waterTargetMl || 2000} ml vann daglig!`;
  } else if (isItalian) {
    fallbackReply = `Ciao ${userContext?.name || ""}! Come tuo coach nutrizionale, ti consiglio cibi ricchi di nutrienti e a basso indice glicemico: verdure fresche, proteine magre (pollo, pesce, uova, tofu) e carboidrati complessi (quinoa, lenticchie, avena). Bevi i tuoi ${userContext?.waterTargetMl || 2000} ml di acqua al giorno!`;
  } else if (isPortuguese) {
    fallbackReply = `Olá ${userContext?.name || ""}! Como seu coach nutricional, recomendo alimentos ricos em nutrientes e com baixo índice glicêmico: legumes variados, proteínas magras e carboidratos complexos. Beba seus ${userContext?.waterTargetMl || 2000} ml de água diariamente!`;
  } else if (targetLang === "nl") {
    fallbackReply = `Hallo ${userContext?.name || ""}! Als uw voedingscoach raad ik u aan te focussen op voedzame voedingsmiddelen met een lage glycemische index: verse groenten, magere eiwitten en complexe koolhydraten. Drink dagelijks uw ${userContext?.waterTargetMl || 2000} ml water!`;
  } else if (targetLang === "pl") {
    fallbackReply = `Cześć ${userContext?.name || ""}! Jako Twój trener żywieniowy zalecam wybieranie produktów o wysokiej gęstości odżywczej i niskim indeksie glikemicznym: kolorowe warzywa, chude białka i węglowodany złożone. Pamiętaj o piciu ${userContext?.waterTargetMl || 2000} ml wody dziennie!`;
  } else if (targetLang === "sv") {
    fallbackReply = `Hej ${userContext?.name || ""}! Som din kostcoach rekommenderar jag näringsrik mat: färgstarka grönsaker, magert protein och komplexa kolhydrater. Kom ihåg att dricka dina ${userContext?.waterTargetMl || 2000} ml vatten dagligen!`;
  } else if (targetLang === "ru") {
    fallbackReply = `Здравствуйте, ${userContext?.name || ""}! Как ваш нутрициолог, рекомендую делать упор на продукты с высокой питательной плотностью: свежие овощи, нежирный белок и сложные углеводы. Пейте ${userContext?.waterTargetMl || 2000} мл воды ежедневно!`;
  } else if (targetLang === "ja") {
    fallbackReply = `こんにちは、${userContext?.name || ""}さん！AI栄養コーチとして、低GI値で栄養価の高い食事をお勧めします。野菜、良質なタンパク質、複合炭水化物をバランスよく摂り、1日${userContext?.waterTargetMl || 2000}mlの水分補給を心がけましょう！`;
  } else if (targetLang === "zh") {
    fallbackReply = `你好，${userContext?.name || ""}！作为您的AI营养教练，建议多选择低升糖指数的高营养密度食物：丰富蔬菜、优质蛋白和复合碳水化合物。别忘了每天喝足 ${userContext?.waterTargetMl || 2000} 毫升水！`;
  } else if (targetLang === "ar") {
    fallbackReply = `مرحباً ${userContext?.name || ""}! بصفتي مدربك الغذائي، أوصيك بالتركيز على الأطعمة الغنية بالعناصر الغذائية: الخضروات، البروتينات الخالية من الدهون، والكربوهيدرات المعقدة. تذكر شرب ${userContext?.waterTargetMl || 2000} مل من الماء يومياً!`;
  } else if (targetLang === "tr") {
    fallbackReply = `Merhaba ${userContext?.name || ""}! Beslenme koçunuz olarak, düşük glisemik indeksli besleyici gıdaları tercih etmenizi öneririm: sebzeler, yağsız proteinler ve kompleks karbonhidratlar. Günde ${userContext?.waterTargetMl || 2000} ml su içmeyi unutmayın!`;
  }

  return fallbackReply;
}

export async function chatWithCoach(params: {
  message?: string;
  userContext?: UserContext;
  history?: ChatHistoryItem[];
  language?: string;
}): Promise<string> {
  const { message, userContext, history, language } = params;
  const targetLang = (language || userContext?.language || "auto").toLowerCase();
  const fallbackReply = getFallbackReply({ message, userContext, language });
  const ai = getGenAI();

  if (!ai) {
    return fallbackReply;
  }

  const systemInstruction = `Tu es NutriCoach, l'assistant nutritionnel et coach minceur personnel expert et chaleureux de l'application mobile NutriCoach.
Tu t'adresses directement à l'utilisateur : ${userContext?.name || "l'utilisateur"}.
Informations de l'utilisateur :
- Poids actuel : ${userContext?.currentWeightKg || 70} kg
- Poids cible : ${userContext?.targetWeightKg || 65} kg
- Objectif : ${userContext?.goal || "perdre"}
- Budget calorique cible : ${userContext?.targetCalories || 1600} kcal/jour
- Calories consommées aujourd'hui : ${userContext?.caloriesConsumed || 0} kcal
- Calories restantes : ${userContext?.caloriesRemaining || 1600} kcal
- Hydratation : ${userContext?.waterMl || 0} / ${userContext?.waterTargetMl || 2000} ml
- Pas effectués : ${userContext?.steps || 0} pas

CONSIGNES DE MULTILINGUISME UNIVERSEL (TOUTES LES LANGUES SUPPORTÉES) :
1. TU ES STRICTEMENT POLYGLOTTE ET TU DOIS TOUJOURS RÉPONDRE DANS LA LANGUE DE L'UTILISATEUR.
- Si l'utilisateur s'exprime en anglais, réponds INTÉGRALEMENT en anglais.
- S'il s'exprime en espagnol, réponds en espagnol.
- S'il s'exprime en allemand, réponds en allemand.
- S'il s'exprime en norvégien, réponds en norvégien.
- S'il s'exprime en italien, portugais, arabe, chinois, japonais, néerlandais, russe, suédois ou TOUTE autre langue, réponds parfaitement et naturellement dans cette langue.
- Si une langue préférée est spécifiée (${targetLang !== "auto" ? targetLang : "détection auto"}), utilise-la pour introduire ou orienter tes réponses, sauf si l'utilisateur s'adresse à toi dans une autre langue précise.
- NE FORCE JAMAIS LE FRANÇAIS si l'utilisateur communique dans une autre langue.

CONSIGNES DE COACHING BIENVEILLANT :
2. Adopte un ton bienveillant, motivant, scientifique mais accessible et sans culpabilisation.
3. Donne des conseils précis, avec des quantités, des idées d'ingrédients sains ou des substituts équilibrés.
4. Encourage et propose régulièrement à l'utilisateur de consommer des fruits frais entiers (pommes, poires, baies, kiwis, agrumes), riches en fibres, eau et antioxydants, parfaits pour la satiété naturelle et pour satisfaire une envie sucrée sans excès de calories.
5. Si l'utilisateur demande une idée de repas, propose une recette simple avec le nombre de calories approximatif et la répartition protéines/glucides/lipides.
6. Reste concis (1 à 3 paragraphes maximum), bien structuré avec des puces si nécessaire.
7. FORMATAGE EN GRAS : Mets SYSTÉMATIQUEMENT en gras avec des astérisques **les mots-clés, chiffres de calories, macronutriments et conseils majeurs** (ex: **1 600 kcal**, **protéines maigres**, **conseil du coach**).
8. SANS GLUTEN & RÉGIMES SPÉCIFIQUES : Tu es un expert en menus et recettes sans gluten (maladie cœliaque, intolérance ou confort digestif). Lorsque l'utilisateur demande des menus ou des conseils sans gluten, propose des menus 100% sans blé, orge, seigle, épeautre ou froment. Privilégie des féculents naturellement sans gluten (**quinoa**, **sarrasin**, **riz complet**, **patates douces**, **légumineuses**) et indique toujours les calories et macronutriments estimés.`;

  const contents: any[] = [];
  if (history && Array.isArray(history)) {
    for (const h of history.slice(-6)) {
      contents.push({
        role: h.sender === "user" ? "user" : "model",
        parts: [{ text: h.text }],
      });
    }
  }
  contents.push({
    role: "user",
    parts: [{ text: message || "Bonjour Coach !" }],
  });

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents,
        config: {
          systemInstruction,
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      15000
    );

    return response.text || fallbackReply;
  } catch (error) {
    console.warn("Gemini chat error (falling back to nutritional coach logic):", error);
    return fallbackReply;
  }
}

export interface MealAnalysisResult {
  foodName: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  portionGrams: number;
  analysis: string;
  advice: string;
  detectedItems?: string[];
}

export async function analyzeMealPhoto(params: {
  imageBase64?: string;
  description?: string;
  language?: string;
}): Promise<MealAnalysisResult> {
  const { imageBase64, description, language } = params;
  const lang = (language || "fr").toLowerCase();
  const parsedImage = parseBase64Image(imageBase64);

  if (!parsedImage && !description?.trim()) {
    throw new Error("Veuillez sélectionner une photo ou décrire votre repas.");
  }

  const ai = getGenAI();
  if (!ai) {
    if (!parsedImage && description?.trim()) {
      const baselineEstimate = estimateMealFromText(description);
      return {
        foodName: baselineEstimate.foodName || description,
        calories: baselineEstimate.totalCalories,
        protein: baselineEstimate.totalProtein,
        carbs: baselineEstimate.totalCarbs,
        fat: baselineEstimate.totalFat,
        portionGrams: baselineEstimate.totalPortionGrams,
        analysis: baselineEstimate.explanation || "Estimation nutritionnelle calculée à partir des tables de référence.",
        advice: "Pensez à accompagner votre repas d'un grand verre d'eau et de légumes riches en fibres.",
      };
    }
    throw new Error("Service d'analyse photo IA indisponible : clé GEMINI_API_KEY manquante.");
  }

  const langName =
    lang === "en"
      ? "English"
      : lang === "es"
      ? "Español"
      : lang === "de"
      ? "Deutsch"
      : lang === "no"
      ? "Norsk"
      : lang === "it"
      ? "Italiano"
      : lang === "pt"
      ? "Português"
      : "Français";

  const prompt = `Tu es un nutritionniste et diététicien clinicien expert doté d'une précision analytique maximale.
Observe attentivement la photo fournie${description ? ` et la description complémentaire ("${description}")` : ""}.
Identifie chaque aliment visible dans l'assiette, le bol, la tasse ou l'emballage, puis calcule les apports nutritionnels réalistes.

Règles strictes :
1. Fonde tes estimations sur les tables CIQUAL (ANSES) et USDA FoodData Central.
2. Prends en compte la taille visuelle de la portion (grammes estimés), le mode de cuisson, les sauces et accompagnements visibles.
3. Respecte les facteurs d'Atwater : Calories ≈ (Protéines × 4) + (Glucides × 4) + (Lipides × 9).
4. Si la photo montre une boisson simple (café noir, thé sans sucre, eau), ne surestime pas (ex: 2–5 kcal pour café noir).
5. Rédige "foodName", "detectedItems", "analysis" et "advice" en ${langName}.`;

  const parts: any[] = [];
  if (parsedImage) {
    parts.push({
      inlineData: {
        mimeType: parsedImage.mimeType,
        data: parsedImage.data,
      },
    });
  }
  parts.push({ text: prompt });

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: { parts },
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              foodName: {
                type: Type.STRING,
                description: "Nom précis et clair du repas identifié.",
              },
              calories: {
                type: Type.INTEGER,
                description: "Calories totales estimées en kcal.",
              },
              protein: {
                type: Type.NUMBER,
                description: "Protéines totales en grammes.",
              },
              carbs: {
                type: Type.NUMBER,
                description: "Glucides totaux en grammes.",
              },
              fat: {
                type: Type.NUMBER,
                description: "Lipides totaux en grammes.",
              },
              portionGrams: {
                type: Type.INTEGER,
                description: "Poids estimé de la portion totale en grammes.",
              },
              detectedItems: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Liste courte des aliments visibles détectés.",
              },
              analysis: {
                type: Type.STRING,
                description: "Analyse diététique factuelle en 1 à 2 phrases.",
              },
              advice: {
                type: Type.STRING,
                description: "Conseil concret du coach en 1 phrase.",
              },
            },
            required: ["foodName", "calories", "protein", "carbs", "fat", "portionGrams", "analysis", "advice"],
          },
        },
      }),
      25000
    );

    const parsed = JSON.parse((response.text || "{}").trim());
    const protein = Math.max(0, Math.round((Number(parsed.protein) || 0) * 10) / 10);
    const carbs = Math.max(0, Math.round((Number(parsed.carbs) || 0) * 10) / 10);
    const fat = Math.max(0, Math.round((Number(parsed.fat) || 0) * 10) / 10);
    const atwaterKcal = Math.round(protein * 4 + carbs * 4 + fat * 9);
    let finalKcal = Math.max(0, Math.round(Number(parsed.calories) ?? atwaterKcal));

    if (finalKcal === 0 && atwaterKcal > 0) {
      finalKcal = atwaterKcal;
    } else if (atwaterKcal > 15 && Math.abs(finalKcal - atwaterKcal) > Math.max(50, atwaterKcal * 0.3)) {
      finalKcal = atwaterKcal;
    }

    return {
      foodName: parsed.foodName || description || "Repas analysé par IA",
      calories: finalKcal,
      protein,
      carbs,
      fat,
      portionGrams: Math.max(10, Math.round(Number(parsed.portionGrams) || 250)),
      analysis: parsed.analysis || "Repas analysé avec succès à partir de votre image.",
      advice: parsed.advice || "Prenez le temps de bien mastiquer et hydratez-vous régulièrement.",
      detectedItems: Array.isArray(parsed.detectedItems) ? parsed.detectedItems : undefined,
    };
  } catch (error: any) {
    console.error("Meal photo analysis error:", error);
    if (!parsedImage && description?.trim()) {
      const baselineEstimate = estimateMealFromText(description);
      return {
        foodName: baselineEstimate.foodName || description,
        calories: baselineEstimate.totalCalories,
        protein: baselineEstimate.totalProtein,
        carbs: baselineEstimate.totalCarbs,
        fat: baselineEstimate.totalFat,
        portionGrams: baselineEstimate.totalPortionGrams,
        analysis: baselineEstimate.explanation || "Estimation nutritionnelle calculée localement.",
        advice: "Prenez le temps de bien mastiquer pour une digestion optimale.",
      };
    }
    throw new Error(formatGeminiErrorMessage(error));
  }
}

export interface BarcodeVisionResult {
  barcode: string;
  productName: string;
  brand: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  servingGrams: number;
  confidence: string;
}

export async function analyzeBarcodeOrLabelPhoto(params: {
  imageBase64: string;
  language?: string;
}): Promise<BarcodeVisionResult> {
  const { imageBase64, language } = params;
  const parsedImage = parseBase64Image(imageBase64);
  if (!parsedImage) {
    throw new Error("Image invalide pour la lecture du code-barres.");
  }

  const ai = getGenAI();
  if (!ai) {
    throw new Error("Lecture IA indisponible : clé GEMINI_API_KEY manquante.");
  }

  const prompt = `Analyse cette photo d'un produit alimentaire ou de son code-barres (${language || "fr"}).
1. Si un code-barres EAN-13, EAN-8, UPC-A ou GTIN est visible et lisible, extrais exactement ses chiffres dans "barcode" (uniquement les chiffres, sinon chaîne vide "").
2. Identifie également le nom du produit ("productName") et la marque ("brand") si visibles sur l'emballage ou l'étiquette nutritionnelle.
3. Si un tableau nutritionnel (valeurs pour 100g) est visible ou si tu reconnais précisément ce produit commercial, fournis "calories", "protein", "carbs", "fat" pour 100g et une portion typique "servingGrams". Sinon mets 0 pour les valeurs inconnues.`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: parsedImage.mimeType,
                data: parsedImage.data,
              },
            },
            { text: prompt },
          ],
        },
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              barcode: {
                type: Type.STRING,
                description: "Chiffres exacts du code-barres si lisible, sinon chaîne vide.",
              },
              productName: {
                type: Type.STRING,
                description: "Nom du produit visible sur l'emballage, sinon chaîne vide.",
              },
              brand: {
                type: Type.STRING,
                description: "Marque visible sur l'emballage, sinon chaîne vide.",
              },
              calories: {
                type: Type.NUMBER,
                description: "Calories en kcal pour 100g (0 si inconnu).",
              },
              protein: {
                type: Type.NUMBER,
                description: "Protéines en g pour 100g (0 si inconnu).",
              },
              carbs: {
                type: Type.NUMBER,
                description: "Glucides en g pour 100g (0 si inconnu).",
              },
              fat: {
                type: Type.NUMBER,
                description: "Lipides en g pour 100g (0 si inconnu).",
              },
              servingGrams: {
                type: Type.INTEGER,
                description: "Portion typique en grammes (ex: 100).",
              },
              confidence: {
                type: Type.STRING,
                description: "high, medium ou low.",
              },
            },
            required: ["barcode", "productName", "brand", "calories", "protein", "carbs", "fat", "servingGrams", "confidence"],
          },
        },
      }),
      20000
    );

    const parsed = JSON.parse((response.text || "{}").trim());
    return {
      barcode: String(parsed.barcode || "").replace(/\D/g, ""),
      productName: String(parsed.productName || "").trim(),
      brand: String(parsed.brand || "").trim(),
      calories: Math.max(0, Math.round(Number(parsed.calories) || 0)),
      protein: Math.max(0, Math.round((Number(parsed.protein) || 0) * 10) / 10),
      carbs: Math.max(0, Math.round((Number(parsed.carbs) || 0) * 10) / 10),
      fat: Math.max(0, Math.round((Number(parsed.fat) || 0) * 10) / 10),
      servingGrams: Math.max(10, Math.round(Number(parsed.servingGrams) || 100)),
      confidence: String(parsed.confidence || "medium"),
    };
  } catch (error: any) {
    console.error("Barcode vision scan error:", error);
    throw new Error(formatGeminiErrorMessage(error));
  }
}

export async function calculateMealFromText(params: {
  mealText: string;
  language?: string;
}) {
  const { mealText, language } = params;
  const localEstimate = estimateMealFromText(mealText);

  const defaultCalculation = {
    foodName: localEstimate.foodName || mealText,
    calories: localEstimate.totalCalories,
    portionGrams: localEstimate.totalPortionGrams,
    protein: localEstimate.totalProtein,
    carbs: localEstimate.totalCarbs,
    fat: localEstimate.totalFat,
    items: localEstimate.items,
    explanation:
      localEstimate.explanation || "Estimation nutritionnelle basée sur les tables de référence officielles.",
    isAiRefined: false,
  };

  const ai = getGenAI();
  if (!ai) {
    return defaultCalculation;
  }

  const prompt = `Tu es un nutritionniste et diététicien clinicien expert polyglotte.
L'utilisateur a consommé ou composé le repas / aliment suivant : "${mealText}".
Rédige les champs textuels ("foodName", "items.name", "explanation") dans la même langue que le texte de l'utilisateur (ou ${language || "fr"}).

RÈGLES NUTRITIONNELLES STRICTES (TABLES DE RÉFÉRENCE CIQUAL & USDA) :
1. BOISSONS CHAUDES NATURE :
   - Un café noir, expresso / espresso, café allongé, thé nature, tisane ou infusion sans sucre = 2 à 5 kcal (0g lipides, 0g protéines, 0g glucides). JAMAIS plus de 5 kcal pour un café noir !
   - Un café avec 1 morceau de sucre = ~20 à 25 kcal (5g glucides).
   - Un café au lait = ~40 à 60 kcal (3g protéines, 5g glucides, 2g lipides).
   - Un cappuccino = ~60 à 80 kcal.
   - Eau plate ou gazeuse = 0 kcal.
2. NE JAMAIS assigner de calories de plat complet (ex: 300-400 kcal) à une simple boisson ou collation légère !
3. Pour les plats composés, décompose chaque aliment avec sa portion réaliste.

Réponds STRICTEMENT sous format JSON valide avec la structure suivante :
{
  "foodName": "Nom propre et clair du plat/composition dans la langue du texte",
  "calories": 425,
  "portionGrams": 240,
  "protein": 18.5,
  "carbs": 24.5,
  "fat": 28,
  "items": [
    {
      "name": "Aliment ou composant dans la langue du texte",
      "portionGrams": 140,
      "calories": 185,
      "protein": 14,
      "carbs": 1.5,
      "fat": 14
    }
  ],
  "explanation": "Brève explication diététique dans la langue du texte"
}`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      15000
    );

    const parsed = JSON.parse(response.text || "{}");
    const rawCalories = Math.round(Number(parsed.calories) || localEstimate.totalCalories);

    let finalCalories = rawCalories;
    if (localEstimate.totalCalories <= 15 && rawCalories > 25) {
      finalCalories = localEstimate.totalCalories;
    }

    return {
      foodName: parsed.foodName || localEstimate.foodName || mealText,
      calories: finalCalories,
      portionGrams: Math.round(Number(parsed.portionGrams) || localEstimate.totalPortionGrams),
      protein: Math.round((Number(parsed.protein) ?? localEstimate.totalProtein) * 10) / 10,
      carbs: Math.round((Number(parsed.carbs) ?? localEstimate.totalCarbs) * 10) / 10,
      fat: Math.round((Number(parsed.fat) ?? localEstimate.totalFat) * 10) / 10,
      items: Array.isArray(parsed.items) && parsed.items.length > 0 ? parsed.items : localEstimate.items,
      explanation: parsed.explanation || localEstimate.explanation || "",
      isAiRefined: true,
    };
  } catch (error) {
    console.warn("Meal calculation error (falling back to clinical dictionary):", error);
    return defaultCalculation;
  }
}

export async function generateMenuPlan(params: {
  targetCalories?: number;
  preference?: string;
  language?: string;
}) {
  const { targetCalories, preference, language } = params;
  const lang = (language || "fr").toLowerCase();
  const ai = getGenAI();
  const isGlutenFree = preference === "sans_gluten" || String(preference || "").toLowerCase().includes("gluten");

  const defaultMenu = isGlutenFree
    ? {
        dayPlan: {
          breakfast: { foodName: "Bowl de sarrasin au lait végétal, myrtilles fraîches & graines de chia (Sans Gluten)", calories: 330, protein: 12, carbs: 46, fat: 8 },
          lunch: { foodName: "Filet de saumon poêlé, quinoa royal, avocat & pousses d'épinards (Sans Gluten)", calories: 530, protein: 38, carbs: 48, fat: 16 },
          snack: { foodName: "Pomme bio croquante & poignée d'amandes brutes (Sans Gluten)", calories: 150, protein: 4, carbs: 18, fat: 9 },
          dinner: { foodName: "Wok de filet de dinde aux légumes croquants et riz basmati sauvage (Sans Gluten)", calories: 390, protein: 36, carbs: 28, fat: 10 },
        },
        tips: "Misez sur des féculents naturellement sans gluten (quinoa, riz complet, sarrasin, patates douces) pour un confort digestif optimal.",
      }
    : {
        dayPlan: {
          breakfast: { foodName: "Porridge d'avoine aux baies & graines de chia", calories: 340, protein: 14, carbs: 48, fat: 8 },
          lunch: { foodName: "Filet de poulet grillé, riz complet et brocolis vapeur", calories: 520, protein: 42, carbs: 55, fat: 12 },
          snack: { foodName: "Pomme & Poignée d'amandes brutes (20g)", calories: 160, protein: 4, carbs: 20, fat: 10 },
          dinner: { foodName: "Papillote de cabillaud au citron et fondue de poireaux", calories: 380, protein: 34, carbs: 18, fat: 9 },
        },
        tips: "Buvez 1 grand verre d'eau 20 minutes avant chaque repas pour faciliter la satiété.",
      };

  if (!ai) {
    return defaultMenu;
  }

  const langName =
    lang === "en"
      ? "English"
      : lang === "es"
      ? "Español"
      : lang === "de"
      ? "Deutsch"
      : lang === "no"
      ? "Norsk"
      : lang === "it"
      ? "Italiano"
      : lang === "pt"
      ? "Português"
      : "Français";

  const glutenConstraint = isGlutenFree
    ? `\nEXIGENCE STRICTE SANS GLUTEN : Interdiction absolue de blé, froment, seigle, orge, épeautre ou kamut. Utilise UNIQUEMENT des céréales et féculents 100% naturellement sans gluten (quinoa, riz complet, sarrasin, millet, patates douces, maïs, légumineuses). Précise la mention "(Sans Gluten)" pour chaque repas.`
    : "";

  const prompt = `Génère un menu journalier complet, savoureux et diététique pour un objectif total de ${targetCalories || 1500} kcal (Préférence alimentaire : ${preference || "standard"}).${glutenConstraint}
Rédige les noms des repas et les conseils INTÉGRALEMENT dans la langue suivante : ${langName}.
Intègre toujours au moins une à deux portions de fruits frais entiers (ex : pomme, baies, kiwi, poire, agrumes) pour l'apport en fibres et vitamines.
Structure JSON requise :
{
  "dayPlan": {
    "breakfast": { "foodName": "...", "calories": 350, "protein": 18, "carbs": 42, "fat": 10 },
    "lunch": { "foodName": "...", "calories": 520, "protein": 40, "carbs": 50, "fat": 14 },
    "snack": { "foodName": "...", "calories": 150, "protein": 5, "carbs": 18, "fat": 8 },
    "dinner": { "foodName": "...", "calories": 420, "protein": 35, "carbs": 25, "fat": 12 }
  },
  "tips": "Un conseil clé du coach pour la journée dans la langue ${langName}."
}`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      15000
    );

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Generate menu error:", error);
    return defaultMenu;
  }
}

export async function generateWeeklyRecipes(params: {
  dietaryPreference?: string;
  targetCalories?: number;
  weekTheme?: string;
}) {
  const { dietaryPreference, targetCalories, weekTheme } = params;
  const ai = getGenAI();

  const defaultRecipes = {
    recipes: [
      {
        id: `ai_recipe_${Date.now()}_1`,
        title: "Filet de Bar Rôti au Thym & Fondue de Poireaux",
        description: "Un plat raffiné, digeste et riche en protéines nobles pour votre semaine.",
        prepTimeMinutes: 20,
        calories: 340,
        protein: 38,
        carbs: 14,
        fat: 8,
        category: "faibles_calories",
        imageUrl: "https://images.unsplash.com/photo-1534939561126-855b8675edd7?auto=format&fit=crop&w=800&q=80",
        ingredients: [
          "150g de filet de bar frais",
          "2 blancs de poireaux émincés",
          "1 c.à.c d'huile d'olive",
          "Jus d'un demi-citron & fleur de sel",
        ],
        instructions: [
          "Faire fondre les poireaux à feu doux avec un fond d'eau pendant 12 min.",
          "Poêler le poisson côté peau 3 min puis retourner 2 min.",
          "Dresser sur le lit de poireaux avec le jus de citron.",
        ],
        tags: ["Nouveauté Semaine", "Riche en Protéines", "Sans Gluten"],
        isNewThisWeek: true,
        isWeeklyStar: true,
      },
      {
        id: `ai_recipe_${Date.now()}_2`,
        title: "Bowl Chaud Patate Douce, Pois Chiches Rôtis & Tahini",
        description: "Plein d'énergie douce et de minéraux pour vos déjeuners actifs.",
        prepTimeMinutes: 25,
        calories: 410,
        protein: 16,
        carbs: 58,
        fat: 12,
        category: "vegetarienne",
        imageUrl: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=800&q=80",
        ingredients: [
          "120g de patate douce rôtie",
          "100g de pois chiches cuits assaisonnés au cumin",
          "1 poignée de roquette fraîche",
          "1 c.à.s de sauce tahini au citron",
        ],
        instructions: [
          "Rôtir les dés de patate douce et les pois chiches au four à 200°C pendant 20 min.",
          "Disposer dans un bol avec la roquette.",
          "Arroser de sauce tahini légère.",
        ],
        tags: ["Nouveauté Semaine", "Végétarien", "Index Glycémique Modéré"],
        isNewThisWeek: true,
      },
      {
        id: `ai_recipe_${Date.now()}_3`,
        title: "Tartine Rustique Seigle, Ricotta & Figues Fraîches",
        description: "Une pause sucrée-salée riche en fibres et calcium naturel.",
        prepTimeMinutes: 8,
        calories: 270,
        protein: 12,
        carbs: 36,
        fat: 7,
        category: "express",
        imageUrl: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80",
        ingredients: [
          "2 tranches de pain de seigle au levain",
          "50g de ricotta fraîche",
          "2 figues fraîches tranchées",
          "1 filet de miel d'acacia",
        ],
        instructions: [
          "Toaster le pain de seigle.",
          "Tartiner la ricotta crémeuse.",
          "Disposer les figues et le filet de miel.",
        ],
        tags: ["Nouveauté Semaine", "Express 8 min", "Gourmand & Sain"],
        isNewThisWeek: true,
      },
    ],
    success: true,
    message: "Recettes hebdomadaires générées avec succès",
  };

  if (!ai) {
    return defaultRecipes;
  }

  const prompt = `Tu es un chef nutritionniste d'élite pour l'application NutriCoach.
Génère exactement 3 nouvelles recettes de saison inédites pour la semaine en cours.
Profil : Préférence alimentaire : ${dietaryPreference || "standard"}, Cible calorique : environ ${Math.round((targetCalories || 1600) / 3)} kcal par repas.
Thème de la semaine : "${weekTheme || "Vitalité & Équilibre de Saison"}".

Chaque recette doit être équilibrée, alléchante, simple à cuisiner avec des ingrédients faciles à trouver.
Assure-toi d'inclure des légumes de saison et un bon apport nutritionnel.
Retourne STRICTEMENT du JSON au format suivant :
{
  "recipes": [
    {
      "id": "ai_rec_1",
      "title": "Nom de la recette",
      "description": "Courte description alléchante et bienfait nutritionnel (1-2 phrases)",
      "prepTimeMinutes": 15,
      "calories": 380,
      "protein": 34,
      "carbs": 30,
      "fat": 11,
      "category": "riches_proteines",
      "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      "ingredients": ["150g de blanc de poulet", "100g de brocolis"],
      "instructions": ["Faire cuire...", "Dresser..."],
      "tags": ["Nouveauté Semaine", "Riche en Protéines"],
      "isNewThisWeek": true
    }
  ]
}`;

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-4-hydrogen",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
          thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
        },
      }),
      15000
    );

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Generate weekly recipes error:", error);
    return defaultRecipes;
  }
}
