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

  // Cafés, Thés & Boissons Chaudes
  {
    keywords: [
      'cafe',
      'cafes',
      'cafe noir',
      'cafes noirs',
      'espresso',
      'espressos',
      'expresso',
      'expressos',
      'allonge',
      'allongé',
      'americano',
      'deca',
      'decaf',
      'décaféiné',
      'cafe sans sucre',
      'un cafe',
      'tasse de cafe',
      'coffee',
      'black coffee',
    ],
    canonicalName: 'Café noir (1 tasse / espresso)',
    defaultPortionGrams: 60,
    caloriesPer100g: 3,
    proteinPer100g: 0.1,
    carbsPer100g: 0.2,
    fatPer100g: 0,
  },
  {
    keywords: [
      'cafe sucre',
      'cafes sucres',
      'cafe avec sucre',
      'cafe 1 sucre',
      'cafe un sucre',
      'espresso sucre',
      'expresso sucre',
      'cafe 2 sucres',
      'sweet coffee',
    ],
    canonicalName: 'Café avec sucre (1 tasse)',
    defaultPortionGrams: 60,
    caloriesPer100g: 35,
    proteinPer100g: 0.1,
    carbsPer100g: 8.5,
    fatPer100g: 0,
  },
  {
    keywords: [
      'cafe au lait',
      'cafes au lait',
      'caffe latte',
      'latte',
      'cafe macchiato',
      'macchiato',
      'flat white',
      'cafe noisette',
      'noisette',
      'cafe creme',
      'café crème',
    ],
    canonicalName: 'Café au lait (1 tasse)',
    defaultPortionGrams: 150,
    caloriesPer100g: 35,
    proteinPer100g: 2.2,
    carbsPer100g: 3.5,
    fatPer100g: 1.5,
  },
  {
    keywords: ['cappuccino', 'cappuccinos', 'capuccino'],
    canonicalName: 'Cappuccino (1 tasse)',
    defaultPortionGrams: 150,
    caloriesPer100g: 50,
    proteinPer100g: 2.6,
    carbsPer100g: 5.5,
    fatPer100g: 2.2,
  },
  {
    keywords: [
      'the',
      'thé',
      'thes',
      'thés',
      'the vert',
      'thé vert',
      'the noir',
      'thé noir',
      'the blanc',
      'the menthe',
      'tisane',
      'tisanes',
      'infusion',
      'infusions',
      'verveine',
      'camomille',
      'rooibos',
      'tea',
      'green tea',
    ],
    canonicalName: 'Thé ou Infusion nature sans sucre',
    defaultPortionGrams: 200,
    caloriesPer100g: 1,
    proteinPer100g: 0,
    carbsPer100g: 0.2,
    fatPer100g: 0,
  },
  {
    keywords: [
      'the sucre',
      'thé sucré',
      'the avec sucre',
      'the au miel',
      'thé au miel',
      'the avec miel',
      'tisane sucree',
      'tisane au miel',
    ],
    canonicalName: 'Thé ou Infusion avec sucre ou miel',
    defaultPortionGrams: 200,
    caloriesPer100g: 18,
    proteinPer100g: 0,
    carbsPer100g: 4.5,
    fatPer100g: 0,
  },
  {
    keywords: [
      'chocolat chaud',
      'chocolats chauds',
      'cacao au lait',
      'cacao',
      'nesquik',
      'benco',
      'hot chocolate',
    ],
    canonicalName: 'Chocolat chaud au lait (1 mug)',
    defaultPortionGrams: 200,
    caloriesPer100g: 78,
    proteinPer100g: 3.5,
    carbsPer100g: 10,
    fatPer100g: 2.8,
  },

  // Boissons Fraîches & Eau
  {
    keywords: [
      'eau',
      'verre d eau',
      'verres d eau',
      'bouteille d eau',
      'eau plate',
      'eau gazeuse',
      'eau minerale',
      'eau de source',
      'water',
    ],
    canonicalName: 'Eau (1 grand verre)',
    defaultPortionGrams: 250,
    caloriesPer100g: 0,
    proteinPer100g: 0,
    carbsPer100g: 0,
    fatPer100g: 0,
  },
  {
    keywords: [
      'jus d orange',
      'jus d oranges',
      'jus orange',
      'orange pressee',
      'orange pressée',
      'jus de fruits',
      'jus de fruit',
      'jus de pomme',
      'jus de pamplemousse',
      'jus d ananas',
      'orange juice',
    ],
    canonicalName: 'Jus d’orange ou de fruits (1 verre)',
    defaultPortionGrams: 200,
    caloriesPer100g: 45,
    proteinPer100g: 0.7,
    carbsPer100g: 10.2,
    fatPer100g: 0.2,
  },
  {
    keywords: [
      'lait',
      'verre de lait',
      'lait demi ecreme',
      'lait demi écrémé',
      'lait ecreme',
      'lait entier',
      'milk',
    ],
    canonicalName: 'Lait demi-écrémé (1 verre)',
    defaultPortionGrams: 200,
    caloriesPer100g: 46,
    proteinPer100g: 3.3,
    carbsPer100g: 4.8,
    fatPer100g: 1.6,
  },
  {
    keywords: ['coca', 'coca cola', 'soda', 'pepsi', 'fanta', 'sprite', 'ice tea'],
    canonicalName: 'Soda sucré (1 canette / verre)',
    defaultPortionGrams: 330,
    caloriesPer100g: 42,
    proteinPer100g: 0,
    carbsPer100g: 10.6,
    fatPer100g: 0,
  },
  {
    keywords: [
      'coca zero',
      'cola zero',
      'coca light',
      'soda zero',
      'zero sucre',
      'pepsi max',
      'coke zero',
    ],
    canonicalName: 'Soda sans sucre / Zéro (1 canette)',
    defaultPortionGrams: 330,
    caloriesPer100g: 0.5,
    proteinPer100g: 0,
    carbsPer100g: 0.1,
    fatPer100g: 0,
  },
  {
    keywords: ['biere', 'bière', 'bieres', 'bières', 'demi de biere', 'panache', 'beer'],
    canonicalName: 'Bière (1 demi 25cl)',
    defaultPortionGrams: 250,
    caloriesPer100g: 43,
    proteinPer100g: 0.5,
    carbsPer100g: 3.6,
    fatPer100g: 0,
  },
  {
    keywords: [
      'vin',
      'vin rouge',
      'vin blanc',
      'vin rose',
      'vin rosé',
      'verre de vin',
      'champagne',
      'wine',
    ],
    canonicalName: 'Vin (1 verre 12cl)',
    defaultPortionGrams: 120,
    caloriesPer100g: 75,
    proteinPer100g: 0.1,
    carbsPer100g: 2.5,
    fatPer100g: 0,
  },

  // Petit-déjeuner, Tartines & Snacks
  {
    keywords: [
      'tartine beurree',
      'tartine beurrée',
      'tartine de beurre',
      'pain beurre',
      'pain beurré',
      'tartine',
    ],
    canonicalName: 'Tartine de pain beurrée (1 tranche)',
    defaultPortionGrams: 40,
    caloriesPer100g: 350,
    proteinPer100g: 6,
    carbsPer100g: 38,
    fatPer100g: 18,
  },
  {
    keywords: ['tartine confiture', 'pain confiture', 'confiture', 'jam'],
    canonicalName: 'Tartine avec confiture (1)',
    defaultPortionGrams: 45,
    caloriesPer100g: 280,
    proteinPer100g: 4,
    carbsPer100g: 55,
    fatPer100g: 2,
  },
  {
    keywords: ['biscotte', 'biscottes', 'craquotte', 'craquottes', 'pain grille', 'pain grillé'],
    canonicalName: 'Biscotte (1)',
    defaultPortionGrams: 15,
    caloriesPer100g: 395,
    proteinPer100g: 11,
    carbsPer100g: 72,
    fatPer100g: 6,
  },
  {
    keywords: ['morceau de sucre', 'morceaux de sucre', 'cuillere de sucre', 'sucre', 'sugar'],
    canonicalName: 'Sucre (1 morceau / cuillère)',
    defaultPortionGrams: 5,
    caloriesPer100g: 400,
    proteinPer100g: 0,
    carbsPer100g: 100,
    fatPer100g: 0,
  },
  {
    keywords: ['miel', 'cuillere de miel', 'honey'],
    canonicalName: 'Miel (1 c.à.c)',
    defaultPortionGrams: 10,
    caloriesPer100g: 304,
    proteinPer100g: 0.3,
    carbsPer100g: 82,
    fatPer100g: 0,
  },
  {
    keywords: [
      'amandes',
      'amande',
      'noix',
      'noisettes',
      'noisette',
      'noix de cajou',
      'pistaches',
      'pistache',
      'nuts',
      'almonds',
    ],
    canonicalName: 'Poignée d’oléagineux (amandes/noix 30g)',
    defaultPortionGrams: 30,
    caloriesPer100g: 600,
    proteinPer100g: 20,
    carbsPer100g: 10,
    fatPer100g: 52,
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
 * Robust word-boundary check to prevent substring collisions (e.g. "eau" matching "morceau", "the" matching "menthe")
 */
function matchesKeyword(normClause: string, normKw: string): boolean {
  if (normClause === normKw) return true;
  const escaped = normKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const reg = new RegExp(`(^|\\s)${escaped}(\\s|$)`);
  return reg.test(normClause);
}

/**
 * Extracts a numeric portion or multiplier if user wrote e.g. "200g", "25cl", "2 cafés", "un café"
 */
function extractQuantityModifier(text: string): { grams?: number; multiplier?: number } {
  const norm = normalize(text);

  // Matches grams: "200g", "200 g", "250gr"
  const gramsMatch = norm.match(/(\d+(?:[.,]\d+)?)\s*(g|gr|grammes|grams)\b/);
  if (gramsMatch) {
    const val = Math.round(parseFloat(gramsMatch[1].replace(',', '.')));
    if (val >= 5 && val <= 2500) {
      return { grams: val };
    }
  }

  // Matches milliliters: "100ml", "250 ml"
  const mlMatch = norm.match(/(\d+)\s*(ml|millilitres)\b/);
  if (mlMatch) {
    const val = parseInt(mlMatch[1], 10);
    if (val >= 10 && val <= 3000) {
      return { grams: val };
    }
  }

  // Matches centiliters: "25cl", "33 cl" -> convert to grams
  const clMatch = norm.match(/(\d+)\s*(cl|centilitres)\b/);
  if (clMatch) {
    const val = parseInt(clMatch[1], 10) * 10;
    if (val >= 10 && val <= 3000) {
      return { grams: val };
    }
  }

  // Matches liters: "1l", "1.5 l"
  const lMatch = norm.match(/(\d+(?:[.,]\d+)?)\s*(l|litre|litres)\b/);
  if (lMatch) {
    const val = Math.round(parseFloat(lMatch[1].replace(',', '.')) * 1000);
    if (val >= 100 && val <= 5000) {
      return { grams: val };
    }
  }

  // Matches word numbers: "un", "une", "deux", "trois"
  const numberWords: Record<string, number> = {
    un: 1,
    une: 1,
    deux: 2,
    trois: 3,
    quatre: 4,
    cinq: 5,
    six: 6,
    demi: 0.5,
    demie: 0.5,
  };

  const countWordMatch = norm.match(
    /\b(un|une|deux|trois|quatre|cinq|six|demi|demie|\d+)\s*(cafes?|tasses?|mugs?|verres?|bols?|tranches?|parts?|morceaux?|cuilleres?|pots?|pommes?|oeufs?|biscottes?|croissants?)\b/
  );
  if (countWordMatch) {
    const rawNum = countWordMatch[1];
    const count = numberWords[rawNum] ?? parseInt(rawNum, 10);
    if (!isNaN(count) && count > 0 && count <= 15) {
      return { multiplier: count };
    }
  }

  // Standalone leading digit: "2 cafes", "3 pommes", "1 cafe"
  const simpleCountMatch = norm.match(/^(\d+)\s+/);
  if (simpleCountMatch) {
    const count = parseInt(simpleCountMatch[1], 10);
    if (count > 0 && count <= 15) {
      return { multiplier: count };
    }
  }

  return {};
}

/**
 * Intelligent categorization for unknown clauses (prevents giving 380 kcal to drinks or small snacks)
 */
function detectCategory(clauseText: string): {
  defaultGrams: number;
  defaultCal: number;
  protein: number;
  carbs: number;
  fat: number;
} {
  const norm = normalize(clauseText);

  // 1. Black coffee, tea, infusions, water (0-5 kcal)
  if (
    /\b(cafe|cafes|coffee|espresso|espressos|expresso|expressos|the|thes|thé|tea|tisane|tisanes|infusion|infusions|eau|water)\b/.test(
      norm
    )
  ) {
    return { defaultGrams: 60, defaultCal: 2, protein: 0.1, carbs: 0.2, fat: 0 };
  }

  // 2. Other drinks (latte, juice, milk, smoothie, soda)
  if (
    /\b(boisson|boissons|drink|jus|lait|milk|latte|smoothie|soda|cola|sirop|tasse|mug|verre)\b/.test(
      norm
    )
  ) {
    return { defaultGrams: 180, defaultCal: 50, protein: 2, carbs: 8, fat: 1 };
  }

  // 3. Fruits & Vegetables
  if (
    /\b(fruit|fruits|legume|legumes|pomme|poire|orange|banane|fraise|kiwi|salade|tomate|courgette|carotte|haricot)\b/.test(
      norm
    )
  ) {
    return { defaultGrams: 120, defaultCal: 55, protein: 1, carbs: 12, fat: 0.2 };
  }

  // 4. Sweets, desserts, sugars & snacks
  if (
    /\b(biscuit|gateau|gâteau|chocolat|bonbon|sucre|miel|mousse|crepe|crêpe|glace|dessert|snack)\b/.test(
      norm
    )
  ) {
    return { defaultGrams: 80, defaultCal: 160, protein: 3, carbs: 24, fat: 6 };
  }

  // 5. General balanced dish (realistic default meal: ~250 kcal, NOT 380)
  return { defaultGrams: 200, defaultCal: 250, protein: 16, carbs: 24, fat: 9 };
}

/**
 * Calculates calories and quantity immediately from a meal text (e.g. "un café", "une omelette et mousse chocolat")
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
    .filter((c) => c.length > 0);

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
        if (matchesKeyword(normClause, normKw)) {
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
    const cat = detectCategory(cleaned);
    matchedItems.push({
      name: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
      portionGrams: cat.defaultGrams,
      calories: cat.defaultCal,
      protein: cat.protein,
      carbs: cat.carbs,
      fat: cat.fat,
    });
  } else if (unmatchedClauses.length > 0) {
    // Add estimates for any remaining unrecognized components
    for (const unk of unmatchedClauses) {
      const cat = detectCategory(unk);
      matchedItems.push({
        name: unk.charAt(0).toUpperCase() + unk.slice(1),
        portionGrams: cat.defaultGrams,
        calories: cat.defaultCal,
        protein: cat.protein,
        carbs: cat.carbs,
        fat: cat.fat,
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
