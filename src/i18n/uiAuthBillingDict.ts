export interface UiAuthBillingDict {
  regCountdownTitle: string;
  regActiveOnSignup: string;
  regCountdownDesc1: string;
  regCountdownDescBold: string;
  reg30Days: string;
  reg100Free: string;
  regModeDiscTitle: string;
  regModeDiscBadge: string;
  regModeDiscDesc: string;
  regModeCustomTitle: string;
  regModeCustomBadge: string;
  regModeCustomDesc: string;
  regTesterBadge: string;
  regDiscoverTitle: string;
  regDiscoverDesc: string;
  regFeatScanTitle: string;
  regFeatScanDesc: string;
  regFeatVoiceTitle: string;
  regFeatVoiceDesc: string;
  regFeatRecipesTitle: string;
  regFeatRecipesDesc: string;
  regFeatJournalTitle: string;
  regFeatJournalDesc: string;
  regEnter1Click: string;
  regCheckNoReg: string;
  regCheckDemoReady: string;
  regCheck30DaysFree: string;
  regPhoneTipTitle: string;
  regPhoneTip1: string;
  regPhoneTipBold: string;
  regPreferCustomBtn: string;
  regCustomFastPrompt: string;
  regLaunch1Click: string;
  regHidePwd: string;
  regShowPwd: string;
  regDietLabel: string;
  regDietStandard: string;
  regDietGlutenFree: string;
  regDietVegetarian: string;
  regDietVegan: string;
  regDietPescetarian: string;
  regDietKeto: string;

  monthly: string;
  yearly: string;
  perMonth: string;
  perYear: string;
  cancelAnytime: string;
  only333Mo: string;
  save30: string;
  paywallBadge: string;
  paywallTitle: string;
  paywallDesc: string;
  paywallBenefits: [string, string, string, string];
  payAndContinue: (price: string) => string;
  stripeSecureShort: string;
  myAccountLogout: string;
  userFallback: string;
  trialExpiredBadge: string;
  privacyPolicy: string;
  deleteAccount: string;
  logoutBtn: string;

  stripeNoSession: string;
  stripeIncomplete: string;
  stripeVerifyFailed: string;
  stripeCreateLinkErr: string;
  stripeNetworkErr: string;
  stripeContactErr: string;
  stripeMissingKeyErr: string;
  stripeBack: string;
  stripeVerifying: string;
  stripeOpening: string;
  stripeSsl: string;
  stripeLoadingCard: string;
  stripeSecuredBy: string;
  stripeOpenInBrowser: string;
  stripeCompleteTitle: string;
  stripeCompleteDesc: string;
  stripeOpenCheckout: (price: string) => string;
  stripeVerifyDone: string;
  stripeRetry: string;
  stripeYearPriceLabel: string;
  stripeMonthPriceLabel: string;

  premUnsubscribedNotice: string;
  premBenefits: [string, string, string, string, string, string, string];
  premBadgeActive: string;
  premBadgeEnded: string;
  premBadgeDays: (d: number) => string;
  premSubActive: string;
  premSubEnded: string;
  premSubTrial: string;
  premActiveStatusLine: string;
  premActiveUnsubNote: string;
  premConfirmCancelTitle: string;
  premConfirmCancelDesc: string;
  premKeepSub: string;
  premConfirmUnsubBtn: string;
  premUnsubBtn: string;
  premUnsubImmediate: string;
  premMonthPayReq: string;
  premMonthTrial: string;
  premPayContinueBtn: (price: string) => string;
  premStartTrialBtn: string;
  premTrustLeft: string;
  premTrustRight: string;

  authSignupTab: string;
  authLoginTab: string;
  authFirstName: string;
  authFirstNamePh: string;
  authEmail: string;
  authEmailPh: string;
  authPassword: string;
  authMin6: string;
  authTerms1: string;
  authTermsLink: string;
  authTrialCallout: string;
  authFeat1: string;
  authFeat2: string;
  authFeat3: string;
  authFeat4: string;
  authContinueGoals: string;
  authLoginBtn: string;
  authStep2Of2: string;
  authCalibrateTitle: string;
  authSexLabel: string;
  authSelectPh: string;
  authFemale: string;
  authMale: string;
  authAgeLabel: string;
  authHeightLabel: string;
  authCurrentWeightLabel: string;
  authTargetWeightLabel: string;
  authActivityLabel: string;
  authActivitySelect: string;
  authActSedentary: string;
  authActLight: string;
  authActModerate: string;
  authActVery: string;
  authBack: string;
  authStart30Days: string;

  shareText: string;
  shareAppTitle: string;
  shareEmailSubject: string;
  shareEmailBodyPrefix: string;
  shareHeading: string;
  shareSubheading: string;
  shareEmailSms: string;
  shareNativeBtn: string;
  shareWebLinkLabel: string;
  shareNoInstallBadge: string;
  shareCopyLinkTitle: string;
  shareCopied: string;
  shareFooter: string;
}

export const AB_FR: UiAuthBillingDict = {
  regCountdownTitle: "⏱️ Décompte de l'Essai Gratuit : 30 Jours Inclus",
  regActiveOnSignup: "Actif dès l'inscription",
  regCountdownDesc1: "Le compte à rebours démarre automatiquement dès votre entrée dans l'application. Vous suivez vos jours restants en direct • ",
  regCountdownDescBold: '0 € pendant 30 jours, puis abonnement requis (4,99 €/mois ou 39,99 €/an) pour continuer',
  reg30Days: '30 Jours',
  reg100Free: '100% Gratuits',
  regModeDiscTitle: 'Mode Découverte 1-Clic',
  regModeDiscBadge: 'Accès Immédiat',
  regModeDiscDesc: 'Entrez directement sans remplir de formulaire pour tester toutes les fonctionnalités.',
  regModeCustomTitle: 'Profil Sur-Mesure',
  regModeCustomBadge: 'Formulaire',
  regModeCustomDesc: 'Renseignez vos mensurations réelles (taille, poids, rythme) pour un calcul direct.',
  regTesterBadge: 'Accès Testeur & Invité 1-Clic',
  regDiscoverTitle: 'Découvrez NutriCoach Minceur en direct',
  regDiscoverDesc: "Testez immédiatement l'ensemble de l'application sans formulaire préalable. Un profil démo complet avec 30 jours d'essai gratuit est prêt pour vous.",
  regFeatScanTitle: 'Scanner Photo & IA de Repas',
  regFeatScanDesc: 'Reconnaissance instantanée des aliments et calcul automatique des calories, glucides, lipides et protéines.',
  regFeatVoiceTitle: 'Coach Vocal & Chat IA',
  regFeatVoiceDesc: 'Dialogue fluide par la voix ou par écrit pour recevoir des recommandations minceur personnalisées.',
  regFeatRecipesTitle: 'Recettes Saines & Sans Gluten',
  regFeatRecipesDesc: 'Catalogue gourmand adapté aux intolérances, prêt en moins de 25 min avec ratios macronutriments.',
  regFeatJournalTitle: 'Journal & Bilan 7 Jours',
  regFeatJournalDesc: "Suivi de l'eau (verres du jour), des pas quotidiens et analyse du déficit calorique hebdomadaire.",
  regEnter1Click: "Entrer dans l'Application (Mode Découverte 1 Clic)",
  regCheckNoReg: 'Aucune inscription requise',
  regCheckDemoReady: 'Données de démonstration prêtes',
  regCheck30DaysFree: '30 jours gratuits activés',
  regPhoneTipTitle: '📱 Vous testez sur smartphone (Android ou iPhone) ?',
  regPhoneTip1: "Pour utiliser NutriCoach en plein écran comme une application native sans la barre d'adresse du navigateur, touchez le menu ⋮ ou l'icône de partage, puis sélectionnez ",
  regPhoneTipBold: "« Ajouter à l'écran d'accueil »",
  regPreferCustomBtn: 'Vous préférez saisir vos mensurations exactes dès maintenant ? Ouvrir le formulaire sur-mesure →',
  regCustomFastPrompt: "Vous préférez tester l'application sans remplir de formulaire ?",
  regLaunch1Click: 'Lancer en 1 Clic',
  regHidePwd: 'Masquer',
  regShowPwd: 'Afficher',
  regDietLabel: 'Régime & Préférence alimentaire',
  regDietStandard: 'Standard / Tous aliments',
  regDietGlutenFree: '🌾 Sans Gluten (Gluten-Free)',
  regDietVegetarian: '🥗 Végétarien',
  regDietVegan: '🌱 Végétalien / Végan',
  regDietPescetarian: '🐟 Pescétarien',
  regDietKeto: '🥑 Low Carb / Cétogène',
  monthly: 'Mensuel',
  yearly: 'Annuel',
  perMonth: '/mois',
  perYear: '/an',
  cancelAnytime: 'Résiliable à tout moment',
  only333Mo: 'Soit 3,33 €/mois',
  save30: 'Économisez 30%',
  paywallBadge: 'Essai de 30 jours terminé • Paiement requis',
  paywallTitle: 'Payez pour continuer à utiliser NutriCoach',
  paywallDesc: 'Vos 30 jours d’essai gratuit sont terminés. Il n’y a pas de formule gratuite sans abonnement : réglez votre abonnement ci-dessous pour continuer à utiliser l’application.',
  paywallBenefits: [
    'Coach nutritionnel IA illimité (écrit & vocal)',
    'Scanner photo IA de vos repas & code-barres instantané',
    'Catalogue complet de 100+ recettes personnalisées',
    'Suivi complet calories, poids, hydratation et montre connectée',
  ],
  payAndContinue: (p) => `Payer et continuer (${p})`,
  stripeSecureShort: 'Paiement Stripe 100% sécurisé • Résiliation en 1 clic',
  myAccountLogout: 'Mon compte / Déconnexion',
  userFallback: 'Utilisateur',
  trialExpiredBadge: 'Essai expiré',
  privacyPolicy: 'Confidentialité',
  deleteAccount: 'Supprimer mon compte',
  logoutBtn: 'Se déconnecter',
  stripeNoSession: 'Aucune session Stripe active. Veuillez ouvrir la page Stripe ci-dessus.',
  stripeIncomplete: "Le paiement n'est pas encore finalisé sur Stripe. Terminez le règlement dans l'onglet Stripe puis vérifiez.",
  stripeVerifyFailed: 'Impossible de vérifier le paiement pour le moment. Réessayez dans quelques secondes.',
  stripeCreateLinkErr: 'Impossible de créer le lien de paiement Stripe.',
  stripeNetworkErr: 'Erreur réseau lors de la connexion à Stripe.',
  stripeContactErr: 'Impossible de contacter Stripe pour le moment. Veuillez réessayer.',
  stripeMissingKeyErr: 'La configuration Stripe (STRIPE_SECRET_KEY) est requise pour procéder au paiement.',
  stripeBack: 'Retour',
  stripeVerifying: 'Vérification de votre paiement Stripe...',
  stripeOpening: 'Ouverture du paiement sécurisé Stripe...',
  stripeSsl: 'Connexion chiffrée SSL 256-bit avec Stripe.',
  stripeLoadingCard: 'Chargement du formulaire bancaire sécurisé...',
  stripeSecuredBy: 'Paiement géré directement par Stripe',
  stripeOpenInBrowser: 'Ouvrir Stripe dans le navigateur',
  stripeCompleteTitle: 'Finalisez votre paiement sécurisé',
  stripeCompleteDesc: 'Appuyez ci-dessous pour ouvrir la page officielle Stripe dans une fenêtre complète sécurisée, puis revenez ici.',
  stripeOpenCheckout: (p) => `Ouvrir la page de paiement Stripe (${p})`,
  stripeVerifyDone: "J'ai terminé le paiement — Vérifier et débloquer",
  stripeRetry: 'Réessayer',
  stripeYearPriceLabel: '39,99 €/an (soit 3,33 €/mois)',
  stripeMonthPriceLabel: '4,99 €/mois',
  premUnsubscribedNotice: 'Votre abonnement a été résilié avec succès. Aucun frais ne vous sera facturé.',
  premBenefits: [
    "Menus diététiques sur-mesure générés par l'IA",
    'Coach vocal et textuel NutriCoach IA illimité',
    'Analyse instantanée des photos de vos repas',
    'Catalogue complet de 100+ recettes exclusives',
    'Programme sportif & synchronisation montres',
    'Export PDF des bilans de santé et courbes',
    'Paiement 100% sécurisé géré par Stripe (Chiffrement SSL 256-bit)',
  ],
  premBadgeActive: 'Abonnement Actif',
  premBadgeEnded: 'Essai gratuit terminé (0 jour restant)',
  premBadgeDays: (d) => `${d} Jours d'essai gratuit restant`,
  premSubActive: 'Votre formule Premium est active sans engagement.',
  premSubEnded: 'Votre période d’essai de 30 jours est terminée. Activez votre abonnement pour continuer.',
  premSubTrial: 'Accélérez vos résultats grâce au suivi nutritionnel IA personnalisé.',
  premActiveStatusLine: 'Statut : Abonnement actif (4,99 €/mois • Sans engagement)',
  premActiveUnsubNote: 'Vous pouvez vous désabonner à tout moment en 1 clic sans aucun frais.',
  premConfirmCancelTitle: 'Confirmer la résiliation',
  premConfirmCancelDesc: "Êtes-vous sûr(e) de vouloir vous désabonner ? Aucun prélèvement futur ne sera effectué. Sans abonnement après 30 jours, l'app nécessitera un paiement.",
  premKeepSub: 'Garder mon abonnement',
  premConfirmUnsubBtn: 'Confirmer le désabonnement',
  premUnsubBtn: 'Se désabonner de NutriCoach',
  premUnsubImmediate: 'Résiliation immédiate, sans frais, réactivable à tout moment.',
  premMonthPayReq: 'Paiement requis pour continuer',
  premMonthTrial: '30 jours offerts puis 4,99 €/mois',
  premPayContinueBtn: (p) => `Payer et continuer — ${p} (Stripe)`,
  premStartTrialBtn: 'Démarrer mon essai (Paiement sécurisé Stripe)',
  premTrustLeft: 'Paiement Stripe 100% sécurisé',
  premTrustRight: 'Sans engagement, résiliation en 1 clic',
  authSignupTab: 'Créer un compte',
  authLoginTab: 'Se connecter',
  authFirstName: 'Prénom',
  authFirstNamePh: 'Votre prénom',
  authEmail: 'Adresse e-mail',
  authEmailPh: 'exemple@domaine.com',
  authPassword: 'Mot de passe',
  authMin6: 'Au moins 6 caractères',
  authTerms1: "J'accepte les conditions générales et la",
  authTermsLink: 'politique de confidentialité',
  authTrialCallout: 'Essai de 30 jours sans carte bancaire requise',
  authFeat1: 'Coach IA illimité',
  authFeat2: 'Scan photo de repas',
  authFeat3: 'Calcul BMR / TDEE',
  authFeat4: '100+ Recettes minceur',
  authContinueGoals: 'Continuer vers mes objectifs',
  authLoginBtn: 'Me connecter',
  authStep2Of2: 'Étape 2 sur 2',
  authCalibrateTitle: 'Calibrons vos besoins caloriques',
  authSexLabel: 'Sexe biologique',
  authSelectPh: 'Sélectionner...',
  authFemale: 'Femme',
  authMale: 'Homme',
  authAgeLabel: 'Âge (ans)',
  authHeightLabel: 'Taille (cm)',
  authCurrentWeightLabel: 'Poids actuel (kg)',
  authTargetWeightLabel: 'Poids cible (kg)',
  authActivityLabel: "Niveau d'activité physique",
  authActivitySelect: 'Sélectionner votre niveau...',
  authActSedentary: 'Sédentaire (Bureau, peu de marche)',
  authActLight: 'Légèrement actif (1 à 3 séances / semaine)',
  authActModerate: 'Modérément actif (3 à 5 séances / semaine)',
  authActVery: 'Très actif (6 à 7 séances intensives)',
  authBack: 'Retour',
  authStart30Days: 'Démarrer mes 30 jours gratuits',
  shareText: 'Découvrez NutriCoach Minceur : coach nutritionnel IA, scanner de repas photo et recettes saines ! 30 jours gratuits :',
  shareAppTitle: 'NutriCoach Minceur - Coach Nutrition & Perte de Poids',
  shareEmailSubject: "Découvre l'application NutriCoach Minceur",
  shareEmailBodyPrefix: 'Lien application : ',
  shareHeading: 'Partager NutriCoach',
  shareSubheading: 'Invitez vos amis et vos proches en 1 clic',
  shareEmailSms: 'E-mail / SMS',
  shareNativeBtn: 'Ouvrir le menu de partage de mon téléphone',
  shareWebLinkLabel: 'Lien Application Web / Smartphone (Accès direct)',
  shareNoInstallBadge: 'Sans installation',
  shareCopyLinkTitle: 'Copier le lien',
  shareCopied: 'Lien copié dans votre presse-papier !',
  shareFooter: "NutriCoach Minceur • 30 jours d'essai gratuit offerts à vos invités",
};

export const AB_EN: UiAuthBillingDict = {
  regCountdownTitle: '⏱️ Free Trial Countdown: 30 Days Included',
  regActiveOnSignup: 'Active on signup',
  regCountdownDesc1: 'The countdown starts automatically once you enter the app. Track your remaining days live • ',
  regCountdownDescBold: '€0 for 30 days, then subscription required (€4.99/mo or €39.99/yr) to continue',
  reg30Days: '30 Days',
  reg100Free: '100% Free',
  regModeDiscTitle: '1-Click Discovery Mode',
  regModeDiscBadge: 'Instant Access',
  regModeDiscDesc: 'Jump straight in without filling out a form to test every feature.',
  regModeCustomTitle: 'Custom Profile',
  regModeCustomBadge: 'Form',
  regModeCustomDesc: 'Enter your real measurements (height, weight, pace) for direct calculation.',
  regTesterBadge: '1-Click Tester & Guest Access',
  regDiscoverTitle: 'Discover NutriCoach Live',
  regDiscoverDesc: 'Try the complete app immediately with no registration required. A full demo profile with a 30-day free trial is ready for you.',
  regFeatScanTitle: 'AI Meal & Photo Scanner',
  regFeatScanDesc: 'Instant food recognition and automatic calories, carbs, fat, and protein calculation.',
  regFeatVoiceTitle: 'Voice Coach & AI Chat',
  regFeatVoiceDesc: 'Smooth voice or text chat to receive personalized weight-loss recommendations.',
  regFeatRecipesTitle: 'Healthy & Gluten-Free Recipes',
  regFeatRecipesDesc: 'Delicious catalog adapted to intolerances, ready in under 25 min with macro ratios.',
  regFeatJournalTitle: 'Food Log & 7-Day Recap',
  regFeatJournalDesc: 'Track water glasses, daily steps, and weekly calorie deficit analysis.',
  regEnter1Click: 'Enter App (1-Click Discovery Mode)',
  regCheckNoReg: 'No signup required',
  regCheckDemoReady: 'Demo data ready',
  regCheck30DaysFree: '30 free days active',
  regPhoneTipTitle: '📱 Testing on a smartphone (Android or iPhone)?',
  regPhoneTip1: 'To use NutriCoach full-screen like a native app without the browser address bar, tap the ⋮ menu or Share icon, then select ',
  regPhoneTipBold: '“Add to Home Screen”',
  regPreferCustomBtn: 'Prefer entering your exact measurements right now? Open custom form →',
  regCustomFastPrompt: 'Prefer testing the app without filling out a form?',
  regLaunch1Click: 'Launch in 1 Click',
  regHidePwd: 'Hide',
  regShowPwd: 'Show',
  regDietLabel: 'Diet & Food Preference',
  regDietStandard: 'Standard / All foods',
  regDietGlutenFree: '🌾 Gluten-Free',
  regDietVegetarian: '🥗 Vegetarian',
  regDietVegan: '🌱 Vegan',
  regDietPescetarian: '🐟 Pescetarian',
  regDietKeto: '🥑 Low Carb / Keto',
  monthly: 'Monthly',
  yearly: 'Yearly',
  perMonth: '/mo',
  perYear: '/yr',
  cancelAnytime: 'Cancel anytime',
  only333Mo: 'Only €3.33/mo',
  save30: 'Save 30%',
  paywallBadge: '30-day trial ended • Payment required',
  paywallTitle: 'Pay & Subscribe to Continue',
  paywallDesc: 'Your 30-day free trial has ended. There is no free tier after the trial — choose a subscription below to continue using NutriCoach.',
  paywallBenefits: [
    'Unlimited AI Nutrition Coach (text & voice)',
    'Instant AI Meal Photo & Barcode Scanner',
    '100+ personalized healthy recipes in 21 languages',
    'Full calorie, hydration, weight & watch sync tracking',
  ],
  payAndContinue: (p) => `Pay & Continue (${p})`,
  stripeSecureShort: '100% secure Stripe payment • 1-click cancel',
  myAccountLogout: 'My Account / Log out',
  userFallback: 'User',
  trialExpiredBadge: 'Trial ended',
  privacyPolicy: 'Privacy Policy',
  deleteAccount: 'Delete Account',
  logoutBtn: 'Log out',
  stripeNoSession: 'No active Stripe session found. Please open the Stripe page above.',
  stripeIncomplete: 'Payment is not completed yet on Stripe. Finish checkout in the Stripe tab, then tap verify again.',
  stripeVerifyFailed: 'Unable to verify payment right now. Please try again.',
  stripeCreateLinkErr: 'Unable to create Stripe checkout link.',
  stripeNetworkErr: 'Network error while connecting to Stripe.',
  stripeContactErr: 'Unable to contact Stripe right now. Please try again.',
  stripeMissingKeyErr: 'Stripe Checkout configuration (STRIPE_SECRET_KEY) is required to continue.',
  stripeBack: 'Back',
  stripeVerifying: 'Verifying your Stripe payment...',
  stripeOpening: 'Opening secure Stripe checkout...',
  stripeSsl: 'SSL 256-bit encrypted connection with Stripe.',
  stripeLoadingCard: 'Loading secure payment card form...',
  stripeSecuredBy: 'Secured directly by Stripe',
  stripeOpenInBrowser: 'Open Stripe in browser instead',
  stripeCompleteTitle: 'Complete your Stripe payment',
  stripeCompleteDesc: 'Tap below to open Stripe Checkout in a full secure window, then come back here.',
  stripeOpenCheckout: (p) => `Open Stripe Checkout (${p})`,
  stripeVerifyDone: 'I completed payment — Verify & Unlock',
  stripeRetry: 'Retry Stripe Checkout',
  stripeYearPriceLabel: '€39.99/year (€3.33/mo)',
  stripeMonthPriceLabel: '€4.99/month',
  premUnsubscribedNotice: 'Your subscription was cancelled successfully. You will not be charged.',
  premBenefits: [
    'Custom AI-generated dietitian menus',
    'Unlimited NutriCoach AI voice & text coach',
    'Instant AI photo analysis of your meals',
    'Complete catalog of 100+ exclusive recipes',
    'Fitness plan & smartwatch sync',
    'PDF export of health reports & charts',
    '100% secure payment via Stripe (256-bit SSL)',
  ],
  premBadgeActive: 'Active Subscription',
  premBadgeEnded: 'Free trial ended (0 days left)',
  premBadgeDays: (d) => `${d} Free Trial Days Left`,
  premSubActive: 'Your Premium plan is active with no commitment.',
  premSubEnded: 'Your 30-day free trial has ended. Activate your subscription to continue.',
  premSubTrial: 'Accelerate your results with personalized AI nutrition coaching.',
  premActiveStatusLine: 'Status: Active subscription (€4.99/mo • Cancel anytime)',
  premActiveUnsubNote: 'You can unsubscribe anytime in 1 click with zero fees.',
  premConfirmCancelTitle: 'Confirm cancellation',
  premConfirmCancelDesc: 'Are you sure you want to unsubscribe? No future charges will be made. After the 30-day trial ends, an active subscription is required.',
  premKeepSub: 'Keep my subscription',
  premConfirmUnsubBtn: 'Confirm unsubscribe',
  premUnsubBtn: 'Unsubscribe from NutriCoach',
  premUnsubImmediate: 'Immediate cancellation, zero fees, reactivate anytime.',
  premMonthPayReq: 'Payment required to continue',
  premMonthTrial: '30 days free then €4.99/mo',
  premPayContinueBtn: (p) => `Pay & continue — ${p} (Stripe)`,
  premStartTrialBtn: 'Start my trial (Secure Stripe Checkout)',
  premTrustLeft: '100% secure Stripe payment',
  premTrustRight: 'No commitment, 1-click cancel',
  authSignupTab: 'Create account',
  authLoginTab: 'Sign in',
  authFirstName: 'First name',
  authFirstNamePh: 'Your first name',
  authEmail: 'Email address',
  authEmailPh: 'example@domain.com',
  authPassword: 'Password',
  authMin6: 'At least 6 characters',
  authTerms1: 'I accept the terms and the',
  authTermsLink: 'privacy policy',
  authTrialCallout: '30-day free trial with no credit card required',
  authFeat1: 'Unlimited AI Coach',
  authFeat2: 'Meal photo scan',
  authFeat3: 'BMR / TDEE calc',
  authFeat4: '100+ Slimming recipes',
  authContinueGoals: 'Continue to my goals',
  authLoginBtn: 'Sign in',
  authStep2Of2: 'Step 2 of 2',
  authCalibrateTitle: "Let's calibrate your calorie needs",
  authSexLabel: 'Biological sex',
  authSelectPh: 'Select...',
  authFemale: 'Female',
  authMale: 'Male',
  authAgeLabel: 'Age (years)',
  authHeightLabel: 'Height (cm)',
  authCurrentWeightLabel: 'Current weight (kg)',
  authTargetWeightLabel: 'Target weight (kg)',
  authActivityLabel: 'Physical activity level',
  authActivitySelect: 'Select your level...',
  authActSedentary: 'Sedentary (Desk job, little walking)',
  authActLight: 'Lightly active (1–3 sessions / week)',
  authActModerate: 'Moderately active (3–5 sessions / week)',
  authActVery: 'Very active (6–7 intensive sessions)',
  authBack: 'Back',
  authStart30Days: 'Start my 30 free days',
  shareText: 'Discover NutriCoach: AI nutrition coach, meal photo scanner, and healthy recipes! 30 days free:',
  shareAppTitle: 'NutriCoach - Nutrition & Weight Loss Coach',
  shareEmailSubject: 'Check out the NutriCoach app',
  shareEmailBodyPrefix: 'App link: ',
  shareHeading: 'Share NutriCoach',
  shareSubheading: 'Invite your friends and family in 1 click',
  shareEmailSms: 'Email / SMS',
  shareNativeBtn: 'Open phone share menu',
  shareWebLinkLabel: 'Web / Smartphone App Link (Direct access)',
  shareNoInstallBadge: 'No install needed',
  shareCopyLinkTitle: 'Copy link',
  shareCopied: 'Link copied to clipboard!',
  shareFooter: 'NutriCoach • 30-day free trial offered to your guests',
};

export const AB_ES: UiAuthBillingDict = {
  regCountdownTitle: '⏱️ Cuenta atrás de prueba gratuita: 30 días incluidos',
  regActiveOnSignup: 'Activo al registrarse',
  regCountdownDesc1: 'La cuenta atrás comienza al entrar en la app. Consulta tus días restantes en vivo • ',
  regCountdownDescBold: '0 € durante 30 días, luego suscripción (4,99 €/mes o 39,99 €/año)',
  reg30Days: '30 Días',
  reg100Free: '100% Gratis',
  regModeDiscTitle: 'Modo Descubrimiento 1-Clic',
  regModeDiscBadge: 'Acceso Inmediato',
  regModeDiscDesc: 'Entra directamente sin rellenar formularios para probar todas las funciones.',
  regModeCustomTitle: 'Perfil a Medida',
  regModeCustomBadge: 'Formulario',
  regModeCustomDesc: 'Introduce tus medidas reales para un cálculo metabólico directo.',
  regTesterBadge: 'Acceso Invitado 1-Clic',
  regDiscoverTitle: 'Descubre NutriCoach en directo',
  regDiscoverDesc: 'Prueba toda la aplicación al instante sin formulario previo. Un perfil demo con 30 días gratis está listo.',
  regFeatScanTitle: 'Escáner Foto IA de Comidas',
  regFeatScanDesc: 'Reconocimiento instantáneo y cálculo de calorías, carbohidratos, grasas y proteínas.',
  regFeatVoiceTitle: 'Coach de Voz y Chat IA',
  regFeatVoiceDesc: 'Conversación fluida por voz o texto para consejos personalizados.',
  regFeatRecipesTitle: 'Recetas Saludables y Sin Gluten',
  regFeatRecipesDesc: 'Catálogo adaptado a intolerancias en menos de 25 min.',
  regFeatJournalTitle: 'Diario y Resumen 7 Días',
  regFeatJournalDesc: 'Seguimiento de agua, pasos diarios y déficit calórico semanal.',
  regEnter1Click: 'Entrar a la App (Modo 1 Clic)',
  regCheckNoReg: 'Sin registro',
  regCheckDemoReady: 'Datos demo listos',
  regCheck30DaysFree: '30 días gratis activos',
  regPhoneTipTitle: '📱 ¿Pruebas desde el móvil (Android o iPhone)?',
  regPhoneTip1: 'Para usar NutriCoach en pantalla completa sin barra de direcciones, toca el menú ⋮ o Compartir y elige ',
  regPhoneTipBold: '« Añadir a pantalla de inicio »',
  regPreferCustomBtn: '¿Prefieres introducir tus medidas exactas ahora? Abrir formulario →',
  regCustomFastPrompt: '¿Prefieres probar la app sin rellenar formulario?',
  regLaunch1Click: 'Iniciar en 1 Clic',
  regHidePwd: 'Ocultar',
  regShowPwd: 'Mostrar',
  regDietLabel: 'Dieta y preferencia alimentaria',
  regDietStandard: 'Estándar / Todos los alimentos',
  regDietGlutenFree: '🌾 Sin Gluten',
  regDietVegetarian: '🥗 Vegetariano',
  regDietVegan: '🌱 Vegano',
  regDietPescetarian: '🐟 Pescetariano',
  regDietKeto: '🥑 Bajo en carbos / Keto',
  monthly: 'Mensual',
  yearly: 'Anual',
  perMonth: '/mes',
  perYear: '/año',
  cancelAnytime: 'Cancela cuando quieras',
  only333Mo: 'Solo 3,33 €/mes',
  save30: 'Ahorra 30%',
  paywallBadge: 'Prueba de 30 días terminada • Pago requerido',
  paywallTitle: 'Paga para continuar usando NutriCoach',
  paywallDesc: 'Tus 30 días de prueba gratuita han finalizado. Elige una suscripción abajo para seguir usando la app.',
  paywallBenefits: [
    'Coach nutricional IA ilimitado (texto y voz)',
    'Escáner foto IA de comidas y código de barras',
    'Más de 100 recetas saludables en 21 idiomas',
    'Control completo de calorías, agua, peso y reloj',
  ],
  payAndContinue: (p) => `Pagar y continuar (${p})`,
  stripeSecureShort: 'Pago Stripe 100% seguro • Cancelación en 1 clic',
  myAccountLogout: 'Mi cuenta / Salir',
  userFallback: 'Usuario',
  trialExpiredBadge: 'Prueba expirada',
  privacyPolicy: 'Privacidad',
  deleteAccount: 'Eliminar cuenta',
  logoutBtn: 'Cerrar sesión',
  stripeNoSession: 'No hay sesión de Stripe activa. Abre la página de Stripe arriba.',
  stripeIncomplete: 'El pago aún no se completó en Stripe. Finaliza el pago y pulsa verificar.',
  stripeVerifyFailed: 'No se pudo verificar el pago. Inténtalo en unos segundos.',
  stripeCreateLinkErr: 'No se pudo crear el enlace de pago de Stripe.',
  stripeNetworkErr: 'Error de red al conectar con Stripe.',
  stripeContactErr: 'No se pudo contactar con Stripe. Inténtalo de nuevo.',
  stripeMissingKeyErr: 'Se requiere configurar Stripe (STRIPE_SECRET_KEY).',
  stripeBack: 'Volver',
  stripeVerifying: 'Verificando tu pago en Stripe...',
  stripeOpening: 'Abriendo pago seguro de Stripe...',
  stripeSsl: 'Conexión cifrada SSL de 256 bits con Stripe.',
  stripeLoadingCard: 'Cargando formulario de pago seguro...',
  stripeSecuredBy: 'Gestionado directamente por Stripe',
  stripeOpenInBrowser: 'Abrir Stripe en el navegador',
  stripeCompleteTitle: 'Completa tu pago seguro',
  stripeCompleteDesc: 'Pulsa abajo para abrir Stripe en una ventana completa segura y luego vuelve aquí.',
  stripeOpenCheckout: (p) => `Abrir pago Stripe (${p})`,
  stripeVerifyDone: 'Ya pagué — Verificar y desbloquear',
  stripeRetry: 'Reintentar',
  stripeYearPriceLabel: '39,99 €/año (3,33 €/mes)',
  stripeMonthPriceLabel: '4,99 €/mes',
  premUnsubscribedNotice: 'Tu suscripción se canceló correctamente. No se realizará ningún cargo.',
  premBenefits: [
    'Menús dietéticos personalizados generados por IA',
    'Coach de voz y texto NutriCoach IA ilimitado',
    'Análisis instantáneo por foto de tus comidas',
    'Catálogo completo de 100+ recetas exclusivas',
    'Plan deportivo y sincronización con relojes',
    'Exportación PDF de informes y gráficas',
    'Pago 100% seguro con Stripe (SSL 256-bit)',
  ],
  premBadgeActive: 'Suscripción Activa',
  premBadgeEnded: 'Prueba terminada (0 días restantes)',
  premBadgeDays: (d) => `${d} días de prueba gratis restantes`,
  premSubActive: 'Tu plan Premium está activo sin compromiso.',
  premSubEnded: 'Tu periodo de prueba de 30 días ha finalizado. Activa tu suscripción para continuar.',
  premSubTrial: 'Acelera tus resultados con el seguimiento nutricional IA personalizado.',
  premActiveStatusLine: 'Estado: Suscripción activa (4,99 €/mes • Sin compromiso)',
  premActiveUnsubNote: 'Puedes cancelar en cualquier momento en 1 clic sin coste.',
  premConfirmCancelTitle: 'Confirmar cancelación',
  premConfirmCancelDesc: '¿Seguro que deseas cancelar? No se realizarán cobros futuros. Al terminar la prueba se requerirá pago.',
  premKeepSub: 'Mantener suscripción',
  premConfirmUnsubBtn: 'Confirmar cancelación',
  premUnsubBtn: 'Cancelar suscripción de NutriCoach',
  premUnsubImmediate: 'Cancelación inmediata, sin costes.',
  premMonthPayReq: 'Pago requerido para continuar',
  premMonthTrial: '30 días gratis y luego 4,99 €/mes',
  premPayContinueBtn: (p) => `Pagar y continuar — ${p} (Stripe)`,
  premStartTrialBtn: 'Iniciar mi prueba (Pago seguro Stripe)',
  premTrustLeft: 'Pago Stripe 100% seguro',
  premTrustRight: 'Sin compromiso, cancela en 1 clic',
  authSignupTab: 'Crear cuenta',
  authLoginTab: 'Iniciar sesión',
  authFirstName: 'Nombre',
  authFirstNamePh: 'Tu nombre',
  authEmail: 'Correo electrónico',
  authEmailPh: 'ejemplo@dominio.com',
  authPassword: 'Contraseña',
  authMin6: 'Mínimo 6 caracteres',
  authTerms1: 'Acepto las condiciones generales y la',
  authTermsLink: 'política de privacidad',
  authTrialCallout: 'Prueba de 30 días sin tarjeta bancaria',
  authFeat1: 'Coach IA ilimitado',
  authFeat2: 'Escaneo foto comida',
  authFeat3: 'Cálculo BMR / TDEE',
  authFeat4: '100+ Recetas ligeras',
  authContinueGoals: 'Continuar a mis objetivos',
  authLoginBtn: 'Entrar',
  authStep2Of2: 'Paso 2 de 2',
  authCalibrateTitle: 'Calibremos tus calorías',
  authSexLabel: 'Sexo biológico',
  authSelectPh: 'Seleccionar...',
  authFemale: 'Mujer',
  authMale: 'Hombre',
  authAgeLabel: 'Edad (años)',
  authHeightLabel: 'Altura (cm)',
  authCurrentWeightLabel: 'Peso actual (kg)',
  authTargetWeightLabel: 'Peso objetivo (kg)',
  authActivityLabel: 'Nivel de actividad física',
  authActivitySelect: 'Selecciona tu nivel...',
  authActSedentary: 'Sedentario (oficina, poco movimiento)',
  authActLight: 'Ligeramente activo (1–3 días/sem)',
  authActModerate: 'Moderadamente activo (3–5 días/sem)',
  authActVery: 'Muy activo (6–7 días intensos)',
  authBack: 'Volver',
  authStart30Days: 'Comenzar mis 30 días gratis',
  shareText: 'Descubre NutriCoach: coach nutricional IA, escáner de comidas y recetas sanas. ¡30 días gratis!',
  shareAppTitle: 'NutriCoach - Coach Nutrición y Pérdida de Peso',
  shareEmailSubject: 'Descubre la app NutriCoach',
  shareEmailBodyPrefix: 'Enlace de la app: ',
  shareHeading: 'Compartir NutriCoach',
  shareSubheading: 'Invita a tus amigos en 1 clic',
  shareEmailSms: 'E-mail / SMS',
  shareNativeBtn: 'Abrir menú de compartir',
  shareWebLinkLabel: 'Enlace Web / Móvil (Acceso directo)',
  shareNoInstallBadge: 'Sin instalación',
  shareCopyLinkTitle: 'Copiar enlace',
  shareCopied: '¡Enlace copiado al portapapeles!',
  shareFooter: 'NutriCoach • 30 días de prueba gratis para tus invitados',
};

export const AB_DE: UiAuthBillingDict = {
  regCountdownTitle: '⏱️ Kostenloser Test: 30 Tage inklusive',
  regActiveOnSignup: 'Ab Anmeldung aktiv',
  regCountdownDesc1: 'Der Countdown startet automatisch beim Öffnen der App. Verbleibende Tage live im Blick • ',
  regCountdownDescBold: '0 € für 30 Tage, danach Abo nötig (4,99 €/Monat oder 39,99 €/Jahr)',
  reg30Days: '30 Tage',
  reg100Free: '100% Gratis',
  regModeDiscTitle: '1-Klick-Entdeckungsmodus',
  regModeDiscBadge: 'Sofortzugang',
  regModeDiscDesc: 'Direkt ohne Formular starten und alle Funktionen testen.',
  regModeCustomTitle: 'Eigenes Profil',
  regModeCustomBadge: 'Formular',
  regModeCustomDesc: 'Gib deine echten Werte (Größe, Gewicht, Tempo) für die Berechnung ein.',
  regTesterBadge: '1-Klick Test- & Gastzugang',
  regDiscoverTitle: 'NutriCoach live entdecken',
  regDiscoverDesc: 'Teste die gesamte App sofort ohne Registrierung. Ein Demo-Profil mit 30 Tagen gratis Testphase liegt bereit.',
  regFeatScanTitle: 'KI-Foto- & Mahlzeiten-Scanner',
  regFeatScanDesc: 'Sofortige Erkennung von Lebensmitteln und automatische Makro-Berechnung.',
  regFeatVoiceTitle: 'Sprach-Coach & KI-Chat',
  regFeatVoiceDesc: 'Flüssiger Dialog per Sprache oder Text für individuelle Tipps.',
  regFeatRecipesTitle: 'Gesunde & glutenfreie Rezepte',
  regFeatRecipesDesc: 'Vielfältiger Katalog für Unverträglichkeiten in unter 25 Min.',
  regFeatJournalTitle: 'Tagebuch & 7-Tage-Bilanz',
  regFeatJournalDesc: 'Wasser-Tracking, tägliche Schritte und wöchentliche Kalorienbilanz.',
  regEnter1Click: 'App starten (1-Klick-Modus)',
  regCheckNoReg: 'Keine Registrierung nötig',
  regCheckDemoReady: 'Demo-Daten bereit',
  regCheck30DaysFree: '30 Gratistage aktiv',
  regPhoneTipTitle: '📱 Testest du auf dem Smartphone (Android oder iPhone)?',
  regPhoneTip1: 'Für Vollbild ohne Adressleiste tippe auf ⋮ oder Teilen und wähle ',
  regPhoneTipBold: '„Zum Startbildschirm hinzufügen“',
  regPreferCustomBtn: 'Lieber eigene Maße eingeben? Formular öffnen →',
  regCustomFastPrompt: 'App lieber ohne Formular testen?',
  regLaunch1Click: 'Mit 1 Klick starten',
  regHidePwd: 'Verbergen',
  regShowPwd: 'Anzeigen',
  regDietLabel: 'Ernährungsform & Vorlieben',
  regDietStandard: 'Standard / Alles',
  regDietGlutenFree: '🌾 Glutenfrei',
  regDietVegetarian: '🥗 Vegetarisch',
  regDietVegan: '🌱 Vegan',
  regDietPescetarian: '🐟 Pescetarisch',
  regDietKeto: '🥑 Low Carb / Keto',
  monthly: 'Monatlich',
  yearly: 'Jährlich',
  perMonth: '/Monat',
  perYear: '/Jahr',
  cancelAnytime: 'Jederzeit kündbar',
  only333Mo: 'Nur 3,33 €/Monat',
  save30: '30% sparen',
  paywallBadge: '30-Tage-Test beendet • Zahlung erforderlich',
  paywallTitle: 'Abonniere, um fortzufahren',
  paywallDesc: 'Deine 30-tägige Testphase ist abgelaufen. Wähle unten ein Abo aus, um NutriCoach weiter zu nutzen.',
  paywallBenefits: [
    'Unbegrenzter KI-Ernährungscoach (Text & Sprache)',
    'Sofortiger KI-Foto- & Barcode-Scanner',
    '100+ gesunde Rezepte in 21 Sprachen',
    'Vollständiges Kalorien-, Wasser-, Gewichts- & Uhr-Tracking',
  ],
  payAndContinue: (p) => `Zahlen & fortfahren (${p})`,
  stripeSecureShort: '100% sichere Stripe-Zahlung • 1-Klick-Kündigung',
  myAccountLogout: 'Mein Konto / Abmelden',
  userFallback: 'Benutzer',
  trialExpiredBadge: 'Testphase beendet',
  privacyPolicy: 'Datenschutz',
  deleteAccount: 'Konto löschen',
  logoutBtn: 'Abmelden',
  stripeNoSession: 'Keine aktive Stripe-Sitzung. Bitte öffne zuerst die Stripe-Seite.',
  stripeIncomplete: 'Zahlung auf Stripe noch nicht abgeschlossen. Schließe die Zahlung ab und prüfe erneut.',
  stripeVerifyFailed: 'Zahlung konnte nicht geprüft werden. Bitte gleich erneut versuchen.',
  stripeCreateLinkErr: 'Stripe-Zahlungslink konnte nicht erstellt werden.',
  stripeNetworkErr: 'Netzwerkfehler bei Verbindung zu Stripe.',
  stripeContactErr: 'Stripe derzeit nicht erreichbar. Bitte erneut versuchen.',
  stripeMissingKeyErr: 'Stripe-Konfiguration (STRIPE_SECRET_KEY) erforderlich.',
  stripeBack: 'Zurück',
  stripeVerifying: 'Stripe-Zahlung wird überprüft...',
  stripeOpening: 'Sichere Stripe-Kasse wird geöffnet...',
  stripeSsl: '256-Bit-SSL-verschlüsselte Verbindung mit Stripe.',
  stripeLoadingCard: 'Sicheres Kartenformular wird geladen...',
  stripeSecuredBy: 'Direkt über Stripe abgesichert',
  stripeOpenInBrowser: 'Stripe im Browser öffnen',
  stripeCompleteTitle: 'Sichere Zahlung abschließen',
  stripeCompleteDesc: 'Tippe unten, um Stripe in einem sicheren Fenster zu öffnen, und kehre dann zurück.',
  stripeOpenCheckout: (p) => `Stripe-Kasse öffnen (${p})`,
  stripeVerifyDone: 'Zahlung abgeschlossen — Prüfen & freischalten',
  stripeRetry: 'Erneut versuchen',
  stripeYearPriceLabel: '39,99 €/Jahr (3,33 €/Monat)',
  stripeMonthPriceLabel: '4,99 €/Monat',
  premUnsubscribedNotice: 'Dein Abo wurde erfolgreich gekündigt. Es fallen keine Kosten an.',
  premBenefits: [
    'Personalisierte KI-Ernährungspläne',
    'Unbegrenzter KI-Sprach- & Textcoach',
    'Sofortige KI-Fotoanalyse deiner Mahlzeiten',
    'Voller Zugriff auf 100+ exklusive Rezepte',
    'Sportprogramm & Smartwatch-Synchronisierung',
    'PDF-Export von Gesundheitsberichten',
    '100% sichere Stripe-Zahlung (256-Bit SSL)',
  ],
  premBadgeActive: 'Aktives Abo',
  premBadgeEnded: 'Gratis-Test beendet (0 Tage übrig)',
  premBadgeDays: (d) => `Noch ${d} Tage gratis testen`,
  premSubActive: 'Dein Premium-Tarif ist ohne Bindung aktiv.',
  premSubEnded: 'Deine 30-Tage-Testphase ist beendet. Aktiviere ein Abo zum Fortfahren.',
  premSubTrial: 'Beschleunige deine Ergebnisse mit individuellem KI-Coaching.',
  premActiveStatusLine: 'Status: Aktives Abo (4,99 €/Monat • Jederzeit kündbar)',
  premActiveUnsubNote: 'Jederzeit kostenlos mit 1 Klick kündbar.',
  premConfirmCancelTitle: 'Kündigung bestätigen',
  premConfirmCancelDesc: 'Möchtest du wirklich kündigen? Es erfolgen keine weiteren Abbuchungen.',
  premKeepSub: 'Abo behalten',
  premConfirmUnsubBtn: 'Kündigung bestätigen',
  premUnsubBtn: 'NutriCoach-Abo kündigen',
  premUnsubImmediate: 'Sofortige Kündigung ohne Gebühren.',
  premMonthPayReq: 'Zahlung zum Fortfahren nötig',
  premMonthTrial: '30 Tage gratis, dann 4,99 €/Monat',
  premPayContinueBtn: (p) => `Zahlen & fortfahren — ${p} (Stripe)`,
  premStartTrialBtn: 'Test starten (Sichere Stripe-Zahlung)',
  premTrustLeft: '100% sichere Stripe-Zahlung',
  premTrustRight: 'Keine Bindung, 1-Klick-Kündigung',
  authSignupTab: 'Konto erstellen',
  authLoginTab: 'Anmelden',
  authFirstName: 'Vorname',
  authFirstNamePh: 'Dein Vorname',
  authEmail: 'E-Mail-Adresse',
  authEmailPh: 'beispiel@domain.de',
  authPassword: 'Passwort',
  authMin6: 'Mindestens 6 Zeichen',
  authTerms1: 'Ich akzeptiere die Nutzungsbedingungen und die',
  authTermsLink: 'Datenschutzerklärung',
  authTrialCallout: '30 Tage kostenlos testen ohne Kreditkarte',
  authFeat1: 'Unbegrenzter KI-Coach',
  authFeat2: 'Mahlzeiten-Foto-Scan',
  authFeat3: 'BMR / TDEE Rechner',
  authFeat4: '100+ Schlank-Rezepte',
  authContinueGoals: 'Weiter zu meinen Zielen',
  authLoginBtn: 'Anmelden',
  authStep2Of2: 'Schritt 2 von 2',
  authCalibrateTitle: 'Kalibrieren wir deinen Kalorienbedarf',
  authSexLabel: 'Biologisches Geschlecht',
  authSelectPh: 'Wählen...',
  authFemale: 'Weiblich',
  authMale: 'Männlich',
  authAgeLabel: 'Alter (Jahre)',
  authHeightLabel: 'Größe (cm)',
  authCurrentWeightLabel: 'Aktuelles Gewicht (kg)',
  authTargetWeightLabel: 'Zielgewicht (kg)',
  authActivityLabel: 'Aktivitätslevel',
  authActivitySelect: 'Level wählen...',
  authActSedentary: 'Sitzend (Büro, wenig Bewegung)',
  authActLight: 'Leicht aktiv (1–3x / Woche)',
  authActModerate: 'Mäßig aktiv (3–5x / Woche)',
  authActVery: 'Sehr aktiv (6–7x intensiv)',
  authBack: 'Zurück',
  authStart30Days: '30 Gratistage starten',
  shareText: 'Entdecke NutriCoach: KI-Ernährungscoach, Foto-Scanner und gesunde Rezepte! 30 Tage gratis:',
  shareAppTitle: 'NutriCoach - Ernährung & Abnehm-Coach',
  shareEmailSubject: 'Entdecke die NutriCoach App',
  shareEmailBodyPrefix: 'App-Link: ',
  shareHeading: 'NutriCoach teilen',
  shareSubheading: 'Lade Freunde mit 1 Klick ein',
  shareEmailSms: 'E-Mail / SMS',
  shareNativeBtn: 'Teilen-Menü öffnen',
  shareWebLinkLabel: 'Web- / Smartphone-Link (Direktzugriff)',
  shareNoInstallBadge: 'Ohne Installation',
  shareCopyLinkTitle: 'Link kopieren',
  shareCopied: 'Link in die Zwischenablage kopiert!',
  shareFooter: 'NutriCoach • 30 Tage gratis Testphase für deine Gäste',
};
