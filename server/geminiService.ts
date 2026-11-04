import { GoogleGenAI } from "@google/genai";
import { estimateMealFromText } from "../src/utils/mealEstimator.ts";

let genAIClient: GoogleGenAI | null = null;

export function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
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
function withTimeout<T>(promise: Promise<T>, timeoutMs = 9000): Promise<T> {
  let timer: any;
  const timeoutPromise = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error("Timeout waiting for AI response")), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]).finally(() => {
    clearTimeout(timer);
  });
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
        model: "gemini-3.8-flash",
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      }),
      8000
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
}

export async function analyzeMealPhoto(params: {
  imageBase64?: string;
  description?: string;
  language?: string;
}): Promise<MealAnalysisResult> {
  const { imageBase64, description, language } = params;
  const lang = (language || "fr").toLowerCase();
  const ai = getGenAI();

  const baselineEstimate = description ? estimateMealFromText(description) : null;
  const defaultAnalysis: MealAnalysisResult = {
    foodName: description || "Assiette équilibrée poulet & légumes",
    calories: baselineEstimate ? baselineEstimate.totalCalories : 350,
    protein: baselineEstimate ? baselineEstimate.totalProtein : 28,
    carbs: baselineEstimate ? baselineEstimate.totalCarbs : 24,
    fat: baselineEstimate ? baselineEstimate.totalFat : 11,
    portionGrams: baselineEstimate ? baselineEstimate.totalPortionGrams : 280,
    analysis:
      "Une excellente composition favorisant la satiété avec un apport énergétique équilibré.",
    advice: "Prenez le temps de bien mastiquer pour une digestion optimale.",
  };

  if (!ai) {
    return defaultAnalysis;
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
Analyse ce repas ${description ? `(Description: ${description})` : ""}.
Règles strictes de calcul nutritionnel :
1. Fonde tes estimations sur les tables de composition nutritionnelle de référence (table CIQUAL de l'ANSES et USDA FoodData Central).
2. Prends en compte la réalité des portions (poids cuit vs cru, matières grasses de cuisson cachées, sauces, vinaigrettes, sucres ajoutés).
3. Utilise le système officiel des facteurs d'Atwater pour garantir une cohérence mathématique exacte :
   Calories totales ≈ (Protéines x 4) + (Glucides x 4) + (Lipides x 9).
4. Rédige les champs textuels ("foodName", "analysis", "advice") dans la langue demandée : ${langName}.

Champs requis :
- foodName: nom précis et clair du plat dans la langue ${langName}
- calories: calories totales estimées en kcal (nombre entier vérifié)
- protein: protéines totales en grammes (nombre entier)
- carbs: glucides totaux en grammes (nombre entier)
- fat: lipides totaux en grammes (nombre entier)
- portionGrams: poids estimé de l'ensemble de la portion en grammes (nombre entier)
- analysis: analyse diététique détaillée et factuelle (qualité des macronutriments, index glycémique, densité nutritionnelle) (2 phrases)
- advice: un conseil diététique concret pour optimiser ce repas ou la satiété (1 à 2 phrases)

Réponds STRICTEMENT au format JSON valide avec ces clés :
{"foodName": "...", "calories": 450, "protein": 35, "carbs": 40, "fat": 15, "portionGrams": 320, "analysis": "...", "advice": "..."}`;

  const parts: any[] = [];
  if (imageBase64) {
    const match = imageBase64.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (match) {
      parts.push({
        inlineData: {
          mimeType: match[1],
          data: match[2],
        },
      });
    }
  }
  parts.push({ text: prompt });

  try {
    const response = await withTimeout(
      ai.models.generateContent({
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts }],
        config: {
          responseMimeType: "application/json",
        },
      }),
      8000
    );

    const parsed = JSON.parse(response.text || "{}");
    const protein = Math.max(0, Math.round(Number(parsed.protein) || 28));
    const carbs = Math.max(0, Math.round(Number(parsed.carbs) || 30));
    const fat = Math.max(0, Math.round(Number(parsed.fat) || 12));
    const atwaterKcal = Math.round(protein * 4 + carbs * 4 + fat * 9);
    let finalKcal = Math.round(Number(parsed.calories) || atwaterKcal || 390);

    // Reconcile with Atwater formula if divergence is unreasonable
    if (atwaterKcal > 0 && Math.abs(finalKcal - atwaterKcal) > Math.max(40, atwaterKcal * 0.25)) {
      finalKcal = atwaterKcal;
    }

    return {
      foodName: parsed.foodName || description || "Repas équilibré",
      calories: finalKcal,
      protein,
      carbs,
      fat,
      portionGrams: Number(parsed.portionGrams) || 280,
      analysis: parsed.analysis || "Assiette bien proportionnée.",
      advice: parsed.advice || "Parfait pour votre objectif !",
    };
  } catch (error) {
    console.warn("Meal analysis error (falling back to standard clinical estimation):", error);
    return defaultAnalysis;
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

Exemple pour "une omelette et mousse chocolat" :
- Omelette (environ 2 œufs) : ~140g, 185 kcal, 14g protéines, 1.5g glucides, 14g lipides
- Mousse au chocolat (1 ramequin classique) : ~100g, 240 kcal, 4.5g protéines, 23g glucides, 14g lipides
- Total : 425 kcal, 240g, 18.5g protéines, 24.5g glucides, 28g lipides.

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
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      }),
      8000
    );

    const parsed = JSON.parse(response.text || "{}");
    const rawCalories = Math.round(Number(parsed.calories) || localEstimate.totalCalories);

    // Sanity check: If local reference detected a zero/low-calorie drink (<= 15 kcal) like black coffee or tea,
    // do not allow an AI hallucination of 100+ or 300+ kcal.
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
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      }),
      8000
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
        model: "gemini-3.8-flash",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          responseMimeType: "application/json",
        },
      }),
      8000
    );

    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.warn("Generate weekly recipes error:", error);
    return defaultRecipes;
  }
}
