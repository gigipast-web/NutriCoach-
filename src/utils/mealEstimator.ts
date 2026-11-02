export interface MealItemEstimate {
  name: string;
  portionGrams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface MealCalculationResult {
  foodName: string;
  totalCalories: number;
  totalPortionGrams: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  items: MealItemEstimate[];
  explanation: string;
  isAiRefined?: boolean;
}

// Extensive dictionary of foods, dishes and typical French/European portions
const FOOD_KNOWLEDGE_BASE: Array<{
  keywords: string[];
  canonicalName: string;
  defaultPortionGrams: number;
  caloriesPer100g: number;
  proteinPer100g: number;
  carbsPer100g: number;
  fatPer100g: number;
}> = [
  // Œufs & Omelettes
  {
    keywords: ['omelette', 'omlette'],
    canonicalName: 'Omelette (2 œufs)',
    defaultPortionGrams: 140,
    caloriesPer100g: 154,
    proteinPer100g: 11,
    carbsPer100g: 1,
    fatPer100g: 12,
  },
  {
    keywords: ['oeuf plat', 'oeufs au plat', 'oeuf au plat', 'fried egg'],
    canonicalName: 'Œufs au plat (2)',
    defaultPortionGrams: 120,
    caloriesPer100g: 196,
    proteinPer100g: 14,
    carbsPer100g: 0.8,
    fatPer100g: 15,
  },
  {
    keywords: ['oeuf dur', 'oeufs durs', 'oeuf poche', 'boiled egg'],
    canonicalName: 'Œuf dur',
    defaultPortionGrams: 60,
    caloriesPer100g: 155,
    proteinPer100g: 13,
    carbsPer100g: 1.1,
    fatPer100g: 11,
  },
  {
    keywords: ['oeufs brouilles', 'oeuf brouille', 'scrambled eggs'],
    canonicalName: 'Œufs brouillés',
    defaultPortionGrams: 140,
    caloriesPer100g: 160,
    proteinPer100g: 10,
    carbsPer100g: 2,
    fatPer100g: 12,
  },

  // Desserts & Douceurs
  {
    keywords: ['mousse chocolat', 'mousse au chocolat', 'chocolate mousse'],
    canonicalName: 'Mousse au chocolat (1 ramequin)',
    defaultPortionGrams: 100,
    caloriesPer100g: 225,
    proteinPer100g: 4.8,
    carbsPer100g: 23,
    fatPer100g: 13,
  },
  {
    keywords: ['yaourt nature', 'yogourt', 'yoghurt'],
    canonicalName: 'Yaourt nature (1 pot)',
    defaultPortionGrams: 125,
    caloriesPer100g: 61,
    proteinPer100g: 4,
    carbsPer100g: 5.5,
    fatPer100g: 3.2,
  },
  {
    keywords: ['fromage blanc', 'quark'],
    canonicalName: 'Fromage blanc 3%',
    defaultPortionGrams: 150,
    caloriesPer100g: 75,
    proteinPer100g: 8,
    carbsPer100g: 4.5,
    fatPer100g: 3,
  },
  {
    keywords: ['chocolat noir', 'carre de chocolat'],
    canonicalName: 'Chocolat noir (2 carrés)',
    defaultPortionGrams: 20,
    caloriesPer100g: 546,
    proteinPer100g: 5.5,
    carbsPer100g: 46,
    fatPer100g: 35,
  },
  {
    keywords: ['croissant'],
    canonicalName: 'Croissant au beurre (1)',
    defaultPortionGrams: 60,
    caloriesPer100g: 406,
    proteinPer100g: 8.2,
    carbsPer100g: 45,
    fatPer100g: 22,
  },
  {
    keywords: ['pain au chocolat', 'chocolatine'],
    canonicalName: 'Pain au chocolat (1)',
    defaultPortionGrams: 75,
    caloriesPer100g: 414,
    proteinPer100g: 7.5,
    carbsPer100g: 47,
    fatPer100g: 22,
  },
  {
    keywords: ['crepe', 'crêpe'],
    canonicalName: 'Crêpe nature (1)',
    defaultPortionGrams: 50,
    caloriesPer100g: 227,
    proteinPer100g: 6.5,
    carbsPer100g: 28,
    fatPer100g: 9.8,
  },

  // Viandes & Volailles
  {
    keywords: ['steak hache', 'steak haché', 'burger patty'],
    canonicalName: 'Steak haché pur bœuf 5% (1)',
    defaultPortionGrams: 125,
    caloriesPer100g: 130,
    proteinPer100g: 21,
    carbsPer100g: 0,
    fatPer100g: 5,
  },
  {
    keywords: ['steak', 'entrecote', 'faux filet', 'bavette', 'boeuf'],
    canonicalName: 'Steak de bœuf grillé',
    defaultPortionGrams: 150,
    caloriesPer100g: 190,
    proteinPer100g: 26,
    carbsPer100g: 0,
    fatPer100g: 9.5,
  },
  {
    keywords: ['poulet', 'blanc de poulet', 'escalope poulet', 'filet poulet', 'chicken breast'],
    canonicalName: 'Filet de poulet rôti',
    defaultPortionGrams: 150,
    caloriesPer100g: 145,
    proteinPer100g: 29,
    carbsPer100g: 0,
    fatPer100g: 3.2,
  },
  {
    keywords: ['dinde', 'escalope dinde'],
    canonicalName: 'Escalope de dinde grillée',
    defaultPortionGrams: 140,
    caloriesPer100g: 125,
    proteinPer100g: 28,
    carbsPer100g: 0,
    fatPer100g: 1.8,
  },
  {
    keywords: ['jambon blanc', 'jambon cuit', 'jambon'],
    canonicalName: 'Jambon blanc découenné (2 tranches)',
    defaultPortionGrams: 90,
    caloriesPer100g: 110,
    proteinPer100g: 20,
    carbsPer100g: 1,
    fatPer100g: 3,
  },

  // Poissons & Fruits de mer
  {
    keywords: ['saumon', 'pave de saumon', 'salmon'],
    canonicalName: 'Pavé de saumon grillé',
    defaultPortionGrams: 140,
    caloriesPer100g: 206,
    proteinPer100g: 22,
    carbsPer100g: 0,
    fatPer100g: 13,
  },
  {
    keywords: ['cabillaud', 'colin', 'merlu', 'poisson blanc', 'cod'],
    canonicalName: 'Dos de cabillaud vapeur',
    defaultPortionGrams: 140,
    caloriesPer100g: 82,
    proteinPer100g: 18,
    carbsPer100g: 0,
    fatPer100g: 0.7,
  },
  {
    keywords: ['thon en boite', 'thon naturel', 'thon', 'tuna'],
    canonicalName: 'Thon au naturel (1 boîte)',
    defaultPortionGrams: 130,
    caloriesPer100g: 115,
    proteinPer100g: 26,
    carbsPer100g: 0,
    fatPer100g: 1,
  },
  {
    keywords: ['crevette', 'crevettes', 'shrimp'],
    canonicalName: 'Crevettes cuites',
    defaultPortionGrams: 120,
    caloriesPer100g: 99,
    proteinPer100g: 21,
    carbsPer100g: 0.9,
    fatPer100g: 1.1,
  },

  // Féculents & Accompagnements
  {
    keywords: ['frite', 'frites', 'french fries'],
    canonicalName: 'Frites de pommes de terre (1 portion)',
    defaultPortionGrams: 150,
    caloriesPer100g: 285,
    proteinPer100g: 3.4,
    carbsPer100g: 36,
    fatPer100g: 14,
  },
  {
    keywords: ['riz basmati', 'riz blanc', 'riz complet', 'riz', 'rice'],
    canonicalName: 'Riz cuit (1 portion)',
    defaultPortionGrams: 160,
    caloriesPer100g: 130,
    proteinPer100g: 2.7,
    carbsPer100g: 28,
    fatPer100g: 0.4,
  },
  {
    keywords: ['pates', 'pâtes', 'spaghetti', 'coquillettes', 'pasta'],
    canonicalName: 'Pâtes cuites',
    defaultPortionGrams: 180,
    caloriesPer100g: 145,
    proteinPer100g: 5.2,
    carbsPer100g: 29,
    fatPer100g: 0.9,
  },
  {
    keywords: ['pomme de terre', 'pommes de terre', 'patate', 'potato'],
    canonicalName: 'Pommes de terre vapeur',
    defaultPortionGrams: 180,
    caloriesPer100g: 86,
    proteinPer100g: 2,
    carbsPer100g: 19,
    fatPer100g: 0.1,
  },
  {
    keywords: ['puree', 'purée'],
    canonicalName: 'Purée maison au lait',
    defaultPortionGrams: 200,
    caloriesPer100g: 112,
    proteinPer100g: 2.2,
    carbsPer100g: 16,
    fatPer100g: 4.5,
  },
  {
    keywords: ['pain complet', 'pain de mie', 'pain', 'baguette', 'bread'],
    canonicalName: 'Pain de campagne ou complet (2 tranches)',
    defaultPortionGrams: 60,
    caloriesPer100g: 265,
    proteinPer100g: 9,
    carbsPer100g: 49,
    fatPer100g: 1.8,
  },
  {
    keywords: ['quinoa'],
    canonicalName: 'Quinoa cuit',
    defaultPortionGrams: 150,
    caloriesPer100g: 120,
    proteinPer100g: 4.4,
    carbsPer100g: 21,
    fatPer100g: 1.9,
  },
  {
    keywords: ['lentille', 'lentilles'],
    canonicalName: 'Lentilles cuites',
    defaultPortionGrams: 160,
    caloriesPer100g: 116,
    proteinPer100g: 9,
    carbsPer100g: 20,
    fatPer100g: 0.4,
  },
  {
    keywords: ['flocons d avoine', 'avoine', 'porridge', 'oats'],
    canonicalName: 'Flocons d’avoine',
    defaultPortionGrams: 50,
    caloriesPer100g: 375,
    proteinPer100g: 13.5,
    carbsPer100g: 60,
    fatPer100g: 7,
  },

  // Légumes & Salades
  {
    keywords: ['salade verte', 'salade', 'laitue', 'mache', 'roquette'],
    canonicalName: 'Salade verte & vinaigrette légère',
    defaultPortionGrams: 80,
    caloriesPer100g: 45,
    proteinPer100g: 1.2,
    carbsPer100g: 2.5,
    fatPer100g: 3.5,
  },
  {
    keywords: ['tomate', 'tomates', 'salade de tomates'],
    canonicalName: 'Tomates fraîches en salade',
    defaultPortionGrams: 130,
    caloriesPer100g: 25,
    proteinPer100g: 1,
    carbsPer100g: 4,
    fatPer100g: 0.5,
  },
  {
    keywords: ['avocat', 'avocado'],
    canonicalName: 'Demi-avocat frais',
    defaultPortionGrams: 80,
    caloriesPer100g: 160,
    proteinPer100g: 2,
    carbsPer100g: 2,
    fatPer100g: 15,
  },
  {
    keywords: ['haricot vert', 'haricots verts', 'green beans'],
    canonicalName: 'Haricots verts extra-fins',
    defaultPortionGrams: 180,
    caloriesPer100g: 31,
    proteinPer100g: 1.8,
    carbsPer100g: 4.3,
    fatPer100g: 0.2,
  },
  {
    keywords: ['brocoli', 'brocolis'],
    canonicalName: 'Brocolis vapeur',
    defaultPortionGrams: 160,
    caloriesPer100g: 35,
    proteinPer100g: 2.8,
    carbsPer100g: 4.5,
    fatPer100g: 0.4,
  },
  {
    keywords: ['courgette', 'courgettes'],
    canonicalName: 'Courgettes poêlées',
    defaultPortionGrams: 170,
    caloriesPer100g: 35,
    proteinPer100g: 1.5,
    carbsPer100g: 3.5,
    fatPer100g: 1.8,
  },
  {
    keywords: ['soupe', 'veloute', 'potage', 'soup'],
    canonicalName: 'Bol de soupe de légumes maison',
    defaultPortionGrams: 250,
    caloriesPer100g: 38,
    proteinPer100g: 1.2,
    carbsPer100g: 5.8,
    fatPer100g: 1.2,
  },

  // Fruits
  {
    keywords: ['pomme', 'apple'],
    canonicalName: 'Pomme fraîche (1)',
    defaultPortionGrams: 150,
    caloriesPer100g: 52,
    proteinPer100g: 0.3,
    carbsPer100g: 13.8,
    fatPer100g: 0.2,
  },
  {
    keywords: ['banane', 'banana'],
    canonicalName: 'Banane moyenne (1)',
    defaultPortionGrams: 120,
    caloriesPer100g: 89,
    proteinPer100g: 1.1,
    carbsPer100g: 22.8,
    fatPer100g: 0.3,
  },
  {
    keywords: ['orange', 'clementine', 'mandarine', 'citrus'],
    canonicalName: 'Clémentine ou Orange fraîche',
    defaultPortionGrams: 100,
    caloriesPer100g: 47,
    proteinPer100g: 0.9,
    carbsPer100g: 11.8,
    fatPer100g: 0.1,
  },
  {
    keywords: ['poire', 'pear'],
    canonicalName: 'Poire fraîche (1)',
    defaultPortionGrams: 160,
    caloriesPer100g: 57,
    proteinPer100g: 0.4,
    carbsPer100g: 15,
    fatPer100g: 0.1,
  },
  {
    keywords: ['kiwi'],
    canonicalName: 'Kiwi frais (1)',
    defaultPortionGrams: 75,
    caloriesPer100g: 61,
    proteinPer100g: 1.1,
    carbsPer100g: 14.7,
    fatPer100g: 0.5,
  },
  {
    keywords: ['fraise', 'fraises', 'framboise', 'framboises', 'fruits rouges', 'myrtilles', 'berries'],
    canonicalName: 'Fruits rouges frais (1 bol)',
    defaultPortionGrams: 120,
    caloriesPer100g: 38,
    proteinPer100g: 0.8,
    carbsPer100g: 7.5,
    fatPer100g: 0.3,
  },
  {
    keywords: ['raisin', 'grape'],
    canonicalName: 'Raisin frais (1 petite grappe)',
    defaultPortionGrams: 100,
    caloriesPer100g: 69,
    proteinPer100g: 0.7,
    carbsPer100g: 18,
    fatPer100g: 0.2,
  },
  {
    keywords: ['melon', 'pasteque', 'pastèque', 'watermelon'],
    canonicalName: 'Melon ou Pastèque fraîche',
    defaultPortionGrams: 200,
    caloriesPer100g: 34,
    proteinPer100g: 0.8,
    carbsPer100g: 8,
    fatPer100g: 0.2,
  },

  // Fromages & Matières grasses
  {
    keywords: ['fromage', 'comte', 'emmental', 'gruyere', 'cheddar', 'cheese'],
    canonicalName: 'Fromage à pâte dure (1 part)',
    defaultPortionGrams: 30,
    caloriesPer100g: 410,
    proteinPer100g: 27,
    carbsPer100g: 0.5,
    fatPer100g: 33,
  },
  {
    keywords: ['beurre', 'butter'],
    canonicalName: 'Beurre doux (1 noisette)',
    defaultPortionGrams: 10,
    caloriesPer100g: 717,
    proteinPer100g: 0.8,
    carbsPer100g: 0.7,
    fatPer100g: 81,
  },
  {
    keywords: ['huile', 'huile d olive', 'olive oil'],
    canonicalName: 'Huile d’olive (1 cuillère à soupe)',
    defaultPortionGrams: 10,
    caloriesPer100g: 884,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 100,
  },

  // Plats combinés populaires
  {
    keywords: ['pizza', 'reine', 'margherita'],
    canonicalName: 'Pizza maison ou restaurant (3 parts)',
    defaultPortionGrams: 280,
    caloriesPer100g: 266,
    proteinPer100g: 11,
    carbsPer100g: 33,
    fatPer100g: 10,
  },
  {
    keywords: ['burger', 'hambourgeois'],
    canonicalName: 'Burger classique',
    defaultPortionGrams: 220,
    caloriesPer100g: 250,
    proteinPer100g: 13,
    carbsPer100g: 24,
    fatPer100g: 11.5,
  },
  {
    keywords: ['sandwich jambon beurre', 'sandwich'],
    canonicalName: 'Sandwich demi-baguette jambon',
    defaultPortionGrams: 200,
    caloriesPer100g: 245,
    proteinPer100g: 11,
    carbsPer100g: 32,
    fatPer100g: 8,
  },
  {
    keywords: ['salade cesar', 'salade césar'],
    canonicalName: 'Salade César au poulet',
    defaultPortionGrams: 280,
    caloriesPer100g: 135,
    proteinPer100g: 10,
    carbsPer100g: 6,
    fatPer100g: 8,
  },
];

/**
 * Normalizes text: lowercase, remove accents and punctuation
 */
function normalize(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .trim();
}

/**
 * Extracts a numeric portion if the user wrote e.g. "200g", "2 oeufs", "3 tranches"
 */
function extractQuantityModifier(text: string): { grams?: number; multiplier?: number } {
  const norm = normalize(text);

  // Matches "200g", "200 g", "250gr"
  const gramsMatch = norm.match(/(\d+)\s*(g|gr|grammes|grams)/);
  if (gramsMatch) {
    const val = parseInt(gramsMatch[1], 10);
    if (val >= 10 && val <= 1500) {
      return { grams: val };
    }
  }

  // Matches count: "2 oeufs", "3 tranches", "1 part"
  const countMatch = norm.match(/^(\d+)\s+(tranches?|parts?|verres?|bols?|oeufs?|pommes?|pots?)/);
  if (countMatch) {
    const count = parseInt(countMatch[1], 10);
    if (count > 0 && count <= 10) {
      return { multiplier: count };
    }
  }

  return {};
}

/**
 * Calculates calories and quantity immediately from a meal text (e.g. "une omelette et mousse chocolat")
 */
export function estimateMealFromText(input: string): MealCalculationResult {
  const cleaned = input.trim();
  if (!cleaned) {
    return {
      foodName: '',
      totalCalories: 0,
      totalPortionGrams: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0,
      items: [],
      explanation: 'Veuillez saisir un aliment ou plat.',
    };
  }

  // Split input into clauses using typical culinary separators
  // "et", "+", "&", ",", "avec", "puis", "suivi de", "accompagné de"
  const clauses = cleaned
    .split(/\s+(?:et|\+|&|avec|puis|suivi\s+de|accompagne\s+de|accompagné\s+de|,)\s+|\s*,\s*|\s*\+\s*/i)
    .map((c) => c.trim())
    .filter((c) => c.length > 1);

  const matchedItems: MealItemEstimate[] = [];
  const unmatchedClauses: string[] = [];

  for (const clause of clauses) {
    const normClause = normalize(clause);
    const { grams, multiplier } = extractQuantityModifier(normClause);

    let bestMatch: (typeof FOOD_KNOWLEDGE_BASE)[0] | null = null;
    let bestScore = 0;

    for (const food of FOOD_KNOWLEDGE_BASE) {
      for (const kw of food.keywords) {
        const normKw = normalize(kw);
        if (normClause.includes(normKw)) {
          const score = normKw.length;
          if (score > bestScore) {
            bestScore = score;
            bestMatch = food;
          }
        }
      }
    }

    if (bestMatch) {
      let portion = grams ?? bestMatch.defaultPortionGrams;
      if (multiplier && !grams) {
        portion = Math.round(bestMatch.defaultPortionGrams * multiplier);
      }

      const factor = portion / 100;
      const cal = Math.round(bestMatch.caloriesPer100g * factor);
      const prot = Math.round(bestMatch.proteinPer100g * factor * 10) / 10;
      const carbs = Math.round(bestMatch.carbsPer100g * factor * 10) / 10;
      const fat = Math.round(bestMatch.fatPer100g * factor * 10) / 10;

      matchedItems.push({
        name: bestMatch.canonicalName,
        portionGrams: portion,
        calories: cal,
        protein: prot,
        carbs,
        fat,
      });
    } else {
      unmatchedClauses.push(clause);
    }
  }

  // If some or all clauses were not recognized by dictionary, provide intelligent generic estimates
  if (matchedItems.length === 0) {
    // Generic balanced meal approximation (e.g. unknown dish)
    const defaultGrams = 250;
    const defaultCal = 380;
    matchedItems.push({
      name: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      portionGrams: defaultGrams,
      calories: defaultCal,
      protein: 24,
      carbs: 35,
      fat: 14,
    });
  } else if (unmatchedClauses.length > 0) {
    // Add an estimate for the remaining item
    for (const unk of unmatchedClauses) {
      matchedItems.push({
        name: unk.charAt(0).toUpperCase() + unk.slice(1),
        portionGrams: 100,
        calories: 130,
        protein: 5,
        carbs: 15,
        fat: 5,
      });
    }
  }

  const totalCalories = matchedItems.reduce((acc, it) => acc + it.calories, 0);
  const totalPortionGrams = matchedItems.reduce((acc, it) => acc + it.portionGrams, 0);
  const totalProtein = Math.round(matchedItems.reduce((acc, it) => acc + it.protein, 0) * 10) / 10;
  const totalCarbs = Math.round(matchedItems.reduce((acc, it) => acc + it.carbs, 0) * 10) / 10;
  const totalFat = Math.round(matchedItems.reduce((acc, it) => acc + it.fat, 0) * 10) / 10;

  const explanation = matchedItems
    .map((it) => `${it.name} (~${it.calories} kcal, ${it.portionGrams}g)`)
    .join(' + ');

  return {
    foodName: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
    totalCalories,
    totalPortionGrams,
    totalProtein,
    totalCarbs,
    totalFat,
    items: matchedItems,
    explanation,
  };
}
