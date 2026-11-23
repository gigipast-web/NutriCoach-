export interface TrackingBrandInfo {
  category: string;
  gateway: string;
  instructions: [string, string, string];
}

export interface UiTrackingDict {
  mealBreakfast: string;
  mealBreakfastShort: string;
  mealLunch: string;
  mealSnack: string;
  mealDinner: string;
  proteins: string;
  carbs: string;
  fats: string;
  macroP: string;
  macroC: string;
  macroF: string;
  saveIn: string;
  cancel: string;
  save: string;
  close: string;
  remove: string;
  add: string;
  kcal: string;

  // JournalView
  journalTitle: string;
  historyWeekTitle: string;
  periodToday: string;
  periodTomorrow: string;
  periodWeek: string;
  weeklyRecapTab: string;
  sevenDaysShort: string;
  nutritionGoalTitle: string;
  proteinsTarget90: string;
  fiberTarget25: string;
  saladAlt: string;
  placeholderBreakfast: string;
  placeholderLunch: string;
  placeholderSnack: string;
  placeholderDinner: string;
  markCompletedTitle: string;
  checkMealTitle: string;
  deleteFoodTitle: string;
  addFoodCta: string;
  barcodeBtn: string;
  aiScannerBtn: string;
  clearTodayTitle: string;
  clearShort: string;
  loggedItemsSummary: (count: number, kcal: number) => string;
  modalSubtitle: string;
  saveInWhichMeal: string;
  quickExamples: string[];
  calculateBtn: string;
  satietyVitamins: string;
  addFruitTitle: (name: string) => string;
  fruits: Array<{ emoji: string; name: string; kcal: number; grams: number }>;
  macronutrientsG: string;
  kcalPlaceholderEx: string;
  portionPlaceholderEx: string;

  // WeeklyMealRecap
  recapBadge: string;
  recapWeekFromTo: (first: string, last: string) => string;
  recapTitle: string;
  recapSubtitle: string;
  prevWeek: string;
  nextWeek: string;
  thisWeek: string;
  lastWeek: string;
  weekOffsetLabel: (n: number) => string;
  copied: string;
  copySummary: string;
  backToToday: string;
  avgPerDay: string;
  targetPrefix: string;
  weekTotal: string;
  daysLogged: (n: number) => string;
  fruitsVitality: string;
  portionsUnit: string;
  fruitPerDayAvg: (avg: string) => string;
  targetRegularity: string;
  daysUnit: string;
  excellentBudget: string;
  balancedPace: string;
  dailyCalEvolution: string;
  clickBarHint: string;
  inTarget: string;
  aboveTarget: string;
  targetLine: (kcal: number) => string;
  selectedDayLabel: string;
  showAllDays: string;
  macroDistTitle: string;
  macroDistSub: string;
  totalAbsorbed: (g: number) => string;
  approxPerDay: (g: number) => string;
  proteinDesc: string;
  carbsDesc: string;
  fatDesc: string;
  coachWeeklyTitle: string;
  coachWeeklyEmpty: string;
  coachWeeklyGood: (name: string, avg: number, target: number, fruits: number) => string;
  coachWeeklyHigh: (name: string, avg: number, target: number) => string;
  dailyDetailHeading: (count: number) => string;
  filterLabel: string;
  filterAll: string;
  todayPill: string;
  fruitCountLabel: (n: number) => string;
  loggedItemsCount: (n: number) => string;
  noMealsFilter: string;
  copyTitle: string;
  copyDailyTarget: string;
  copyRealAvg: string;
  copyTotalConsumed: string;
  copyDaysLoggedText: (n: number) => string;
  copyFruitsLabel: string;
  copyDetailByDay: string;
  copyMealsCount: (n: number) => string;
  copyNoMeals: string;

  // HydrationView
  wellbeingBadge: string;
  dailyTracking: string;
  hydrationTitle: string;
  waterShort: string;
  stepsShort: string;
  syncWatchShort: string;
  syncMyWatch: string;
  hydrationJournal: string;
  goalMl: (ml: number) => string;
  outOfGlasses: (n: number) => string;
  litersTotal: (l: string) => string;
  addGlass250: string;
  addBottle500: string;
  activitiesStepsTitle: string;
  logSportBtn: string;
  todaysSteps: string;
  resetStepsTitle: string;
  resetToZero: string;
  stepsMorningNote: string;
  stepGoalPrefix: (steps: string) => string;
  editStepGoalTitle: string;
  caloriesBurned: string;
  activeBurn: string;
  watchPrefix: (brand: string) => string;
  watchGenericTitle: string;
  lastSyncPrefix: (val: string) => string;
  watchSyncSub: string;
  syncActionBtn: string;
  connectActionBtn: string;
  quickAddSteps: string;
  clickDirectAdd: string;
  presetSmallWalk: string;
  presetActiveWalk: string;
  presetLongWalk: string;
  stepsUnit: string;
  loggedActivitiesCount: (n: number) => string;
  noActivitiesToday: string;
  sportSession: string;
  deleteActivityTitle: string;
  addActivityModalTitle: string;
  addActivityModalSub: string;
  activityNameLabel: string;
  activityNamePlaceholder: string;
  durationMinLabel: string;
  caloriesBurnedLabel: string;
  stepsOptionalLabel: string;
  editStepModalTitle: string;
  editStepModalSub: string;
  dailyStepTargetLabel: string;
  recommendedTargets: string;
  validateGoalBtn: string;

  // SmartwatchSyncModal
  watchModalBadge: string;
  watchModalCompat: string;
  watchModalTitle: string;
  tabSync: string;
  tabSelect: (n: number) => string;
  tabBluetooth: string;
  tabGuide: string;
  watchConnectedSuccess: (brand: string, model: string) => string;
  syncSuccessWithSteps: (steps: string, kcal: number, watch: string) => string;
  syncSuccessZero: (watch: string) => string;
  bleUnsupported: string;
  bleDetectedDefault: string;
  bleConnectedAppDefault: string;
  bleConnectedMsg: (name: string) => string;
  bleCancelled: string;
  bleError: string;
  watchDisconnected: string;
  noWatchConfigured: string;
  statusConnected: string;
  statusNotLinked: string;
  modelLabel: string;
  selectYourModel: string;
  lastSyncLabel: string;
  switchWatch: string;
  unlinkWatch: string;
  transferTodayTitle: string;
  transferTodayDesc: string;
  stepsReadTodayLabel: string;
  morningZeroBtn: string;
  approxBurned: (kcal: number) => string;
  zeroKcalStart: string;
  syncingBtn: string;
  startSyncNowBtn: string;
  watchPrincipleNote: string;
  supportedWatches: string;
  selectBrandTitle: string;
  selectBrandSub: string;
  badgeCurrent: string;
  gatewayLabel: string;
  exactModelLabel: string;
  pairThisWatch: string;
  bleDirectTitle: string;
  bleDirectSub: string;
  bleDirectBody: string;
  bleConnectedTo: string;
  bleScanningBtn: string;
  bleScanBtn: string;
  bleHelpLink: string;
  bleAppleNoteTitle: string;
  bleAppleNoteBody: string;
  guideTitle: string;
  guideSub: string;
  guideStep1Title: string;
  guideStep1Body: string;
  guideStep2Title: string;
  guideStep2Body: string;
  guideStep3Title: string;
  guideStep3Body: string;
  guideSpecificFor: (brand: string) => string;
  privateHealthFooter: string;
  todayAtTime: (time: string) => string;
  watchActivityTitle: (watchLabel: string) => string;
  brandSpecific: Record<string, TrackingBrandInfo>;

  // BarcodeScannerModal
  errInvalidBarcode: string;
  errNotFoundBarcode: (code: string) => string;
  errNetworkBarcode: string;
  errUnreadableLabel: string;
  errAnalyzeImage: string;
  errCameraNotReady: string;
  errProcessImage: string;
  scannedProductDefault: string;
  scannerTitle: string;
  scannerSubtitle: string;
  lookingUpProduct: string;
  autoDetectActive: string;
  cameraStarting: string;
  cameraUnavailable: string;
  cameraUnavailableHint: string;
  captureReadAi: string;
  takePhoto: string;
  photoGallery: string;
  orEnterEan: string;
  okBtn: string;
  recognizedByAi: string;
  forPortionG: (g: number) => string;
  consumedQtyG: string;
  scanAnotherTitle: string;
  addToJournalKcal: (kcal: number) => string;
}

export const TRK_FR: UiTrackingDict = {
  mealBreakfast: 'Petit-déjeuner',
  mealBreakfastShort: 'Petit-déj.',
  mealLunch: 'Déjeuner',
  mealSnack: 'Collation',
  mealDinner: 'Dîner',
  proteins: 'Protéines',
  carbs: 'Glucides',
  fats: 'Lipides',
  macroP: 'P',
  macroC: 'G',
  macroF: 'L',
  saveIn: 'Enregistrer dans :',
  cancel: 'Annuler',
  save: 'Enregistrer',
  close: 'Fermer',
  remove: 'Supprimer',
  add: 'Ajouter',
  kcal: 'kcal',

  journalTitle: 'Mon alimentation',
  historyWeekTitle: 'Historique & Bilan semaine',
  periodToday: "Aujourd'hui",
  periodTomorrow: 'Demain',
  periodWeek: 'Semaine',
  weeklyRecapTab: '📊 Récapitulatif Semaine',
  sevenDaysShort: '7j',
  nutritionGoalTitle: 'Votre objectif nutritionnel',
  proteinsTarget90: 'Protéines : 90 g',
  fiberTarget25: 'Fibres : 25 g',
  saladAlt: 'Salade équilibrée',
  placeholderBreakfast: "Flocons d'avoine, fruits rouges, yaourt nature...",
  placeholderLunch: 'Salade composée, féculents, légumes, poisson ou viande...',
  placeholderSnack: 'Fruit frais, amandes, fromage blanc ou compote...',
  placeholderDinner: 'Filet de poulet, légumes vapeur, soupe légère...',
  markCompletedTitle: 'Marqué comme complété',
  checkMealTitle: 'Cocher ce repas',
  deleteFoodTitle: 'Supprimer cet aliment',
  addFoodCta: 'Ajouter un aliment',
  barcodeBtn: 'Code-barres',
  aiScannerBtn: 'Scanner Photo IA',
  clearTodayTitle: "Vider aujourd'hui",
  clearShort: 'Vider',
  loggedItemsSummary: (c, k) => `Détail des ${c} aliments enregistrés (${k} kcal)`,
  modalSubtitle: 'Tapez simplement ce que vous mangez (ex : une omelette et mousse chocolat). Les calories et quantités sont calculées directement !',
  saveInWhichMeal: 'Enregistrer dans quel repas ?',
  quickExamples: [
    '☕ Un café',
    '☕ Café au lait & 1 biscotte',
    '🥚 Une omelette et mousse chocolat',
    '🍎 Omelette nature, salade & 1 pomme',
    '🍓 Yaourt grec & fruits rouges',
    '🥩 Steak haché, haricots & 1 poire',
  ],
  calculateBtn: 'Calculer',
  satietyVitamins: 'Satiété & Vitamines',
  addFruitTitle: (n) => `Ajouter ${n} à ce repas`,
  fruits: [
    { emoji: '🍎', name: '1 Pomme', kcal: 52, grams: 150 },
    { emoji: '🍊', name: '1 Clémentine', kcal: 38, grams: 80 },
    { emoji: '🍓', name: 'Fruits rouges', kcal: 38, grams: 100 },
    { emoji: '🥝', name: '1 Kiwi', kcal: 42, grams: 75 },
    { emoji: '🍌', name: '1/2 Banane', kcal: 45, grams: 60 },
    { emoji: '🍐', name: '1 Poire', kcal: 57, grams: 120 },
  ],
  macronutrientsG: 'Macronutriments (g)',
  kcalPlaceholderEx: 'ex: 425',
  portionPlaceholderEx: 'ex: 240',

  recapBadge: '📊 Synthèse Hebdomadaire',
  recapWeekFromTo: (a, b) => `Semaine du ${a} au ${b}`,
  recapTitle: 'Récapitulatif des Repas de la Semaine',
  recapSubtitle: "Vue d'ensemble de vos apports caloriques, macronutriments et portions de fruits sur 7 jours.",
  prevWeek: 'Semaine précédente',
  nextWeek: 'Semaine suivante',
  thisWeek: 'Cette semaine',
  lastWeek: 'Semaine dernière',
  weekOffsetLabel: (n) => `Semaine ${n}`,
  copied: 'Copié !',
  copySummary: 'Copier le bilan',
  backToToday: "← Vue Aujourd'hui",
  avgPerDay: 'Moyenne / Jour',
  targetPrefix: 'Cible :',
  weekTotal: 'Total Semaine',
  daysLogged: (n) => `${n} / 7 jours renseignés`,
  fruitsVitality: 'Fruits & Vitalité',
  portionsUnit: 'portions',
  fruitPerDayAvg: (a) => `~${a} portion / jour (Objectif : 2-3)`,
  targetRegularity: 'Régularité Cible',
  daysUnit: 'jours',
  excellentBudget: '🎯 Excellent respect du budget',
  balancedPace: '⚖️ Rythme équilibré',
  dailyCalEvolution: 'Évolution Journalière des Calories',
  clickBarHint: 'Cliquez sur une barre pour isoler le détail des repas de cette journée.',
  inTarget: 'Dans la cible',
  aboveTarget: 'Au-dessus',
  targetLine: (k) => `Ligne Cible (${k} kcal)`,
  selectedDayLabel: 'Jour sélectionné :',
  showAllDays: 'Réafficher tous les jours',
  macroDistTitle: 'Répartition des Macronutriments de la Semaine',
  macroDistSub: 'Total cumulé et part relative des protéines, glucides et lipides.',
  totalAbsorbed: (g) => `Total ${g}g absorbés`,
  approxPerDay: (g) => `(~${g}g/j)`,
  proteinDesc: 'Maintien et développement de la masse musculaire.',
  carbsDesc: 'Énergie disponible pour vos journées et activités.',
  fatDesc: 'Équilibre hormonal et assimilation des vitamines.',
  coachWeeklyTitle: 'Le Bilan du Coach IA pour votre semaine',
  coachWeeklyEmpty: 'Commencez à enregistrer vos repas pour que le coach puisse analyser la qualité de votre alimentation hebdomadaire !',
  coachWeeklyGood: (name, avg, target, fruits) => `Bravo ${name} ! Votre moyenne hebdomadaire (${avg} kcal) est parfaitement alignée avec votre budget cible de ${target} kcal. Vous avez également enregistré ${fruits} portions de fruits : maintenez ce cap pour maximiser votre satiété !`,
  coachWeeklyHigh: (name, avg, target) => `Bonne semaine ${name} ! Votre moyenne hebdomadaire est légèrement au-dessus (${avg} kcal vs ${target} kcal). Privilégiez des dîners riches en légumes vapeur et en protéines maigres pour rééquilibrer vos journées sans frustration.`,
  dailyDetailHeading: (c) => `Détail des Repas par Jour (${c} jours affichés)`,
  filterLabel: 'Filtrer :',
  filterAll: 'Tous',
  todayPill: "Aujourd'hui",
  fruitCountLabel: (n) => `${n} fruit${n > 1 ? 's' : ''}`,
  loggedItemsCount: (n) => `${n} élément${n > 1 ? 's' : ''} enregistré${n > 1 ? 's' : ''}`,
  noMealsFilter: 'Aucun repas enregistré pour ce jour avec le filtre sélectionné.',
  copyTitle: '📊 Récapitulatif Nutritionnel NutriCoach',
  copyDailyTarget: '🎯 Objectif quotidien :',
  copyRealAvg: '🔥 Moyenne réelle :',
  copyTotalConsumed: '⚖️ Total consommé :',
  copyDaysLoggedText: (n) => `${n}/7 jours renseignés`,
  copyFruitsLabel: '🍎 Portions de fruits :',
  copyDetailByDay: 'Détail par jour :',
  copyMealsCount: (n) => `${n} repas`,
  copyNoMeals: '(Aucun repas enregistré)',

  wellbeingBadge: 'Bien-Être & Mouvement',
  dailyTracking: 'Suivi Quotidien',
  hydrationTitle: 'Hydratation & Activités',
  waterShort: 'Eau',
  stepsShort: 'Pas',
  syncWatchShort: 'Synchro Montre',
  syncMyWatch: 'Synchroniser ma Montre',
  hydrationJournal: "Journal d'Hydratation",
  goalMl: (ml) => `Objectif ${ml} ml`,
  outOfGlasses: (n) => `sur ${n} verres d'eau bus`,
  litersTotal: (l) => `${l} Litres au total`,
  addGlass250: '+250 ml (Verre)',
  addBottle500: '+500 ml (Gourde)',
  activitiesStepsTitle: 'Activités Physiques & Pas',
  logSportBtn: 'Enregistrer Sport',
  todaysSteps: "Pas d'aujourd'hui",
  resetStepsTitle: 'Remettre le compteur du jour à 0 pour laisser la montre synchroniser',
  resetToZero: 'Remettre à 0',
  stepsMorningNote: '☀️ 0 pas au réveil • Votre montre indique vos pas au fil de la journée',
  stepGoalPrefix: (s) => `Objectif : ${s} pas`,
  editStepGoalTitle: 'Modifier votre objectif quotidien de pas',
  caloriesBurned: 'Calories Brûlées',
  activeBurn: 'Dépense active',
  watchPrefix: (b) => `Montre : ${b}`,
  watchGenericTitle: 'Montre connectée (Apple, Garmin, Galaxy...)',
  lastSyncPrefix: (v) => `Synchro : ${v}`,
  watchSyncSub: 'Synchronisez les pas et calories de votre poignet',
  syncActionBtn: 'Synchroniser',
  connectActionBtn: 'Connecter',
  quickAddSteps: 'Ajout rapide de pas :',
  clickDirectAdd: 'Cliquez pour ajouter directement',
  presetSmallWalk: 'Petite marche (+1 000 pas)',
  presetActiveWalk: 'Balade active (+2 500 pas)',
  presetLongWalk: 'Grande marche (+5 000 pas)',
  stepsUnit: 'pas',
  loggedActivitiesCount: (n) => `Activités enregistrées (${n})`,
  noActivitiesToday: "Aucune activité physique enregistrée aujourd'hui.",
  sportSession: 'Séance sportive',
  deleteActivityTitle: 'Supprimer cette activité',
  addActivityModalTitle: 'Ajouter une Activité Physique',
  addActivityModalSub: 'Enregistrez vos séances de sport ou marches pour ajouter des calories brûlées.',
  activityNameLabel: "Nom de l'activité *",
  activityNamePlaceholder: 'ex: Marche rapide, Séance Fitness, Natation',
  durationMinLabel: 'Durée (minutes)',
  caloriesBurnedLabel: 'Calories Brûlées (kcal)',
  stepsOptionalLabel: 'Nombre de pas (optionnel)',
  editStepModalTitle: "Modifier l'objectif de pas",
  editStepModalSub: "Définissez votre cible quotidienne de marche. L'OMS recommande 8 000 à 10 000 pas par jour pour une santé optimale.",
  dailyStepTargetLabel: 'Objectif quotidien (pas)',
  recommendedTargets: 'Objectifs recommandés :',
  validateGoalBtn: "Valider l'objectif",

  watchModalBadge: 'Capteurs & Podomètre',
  watchModalCompat: '100% Compatible',
  watchModalTitle: 'Synchronisation Montre Connectée',
  tabSync: 'Synchroniser',
  tabSelect: (n) => `Choisir ma montre (${n})`,
  tabBluetooth: 'Bluetooth Direct (BLE)',
  tabGuide: 'Guide Pas-à-Pas',
  watchConnectedSuccess: (b, m) => `Votre montre ${b} (${m}) est maintenant connectée avec succès !`,
  syncSuccessWithSteps: (s, k, w) => `Synchronisation réussie ! ${s} pas et ${k} kcal importés depuis votre ${w}.`,
  syncSuccessZero: (w) => `Compteur du jour remis à zéro (0 pas). Votre ${w} enregistrera vos mouvements tout au long de la journée.`,
  bleUnsupported: "L’API Web Bluetooth directe est disponible sous Google Chrome, Edge ou Brave (sur PC, Mac ou Android). Sur iPhone / Safari, la synchronisation des montres passe automatiquement par Apple Santé.",
  bleDetectedDefault: 'Montre connectée détectée',
  bleConnectedAppDefault: 'Appareil Connecté',
  bleConnectedMsg: (n) => `Appareil Bluetooth « ${n} » connecté avec succès !`,
  bleCancelled: 'Recherche annulée ou aucun appareil sélectionné.',
  bleError: 'Impossible de se connecter en Bluetooth direct.',
  watchDisconnected: 'Montre déconnectée.',
  noWatchConfigured: 'Aucune montre configurée',
  statusConnected: 'Connectée',
  statusNotLinked: 'Non liée',
  modelLabel: 'Modèle :',
  selectYourModel: 'Sélectionnez votre modèle',
  lastSyncLabel: 'Dernière synchro :',
  switchWatch: 'Changer de montre',
  unlinkWatch: 'Dissocier',
  transferTodayTitle: 'Transférer les pas et calories du jour',
  transferTodayDesc: 'Cliquez ci-dessous pour importer directement vos pas enregistrés depuis votre montre connectée ou passerelle Santé.',
  stepsReadTodayLabel: "Pas relevés sur la montre aujourd'hui :",
  morningZeroBtn: '0 (Matin / Réveil)',
  approxBurned: (k) => `≈ ${k} kcal brûlées`,
  zeroKcalStart: '0 kcal (Début de journée)',
  syncingBtn: 'Synchronisation en cours...',
  startSyncNowBtn: 'Lancer la Synchronisation Immédiate',
  watchPrincipleNote: '☀️ Principe de la montre : Vos pas démarrent à 0 au réveil et augmentent au fur et à mesure de vos pas réels.',
  supportedWatches: 'Montres et applications 100% compatibles :',
  selectBrandTitle: 'Sélectionnez votre marque et modèle de montre :',
  selectBrandSub: "Choisissez votre équipement pour bénéficier d'un suivi sur mesure et des conseils adaptés.",
  badgeCurrent: 'Actuelle',
  gatewayLabel: 'Passerelle :',
  exactModelLabel: 'Modèle précis :',
  pairThisWatch: 'Associer cette montre',
  bleDirectTitle: 'Connexion Directe sans Fil (Web Bluetooth BLE)',
  bleDirectSub: 'Pour montres de sport avec capteurs ouverts, cardiofréquencemètres et podomètres connectés.',
  bleDirectBody: "L'application utilise le standard sécurisé Web Bluetooth. Assurez-vous que le Bluetooth est activé et que votre montre est visible.",
  bleConnectedTo: 'Connecté à :',
  bleScanningBtn: 'Recherche en cours...',
  bleScanBtn: 'Rechercher les appareils Bluetooth',
  bleHelpLink: "Besoin d'aide pour appairer ?",
  bleAppleNoteTitle: '💡 Note pour les utilisateurs Apple Watch & iPhone :',
  bleAppleNoteBody: "Apple n'autorise pas la détection Bluetooth brute depuis Safari. La liaison se fait via Apple Santé (onglet Synchroniser).",
  guideTitle: 'Comment fonctionne la synchronisation avec NutriCoach ?',
  guideSub: 'Suivez ces 3 étapes simples pour relier votre montre :',
  guideStep1Title: 'Portez votre montre au quotidien',
  guideStep1Body: 'Votre montre mesure vos pas réels, votre fréquence cardiaque et vos calories brûlées.',
  guideStep2Title: "Transmission automatique à l'application Santé",
  guideStep2Body: "L'application compagnon de votre montre déverse vos métriques dans Apple Santé ou Health Connect / Google Fit.",
  guideStep3Title: 'Synchronisation immédiate dans NutriCoach',
  guideStep3Body: "Cliquez sur « Lancer la synchronisation » pour ajouter vos pas et calories à votre bilan journalier.",
  guideSpecificFor: (b) => `Guide spécifique pour ${b} :`,
  privateHealthFooter: 'Données de santé privées & sécurisées',
  todayAtTime: (t) => `Aujourd'hui à ${t}`,
  watchActivityTitle: (w) => `Marche & Activité Montre (${w})`,
  brandSpecific: {
    apple: { category: 'iOS / WatchOS', gateway: 'Apple Santé (HealthKit)', instructions: ['Vos pas et calories sont mesurés automatiquement par votre Apple Watch.', 'Ouvrez l’app « Santé » sur iPhone pour vérifier que le suivi d’activité est actif.', 'Cliquez sur « Lancer la synchronisation » pour importer vos pas du jour.'] },
    garmin: { category: 'Garmin Connect', gateway: 'Garmin Connect ➔ Apple Santé / Health Connect', instructions: ['Ouvrez Garmin Connect sur votre smartphone.', 'Allez dans Paramètres > Applications connectées > activez Apple Santé ou Health Connect.', 'Importez ensuite vos pas et calories dans NutriCoach.'] },
    samsung: { category: 'Wear OS / Tizen', gateway: 'Samsung Health & Health Connect', instructions: ['Ouvrez Samsung Health sur votre téléphone.', 'Activez la synchro avec « Health Connect ».', 'Vos pas remontent automatiquement dans votre tableau de bord.'] },
    fitbit: { category: 'Fitbit & Google Health', gateway: 'Application Fitbit & Google Fit', instructions: ['Synchronisez votre montre avec Fitbit ou Google Pixel Watch.', 'Autorisez l’accès aux données de pas et d’activités.', 'Lancez la synchro pour enregistrer pas et calories.'] },
    withings: { category: 'Withings Health Mate', gateway: 'Withings Health Mate', instructions: ['Ouvrez l’app Withings sur votre smartphone.', 'Activez le partage avec Apple Santé ou Google Fit.', 'NutriCoach importe vos données énergétiques du jour.'] },
    polar: { category: 'Sport & Performance', gateway: 'Polar Flow / Suunto App', instructions: ['Associez votre montre à Polar Flow ou Suunto.', 'Activez le lien avec Santé / Google Fit.', 'Vos séances et pas quotidiens sont synchronisés.'] },
    xiaomi: { category: 'Mi Fitness / Zepp', gateway: 'Mi Fitness / Zepp App', instructions: ['Dans Mi Fitness ou Zepp, liez vos données à Apple Santé ou Google Fit.', 'Activez le podomètre automatique.', 'Synchronisez en 1 clic pour actualiser votre suivi.'] },
  },

  errInvalidBarcode: 'Saisissez un code-barres valide (8 à 14 chiffres, ex: 3017620422003).',
  errNotFoundBarcode: (c) => `Produit non trouvé pour le code-barres ${c}. Essayez de photographier l'emballage.`,
  errNetworkBarcode: 'Erreur réseau lors de la recherche du produit. Réessayez dans un instant.',
  errUnreadableLabel: 'Code-barres ou étiquette nutritionnelle illisible. Rapprochez la caméra ou saisissez les chiffres.',
  errAnalyzeImage: "Impossible d'analyser l'image pour le moment.",
  errCameraNotReady: 'Caméra non prête. Réessayez ou importez une photo.',
  errProcessImage: 'Impossible de traiter cette image.',
  scannedProductDefault: 'Produit scanné',
  scannerTitle: 'Scanner de Code-Barres',
  scannerSubtitle: 'Visez le code-barres avec la caméra, prenez une photo ou saisissez le numéro EAN.',
  lookingUpProduct: 'Recherche du produit...',
  autoDetectActive: 'Détection automatique active',
  cameraStarting: 'Ouverture de la caméra...',
  cameraUnavailable: 'Caméra en direct indisponible ou non autorisée',
  cameraUnavailableHint: 'Utilisez le bouton photo ci-dessous ou saisissez les chiffres du code-barres.',
  captureReadAi: 'Capturer & Lire IA',
  takePhoto: 'Prendre photo',
  photoGallery: 'Photo / Galerie',
  orEnterEan: 'Ou saisir le numéro du code-barres (EAN) :',
  okBtn: 'OK',
  recognizedByAi: 'Reconnu par IA',
  forPortionG: (g) => `pour ${g}g`,
  consumedQtyG: 'Quantité consommée (g) :',
  scanAnotherTitle: 'Scanner un autre produit',
  addToJournalKcal: (k) => `Ajouter au journal (${k} kcal)`,
};

export const TRK_EN: UiTrackingDict = {
  mealBreakfast: 'Breakfast',
  mealBreakfastShort: 'Breakfast',
  mealLunch: 'Lunch',
  mealSnack: 'Snack',
  mealDinner: 'Dinner',
  proteins: 'Proteins',
  carbs: 'Carbs',
  fats: 'Fats',
  macroP: 'P',
  macroC: 'C',
  macroF: 'F',
  saveIn: 'Save to:',
  cancel: 'Cancel',
  save: 'Save',
  close: 'Close',
  remove: 'Remove',
  add: 'Add',
  kcal: 'kcal',

  journalTitle: 'My Food Log',
  historyWeekTitle: 'History & Weekly Recap',
  periodToday: 'Today',
  periodTomorrow: 'Tomorrow',
  periodWeek: 'Week',
  weeklyRecapTab: '📊 Weekly Summary',
  sevenDaysShort: '7d',
  nutritionGoalTitle: 'Your nutrition goal',
  proteinsTarget90: 'Proteins: 90 g',
  fiberTarget25: 'Fiber: 25 g',
  saladAlt: 'Balanced salad',
  placeholderBreakfast: 'Oats, berries, plain yogurt...',
  placeholderLunch: 'Mixed salad, grains, vegetables, fish or lean meat...',
  placeholderSnack: 'Fresh fruit, almonds, Greek yogurt or applesauce...',
  placeholderDinner: 'Chicken breast, steamed veggies, light soup...',
  markCompletedTitle: 'Marked as completed',
  checkMealTitle: 'Check off this meal',
  deleteFoodTitle: 'Delete this food item',
  addFoodCta: 'Add a food item',
  barcodeBtn: 'Barcode',
  aiScannerBtn: 'AI Photo Scan',
  clearTodayTitle: 'Clear today',
  clearShort: 'Clear',
  loggedItemsSummary: (c, k) => `Details of ${c} logged items (${k} kcal)`,
  modalSubtitle: 'Simply type what you eat (e.g. omelette and chocolate mousse). Calories and portions are calculated automatically!',
  saveInWhichMeal: 'Which meal should we log it under?',
  quickExamples: [
    '☕ Black coffee',
    '☕ Latte & 1 rusk toast',
    '🥚 Omelette & chocolate mousse',
    '🍎 Plain omelette, salad & 1 apple',
    '🍓 Greek yogurt & berries',
    '🥩 Lean steak, green beans & 1 pear',
  ],
  calculateBtn: 'Calculate',
  satietyVitamins: 'Satiety & Vitamins',
  addFruitTitle: (n) => `Add ${n} to this meal`,
  fruits: [
    { emoji: '🍎', name: '1 Apple', kcal: 52, grams: 150 },
    { emoji: '🍊', name: '1 Clementine', kcal: 38, grams: 80 },
    { emoji: '🍓', name: 'Mixed berries', kcal: 38, grams: 100 },
    { emoji: '🥝', name: '1 Kiwi', kcal: 42, grams: 75 },
    { emoji: '🍌', name: '1/2 Banana', kcal: 45, grams: 60 },
    { emoji: '🍐', name: '1 Pear', kcal: 57, grams: 120 },
  ],
  macronutrientsG: 'Macronutrients (g)',
  kcalPlaceholderEx: 'e.g. 425',
  portionPlaceholderEx: 'e.g. 240',

  recapBadge: '📊 Weekly Overview',
  recapWeekFromTo: (a, b) => `Week of ${a} – ${b}`,
  recapTitle: 'Weekly Meal Summary',
  recapSubtitle: 'Overview of your daily calorie intake, macronutrients and fruit servings over 7 days.',
  prevWeek: 'Previous week',
  nextWeek: 'Next week',
  thisWeek: 'This week',
  lastWeek: 'Last week',
  weekOffsetLabel: (n) => `Week ${n}`,
  copied: 'Copied!',
  copySummary: 'Copy summary',
  backToToday: '← Back to Today',
  avgPerDay: 'Daily Average',
  targetPrefix: 'Target:',
  weekTotal: 'Weekly Total',
  daysLogged: (n) => `${n} / 7 days logged`,
  fruitsVitality: 'Fruits & Vitality',
  portionsUnit: 'servings',
  fruitPerDayAvg: (a) => `~${a} serving / day (Goal: 2-3)`,
  targetRegularity: 'Target Consistency',
  daysUnit: 'days',
  excellentBudget: '🎯 Great calorie consistency',
  balancedPace: '⚖️ Balanced pace',
  dailyCalEvolution: 'Daily Calorie Trend',
  clickBarHint: 'Click any bar to isolate meals from that specific day.',
  inTarget: 'On target',
  aboveTarget: 'Above target',
  targetLine: (k) => `Target Line (${k} kcal)`,
  selectedDayLabel: 'Selected day:',
  showAllDays: 'Show all days',
  macroDistTitle: 'Weekly Macronutrient Breakdown',
  macroDistSub: 'Cumulative total and share of protein, carbs, and fats.',
  totalAbsorbed: (g) => `Total ${g}g consumed`,
  approxPerDay: (g) => `(~${g}g/d)`,
  proteinDesc: 'Maintains and supports lean muscle mass.',
  carbsDesc: 'Provides energy for your daily activities.',
  fatDesc: 'Supports hormones and vitamin absorption.',
  coachWeeklyTitle: 'AI Coach Weekly Assessment',
  coachWeeklyEmpty: 'Start logging meals so the coach can analyze your weekly nutrition balance!',
  coachWeeklyGood: (name, avg, target, fruits) => `Well done ${name}! Your weekly average (${avg} kcal) aligns nicely with your ${target} kcal target. You also logged ${fruits} fruit servings — keep it up for lasting satiety!`,
  coachWeeklyHigh: (name, avg, target) => `Good week ${name}! Your weekly average is slightly above target (${avg} kcal vs ${target} kcal). Favor steamed veggies and lean proteins at dinner to rebalance smoothly.`,
  dailyDetailHeading: (c) => `Daily Meal Breakdown (${c} days shown)`,
  filterLabel: 'Filter:',
  filterAll: 'All',
  todayPill: 'Today',
  fruitCountLabel: (n) => `${n} fruit${n > 1 ? 's' : ''}`,
  loggedItemsCount: (n) => `${n} item${n > 1 ? 's' : ''} logged`,
  noMealsFilter: 'No meals logged on this day for the selected filter.',
  copyTitle: '📊 NutriCoach Weekly Nutrition Summary',
  copyDailyTarget: '🎯 Daily goal:',
  copyRealAvg: '🔥 Actual average:',
  copyTotalConsumed: '⚖️ Total consumed:',
  copyDaysLoggedText: (n) => `${n}/7 days logged`,
  copyFruitsLabel: '🍎 Fruit servings:',
  copyDetailByDay: 'Daily breakdown:',
  copyMealsCount: (n) => `${n} meals`,
  copyNoMeals: '(No meals logged)',

  wellbeingBadge: 'Wellness & Movement',
  dailyTracking: 'Daily Tracking',
  hydrationTitle: 'Hydration & Activity',
  waterShort: 'Water',
  stepsShort: 'Steps',
  syncWatchShort: 'Sync Watch',
  syncMyWatch: 'Sync my Watch',
  hydrationJournal: 'Hydration Log',
  goalMl: (ml) => `Goal ${ml} ml`,
  outOfGlasses: (n) => `of ${n} glasses drunk`,
  litersTotal: (l) => `${l} Liters total`,
  addGlass250: '+250 ml (Glass)',
  addBottle500: '+500 ml (Bottle)',
  activitiesStepsTitle: 'Physical Activity & Steps',
  logSportBtn: 'Log Workout',
  todaysSteps: "Today's Steps",
  resetStepsTitle: 'Reset daily step counter to 0 for smartwatch sync',
  resetToZero: 'Reset to 0',
  stepsMorningNote: '☀️ 0 steps on wake-up • Your watch updates your steps throughout the day',
  stepGoalPrefix: (s) => `Goal: ${s} steps`,
  editStepGoalTitle: 'Edit daily step target',
  caloriesBurned: 'Calories Burned',
  activeBurn: 'Active burn',
  watchPrefix: (b) => `Watch: ${b}`,
  watchGenericTitle: 'Smartwatch (Apple, Garmin, Galaxy...)',
  lastSyncPrefix: (v) => `Sync: ${v}`,
  watchSyncSub: 'Sync steps and calories from your wrist',
  syncActionBtn: 'Sync',
  connectActionBtn: 'Connect',
  quickAddSteps: 'Quick add steps:',
  clickDirectAdd: 'Click to add directly',
  presetSmallWalk: 'Short walk (+1,000 steps)',
  presetActiveWalk: 'Brisk walk (+2,500 steps)',
  presetLongWalk: 'Long walk (+5,000 steps)',
  stepsUnit: 'steps',
  loggedActivitiesCount: (n) => `Logged activities (${n})`,
  noActivitiesToday: 'No physical activity logged today.',
  sportSession: 'Workout session',
  deleteActivityTitle: 'Delete this activity',
  addActivityModalTitle: 'Log Physical Activity',
  addActivityModalSub: 'Log workouts or walks to credit burned calories.',
  activityNameLabel: 'Activity name *',
  activityNamePlaceholder: 'e.g. Brisk walk, Gym session, Swimming',
  durationMinLabel: 'Duration (minutes)',
  caloriesBurnedLabel: 'Calories Burned (kcal)',
  stepsOptionalLabel: 'Step count (optional)',
  editStepModalTitle: 'Edit Daily Step Target',
  editStepModalSub: 'Set your daily walking goal. WHO recommends 8,000 to 10,000 steps per day for optimal health.',
  dailyStepTargetLabel: 'Daily goal (steps)',
  recommendedTargets: 'Recommended targets:',
  validateGoalBtn: 'Save goal',

  watchModalBadge: 'Sensors & Pedometer',
  watchModalCompat: '100% Compatible',
  watchModalTitle: 'Smartwatch Synchronization',
  tabSync: 'Sync Now',
  tabSelect: (n) => `Choose Watch (${n})`,
  tabBluetooth: 'Direct Bluetooth (BLE)',
  tabGuide: 'Step-by-Step Guide',
  watchConnectedSuccess: (b, m) => `Your ${b} (${m}) watch is now connected!`,
  syncSuccessWithSteps: (s, k, w) => `Sync complete! ${s} steps and ${k} kcal imported from your ${w}.`,
  syncSuccessZero: (w) => `Counter reset to 0 steps. Your ${w} will track movement throughout the day.`,
  bleUnsupported: 'Direct Web Bluetooth is supported in Chrome, Edge or Brave (Desktop & Android). On iPhone / Safari, watches sync seamlessly via Apple Health.',
  bleDetectedDefault: 'Smartwatch detected',
  bleConnectedAppDefault: 'Connected Device',
  bleConnectedMsg: (n) => `Bluetooth device "${n}" connected!`,
  bleCancelled: 'Scan cancelled or no device selected.',
  bleError: 'Unable to connect via direct Bluetooth.',
  watchDisconnected: 'Watch disconnected.',
  noWatchConfigured: 'No watch configured',
  statusConnected: 'Connected',
  statusNotLinked: 'Not linked',
  modelLabel: 'Model:',
  selectYourModel: 'Select your model',
  lastSyncLabel: 'Last sync:',
  switchWatch: 'Switch watch',
  unlinkWatch: 'Disconnect',
  transferTodayTitle: "Import today's steps & calories",
  transferTodayDesc: 'Click below to import recorded steps directly from your smartwatch or Health gateway.',
  stepsReadTodayLabel: 'Steps recorded on watch today:',
  morningZeroBtn: '0 (Morning)',
  approxBurned: (k) => `≈ ${k} kcal burned`,
  zeroKcalStart: '0 kcal (Start of day)',
  syncingBtn: 'Syncing...',
  startSyncNowBtn: 'Sync Immediately',
  watchPrincipleNote: '☀️ How it works: Steps start at 0 in the morning and rise naturally as you move throughout the day.',
  supportedWatches: '100% compatible watches & health apps:',
  selectBrandTitle: 'Select your watch brand and model:',
  selectBrandSub: 'Pick your wearable for tailored tracking and tips.',
  badgeCurrent: 'Current',
  gatewayLabel: 'Gateway:',
  exactModelLabel: 'Exact model:',
  pairThisWatch: 'Link this watch',
  bleDirectTitle: 'Direct Wireless Link (Web Bluetooth BLE)',
  bleDirectSub: 'For sports watches with open sensors, heart-rate monitors & pedometers.',
  bleDirectBody: 'Uses secure Web Bluetooth standards. Ensure Bluetooth is enabled and your watch is discoverable.',
  bleConnectedTo: 'Connected to:',
  bleScanningBtn: 'Scanning...',
  bleScanBtn: 'Scan Bluetooth Devices',
  bleHelpLink: 'Need pairing help?',
  bleAppleNoteTitle: '💡 Note for Apple Watch & iPhone users:',
  bleAppleNoteBody: 'Safari blocks raw Bluetooth scanning. Apple Watch syncs securely via Apple Health (Sync tab).',
  guideTitle: 'How does smartwatch syncing work with NutriCoach?',
  guideSub: 'Follow these 3 simple steps:',
  guideStep1Title: 'Wear your watch daily',
  guideStep1Body: 'Your wearable tracks real steps, heart rate, and active calories.',
  guideStep2Title: 'Auto-sync with your Health app',
  guideStep2Body: 'Your companion app sends metrics to Apple Health or Google Health Connect / Google Fit.',
  guideStep3Title: 'Instant import in NutriCoach',
  guideStep3Body: 'Tap "Sync Immediately" to add your daily steps and calories to your dashboard.',
  guideSpecificFor: (b) => `Setup guide for ${b}:`,
  privateHealthFooter: 'Private & secure health data',
  todayAtTime: (t) => `Today at ${t}`,
  watchActivityTitle: (w) => `Watch Steps & Activity (${w})`,
  brandSpecific: {
    apple: { category: 'iOS / WatchOS', gateway: 'Apple Health (HealthKit)', instructions: ['Steps and calories are tracked automatically by Apple Watch.', 'Open the Health app on iPhone to verify activity tracking is active.', 'Click "Sync Immediately" below to import today’s steps.'] },
    garmin: { category: 'Garmin Connect', gateway: 'Garmin Connect ➔ Apple Health / Health Connect', instructions: ['Open Garmin Connect on your phone.', 'Go to Settings > Connected Apps and enable Apple Health or Health Connect.', 'Import your steps into NutriCoach in one tap.'] },
    samsung: { category: 'Wear OS / Tizen', gateway: 'Samsung Health & Health Connect', instructions: ['Open Samsung Health on your Android phone.', 'Enable sync with Google Health Connect.', 'Steps recorded on your wrist flow straight into NutriCoach.'] },
    fitbit: { category: 'Fitbit & Google Health', gateway: 'Fitbit App & Google Fit', instructions: ['Sync your wearable in the Fitbit or Pixel Watch app.', 'Ensure step & activity permissions are granted.', 'Tap Sync Now to record calories and steps.'] },
    withings: { category: 'Withings Health Mate', gateway: 'Withings App', instructions: ['Open the Withings app on your phone.', 'Enable sharing with Apple Health or Google Fit.', 'NutriCoach pulls your daily energy metrics.'] },
    polar: { category: 'Sports & Performance', gateway: 'Polar Flow / Suunto App', instructions: ['Pair your watch with Polar Flow or Suunto.', 'Link Health / Google Fit in account settings.', 'Workouts and daily steps sync automatically.'] },
    xiaomi: { category: 'Mi Fitness / Zepp', gateway: 'Mi Fitness / Zepp App', instructions: ['Link Mi Fitness or Zepp to Apple Health or Google Fit.', 'Enable automatic pedometer.', 'Sync in one tap to update your dashboard.'] },
  },

  errInvalidBarcode: 'Enter a valid barcode (8 to 14 digits, e.g. 3017620422003).',
  errNotFoundBarcode: (c) => `Product not found for barcode ${c}. Try taking a photo of the package.`,
  errNetworkBarcode: 'Network error while looking up product. Please try again.',
  errUnreadableLabel: 'Unreadable barcode or nutrition label. Move closer or type the digits.',
  errAnalyzeImage: 'Unable to analyze this image right now.',
  errCameraNotReady: 'Camera not ready. Try again or upload a photo.',
  errProcessImage: 'Unable to process this image.',
  scannedProductDefault: 'Scanned product',
  scannerTitle: 'Barcode Scanner',
  scannerSubtitle: 'Point the camera at the barcode, take a photo, or enter the EAN digits.',
  lookingUpProduct: 'Looking up product...',
  autoDetectActive: 'Auto-detection active',
  cameraStarting: 'Starting camera...',
  cameraUnavailable: 'Live camera unavailable or denied',
  cameraUnavailableHint: 'Use the photo button below or enter the barcode digits manually.',
  captureReadAi: 'Capture & AI Read',
  takePhoto: 'Take Photo',
  photoGallery: 'Photo / Gallery',
  orEnterEan: 'Or enter barcode digits (EAN):',
  okBtn: 'OK',
  recognizedByAi: 'AI Recognized',
  forPortionG: (g) => `for ${g}g`,
  consumedQtyG: 'Amount consumed (g):',
  scanAnotherTitle: 'Scan another product',
  addToJournalKcal: (k) => `Add to food log (${k} kcal)`,
};

export const TRK_ES: UiTrackingDict = {
  mealBreakfast: 'Desayuno',
  mealBreakfastShort: 'Desayuno',
  mealLunch: 'Almuerzo',
  mealSnack: 'Merienda',
  mealDinner: 'Cena',
  proteins: 'Proteínas',
  carbs: 'Carbohidratos',
  fats: 'Grasas',
  macroP: 'P',
  macroC: 'C',
  macroF: 'G',
  saveIn: 'Guardar en:',
  cancel: 'Cancelar',
  save: 'Guardar',
  close: 'Cerrar',
  remove: 'Eliminar',
  add: 'Añadir',
  kcal: 'kcal',

  journalTitle: 'Mi Alimentación',
  historyWeekTitle: 'Historial y Resumen Semanal',
  periodToday: 'Hoy',
  periodTomorrow: 'Mañana',
  periodWeek: 'Semana',
  weeklyRecapTab: '📊 Resumen Semanal',
  sevenDaysShort: '7d',
  nutritionGoalTitle: 'Tu objetivo nutricional',
  proteinsTarget90: 'Proteínas: 90 g',
  fiberTarget25: 'Fibra: 25 g',
  saladAlt: 'Ensalada equilibrada',
  placeholderBreakfast: 'Copos de avena, frutos rojos, yogur natural...',
  placeholderLunch: 'Ensalada variada, cereales, verduras, pescado o carne...',
  placeholderSnack: 'Fruta fresca, almendras, yogur griego o compota...',
  placeholderDinner: 'Pechuga de pollo, verduras al vapor, sopa ligera...',
  markCompletedTitle: 'Marcado como completado',
  checkMealTitle: 'Marcar esta comida',
  deleteFoodTitle: 'Eliminar este alimento',
  addFoodCta: 'Añadir un alimento',
  barcodeBtn: 'Código de barras',
  aiScannerBtn: 'Escáner Foto IA',
  clearTodayTitle: 'Vaciar hoy',
  clearShort: 'Vaciar',
  loggedItemsSummary: (c, k) => `Detalle de los ${c} alimentos registrados (${k} kcal)`,
  modalSubtitle: 'Escribe lo que comes (ej: tortilla y mousse de chocolate). ¡Las calorías y cantidades se calculan al instante!',
  saveInWhichMeal: '¿En qué comida guardarlo?',
  quickExamples: [
    '☕ Un café solo',
    '☕ Café con leche y 1 tostada',
    '🥚 Tortilla y mousse de chocolate',
    '🍎 Tortilla, ensalada y 1 manzana',
    '🍓 Yogur griego y frutos rojos',
    '🥩 Filete magro, judías verdes y 1 pera',
  ],
  calculateBtn: 'Calcular',
  satietyVitamins: 'Saciedad y Vitaminas',
  addFruitTitle: (n) => `Añadir ${n} a esta comida`,
  fruits: [
    { emoji: '🍎', name: '1 Manzana', kcal: 52, grams: 150 },
    { emoji: '🍊', name: '1 Mandarina', kcal: 38, grams: 80 },
    { emoji: '🍓', name: 'Frutos rojos', kcal: 38, grams: 100 },
    { emoji: '🥝', name: '1 Kiwi', kcal: 42, grams: 75 },
    { emoji: '🍌', name: '1/2 Plátano', kcal: 45, grams: 60 },
    { emoji: '🍐', name: '1 Pera', kcal: 57, grams: 120 },
  ],
  macronutrientsG: 'Macronutrientes (g)',
  kcalPlaceholderEx: 'ej: 425',
  portionPlaceholderEx: 'ej: 240',

  recapBadge: '📊 Síntesis Semanal',
  recapWeekFromTo: (a, b) => `Semana del ${a} al ${b}`,
  recapTitle: 'Resumen Semanal de Comidas',
  recapSubtitle: 'Vista general de tus calorías, macronutrientes y porciones de fruta en 7 días.',
  prevWeek: 'Semana anterior',
  nextWeek: 'Semana siguiente',
  thisWeek: 'Esta semana',
  lastWeek: 'Semana pasada',
  weekOffsetLabel: (n) => `Semana ${n}`,
  copied: '¡Copiado!',
  copySummary: 'Copiar resumen',
  backToToday: '← Volver a Hoy',
  avgPerDay: 'Media / Día',
  targetPrefix: 'Meta:',
  weekTotal: 'Total Semana',
  daysLogged: (n) => `${n} / 7 días registrados`,
  fruitsVitality: 'Frutas y Vitalidad',
  portionsUnit: 'porciones',
  fruitPerDayAvg: (a) => `~${a} porción / día (Meta: 2-3)`,
  targetRegularity: 'Regularidad',
  daysUnit: 'días',
  excellentBudget: '🎯 Excelente cumplimiento',
  balancedPace: '⚖️ Ritmo equilibrado',
  dailyCalEvolution: 'Evolución Diaria de Calorías',
  clickBarHint: 'Haz clic en una barra para ver los detalles de ese día.',
  inTarget: 'En objetivo',
  aboveTarget: 'Por encima',
  targetLine: (k) => `Línea Meta (${k} kcal)`,
  selectedDayLabel: 'Día seleccionado:',
  showAllDays: 'Ver todos los días',
  macroDistTitle: 'Distribución Semanal de Macronutrientes',
  macroDistSub: 'Total acumulado y proporción de proteínas, carbohidratos y grasas.',
  totalAbsorbed: (g) => `Total ${g}g consumidos`,
  approxPerDay: (g) => `(~${g}g/d)`,
  proteinDesc: 'Mantiene y fortalece la masa muscular.',
  carbsDesc: 'Energía disponible para tus actividades.',
  fatDesc: 'Equilibrio hormonal y absorción vitamínica.',
  coachWeeklyTitle: 'Balance del Coach IA esta semana',
  coachWeeklyEmpty: '¡Empieza a registrar comidas para que el coach analice tu semana!',
  coachWeeklyGood: (name, avg, target, fruits) => `¡Bravo ${name}! Tu media semanal (${avg} kcal) encaja con tu meta de ${target} kcal. Además registraste ${fruits} porciones de fruta: ¡sigue así!`,
  coachWeeklyHigh: (name, avg, target) => `¡Buena semana ${name}! Tu media está algo por encima (${avg} kcal vs ${target} kcal). Prioriza cenas con verduras al vapor y proteínas magras.`,
  dailyDetailHeading: (c) => `Detalle por Día (${c} días mostrados)`,
  filterLabel: 'Filtrar:',
  filterAll: 'Todos',
  todayPill: 'Hoy',
  fruitCountLabel: (n) => `${n} fruta${n > 1 ? 's' : ''}`,
  loggedItemsCount: (n) => `${n} alimento${n > 1 ? 's' : ''} registrado${n > 1 ? 's' : ''}`,
  noMealsFilter: 'No hay comidas registradas para este filtro.',
  copyTitle: '📊 Resumen Nutricional NutriCoach',
  copyDailyTarget: '🎯 Meta diaria:',
  copyRealAvg: '🔥 Media real:',
  copyTotalConsumed: '⚖️ Total consumido:',
  copyDaysLoggedText: (n) => `${n}/7 días registrados`,
  copyFruitsLabel: '🍎 Porciones de fruta:',
  copyDetailByDay: 'Detalle por día:',
  copyMealsCount: (n) => `${n} comidas`,
  copyNoMeals: '(Sin comidas registradas)',

  wellbeingBadge: 'Bienestar y Movimiento',
  dailyTracking: 'Seguimiento Diario',
  hydrationTitle: 'Hidratación y Actividad',
  waterShort: 'Agua',
  stepsShort: 'Pasos',
  syncWatchShort: 'Sinc. Reloj',
  syncMyWatch: 'Sincronizar Reloj',
  hydrationJournal: 'Registro de Hidratación',
  goalMl: (ml) => `Meta ${ml} ml`,
  outOfGlasses: (n) => `de ${n} vasos de agua`,
  litersTotal: (l) => `${l} Litros en total`,
  addGlass250: '+250 ml (Vaso)',
  addBottle500: '+500 ml (Botella)',
  activitiesStepsTitle: 'Actividad Física y Pasos',
  logSportBtn: 'Registrar Deporte',
  todaysSteps: 'Pasos de hoy',
  resetStepsTitle: 'Poner a 0 para sincronizar con el reloj',
  resetToZero: 'Poner a 0',
  stepsMorningNote: '☀️ 0 pasos al despertar • Tu reloj suma tus pasos durante el día',
  stepGoalPrefix: (s) => `Objetivo: ${s} pasos`,
  editStepGoalTitle: 'Editar objetivo diario de pasos',
  caloriesBurned: 'Calorías Quemadas',
  activeBurn: 'Gasto activo',
  watchPrefix: (b) => `Reloj: ${b}`,
  watchGenericTitle: 'Reloj inteligente (Apple, Garmin, Galaxy...)',
  lastSyncPrefix: (v) => `Sinc: ${v}`,
  watchSyncSub: 'Sincroniza pasos y calorías desde tu muñeca',
  syncActionBtn: 'Sincronizar',
  connectActionBtn: 'Conectar',
  quickAddSteps: 'Añadir pasos rápido:',
  clickDirectAdd: 'Toca para añadir directamente',
  presetSmallWalk: 'Paseo corto (+1.000 pasos)',
  presetActiveWalk: 'Caminata activa (+2.500 pasos)',
  presetLongWalk: 'Caminata larga (+5.000 pasos)',
  stepsUnit: 'pasos',
  loggedActivitiesCount: (n) => `Actividades registradas (${n})`,
  noActivitiesToday: 'Ninguna actividad física registrada hoy.',
  sportSession: 'Sesión deportiva',
  deleteActivityTitle: 'Eliminar actividad',
  addActivityModalTitle: 'Añadir Actividad Física',
  addActivityModalSub: 'Registra entrenamientos o caminatas para sumar calorías quemadas.',
  activityNameLabel: 'Nombre de la actividad *',
  activityNamePlaceholder: 'ej: Caminata rápida, Fitness, Natación',
  durationMinLabel: 'Duración (minutos)',
  caloriesBurnedLabel: 'Calorías quemadas (kcal)',
  stepsOptionalLabel: 'Número de pasos (opcional)',
  editStepModalTitle: 'Editar objetivo de pasos',
  editStepModalSub: 'Define tu meta diaria de caminata. La OMS recomienda entre 8.000 y 10.000 pasos al día.',
  dailyStepTargetLabel: 'Meta diaria (pasos)',
  recommendedTargets: 'Objetivos recomendados:',
  validateGoalBtn: 'Guardar objetivo',

  watchModalBadge: 'Sensores y Podómetro',
  watchModalCompat: '100% Compatible',
  watchModalTitle: 'Sincronización Reloj Inteligente',
  tabSync: 'Sincronizar',
  tabSelect: (n) => `Elegir reloj (${n})`,
  tabBluetooth: 'Bluetooth Directo (BLE)',
  tabGuide: 'Guía Paso a Paso',
  watchConnectedSuccess: (b, m) => `¡Tu reloj ${b} (${m}) está conectado con éxito!`,
  syncSuccessWithSteps: (s, k, w) => `¡Sincronización completa! ${s} pasos y ${k} kcal importados desde ${w}.`,
  syncSuccessZero: (w) => `Contador reiniciado a 0 pasos. Tu ${w} registrará tu actividad diaria.`,
  bleUnsupported: 'Web Bluetooth funciona en Chrome, Edge o Brave (PC/Android). En iPhone/Safari los relojes sincronizan con Apple Salud.',
  bleDetectedDefault: 'Reloj detectado',
  bleConnectedAppDefault: 'Dispositivo conectado',
  bleConnectedMsg: (n) => `¡Dispositivo Bluetooth «${n}» conectado!`,
  bleCancelled: 'Búsqueda cancelada o ningún dispositivo elegido.',
  bleError: 'No se pudo conectar por Bluetooth directo.',
  watchDisconnected: 'Reloj desconectado.',
  noWatchConfigured: 'Sin reloj configurado',
  statusConnected: 'Conectado',
  statusNotLinked: 'Sin vincular',
  modelLabel: 'Modelo:',
  selectYourModel: 'Elige tu modelo',
  lastSyncLabel: 'Última sinc:',
  switchWatch: 'Cambiar reloj',
  unlinkWatch: 'Desvincular',
  transferTodayTitle: 'Transferir pasos y calorías de hoy',
  transferTodayDesc: 'Pulsa abajo para importar pasos desde tu reloj o pasarela de salud.',
  stepsReadTodayLabel: 'Pasos leídos del reloj hoy:',
  morningZeroBtn: '0 (Mañana)',
  approxBurned: (k) => `≈ ${k} kcal quemadas`,
  zeroKcalStart: '0 kcal (Inicio del día)',
  syncingBtn: 'Sincronizando...',
  startSyncNowBtn: 'Iniciar Sincronización Ahora',
  watchPrincipleNote: '☀️ Principio del reloj: tus pasos empiezan en 0 al despertar y suben al caminar.',
  supportedWatches: 'Relojes y apps 100% compatibles:',
  selectBrandTitle: 'Elige tu marca y modelo:',
  selectBrandSub: 'Selecciona tu dispositivo para un seguimiento a medida.',
  badgeCurrent: 'Actual',
  gatewayLabel: 'Pasarela:',
  exactModelLabel: 'Modelo exacto:',
  pairThisWatch: 'Vincular este reloj',
  bleDirectTitle: 'Conexión Directa Inalámbrica (Web Bluetooth BLE)',
  bleDirectSub: 'Para relojes deportivos con sensores abiertos y pulsómetros.',
  bleDirectBody: 'Usa el estándar seguro Web Bluetooth. Asegúrate de tener el Bluetooth activo.',
  bleConnectedTo: 'Conectado a:',
  bleScanningBtn: 'Buscando...',
  bleScanBtn: 'Buscar dispositivos Bluetooth',
  bleHelpLink: '¿Necesitas ayuda?',
  bleAppleNoteTitle: '💡 Nota para Apple Watch y iPhone:',
  bleAppleNoteBody: 'Safari no permite escaneo BLE directo; usa Apple Salud desde la pestaña Sincronizar.',
  guideTitle: '¿Cómo funciona la sincronización con NutriCoach?',
  guideSub: 'Sigue estos 3 pasos:',
  guideStep1Title: 'Lleva tu reloj a diario',
  guideStep1Body: 'Mide tus pasos reales, pulso y calorías.',
  guideStep2Title: 'Envío automático a tu app de Salud',
  guideStep2Body: 'Tu app vinculada sincroniza con Apple Salud o Google Health Connect.',
  guideStep3Title: 'Sincronización inmediata en NutriCoach',
  guideStep3Body: 'Pulsa «Iniciar Sincronización» para actualizar tu balance diario.',
  guideSpecificFor: (b) => `Guía para ${b}:`,
  privateHealthFooter: 'Datos de salud privados y seguros',
  todayAtTime: (t) => `Hoy a las ${t}`,
  watchActivityTitle: (w) => `Pasos y Actividad Watch (${w})`,
  brandSpecific: {
    apple: { category: 'iOS / WatchOS', gateway: 'Apple Salud (HealthKit)', instructions: ['Tu Apple Watch mide pasos y calorías automáticamente.', 'Verifica en la app Salud que el seguimiento esté activo.', 'Pulsa sincronizar abajo para importar tus pasos.'] },
    garmin: { category: 'Garmin Connect', gateway: 'Garmin Connect ➔ Apple Salud / Health Connect', instructions: ['Abre Garmin Connect.', 'Activa Apple Salud o Health Connect en ajustes.', 'Importa tus pasos en NutriCoach.'] },
    samsung: { category: 'Wear OS / Tizen', gateway: 'Samsung Health & Health Connect', instructions: ['Abre Samsung Health.', 'Vincula Health Connect.', 'Tus pasos llegan automáticamente a NutriCoach.'] },
    fitbit: { category: 'Fitbit y Google Health', gateway: 'Fitbit App & Google Fit', instructions: ['Sincroniza tu reloj con Fitbit o Pixel Watch.', 'Activa los permisos de pasos.', 'Pulsa Sincronizar ahora.'] },
    withings: { category: 'Withings Health Mate', gateway: 'Withings App', instructions: ['Abre Withings en tu móvil.', 'Activa Apple Salud o Google Fit.', 'Importa tus datos al instante.'] },
    polar: { category: 'Deporte y Rendimiento', gateway: 'Polar Flow / Suunto App', instructions: ['Empareja tu reloj con Polar Flow o Suunto.', 'Activa la conexión con Salud / Google Fit.', 'Tus entrenos y pasos se sincronizan.'] },
    xiaomi: { category: 'Mi Fitness / Zepp', gateway: 'Mi Fitness / Zepp App', instructions: ['Conecta Mi Fitness o Zepp con Salud / Google Fit.', 'Activa el podómetro automático.', 'Sincroniza en 1 clic.'] },
  },

  errInvalidBarcode: 'Introduce un código de barras válido (8 a 14 dígitos, ej: 3017620422003).',
  errNotFoundBarcode: (c) => `Producto no encontrado para ${c}. Intenta fotografiar el envase.`,
  errNetworkBarcode: 'Error de red al buscar el producto. Inténtalo de nuevo.',
  errUnreadableLabel: 'Código o etiqueta ilegible. Acerca la cámara o escribe los números.',
  errAnalyzeImage: 'No se pudo analizar la imagen en este momento.',
  errCameraNotReady: 'Cámara no lista. Reintenta o sube una foto.',
  errProcessImage: 'No se pudo procesar esta imagen.',
  scannedProductDefault: 'Producto escaneado',
  scannerTitle: 'Escáner de Código de Barras',
  scannerSubtitle: 'Apunta al código de barras, haz una foto o escribe el número EAN.',
  lookingUpProduct: 'Buscando producto...',
  autoDetectActive: 'Detección automática activa',
  cameraStarting: 'Abriendo cámara...',
  cameraUnavailable: 'Cámara en vivo no disponible o sin permiso',
  cameraUnavailableHint: 'Usa el botón de foto abajo o escribe los dígitos.',
  captureReadAi: 'Capturar y Leer IA',
  takePhoto: 'Hacer foto',
  photoGallery: 'Foto / Galería',
  orEnterEan: 'O escribe el número EAN:',
  okBtn: 'OK',
  recognizedByAi: 'Reconocido por IA',
  forPortionG: (g) => `para ${g}g`,
  consumedQtyG: 'Cantidad consumida (g):',
  scanAnotherTitle: 'Escanear otro producto',
  addToJournalKcal: (k) => `Añadir al diario (${k} kcal)`,
};

export const TRK_DE: UiTrackingDict = {
  mealBreakfast: 'Frühstück',
  mealBreakfastShort: 'Frühst.',
  mealLunch: 'Mittagessen',
  mealSnack: 'Snack',
  mealDinner: 'Abendessen',
  proteins: 'Proteine',
  carbs: 'Kohlenhydrate',
  fats: 'Fette',
  macroP: 'E',
  macroC: 'K',
  macroF: 'F',
  saveIn: 'Speichern unter:',
  cancel: 'Abbrechen',
  save: 'Speichern',
  close: 'Schließen',
  remove: 'Entfernen',
  add: 'Hinzufügen',
  kcal: 'kcal',

  journalTitle: 'Meine Ernährung',
  historyWeekTitle: 'Verlauf & Wochenbilanz',
  periodToday: 'Heute',
  periodTomorrow: 'Morgen',
  periodWeek: 'Woche',
  weeklyRecapTab: '📊 Wochenübersicht',
  sevenDaysShort: '7T',
  nutritionGoalTitle: 'Dein Ernährungsziel',
  proteinsTarget90: 'Proteine: 90 g',
  fiberTarget25: 'Ballaststoffe: 25 g',
  saladAlt: 'Ausgewogener Salat',
  placeholderBreakfast: 'Haferflocken, Beeren, Naturjoghurt...',
  placeholderLunch: 'Gemischter Salat, Vollkorn, Gemüse, Fisch oder Fleisch...',
  placeholderSnack: 'Frisches Obst, Mandeln, Quark oder Kompott...',
  placeholderDinner: 'Hähnchenfilet, gedünstetes Gemüse, leichte Suppe...',
  markCompletedTitle: 'Als erledigt markiert',
  checkMealTitle: 'Mahlzeit abhaken',
  deleteFoodTitle: 'Lebensmittel löschen',
  addFoodCta: 'Lebensmittel hinzufügen',
  barcodeBtn: 'Barcode',
  aiScannerBtn: 'KI-Foto-Scan',
  clearTodayTitle: 'Heute leeren',
  clearShort: 'Leeren',
  loggedItemsSummary: (c, k) => `Details der ${c} eingetragenen Lebensmittel (${k} kcal)`,
  modalSubtitle: 'Gib einfach ein, was du isst (z. B. Omelett und Schokomousse). Kalorien & Mengen werden direkt berechnet!',
  saveInWhichMeal: 'Zu welcher Mahlzeit hinzufügen?',
  quickExamples: [
    '☕ Schwarzer Kaffee',
    '☕ Milchkaffee & 1 Zwieback',
    '🥚 Omelett & Schokoladenmousse',
    '🍎 Omelett, Salat & 1 Apfel',
    '🍓 Griechischer Joghurt & Beeren',
    '🥩 Rindersteak, Bohnen & 1 Birne',
  ],
  calculateBtn: 'Berechnen',
  satietyVitamins: 'Sättigung & Vitamine',
  addFruitTitle: (n) => `${n} hinzufügen`,
  fruits: [
    { emoji: '🍎', name: '1 Apfel', kcal: 52, grams: 150 },
    { emoji: '🍊', name: '1 Clementine', kcal: 38, grams: 80 },
    { emoji: '🍓', name: 'Beerenmix', kcal: 38, grams: 100 },
    { emoji: '🥝', name: '1 Kiwi', kcal: 42, grams: 75 },
    { emoji: '🍌', name: '1/2 Banane', kcal: 45, grams: 60 },
    { emoji: '🍐', name: '1 Birne', kcal: 57, grams: 120 },
  ],
  macronutrientsG: 'Makronährstoffe (g)',
  kcalPlaceholderEx: 'z.B. 425',
  portionPlaceholderEx: 'z.B. 240',

  recapBadge: '📊 Wochenauswertung',
  recapWeekFromTo: (a, b) => `Woche ${a} bis ${b}`,
  recapTitle: 'Wöchentliche Mahlzeitenübersicht',
  recapSubtitle: 'Überblick über Kalorien, Makronährstoffe und Obstportionen der letzten 7 Tage.',
  prevWeek: 'Vorherige Woche',
  nextWeek: 'Nächste Woche',
  thisWeek: 'Diese Woche',
  lastWeek: 'Letzte Woche',
  weekOffsetLabel: (n) => `Woche ${n}`,
  copied: 'Kopiert!',
  copySummary: 'Bilanz kopieren',
  backToToday: '← Zurück zu Heute',
  avgPerDay: 'Schnitt / Tag',
  targetPrefix: 'Ziel:',
  weekTotal: 'Wochengesamt',
  daysLogged: (n) => `${n} / 7 Tage erfasst`,
  fruitsVitality: 'Obst & Vitalität',
  portionsUnit: 'Portionen',
  fruitPerDayAvg: (a) => `~${a} Portion / Tag (Ziel: 2-3)`,
  targetRegularity: 'Zieltreue',
  daysUnit: 'Tage',
  excellentBudget: '🎯 Hervorragend im Budget',
  balancedPace: '⚖️ Ausgewogenes Tempo',
  dailyCalEvolution: 'Täglicher Kalorienverlauf',
  clickBarHint: 'Klicke auf einen Balken, um Details dieses Tages anzuzeigen.',
  inTarget: 'Im Ziel',
  aboveTarget: 'Darüber',
  targetLine: (k) => `Ziellinie (${k} kcal)`,
  selectedDayLabel: 'Gewählter Tag:',
  showAllDays: 'Alle Tage anzeigen',
  macroDistTitle: 'Wöchentliche Makronährstoffverteilung',
  macroDistSub: 'Gesamtmenge und Anteil von Eiweiß, Kohlenhydraten und Fett.',
  totalAbsorbed: (g) => `Gesamt ${g}g aufgenommen`,
  approxPerDay: (g) => `(~${g}g/T)`,
  proteinDesc: 'Erhält und unterstützt die Muskelmasse.',
  carbsDesc: 'Liefert Energie für deinen Alltag.',
  fatDesc: 'Hormonbalance und Vitaminaufnahme.',
  coachWeeklyTitle: 'KI-Coach Wochenbewertung',
  coachWeeklyEmpty: 'Trage erste Mahlzeiten ein, damit der Coach deine Woche analysieren kann!',
  coachWeeklyGood: (name, avg, target, fruits) => `Bravo ${name}! Dein Wochenschnitt (${avg} kcal) passt perfekt zu deinem Ziel von ${target} kcal. Dazu ${fruits} Obstportionen – weiter so!`,
  coachWeeklyHigh: (name, avg, target) => `Gute Woche ${name}! Dein Schnitt liegt leicht über dem Ziel (${avg} kcal vs ${target} kcal). Wähle abends leichtes Gemüse und mageres Protein.`,
  dailyDetailHeading: (c) => `Mahlzeiten nach Tag (${c} Tage angezeigt)`,
  filterLabel: 'Filter:',
  filterAll: 'Alle',
  todayPill: 'Heute',
  fruitCountLabel: (n) => `${n} Obst`,
  loggedItemsCount: (n) => `${n} Einträge`,
  noMealsFilter: 'Keine Mahlzeiten für diesen Filter vorhanden.',
  copyTitle: '📊 NutriCoach Ernährungsübersicht',
  copyDailyTarget: '🎯 Tagesziel:',
  copyRealAvg: '🔥 Tatsächlicher Schnitt:',
  copyTotalConsumed: '⚖️ Gesamt:',
  copyDaysLoggedText: (n) => `${n}/7 Tage erfasst`,
  copyFruitsLabel: '🍎 Obstportionen:',
  copyDetailByDay: 'Details pro Tag:',
  copyMealsCount: (n) => `${n} Mahlzeiten`,
  copyNoMeals: '(Keine Einträge)',

  wellbeingBadge: 'Wohlbefinden & Bewegung',
  dailyTracking: 'Tägliches Tracking',
  hydrationTitle: 'Wasser & Aktivität',
  waterShort: 'Wasser',
  stepsShort: 'Schritte',
  syncWatchShort: 'Uhr Sync',
  syncMyWatch: 'Uhr Synchronisieren',
  hydrationJournal: 'Trinkprotokoll',
  goalMl: (ml) => `Ziel ${ml} ml`,
  outOfGlasses: (n) => `von ${n} Gläsern getrunken`,
  litersTotal: (l) => `${l} Liter gesamt`,
  addGlass250: '+250 ml (Glas)',
  addBottle500: '+500 ml (Flasche)',
  activitiesStepsTitle: 'Aktivität & Schritte',
  logSportBtn: 'Sport eintragen',
  todaysSteps: 'Schritte heute',
  resetStepsTitle: 'Auf 0 zurücksetzen für Smartwatch-Sync',
  resetToZero: 'Auf 0 setzen',
  stepsMorningNote: '☀️ 0 Schritte beim Aufwachen • Deine Uhr zählt den Tag über mit',
  stepGoalPrefix: (s) => `Ziel: ${s} Schritte`,
  editStepGoalTitle: 'Tägliches Schrittziel ändern',
  caloriesBurned: 'Verbrannte Kalorien',
  activeBurn: 'Aktivumsatz',
  watchPrefix: (b) => `Uhr: ${b}`,
  watchGenericTitle: 'Smartwatch (Apple, Garmin, Galaxy...)',
  lastSyncPrefix: (v) => `Sync: ${v}`,
  watchSyncSub: 'Synchronisiere Schritte & Kalorien vom Handgelenk',
  syncActionBtn: 'Synchronisieren',
  connectActionBtn: 'Verbinden',
  quickAddSteps: 'Schritte schnell hinzufügen:',
  clickDirectAdd: 'Zum Hinzufügen tippen',
  presetSmallWalk: 'Kurzer Spaziergang (+1.000)',
  presetActiveWalk: 'Zügiger Spaziergang (+2.500)',
  presetLongWalk: 'Langer Marsch (+5.000)',
  stepsUnit: 'Schritte',
  loggedActivitiesCount: (n) => `Erfasste Aktivitäten (${n})`,
  noActivitiesToday: 'Heute noch keine Aktivität erfasst.',
  sportSession: 'Sporteinheit',
  deleteActivityTitle: 'Aktivität löschen',
  addActivityModalTitle: 'Aktivität hinzufügen',
  addActivityModalSub: 'Trage Sport oder Spaziergänge für verbrannte Kalorien ein.',
  activityNameLabel: 'Name der Aktivität *',
  activityNamePlaceholder: 'z.B. Zügiges Gehen, Fitness, Schwimmen',
  durationMinLabel: 'Dauer (Minuten)',
  caloriesBurnedLabel: 'Verbrannte Kalorien (kcal)',
  stepsOptionalLabel: 'Schrittzahl (optional)',
  editStepModalTitle: 'Schrittziel bearbeiten',
  editStepModalSub: 'Lege dein Tagesziel fest. Die WHO empfiehlt 8.000 bis 10.000 Schritte pro Tag.',
  dailyStepTargetLabel: 'Tagesziel (Schritte)',
  recommendedTargets: 'Empfohlene Ziele:',
  validateGoalBtn: 'Ziel speichern',

  watchModalBadge: 'Sensoren & Schrittzähler',
  watchModalCompat: '100% Kompatibel',
  watchModalTitle: 'Smartwatch-Synchronisation',
  tabSync: 'Synchronisieren',
  tabSelect: (n) => `Uhr wählen (${n})`,
  tabBluetooth: 'Direktes Bluetooth (BLE)',
  tabGuide: 'Anleitung',
  watchConnectedSuccess: (b, m) => `Deine Uhr ${b} (${m}) wurde verbunden!`,
  syncSuccessWithSteps: (s, k, w) => `Erfolgreich! ${s} Schritte und ${k} kcal von ${w} importiert.`,
  syncSuccessZero: (w) => `Zähler auf 0 zurückgesetzt. Deine ${w} zählt ab jetzt mit.`,
  bleUnsupported: 'Web Bluetooth wird von Chrome, Edge und Brave unterstützt. Auf dem iPhone synchronisieren Uhren über Apple Health.',
  bleDetectedDefault: 'Smartwatch erkannt',
  bleConnectedAppDefault: 'Verbundenes Gerät',
  bleConnectedMsg: (n) => `Bluetooth-Gerät „${n}“ verbunden!`,
  bleCancelled: 'Suche abgebrochen oder kein Gerät gewählt.',
  bleError: 'Direkte Bluetooth-Verbindung fehlgeschlagen.',
  watchDisconnected: 'Uhr getrennt.',
  noWatchConfigured: 'Keine Uhr konfiguriert',
  statusConnected: 'Verbunden',
  statusNotLinked: 'Nicht verknüpft',
  modelLabel: 'Modell:',
  selectYourModel: 'Modell wählen',
  lastSyncLabel: 'Letzter Sync:',
  switchWatch: 'Uhr wechseln',
  unlinkWatch: 'Trennen',
  transferTodayTitle: 'Heutige Schritte & Kalorien übertragen',
  transferTodayDesc: 'Tippe unten, um Schritte direkt von deiner Uhr oder Health-App zu importieren.',
  stepsReadTodayLabel: 'Heute auf der Uhr erfasste Schritte:',
  morningZeroBtn: '0 (Morgen)',
  approxBurned: (k) => `≈ ${k} kcal verbrannt`,
  zeroKcalStart: '0 kcal (Tagesbeginn)',
  syncingBtn: 'Synchronisiere...',
  startSyncNowBtn: 'Jetzt Synchronisieren',
  watchPrincipleNote: '☀️ Prinzip: Die Schritte starten morgens bei 0 und steigen mit jeder Bewegung.',
  supportedWatches: '100% kompatible Uhren & Apps:',
  selectBrandTitle: 'Wähle Marke und Modell:',
  selectBrandSub: 'Wähle dein Gerät für optimales Tracking.',
  badgeCurrent: 'Aktuell',
  gatewayLabel: 'Plattform:',
  exactModelLabel: 'Genaues Modell:',
  pairThisWatch: 'Diese Uhr koppeln',
  bleDirectTitle: 'Direkte Funkverbindung (Web Bluetooth BLE)',
  bleDirectSub: 'Für Sportuhren mit offenen Sensoren und Pulsmessern.',
  bleDirectBody: 'Nutzt sicheres Web Bluetooth. Stelle sicher, dass Bluetooth aktiviert ist.',
  bleConnectedTo: 'Verbunden mit:',
  bleScanningBtn: 'Suche läuft...',
  bleScanBtn: 'Bluetooth-Geräte suchen',
  bleHelpLink: 'Hilfe beim Koppeln?',
  bleAppleNoteTitle: '💡 Hinweis für Apple Watch & iPhone:',
  bleAppleNoteBody: 'Safari blockiert direktes BLE; nutze Apple Health im Tab Synchronisieren.',
  guideTitle: 'Wie funktioniert die Synchronisation?',
  guideSub: 'Folge diesen 3 einfachen Schritten:',
  guideStep1Title: 'Uhr täglich tragen',
  guideStep1Body: 'Sie erfasst reale Schritte, Puls und aktive Kalorien.',
  guideStep2Title: 'Automatischer Sync mit Health-App',
  guideStep2Body: 'Deine Begleit-App sendet Daten an Apple Health oder Google Health Connect.',
  guideStep3Title: 'Sofortiger Import in NutriCoach',
  guideStep3Body: 'Klicke auf „Jetzt Synchronisieren“, um Schritte und Kalorien hinzuzufügen.',
  guideSpecificFor: (b) => `Anleitung für ${b}:`,
  privateHealthFooter: 'Private & sichere Gesundheitsdaten',
  todayAtTime: (t) => `Heute um ${t}`,
  watchActivityTitle: (w) => `Schritte & Aktivität Watch (${w})`,
  brandSpecific: {
    apple: { category: 'iOS / WatchOS', gateway: 'Apple Health (HealthKit)', instructions: ['Schritte und Kalorien werden automatisch erfasst.', 'Prüfe in Apple Health die Berechtigung.', 'Klicke auf Jetzt Synchronisieren.'] },
    garmin: { category: 'Garmin Connect', gateway: 'Garmin Connect ➔ Apple Health / Health Connect', instructions: ['Öffne Garmin Connect.', 'Aktiviere Apple Health oder Health Connect.', 'Importiere deine Schritte in NutriCoach.'] },
    samsung: { category: 'Wear OS / Tizen', gateway: 'Samsung Health & Health Connect', instructions: ['Öffne Samsung Health.', 'Aktiviere Health Connect.', 'Deine Schritte erscheinen im Dashboard.'] },
    fitbit: { category: 'Fitbit & Google Health', gateway: 'Fitbit App & Google Fit', instructions: ['Synchronisiere mit Fitbit oder Pixel Watch.', 'Erlaube Schrittzugriff.', 'Tippe auf Jetzt Synchronisieren.'] },
    withings: { category: 'Withings Health Mate', gateway: 'Withings App', instructions: ['Öffne die Withings-App.', 'Aktiviere Apple Health oder Google Fit.', 'Daten direkt importieren.'] },
    polar: { category: 'Sport & Leistung', gateway: 'Polar Flow / Suunto App', instructions: ['Kopple die Uhr mit Polar Flow oder Suunto.', 'Verknüpfe Health / Google Fit.', 'Workouts und Schritte werden synchronisiert.'] },
    xiaomi: { category: 'Mi Fitness / Zepp', gateway: 'Mi Fitness / Zepp App', instructions: ['Verknüpfe Mi Fitness/Zepp mit Apple Health oder Google Fit.', 'Aktiviere den Schrittzähler.', 'Mit 1 Klick synchronisieren.'] },
  },

  errInvalidBarcode: 'Gib einen gültigen Barcode ein (8 bis 14 Ziffern, z.B. 3017620422003).',
  errNotFoundBarcode: (c) => `Produkt für Barcode ${c} nicht gefunden. Fotografiere die Verpackung.`,
  errNetworkBarcode: 'Netzwerkfehler bei der Produktsuche. Bitte erneut versuchen.',
  errUnreadableLabel: 'Barcode oder Nährwerttabelle unleserlich. Näher herangehen oder Ziffern eingeben.',
  errAnalyzeImage: 'Bild kann derzeit nicht analysiert werden.',
  errCameraNotReady: 'Kamera nicht bereit. Erneut versuchen oder Foto hochladen.',
  errProcessImage: 'Dieses Bild konnte nicht verarbeitet werden.',
  scannedProductDefault: 'Gescanntes Produkt',
  scannerTitle: 'Barcode-Scanner',
  scannerSubtitle: 'Kamera auf den Code richten, Foto machen oder EAN-Nummer eingeben.',
  lookingUpProduct: 'Produkt wird gesucht...',
  autoDetectActive: 'Auto-Erkennung aktiv',
  cameraStarting: 'Kamera startet...',
  cameraUnavailable: 'Live-Kamera nicht verfügbar',
  cameraUnavailableHint: 'Nutze den Foto-Button oder gib die Ziffern manuell ein.',
  captureReadAi: 'Aufnehmen & KI-Scan',
  takePhoto: 'Foto aufnehmen',
  photoGallery: 'Foto / Galerie',
  orEnterEan: 'Oder Barcode-Nummer (EAN) eingeben:',
  okBtn: 'OK',
  recognizedByAi: 'Von KI erkannt',
  forPortionG: (g) => `für ${g}g`,
  consumedQtyG: 'Verzehrte Menge (g):',
  scanAnotherTitle: 'Anderes Produkt scannen',
  addToJournalKcal: (k) => `Zum Tagebuch hinzufügen (${k} kcal)`,
};
