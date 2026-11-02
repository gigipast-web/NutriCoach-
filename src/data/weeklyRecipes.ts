import { Recipe } from '../types.ts';

/**
 * Calculates current ISO Week number (1 - 52)
 */
export function getIsoWeekNumber(d: Date = new Date()): number {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

/**
 * Returns user-friendly week label (e.g. "Semaine 41 • 6 au 12 Octobre")
 */
export function getWeekDateRangeLabel(d: Date = new Date()): string {
  const weekNum = getIsoWeekNumber(d);
  const currentDayOfWeek = (d.getDay() + 6) % 7; // 0 = Lundi, 6 = Dimanche
  const monday = new Date(d);
  monday.setDate(d.getDate() - currentDayOfWeek);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  const startStr = monday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  const endStr = sunday.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });

  return `Semaine ${weekNum} • ${startStr} au ${endStr}`;
}

/**
 * Weekly themes that change every week
 */
export const WEEKLY_THEMES = [
  'Spécial Détox & Vitalité d’Automne 🍂',
  'Haute Teneur en Protéines & Satiété 💪',
  'Cuisine Express Méditerranéenne & Huile d’Olive 🫒',
  'Brûle-Graisses & Aliments à Faible Indice Glycémique 🔥',
  'Saveurs d’Asie Gourmandes & Légères 🥢',
  'Spécial Légumes Racines & Réconfort Sans Excès 🥕',
  'Cuisine Végétale & Fibres Prébiotiques 🥦',
  'Pêche Durable & Oméga-3 Essentiels 🐟',
];

export function getCurrentWeekTheme(weekNum: number = getIsoWeekNumber()): string {
  return WEEKLY_THEMES[weekNum % WEEKLY_THEMES.length];
}

/**
 * Curated Catalog of Seasonal Weekly Recipes
 * Automatically rotated and refreshed according to current week
 */
export const ALL_SEASONAL_RECIPES: Recipe[] = [
  // --- NOUVEAUTÉS DE CETTE SEMAINE ---
  {
    id: 'w_salmon_teriyaki',
    title: 'Pavé de Saumon Teriyaki & Brocolis Sauvages',
    description: 'Une cuisson laquée sans sucres raffinés, riche en oméga-3 anti-inflammatoires et protéines nobles.',
    prepTimeMinutes: 18,
    calories: 420,
    protein: 36,
    carbs: 22,
    fat: 16,
    category: 'riches_proteines',
    imageUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '140g de pavé de saumon frais',
      '150g de brocolis vapeur',
      '1 c.à.s de sauce soja allégée en sel',
      '1 c.à.c de miel ou sirop d’érable',
      '1 c.à.c de graines de sésame grillées',
      'Gingembre frais râpé',
    ],
    instructions: [
      'Mélanger la sauce soja, le miel et le gingembre râpé.',
      'Faire cuire le pavé de saumon côté peau pendant 4 minutes dans une poêle antiadhésive.',
      'Napper de la sauce et laisser caraméliser 2 minutes à feu moyen.',
      'Servir avec les têtes de brocolis vapeur parsemées de graines de sésame.',
    ],
    tags: ['Nouveauté Semaine', 'Star de la Semaine 🌟', 'Riche en Protéines', 'Oméga-3', 'Sans Gluten'],
    isNewThisWeek: true,
    isWeeklyStar: true,
  },
  {
    id: 'w_butternut_soup',
    title: 'Velouté Onctueux Butternut & Lentilles Corail',
    description: 'Une soupe d’automne réconfortante, soyeuse et naturellement riche en bêta-carotène et fibres de satiété.',
    prepTimeMinutes: 22,
    calories: 260,
    protein: 14,
    carbs: 38,
    fat: 4,
    category: 'faibles_calories',
    imageUrl: 'https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '200g de courge butternut en dés',
      '40g de lentilles corail crues',
      '1/2 oignon doux émincé',
      '1 pincée de noix de muscade et curcuma',
      '1 c.à.s de graines de courge toastées',
    ],
    instructions: [
      'Faire suer l’oignon dans une goutte d’huile d’olive.',
      'Ajouter les dés de butternut, les lentilles rincées et couvrir de bouillon de légumes.',
      'Laisser mijoter 18 minutes jusqu’à tendreté.',
      'Mixer finement jusqu’à consistance veloutée.',
      'Servir bien chaud parsemé de graines de courge croquantes.',
    ],
    tags: ['Nouveauté Semaine', 'Faibles Calories', 'Végétarien', 'Détox', 'Sans Gluten'],
    isNewThisWeek: true,
  },
  {
    id: 'w_quinoa_bowl_detox',
    title: 'Super-Bowl Quinoa, Grenade, Avocat & Féta',
    description: 'L’équilibre idéal entre antioxydants colorés, croquant de la grenade et onctuosité de l’avocat.',
    prepTimeMinutes: 12,
    calories: 350,
    protein: 16,
    carbs: 42,
    fat: 12,
    category: 'sans_gluten',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '80g de quinoa cuit',
      '1/3 d’avocat frais coupé en lamelles',
      '2 c.à.s d’arilles de grenade fraîche',
      '35g de féta AOP émiettée',
      '1 poignée de jeunes pousses d’épinards',
      'Vinaigrette citronnée légère',
    ],
    instructions: [
      'Disposer les jeunes pousses d’épinards et le quinoa cuit au fond d’un bol.',
      'Ajouter les lamelles d’avocat et la féta émiettée.',
      'Parsemer généreusement de graines de grenade pour la touche antioxydante acidulée.',
      'Arroser d’un filet de jus de citron et d’huile d’olive extra vierge.',
    ],
    tags: ['Nouveauté Semaine', 'Express 12 min', 'Végétarien', 'Sans Gluten'],
    isNewThisWeek: true,
  },
  {
    id: 'w_turkey_wok',
    title: 'Wok Express Dinde, Légumes Croquants & Noix de Cajou',
    description: 'Prêt en 15 minutes chrono : un festival de couleurs, très pauvre en matières grasses et ultra rassasiant.',
    prepTimeMinutes: 15,
    calories: 380,
    protein: 40,
    carbs: 24,
    fat: 10,
    category: 'express',
    imageUrl: 'https://images.unsplash.com/photo-1543353071-873f17a7a088?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '150g d’escalope de dinde en lanières',
      '100g de pois gourmands et poivrons émincés',
      '1 courgette moyenne coupée en rondelles fines',
      '15g de noix de cajou non salées torréfiées',
      '1 c.à.s de sauce soja salée légère',
      'Coriandre fraîche hachée',
    ],
    instructions: [
      'Chauffer le wok avec un spray d’huile.',
      'Saisir les lanières de dinde 3 à 4 minutes à feu vif.',
      'Ajouter les légumes croquants et la sauce soja, remuer sans cesse pendant 5 minutes.',
      'Terminer en parsemant de noix de cajou et de coriandre fraîche.',
    ],
    tags: ['Nouveauté Semaine', 'Express 15 min', 'Riche en Protéines', 'Low Fat'],
    isNewThisWeek: true,
  },
  {
    id: 'w_oat_pancakes',
    title: 'Pancakes Moelleux Flocons d’Avoine & Myrtilles',
    description: 'Le petit-déjeuner du week-end sans sucre ajouté, à index glycémique bas pour éviter toute fringale à 11h.',
    prepTimeMinutes: 15,
    calories: 280,
    protein: 15,
    carbs: 42,
    fat: 5,
    category: 'sans_gluten',
    imageUrl: 'https://images.unsplash.com/photo-1528207776546-365bb710ee93?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '50g de flocons d’avoine mixés en farine',
      '1 banane mûre écrasée',
      '1 œuf entier bio',
      '50ml de lait d’amande sans sucre',
      '1 poignée de myrtilles fraîches',
    ],
    instructions: [
      'Écraser la banane et la fouetter avec l’œuf et le lait d’amande.',
      'Incorporer la farine d’avoine pour obtenir une pâte homogène.',
      'Cuire de petits pancakes dans une poêle chaude antiadhésive 2 min par face.',
      'Garnir de myrtilles fraîches riches en polyphénols.',
    ],
    tags: ['Nouveauté Semaine', 'Petit-déj Sain', 'Sans Sucre Ajouté', 'Index Glycémique Bas'],
    isNewThisWeek: true,
  },

  // --- RECETTES CLASSIQUES DU CATALOGUE ---
  {
    id: 'r1',
    title: 'Bowl Méditerranéen Poulet & Avocat',
    description: 'Un repas complet, gourmand et équilibré riche en protéines et bonnes graisses.',
    prepTimeMinutes: 15,
    calories: 420,
    protein: 36,
    carbs: 35,
    fat: 14,
    category: 'riches_proteines',
    imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '120g de blanc de poulet grillé',
      '80g de quinoa cuit',
      '1/2 avocat mûr tranché',
      '50g de concombres et tomates cerises',
      '1 c.à.s de sauce yaourt aux fines herbes et citron',
    ],
    instructions: [
      'Faire cuire le quinoa et laisser tiédir.',
      "Saisir le blanc de poulet avec un filet d'huile d'olive et des herbes de Provence.",
      "Dresser le quinoa dans un bol, ajouter le poulet, l'avocat et les crudités.",
      'Napper de la sauce yaourt légère au citron.',
    ],
    tags: ['Riche en Protéines', 'Sans Gluten', 'Express'],
  },
  {
    id: 'r2',
    title: 'Wok de Cabillaud & Légumes Croquants',
    description: 'Une recette ultra-légère et rassasiante aux saveurs gingembre-soja.',
    prepTimeMinutes: 20,
    calories: 290,
    protein: 32,
    carbs: 18,
    fat: 6,
    category: 'faibles_calories',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '150g de dos de cabillaud',
      '100g de courgettes et carottes coupées en julienne',
      '50g de pousses de soja',
      '1 c.à.s de sauce soja salée pauvre en sodium',
      'Gingembre frais râpé et ciboulette',
    ],
    instructions: [
      "Faire sauter les légumes dans un wok très chaud pendant 5 min avec un filet d'eau.",
      'Ajouter le cabillaud coupé en gros dés.',
      'Verser la sauce soja et le gingembre râpé.',
      'Laisser mijoter 6 à 8 minutes à feu doux.',
    ],
    tags: ['Faible Calorie', 'Sans Gluten', 'Protéiné'],
  },
  {
    id: 'r3',
    title: 'Curry Doux de Lentilles Corail & Épinards',
    description: 'Plat végétarien réconfortant et très riche en fibres et minéraux.',
    prepTimeMinutes: 25,
    calories: 360,
    protein: 18,
    carbs: 48,
    fat: 9,
    category: 'vegetarienne',
    imageUrl: 'https://images.unsplash.com/photo-1543339308-43e59d6b73a6?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '70g de lentilles corail crues',
      '100ml de lait de coco léger',
      "50g d'épinards frais",
      '1/2 oignon et 1 gousse d\'ail',
      '1 c.à.c de curry doux',
    ],
    instructions: [
      "Faire revenir l'oignon haché et l'ail.",
      'Ajouter le curry et les lentilles rincées.',
      "Verser 200ml d'eau et le lait de coco.",
      'Cuire 15 minutes à petit bouillon, incorporer les épinards en fin de cuisson.',
    ],
    tags: ['Végétarien', 'Riche en Fibres', 'Sans Gluten'],
  },
  {
    id: 'r4',
    title: 'Omelette Soufflée aux Épinards & Féta 0%',
    description: 'Le petit-déjeuner ou dîner express parfait pour faire le plein de légèreté.',
    prepTimeMinutes: 10,
    calories: 240,
    protein: 21,
    carbs: 6,
    fat: 14,
    category: 'express',
    imageUrl: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '2 œufs frais bio',
      "40g d'épinards frais tombés à la poêle",
      '30g de féta allégée',
      'Poivre noir et ciboulette fraîche',
    ],
    instructions: [
      "Battre les œufs vigoureusement pour incorporer de l'air.",
      'Faire fondre les épinards dans une poêle antiadhésive.',
      'Verser les œufs battus, émietter la féta au centre.',
      'Replier l’omelette et servir immédiatement.',
    ],
    tags: ['Express 10 min', 'Low Carb', 'Végétarien', 'Sans Gluten'],
  },
  {
    id: 'w_galette_sarrasin',
    title: 'Galette Bretonne au Sarrasin, Saumon & Aneth',
    description: 'Une crêpe fine 100% sarrasin naturellement sans gluten, garnie de saumon fumé et fromage blanc citronné.',
    prepTimeMinutes: 15,
    calories: 340,
    protein: 26,
    carbs: 32,
    fat: 9,
    category: 'sans_gluten',
    imageUrl: 'https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '1 galette de pur sarrasin (blé noir)',
      '60g de saumon fumé sauvage',
      '2 c.à.s de fromage blanc 0% battu à l’aneth',
      '1 poignée de jeunes pousses d’épinards',
      'Jus de citron frais & poivre noir',
    ],
    instructions: [
      'Chauffer doucement la galette de sarrasin dans une crêpière.',
      'Tartiner le fromage blanc assaisonné de jus de citron et d’aneth.',
      'Disposer les tranches de saumon et les pousses d’épinards frais.',
      'Plier en carré et servir immédiatement avec une salade verte.',
    ],
    tags: ['Nouveauté Semaine', 'Sans Gluten', 'Riche en Protéines', 'Express 15 min'],
    isNewThisWeek: true,
  },
  {
    id: 'w_thai_curry_chicken',
    title: 'Curry Thaï de Dinde & Patates Douces au Lait de Coco',
    description: 'Un plat parfumé sans aucun gluten, riche en curcuma anti-inflammatoire et glucides lents rassasiants.',
    prepTimeMinutes: 20,
    calories: 410,
    protein: 38,
    carbs: 40,
    fat: 11,
    category: 'sans_gluten',
    imageUrl: 'https://images.unsplash.com/photo-1455619452474-d2be8b1e70cd?auto=format&fit=crop&w=800&q=80',
    ingredients: [
      '140g d’escalope de dinde en cubes',
      '120g de patate douce coupée en dés',
      '80ml de lait de coco allégé',
      '1 c.à.c de pâte de curry jaune sans gluten',
      '1 poignée de pousses de bambou et coriandre',
    ],
    instructions: [
      'Cuire les dés de patate douce 8 min à la vapeur.',
      'Saisir les morceaux de dinde dans une sauteuse.',
      'Ajouter la pâte de curry et déglacer au lait de coco.',
      'Incorporer les dés de patate douce et laisser mijoter 5 minutes.',
      'Parsemer de coriandre fraîche avant de déguster.',
    ],
    tags: ['Nouveauté Semaine', 'Sans Gluten', 'Confort Digestif', 'Riche en Protéines'],
    isNewThisWeek: true,
  },
];
