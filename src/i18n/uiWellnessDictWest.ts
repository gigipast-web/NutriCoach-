export interface UiWellnessDict {
  // ProgressView
  progressHeaderTitle: string;
  progressCalendarTitle: string;
  progressTabWeight: string;
  progressTabCalories: string;
  progressTabHydration: string;
  progressWeekPrefix: string;
  progressBravo: string;
  progressLostSinceStart: string;
  progressGoalsTitle: string;
  progressViewAll: string;
  progressOverWeeks: string;
  progressDaysUnit: string;
  progressActiveStreak: string;
  progressWaterPerDay: string;
  progressEncouragementBanner: string;
  progressRecordWeighInCta: string;
  progressChartTitle: string;
  progressTargetGoalLabel: string;
  progressModeSpline: string;
  progressModeSplineTitle: string;
  progressModeBars: string;
  progressModeBarsTitle: string;
  progressThemeAurora: string;
  progressThemeSunset: string;
  progressThemeElectric: string;
  progressWeighInLabel: string;
  progressDeltaLabel: string;
  progressTargetSvgPrefix: string;
  progressMinSvg: string;
  progressLegendSpline: string;
  progressLegendTarget: string;
  progressLegendLow: string;
  progressTouchInspect: string;
  progressPhotosTitle: string;
  progressModeSlider: string;
  progressModeSideBySide: string;
  progressFullscreenTitle: string;
  progressPhotosDesc: string;
  progressImgReadError: string;
  progressFileReadError: string;
  progressPhotoLoadError: string;
  progressClose: string;
  progressPhotoAfterAlt: string;
  progressPhotoBeforeAlt: string;
  progressBadgeCurrent: string;
  progressBadgeBefore: string;
  progressDragSlider: string;
  progressDiffKg: string;
  progressDeletePhotoTitle: string;
  progressChangePhoto: string;
  progressLoading: string;
  progressAddPhoto: string;
  progressGalleryOrDevice: string;
  progressStartDateFallback: string;
  progressRecentPhoto: string;
  progressLostUnit: string;
  progressPrivacyNote: string;
  progressLoadDemoPhotos: string;
  progressHistoryTitle: string;
  progressWaistLabel: string;
  progressModalTitle: string;
  progressModalSubtitle: string;
  progressWeightField: string;
  progressWaistField: string;
  progressNoteField: string;
  progressNotePlaceholder: string;
  progressCancel: string;
  progressSave: string;
  progressTransformTitle: string;
  progressLostPill: string;
  progressFromWord: string;
  progressToWord: string;

  // BadgesView
  badgesHeaderTitle: string;
  badgesShareCelebrateTitle: string;
  badgesHeroBravo: string;
  badgesHeroSubtext: string;
  badgesTile1Top: string;
  badgesTile1Sub: string;
  badgesTile2Top: string;
  badgesTile2Sub: string;
  badgesTile3Top: string;
  badgesTile3Sub: string;
  badgesTile4Top: string;
  badgesTile4Sub: string;
  badgesTile5Top: string;
  badgesTile5Sub: string;
  badgesTile6Top: string;
  badgesTile6Sub: string;
  badgesFooterEncouragement: string;
  badgesViewChallenges: string;
  badgesChallengesWord: string;
  badgesUnlockedWord: string;
  badgesDonePill: string;
  badgesItems: Record<string, { title: string; description: string }>;
  badgesRemindersTitle: string;
  badgesRemindersSub: string;
  badgesVoiceBannerTitle: string;
  badgesActiveBadge: string;
  badgesVoiceBannerDesc: string;
  badgesStopVoice: string;
  badgesListenCoach: string;
  badgesEverydayAt: string;
  badgesTtsLabel: string;
  badgesStop: string;
  badgesTestVoice: string;
  badgesReminderSpeechPrefix: string;
  badgesReminderSpeechBody: string;
  badgesRemindersItems: Record<string, { title: string; subtitle: string }>;

  // ProfileView
  profileMemberSince: string;
  profileSettingsTitle: string;
  profileMyGoal: string;
  profileGoalLose5: string;
  profileEditGoalTitle: string;
  profileRemainingPrefix: string;
  profileDailyTipsTitle: string;
  profileDailyTipAlt: string;
  profileDailyTipText: string;
  profileMenuUnsubscribe: string;
  profileMenuTrial: string;
  profileUnsubscribeBtn: string;
  profilePaymentRequiredBadge: string;
  profileDaysShort: string;
  profileMyStats: string;
  profileMySettings: string;
  profileBadgesAndReminders: string;
  profileFaqHelp: string;
  profileFaq1Title: string;
  profileFaq1Body: string;
  profileFaq2Title: string;
  profileFaq2Body: string;
  profileFaq3Title: string;
  profileFaq3Body: string;
  profileCancelSuccess: string;
  profilePortalMissingEmail: string;
  profilePortalUnavailable: string;
  profilePortalConnError: string;
  profileSubTitle: string;
  profileSubSubtitle: string;
  profileStatusPremium: string;
  profileStatusPaymentRequired: string;
  profileStatusTrial: string;
  profilePortalReady: string;
  profileOpenPortalBtn: string;
  profileUnsubscribeFullBtn: string;
  profileManageInvoicesBtn: string;
  profilePlanLabel: string;
  profilePlanName: string;
  profilePlanPrice: string;
  profileBillingStatusLabel: string;
  profileStripeSecure: string;
  profileCancelOneClick: string;
  profileYourRightsTitle: string;
  profileYourRightsBody: string;
  profileTrialEndedTitle: string;
  profileTrialOngoingPrefix: string;
  profileDaySingular: string;
  profileDayPlural: string;
  profileTrialEndedDesc: string;
  profileTrialOngoingDesc: string;
  profilePayToContinueBtn: string;
  profileActivatePremiumBtn: string;
  profileMetabolismTitle: string;
  profileMifflinBadge: string;
  profileBmrLabel: string;
  profileBmrSub: string;
  profileTdeeLabel: string;
  profileTdeeSub: string;
  profileTargetDeficitLabel: string;
  profileTargetDeficitSub: string;
  profileBmiLabel: string;
  profileBmiCategories: {
    underweight: string;
    normal: string;
    overweight: string;
    obese: string;
  };
  profilePersonalInfoTitle: string;
  profileFieldName: string;
  profileFieldAge: string;
  profileFieldSex: string;
  profileSexFemale: string;
  profileSexMale: string;
  profileFieldHeight: string;
  profileFieldCurrentWeight: string;
  profileFieldTargetWeight: string;
  profileFieldActivity: string;
  profileActSedentary: string;
  profileActLight: string;
  profileActModerate: string;
  profileActVery: string;
  profileActExtreme: string;
  profileFieldGoal: string;
  profileGoalLose: string;
  profileGoalMaintain: string;
  profileGoalGain: string;
  profileFieldDiet: string;
  profileDietStandard: string;
  profileDietGlutenFree: string;
  profileDietVegetarian: string;
  profileDietVegan: string;
  profileDietPescatarian: string;
  profileDietKeto: string;
  profileFieldWaterTarget: string;
  profileFieldStepTarget: string;
  profileStepRecommended: string;
  profileAccountStatusTitle: string;
  profileBadgePremiumActive: string;
  profileBadgeTrialExpired: string;
  profileBadgeTrialDaysLeft: string;
  profileCountdownLabel: string;
  profileCountdownExpired: string;
  profileCountdownDayWord: string;
  profileTrialExpiredWarning: string;
  profileTrialVerified: string;
  profileZeroBilled: string;
  profileGooglePlayTitle: string;
  profileGooglePlayBtn: string;
  profileWatchTitle: string;
  profileWatchUnconfigured: string;
  profileWatchLastSync: string;
  profileWatchManageBtn: string;
  profileWatchConnectBtn: string;
  profileVoiceAutoTitle: string;
  profileEnabled: string;
  profileDisabled: string;
  profileVoiceAutoDesc: string;
  profileLangSubtitle: string;
  profileAccountSynced: string;
  profileGuestMode: string;
  profileCreateAccount: string;
  profileCreatorCredit: string;
  profileCancelModalTitle: string;
  profileCancelModalQuestion: string;
  profileCancelPerk1Title: string;
  profileCancelPerk1Body: string;
  profileCancelPerk2Title: string;
  profileCancelPerk2Body: string;
  profileCancelPerk3Title: string;
  profileCancelPerk3Body: string;
  profileKeepSubBtn: string;
  profileCancellingBtn: string;
  profileConfirmUnsubBtn: string;

  // AiCoachView
  coachBannerTitle: string;
  coachBannerBadge: string;
  coachDropdownTitle: string;
  coachModalHeader: string;
  coachLangsAvailable: string;
  coachSearchPlaceholder: string;
  coachQuickPick: string;
  coachNoLangFound: string;
  coachUniversalBtn: string;
  coachPolyglotHint: string;
  coachHeaderTitle: string;
  coachOnlineStatus: string;
  coachMoreOptionsTitle: string;
  coachTabChat: string;
  coachTabScan: string;
  coachTabMenu: string;
  coachBoldLabel: string;
  coachBoldOn: string;
  coachBoldOff: string;
  coachBoldTooltip: string;
  coachBoldEnabledTitle: string;
  coachBoldDisabledTitle: string;
  coachVoiceAskBtn: string;
  coachVoiceAskTooltip: string;
  coachSuggestionsLabel: string;
  coachYogurtTitle: string;
  coachYogurtFoodName: string;
  coachYogurtAlt: string;
  coachAddBtn: string;
  coachListenVoice: string;
  coachListenVoiceTitle: string;
  coachThinking: string;
  coachChatInputPlaceholder: string;
  coachSendTitle: string;
  coachCameraBlocked: string;
  coachCameraCaptureErr: string;
  coachPhotoLoadErr: string;
  coachPhotoAnalyzeErr: string;
  coachPhotoDefaultFood: string;
  coachPhotoStdPortion: string;
  coachPhotoSuccessMsg: string;
  coachPhotoTitle: string;
  coachPhotoSubtitle: string;
  coachTakePhoto: string;
  coachGalleryFile: string;
  coachCapturePlate: string;
  coachPhotoReady: string;
  coachPhotoDropzoneTitle: string;
  coachPhotoDropzoneFormats: string;
  coachExtraNoteLabel: string;
  coachExtraNotePlaceholder: string;
  coachAnalyzing: string;
  coachAnalyzeBtn: string;
  coachResultTitle: string;
  coachEstimatedPortion: string;
  coachMacroP: string;
  coachMacroC: string;
  coachMacroF: string;
  coachSaveInto: string;
  coachAddedSuccess: string;
  coachAddToJournal: string;
  coachResultEmpty: string;
  coachMenuTitle: string;
  coachMenuSubtitle: string;
  coachMenuCalTarget: string;
  coachMenuDietPref: string;
  coachMenuPrefStandard: string;
  coachMenuPrefVeg: string;
  coachMenuPrefGlutenFree: string;
  coachMenuPrefKeto: string;
  coachMenuGenerateBtn: string;
  coachMenuSuggestedPrefix: string;
  coachMenuAiTipPrefix: string;
  coachMenuDefaultTip: string;
  coachMenuFallbackBreakfast: string;
  coachMenuFallbackBreakfastDesc: string;
  coachMenuFallbackLunch: string;
  coachMenuFallbackLunchDesc: string;
  coachMenuFallbackSnack: string;
  coachMenuFallbackSnackDesc: string;
  coachMenuFallbackDinner: string;
  coachMenuFallbackDinnerDesc: string;
  coachStarterMsg1Prefix: string;
  coachStarterMsg1Body: string;
  coachStarterMsg2: string;
  coachStarterMsg3: string;
}

export const WLN_FR: UiWellnessDict = {
  progressHeaderTitle: 'Mon évolution',
  progressCalendarTitle: 'Calendrier des pesées & nouvelle pesée',
  progressTabWeight: 'Poids',
  progressTabCalories: 'Calories',
  progressTabHydration: 'Hydratation',
  progressWeekPrefix: 'S',
  progressBravo: 'Bravo !',
  progressLostSinceStart: 'depuis le début',
  progressGoalsTitle: 'Vos objectifs',
  progressViewAll: 'Voir tout ›',
  progressOverWeeks: 'sur 8 semaines',
  progressDaysUnit: 'jours',
  progressActiveStreak: 'série active',
  progressWaterPerDay: "d'eau / jour",
  progressEncouragementBanner: 'Vous êtes sur la bonne voie ! Continuez, vous y arriverez 💚',
  progressRecordWeighInCta: 'Enregistrer une nouvelle pesée',
  progressChartTitle: 'Évolution Graphique du Poids',
  progressTargetGoalLabel: 'Objectif visé :',
  progressModeSpline: 'Courbe',
  progressModeSplineTitle: 'Courbe fluide et lumineuse',
  progressModeBars: 'Barres',
  progressModeBarsTitle: 'Histogramme coloré',
  progressThemeAurora: 'Aurore',
  progressThemeSunset: 'Sunset',
  progressThemeElectric: 'Néon',
  progressWeighInLabel: 'Pesée :',
  progressDeltaLabel: 'Évolution :',
  progressTargetSvgPrefix: '🎯 CIBLE',
  progressMinSvg: 'MIN',
  progressLegendSpline: 'Courbe lissée',
  progressLegendTarget: 'Cible',
  progressLegendLow: 'Record bas',
  progressTouchInspect: 'Touchez un point pour inspecter',
  progressPhotosTitle: 'Photos Avant / Après',
  progressModeSlider: 'Mode Curseur ↔',
  progressModeSideBySide: 'Vue Côte à Côte',
  progressFullscreenTitle: 'Plein écran',
  progressPhotosDesc: "Comparez visuellement votre silhouette pour mesurer l'impact réel de vos efforts.",
  progressImgReadError: 'Erreur de lecture de l’image',
  progressFileReadError: 'Erreur de lecture du fichier',
  progressPhotoLoadError: "Impossible de charger l'image. Essayez un autre format (JPG ou PNG).",
  progressClose: 'Fermer',
  progressPhotoAfterAlt: 'Après',
  progressPhotoBeforeAlt: 'Avant',
  progressBadgeCurrent: 'ACTUEL',
  progressBadgeBefore: 'AVANT',
  progressDragSlider: 'Glissez le curseur de gauche à droite pour comparer',
  progressDiffKg: "kg d'écart",
  progressDeletePhotoTitle: 'Supprimer la photo',
  progressChangePhoto: 'Changer la photo',
  progressLoading: 'Chargement...',
  progressAddPhoto: 'Ajouter photo',
  progressGalleryOrDevice: 'Galerie ou appareil',
  progressStartDateFallback: 'Date de départ',
  progressRecentPhoto: 'Photo récente',
  progressLostUnit: 'kg perdus !',
  progressPrivacyNote: '🔒 Vos photos restent 100% privées sur votre appareil.',
  progressLoadDemoPhotos: "Charger des photos d'exemple",
  progressHistoryTitle: 'Historique des Pesées',
  progressWaistLabel: 'Taille :',
  progressModalTitle: 'Nouvelle pesée',
  progressModalSubtitle: 'Enregistrez votre poids et tour de taille pour mettre à jour vos graphiques.',
  progressWeightField: 'Poids (kg) *',
  progressWaistField: 'Tour de taille (cm - optionnel)',
  progressNoteField: 'Note personnelle',
  progressNotePlaceholder: 'ex: Pesée à jeun du matin',
  progressCancel: 'Annuler',
  progressSave: 'Enregistrer',
  progressTransformTitle: 'Transformation Corporelle',
  progressLostPill: 'kg perdus',
  progressFromWord: 'De',
  progressToWord: 'à',

  badgesHeaderTitle: 'Mes réussites',
  badgesShareCelebrateTitle: 'Partager mes réussites & fêter',
  badgesHeroBravo: 'Bravo',
  badgesHeroSubtext: 'Vous avez atteint 5 objectifs ! Félicitations pour votre régularité ✨',
  badgesTile1Top: '5 jours',
  badgesTile1Sub: 'actifs',
  badgesTile2Top: '2 L',
  badgesTile2Sub: "d'eau/jour",
  badgesTile3Top: 'Menu',
  badgesTile3Sub: 'équilibré',
  badgesTile4Top: '- 2 kg',
  badgesTile4Sub: 'atteints',
  badgesTile5Top: '1 semaine',
  badgesTile5Sub: 'au top',
  badgesTile6Top: 'Sérénité',
  badgesTile6Sub: 'zen & équilibre',
  badgesFooterEncouragement: 'Vous êtes incroyable ! Continuez à prendre soin de vous.',
  badgesViewChallenges: 'Consulter les',
  badgesChallengesWord: 'défis et niveaux',
  badgesUnlockedWord: 'débloqués',
  badgesDonePill: 'Fait',
  badgesItems: {
    b1: { title: 'Premier Pas', description: "Enregistrer votre première pesée sur l'application." },
    b2: { title: 'Champion Hydratation', description: "Atteindre votre objectif de 8 verres d'eau par jour." },
    b3: { title: 'Série de 5 Jours 🔥', description: 'Remplir votre journal alimentaire pendant 5 jours consécutifs.' },
    b4: { title: 'Marcheur Régulier', description: 'Franchir le cap des 10 000 pas en une seule journée.' },
    b5: { title: 'Cap des -5 kg 🎯', description: 'Perdre 5 kilogrammes depuis votre poids de départ.' },
    b6: { title: 'Gourmet Équilibré', description: 'Ajouter 10 recettes favorites à votre menu.' },
  },
  badgesRemindersTitle: 'Rappels Quotidiens & Mode Vocal',
  badgesRemindersSub: 'Restez régulier sans effort',
  badgesVoiceBannerTitle: "🎙️ Rappel Vocal du Coach : « Que vas-tu manger aujourd'hui ? »",
  badgesActiveBadge: 'Actif',
  badgesVoiceBannerDesc: 'Le Coach IA vous interpelle de vive voix pour vous demander votre repas et vous aider à garder le cap sur vos calories !',
  badgesStopVoice: 'Arrêter la voix',
  badgesListenCoach: '🔊 Écouter la voix du Coach',
  badgesEverydayAt: 'Tous les jours à',
  badgesTtsLabel: 'Synthèse vocale IA',
  badgesStop: 'Arrêter',
  badgesTestVoice: 'Tester la voix',
  badgesReminderSpeechPrefix: 'Bonjour',
  badgesReminderSpeechBody: "C'est votre rappel NutriCoach :",
  badgesRemindersItems: {
    r1: { title: "Boire un verre d'eau 💧", subtitle: 'Pensez à bien vous hydrater régulièrement' },
    r2: { title: 'Rappel Repas : Que vas-tu manger ? 🍽️', subtitle: 'Rappel vocal du Coach IA pour enregistrer votre repas' },
    r3: { title: 'Pause Marche Active 🚶', subtitle: 'Objectif 10 000 pas : bougez quelques minutes !' },
    r4: { title: 'Pesée Hebdomadaire ⚖️', subtitle: 'Suivez la tendance de votre poids le dimanche' },
  },

  profileMemberSince: 'Membre depuis 12 semaines 🌸',
  profileSettingsTitle: 'Paramètres du profil',
  profileMyGoal: 'Mon objectif',
  profileGoalLose5: 'Perdre 5 kg',
  profileEditGoalTitle: "Modifier l'objectif",
  profileRemainingPrefix: 'Il vous reste',
  profileDailyTipsTitle: 'Mes conseils du jour',
  profileDailyTipAlt: 'Légumes frais',
  profileDailyTipText: 'Privilégiez les légumes à chaque repas : ils sont riches en nutriments et peu caloriques !',
  profileMenuUnsubscribe: 'Mon abonnement • Se désabonner',
  profileMenuTrial: 'Abonnement & Essai 30 jours',
  profileUnsubscribeBtn: 'Se désabonner',
  profilePaymentRequiredBadge: 'Paiement requis',
  profileDaysShort: 'j / 30',
  profileMyStats: 'Mes statistiques',
  profileMySettings: 'Mes paramètres',
  profileBadgesAndReminders: 'Badges, Défis & Rappels',
  profileFaqHelp: 'FAQ & Aide',
  profileFaq1Title: '📸 Scanner un repas ou code-barres :',
  profileFaq1Body: "Utilisez les boutons rapides sur l'écran d'accueil ou dans le Journal alimentaire.",
  profileFaq2Title: '💳 Essai & abonnement :',
  profileFaq2Body: "30 jours d'essai gratuit, puis abonnement requis (4,99 €/mois ou 39,99 €/an, résiliable à tout moment) pour continuer à utiliser l'application.",
  profileFaq3Title: '📱 Ouvrir en plein écran :',
  profileFaq3Body: "Appuyez sur « Mode Appli » dans la barre du haut pour installer NutriCoach sur votre écran d'accueil.",
  profileCancelSuccess: 'Votre abonnement a été résilié avec succès. Aucun prélèvement futur ne sera effectué.',
  profilePortalMissingEmail: 'Veuillez renseigner une adresse email pour accéder au portail Stripe.',
  profilePortalUnavailable: 'Portail Stripe non disponible en mode local ou configuration Stripe incomplète. Vous pouvez résilier directement ci-dessous en un clic.',
  profilePortalConnError: 'Erreur de connexion avec le portail Stripe. Utilisez le bouton direct de désabonnement.',
  profileSubTitle: 'Abonnement & Facturation',
  profileSubSubtitle: 'Gestion en toute transparence • Résiliation libre sans frais',
  profileStatusPremium: 'Premium Actif',
  profileStatusPaymentRequired: 'Paiement Requis',
  profileStatusTrial: 'Essai Gratuit',
  profilePortalReady: 'Votre portail Stripe est prêt :',
  profileOpenPortalBtn: 'Ouvrir le portail Stripe',
  profileUnsubscribeFullBtn: 'Se désabonner de NutriCoach',
  profileManageInvoicesBtn: 'Gérer mes factures & cartes (Stripe)',
  profilePlanLabel: 'Formule souscrite',
  profilePlanName: 'NutriCoach Premium',
  profilePlanPrice: '4,99 € / mois (Sans engagement)',
  profileBillingStatusLabel: 'Statut des prélèvements',
  profileStripeSecure: 'Paiement sécurisé Stripe',
  profileCancelOneClick: 'Résiliable à tout instant en 1 clic',
  profileYourRightsTitle: 'Vos droits :',
  profileYourRightsBody: 'Vous pouvez résilier votre abonnement à tout moment sans aucun préavis ni frais. Votre accès reste actif pour la période déjà payée et aucun nouveau prélèvement ne sera effectué.',
  profileTrialEndedTitle: 'Essai de 30 jours terminé — Abonnement requis',
  profileTrialOngoingPrefix: "Période d'essai gratuit en cours",
  profileDaySingular: 'jour restant',
  profileDayPlural: 'jours restants',
  profileTrialEndedDesc: "Il n’y a pas de formule gratuite après la période d’essai. Activez votre abonnement (4,99 €/mois ou 39,99 €/an) pour continuer à utiliser NutriCoach.",
  profileTrialOngoingDesc: "Aucun prélèvement pendant les 30 jours d’essai. Au bout des 30 jours, un abonnement (4,99 €/mois ou 39,99 €/an) vous sera demandé pour continuer à utiliser l’application.",
  profilePayToContinueBtn: 'Payer pour continuer (4,99 €/mois)',
  profileActivatePremiumBtn: 'Activer Premium (4,99 €/mois)',
  profileMetabolismTitle: 'Calcul Automatique du Métabolisme & Calories',
  profileMifflinBadge: 'Formule Mifflin-St Jeor',
  profileBmrLabel: 'Métabolisme de base (BMR)',
  profileBmrSub: 'Besoins au repos total',
  profileTdeeLabel: 'Dépense Totale (TDEE)',
  profileTdeeSub: "Selon niveau d'activité",
  profileTargetDeficitLabel: 'Cible Déficit Calorique',
  profileTargetDeficitSub: 'Pour perte de poids douce',
  profileBmiLabel: 'Indice IMC',
  profileBmiCategories: {
    underweight: 'Insuffisance pondérale',
    normal: 'Poids idéal / Normal',
    overweight: 'Surpoids léger',
    obese: 'Obésité',
  },
  profilePersonalInfoTitle: 'Informations Personnelles',
  profileFieldName: 'Prénom',
  profileFieldAge: 'Âge (ans)',
  profileFieldSex: 'Sexe',
  profileSexFemale: 'Femme',
  profileSexMale: 'Homme',
  profileFieldHeight: 'Taille (cm)',
  profileFieldCurrentWeight: 'Poids actuel (kg)',
  profileFieldTargetWeight: 'Poids objectif (kg)',
  profileFieldActivity: "Niveau d'activité physique",
  profileActSedentary: 'Sédentaire (Bureau, peu de marche)',
  profileActLight: 'Légèrement actif (Marche 1-3x/semaine)',
  profileActModerate: 'Modérément actif (Sport 3-5x/semaine)',
  profileActVery: 'Très actif (Sport intense quotidien)',
  profileActExtreme: 'Extrêmement actif (Athlète)',
  profileFieldGoal: 'Objectif principal',
  profileGoalLose: 'Perdre du poids (-0,5 kg/semaine)',
  profileGoalMaintain: 'Maintenir mon poids actuel',
  profileGoalGain: 'Prendre de la masse musculaire',
  profileFieldDiet: 'Régime & Préférence alimentaire',
  profileDietStandard: 'Standard / Tous aliments',
  profileDietGlutenFree: '🌾 Sans Gluten (Gluten-Free)',
  profileDietVegetarian: '🥗 Végétarien',
  profileDietVegan: '🌱 Végétalien / Végan',
  profileDietPescatarian: '🐟 Pescétarien (Poissons & Végétaux)',
  profileDietKeto: '🥑 Low Carb / Cétogène',
  profileFieldWaterTarget: 'Objectif Hydratation (ml)',
  profileFieldStepTarget: 'Objectif de pas par jour',
  profileStepRecommended: 'Recommandé : 8 000 à 10 000 pas / jour',
  profileAccountStatusTitle: 'Statut du Compte & Décompte Essai Gratuit',
  profileBadgePremiumActive: '👑 Abonnement Premium Actif',
  profileBadgeTrialExpired: '🔒 Essai gratuit terminé (0 jour restant)',
  profileBadgeTrialDaysLeft: 'jours restants sur 30',
  profileCountdownLabel: "Compte à rebours de l'essai (30 jours) :",
  profileCountdownExpired: 'Terminé (0 jour restant)',
  profileCountdownDayWord: 'Jour',
  profileTrialExpiredWarning: "⚠️ Période d'essai terminée — Passez à Premium pour continuer.",
  profileTrialVerified: "✨ Inscription validée • Période d'évaluation offerte à 100%",
  profileZeroBilled: '0 € facturé avant la fin des 30 jours',
  profileGooglePlayTitle: 'NutriCoach sur Google Play',
  profileGooglePlayBtn: 'Fiche Google Play',
  profileWatchTitle: 'Montre Connectée & Capteurs',
  profileWatchUnconfigured: 'Non configurée',
  profileWatchLastSync: 'Dernière synchro :',
  profileWatchManageBtn: 'Gérer / Synchroniser',
  profileWatchConnectBtn: 'Connecter ma montre',
  profileVoiceAutoTitle: 'Accueil Vocal Automatique du Coach',
  profileEnabled: 'Activé',
  profileDisabled: 'Désactivé',
  profileVoiceAutoDesc: "Le Coach vous accueille de vive voix à l'ouverture : « Que vas-tu manger aujourd'hui ? »",
  profileLangSubtitle: '21 langues disponibles • Traduction universelle (130+ langues)',
  profileAccountSynced: "Compte synchronisé & Période d'essai activée",
  profileGuestMode: 'Mode invité',
  profileCreateAccount: 'Créer un compte',
  profileCreatorCredit: '✨ Une création de',
  profileCancelModalTitle: 'Confirmer le désabonnement',
  profileCancelModalQuestion: 'Êtes-vous certain(e) de vouloir résilier votre abonnement NutriCoach Premium ?',
  profileCancelPerk1Title: 'Aucun frais de résiliation :',
  profileCancelPerk1Body: 'La résiliation est 100% gratuite et immédiate.',
  profileCancelPerk2Title: 'Arrêt définitif des prélèvements :',
  profileCancelPerk2Body: 'Aucun montant ne sera plus débité sur votre carte.',
  profileCancelPerk3Title: 'Vos données sont préservées :',
  profileCancelPerk3Body: 'Votre profil, vos repas enregistrés et calculs métaboliques restent intacts.',
  profileKeepSubBtn: 'Garder mon abonnement',
  profileCancellingBtn: 'Résiliation en cours...',
  profileConfirmUnsubBtn: 'Confirmer le désabonnement',

  coachBannerTitle: 'Coach Polyglotte',
  coachBannerBadge: '21+ langues',
  coachDropdownTitle: 'Menu déroulant : choisir la langue du Coach polyglotte',
  coachModalHeader: 'Langue du Coach IA',
  coachLangsAvailable: 'langues disponibles',
  coachSearchPlaceholder: 'Rechercher une langue...',
  coachQuickPick: 'Accès rapide :',
  coachNoLangFound: 'Aucune langue trouvée pour',
  coachUniversalBtn: 'Traduction Universelle (130+ langues)',
  coachPolyglotHint: '💡 Le coach IA répondra immédiatement dans cette langue.',
  coachHeaderTitle: 'Mon coach IA',
  coachOnlineStatus: 'En ligne • Conseils personnalisés',
  coachMoreOptionsTitle: 'Options supplémentaires',
  coachTabChat: '💬 Chat',
  coachTabScan: '📸 Scan',
  coachTabMenu: '🥗 Menu',
  coachBoldLabel: 'Texte en gras :',
  coachBoldOn: 'ACTIVÉ',
  coachBoldOff: 'DÉSACTIVÉ',
  coachBoldTooltip: 'Activer ou désactiver le formatage en texte gras',
  coachBoldEnabledTitle: 'Texte en gras activé',
  coachBoldDisabledTitle: 'Activer le texte en gras',
  coachVoiceAskBtn: '🎙️ Que vas-tu manger ? (Vocal)',
  coachVoiceAskTooltip: 'Le Coach vous demande de vive voix ce que vous allez manger',
  coachSuggestionsLabel: 'Suggestions :',
  coachYogurtTitle: 'Yaourt nature, fruits & amandes (~160 kcal)',
  coachYogurtFoodName: 'Yaourt nature, fruits frais & amandes',
  coachYogurtAlt: 'Yaourt aux fruits et amandes',
  coachAddBtn: '+ Noter',
  coachListenVoice: 'Écouter la voix',
  coachListenVoiceTitle: 'Écouter ce conseil de vive voix',
  coachThinking: 'NutriCoach réfléchit...',
  coachChatInputPlaceholder: 'Posez-moi une question...',
  coachSendTitle: 'Envoyer la question',
  coachCameraBlocked: 'Caméra en direct bloquée. Ouverture du sélecteur photo...',
  coachCameraCaptureErr: "Impossible de capturer l'image. Réessayez.",
  coachPhotoLoadErr: 'Impossible de charger cette image.',
  coachPhotoAnalyzeErr: "Impossible d'analyser cette photo pour le moment. Vérifiez votre image ou réessayez.",
  coachPhotoDefaultFood: 'Repas analysé',
  coachPhotoStdPortion: 'Portion standard',
  coachPhotoSuccessMsg: 'Repas analysé avec succès.',
  coachPhotoTitle: 'Scanner Photo IA',
  coachPhotoSubtitle: 'Prenez une photo de votre assiette ou importez une image pour estimer automatiquement les calories et macronutriments.',
  coachTakePhoto: 'Prendre une photo',
  coachGalleryFile: 'Galerie / Fichier',
  coachCapturePlate: 'Capturer mon assiette',
  coachPhotoReady: "Photo prête ! Cliquez pour changer ou lancez l'analyse ci-dessous.",
  coachPhotoDropzoneTitle: 'Appuyez ici pour choisir une photo de votre repas',
  coachPhotoDropzoneFormats: 'JPG, PNG, WebP • Compression automatique',
  coachExtraNoteLabel: 'Précision complémentaire (facultatif)',
  coachExtraNotePlaceholder: 'ex: Pavé de saumon grillé, riz basmati et légumes',
  coachAnalyzing: "Analyse diététique par l'IA en cours...",
  coachAnalyzeBtn: 'Analyser mon repas',
  coachResultTitle: "Résultat d'analyse nutritionnelle",
  coachEstimatedPortion: 'Portion estimée :',
  coachMacroP: 'Protéines',
  coachMacroC: 'Glucides',
  coachMacroF: 'Lipides',
  coachSaveInto: 'Enregistrer dans :',
  coachAddedSuccess: 'Ajouté avec succès au journal !',
  coachAddToJournal: 'Ajouter ce repas à mon journal',
  coachResultEmpty: 'Prenez ou importez une photo de votre assiette puis cliquez sur « Analyser mon repas ».',
  coachMenuTitle: 'Générateur de Menus Sur-Mesure',
  coachMenuSubtitle: 'Générez un menu équilibré complet (Petit-déjeuner, Déjeuner, Collation, Dîner) adapté exactement à vos calories cibles.',
  coachMenuCalTarget: 'Cible Calorique (kcal)',
  coachMenuDietPref: 'Préférence Alimentaire',
  coachMenuPrefStandard: 'Standard Équilibré',
  coachMenuPrefVeg: 'Végétarien',
  coachMenuPrefGlutenFree: 'Sans Gluten',
  coachMenuPrefKeto: 'Low Carb / Protéiné',
  coachMenuGenerateBtn: 'Générer mon Menu',
  coachMenuSuggestedPrefix: 'Menu suggéré (~',
  coachMenuAiTipPrefix: 'Conseil IA :',
  coachMenuDefaultTip: 'Privilégiez une bonne mastication et une hydratation continue.',
  coachMenuFallbackBreakfast: "Porridge d'avoine aux fruits",
  coachMenuFallbackBreakfastDesc: 'Riche en fibres pour un réveil énergisant sans pic glycémique',
  coachMenuFallbackLunch: 'Poulet grillé, quinoa & brocolis',
  coachMenuFallbackLunchDesc: 'Équilibre parfait protéines et glucides lents pour éviter le coup de fatigue',
  coachMenuFallbackSnack: 'Pomme & amandes brutes',
  coachMenuFallbackSnackDesc: 'Collation saine régulant la satiété jusqu’au dîner',
  coachMenuFallbackDinner: 'Poisson blanc & légumes vapeur',
  coachMenuFallbackDinnerDesc: 'Repas léger favorisant un sommeil réparateur et la combustion nocturne',
  coachStarterMsg1Prefix: 'Bonjour',
  coachStarterMsg1Body: "Comment vous sentez-vous aujourd'hui ?",
  coachStarterMsg2: "Plutôt bien, mais j'ai une petite fringale ce matin...",
  coachStarterMsg3: "Pas de souci ! 😊\nVoici une idée saine et gourmande :\n\nUn yaourt nature avec des fruits et quelques amandes.\n\nCela vous apportera de l'énergie sans excès de calories.",
};

export const WLN_EN: UiWellnessDict = {
  progressHeaderTitle: 'My progress',
  progressCalendarTitle: 'Weigh-in calendar & new weigh-in',
  progressTabWeight: 'Weight',
  progressTabCalories: 'Calories',
  progressTabHydration: 'Hydration',
  progressWeekPrefix: 'W',
  progressBravo: 'Well done!',
  progressLostSinceStart: 'since the beginning',
  progressGoalsTitle: 'Your goals',
  progressViewAll: 'See all ›',
  progressOverWeeks: 'over 8 weeks',
  progressDaysUnit: 'days',
  progressActiveStreak: 'active streak',
  progressWaterPerDay: 'water / day',
  progressEncouragementBanner: 'You are on the right track! Keep going, you will make it 💚',
  progressRecordWeighInCta: 'Log a new weigh-in',
  progressChartTitle: 'Weight Evolution Chart',
  progressTargetGoalLabel: 'Target goal:',
  progressModeSpline: 'Curve',
  progressModeSplineTitle: 'Smooth glowing curve',
  progressModeBars: 'Bars',
  progressModeBarsTitle: 'Colored bar chart',
  progressThemeAurora: 'Aurora',
  progressThemeSunset: 'Sunset',
  progressThemeElectric: 'Neon',
  progressWeighInLabel: 'Weigh-in:',
  progressDeltaLabel: 'Change:',
  progressTargetSvgPrefix: '🎯 TARGET',
  progressMinSvg: 'MIN',
  progressLegendSpline: 'Smoothed curve',
  progressLegendTarget: 'Target',
  progressLegendLow: 'Lowest record',
  progressTouchInspect: 'Tap a point to inspect',
  progressPhotosTitle: 'Before / After Photos',
  progressModeSlider: 'Slider Mode ↔',
  progressModeSideBySide: 'Side by Side View',
  progressFullscreenTitle: 'Fullscreen',
  progressPhotosDesc: 'Visually compare your silhouette to measure the real impact of your efforts.',
  progressImgReadError: 'Image reading error',
  progressFileReadError: 'File reading error',
  progressPhotoLoadError: 'Unable to load the image. Try another format (JPG or PNG).',
  progressClose: 'Close',
  progressPhotoAfterAlt: 'After',
  progressPhotoBeforeAlt: 'Before',
  progressBadgeCurrent: 'CURRENT',
  progressBadgeBefore: 'BEFORE',
  progressDragSlider: 'Drag the slider left and right to compare',
  progressDiffKg: 'kg difference',
  progressDeletePhotoTitle: 'Delete photo',
  progressChangePhoto: 'Change photo',
  progressLoading: 'Loading...',
  progressAddPhoto: 'Add photo',
  progressGalleryOrDevice: 'Gallery or camera',
  progressStartDateFallback: 'Start date',
  progressRecentPhoto: 'Recent photo',
  progressLostUnit: 'kg lost!',
  progressPrivacyNote: '🔒 Your photos stay 100% private on your device.',
  progressLoadDemoPhotos: 'Load sample photos',
  progressHistoryTitle: 'Weigh-in History',
  progressWaistLabel: 'Waist:',
  progressModalTitle: 'New weigh-in',
  progressModalSubtitle: 'Log your weight and waist circumference to update your charts.',
  progressWeightField: 'Weight (kg) *',
  progressWaistField: 'Waist size (cm - optional)',
  progressNoteField: 'Personal note',
  progressNotePlaceholder: 'e.g. Morning fasted weigh-in',
  progressCancel: 'Cancel',
  progressSave: 'Save',
  progressTransformTitle: 'Body Transformation',
  progressLostPill: 'kg lost',
  progressFromWord: 'From',
  progressToWord: 'to',

  badgesHeaderTitle: 'My achievements',
  badgesShareCelebrateTitle: 'Share my achievements & celebrate',
  badgesHeroBravo: 'Bravo',
  badgesHeroSubtext: 'You reached 5 goals! Congratulations on your consistency ✨',
  badgesTile1Top: '5 days',
  badgesTile1Sub: 'active',
  badgesTile2Top: '2 L',
  badgesTile2Sub: 'water/day',
  badgesTile3Top: 'Menu',
  badgesTile3Sub: 'balanced',
  badgesTile4Top: '- 2 kg',
  badgesTile4Sub: 'achieved',
  badgesTile5Top: '1 week',
  badgesTile5Sub: 'on top',
  badgesTile6Top: 'Serenity',
  badgesTile6Sub: 'zen & balance',
  badgesFooterEncouragement: 'You are amazing! Keep taking care of yourself.',
  badgesViewChallenges: 'View all',
  badgesChallengesWord: 'challenges and levels',
  badgesUnlockedWord: 'unlocked',
  badgesDonePill: 'Done',
  badgesItems: {
    b1: { title: 'First Step', description: 'Log your very first weigh-in in the app.' },
    b2: { title: 'Hydration Champion', description: 'Reach your daily goal of 8 glasses of water.' },
    b3: { title: '5-Day Streak 🔥', description: 'Complete your food journal for 5 consecutive days.' },
    b4: { title: 'Steady Walker', description: 'Cross the 10,000-step mark in a single day.' },
    b5: { title: '-5 kg Milestone 🎯', description: 'Lose 5 kilograms from your starting weight.' },
    b6: { title: 'Balanced Gourmet', description: 'Add 10 favorite recipes to your menu.' },
  },
  badgesRemindersTitle: 'Daily Reminders & Voice Mode',
  badgesRemindersSub: 'Stay consistent effortlessly',
  badgesVoiceBannerTitle: "🎙️ Coach Voice Reminder: “What are you going to eat today?”",
  badgesActiveBadge: 'Active',
  badgesVoiceBannerDesc: 'The AI Coach speaks to you out loud to ask about your meal and help keep your calories on track!',
  badgesStopVoice: 'Stop voice',
  badgesListenCoach: '🔊 Listen to the Coach voice',
  badgesEverydayAt: 'Every day at',
  badgesTtsLabel: 'AI voice synthesis',
  badgesStop: 'Stop',
  badgesTestVoice: 'Test voice',
  badgesReminderSpeechPrefix: 'Hello',
  badgesReminderSpeechBody: 'This is your NutriCoach reminder:',
  badgesRemindersItems: {
    r1: { title: 'Drink a glass of water 💧', subtitle: 'Remember to stay hydrated regularly' },
    r2: { title: 'Meal Reminder: What will you eat? 🍽️', subtitle: 'AI Coach voice reminder to log your meal' },
    r3: { title: 'Active Walk Break 🚶', subtitle: '10,000-step goal: get moving for a few minutes!' },
    r4: { title: 'Weekly Weigh-In ⚖️', subtitle: 'Track your weight trend every Sunday' },
  },

  profileMemberSince: 'Member for 12 weeks 🌸',
  profileSettingsTitle: 'Profile settings',
  profileMyGoal: 'My goal',
  profileGoalLose5: 'Lose 5 kg',
  profileEditGoalTitle: 'Edit goal',
  profileRemainingPrefix: 'Only',
  profileDailyTipsTitle: 'My daily tips',
  profileDailyTipAlt: 'Fresh vegetables',
  profileDailyTipText: 'Prioritize vegetables at every meal: they are nutrient-dense and low in calories!',
  profileMenuUnsubscribe: 'My subscription • Unsubscribe',
  profileMenuTrial: 'Subscription & 30-day trial',
  profileUnsubscribeBtn: 'Unsubscribe',
  profilePaymentRequiredBadge: 'Payment required',
  profileDaysShort: 'd / 30',
  profileMyStats: 'My statistics',
  profileMySettings: 'My settings',
  profileBadgesAndReminders: 'Badges, Challenges & Reminders',
  profileFaqHelp: 'FAQ & Help',
  profileFaq1Title: '📸 Scan a meal or barcode:',
  profileFaq1Body: 'Use the quick buttons on the home screen or inside the Food Journal.',
  profileFaq2Title: '💳 Trial & subscription:',
  profileFaq2Body: '30-day free trial, then a subscription (€4.99/month or €39.99/year, cancel anytime) is required to keep using the app.',
  profileFaq3Title: '📱 Open fullscreen:',
  profileFaq3Body: 'Tap “App Mode” in the top bar to install NutriCoach on your home screen.',
  profileCancelSuccess: 'Your subscription has been successfully canceled. No future charges will be made.',
  profilePortalMissingEmail: 'Please enter an email address to access the Stripe portal.',
  profilePortalUnavailable: 'Stripe portal unavailable locally or incomplete Stripe setup. You can cancel directly below in one click.',
  profilePortalConnError: 'Error connecting to the Stripe portal. Use the direct unsubscribe button instead.',
  profileSubTitle: 'Subscription & Billing',
  profileSubSubtitle: 'Fully transparent management • Free cancellation anytime',
  profileStatusPremium: 'Premium Active',
  profileStatusPaymentRequired: 'Payment Required',
  profileStatusTrial: 'Free Trial',
  profilePortalReady: 'Your Stripe portal is ready:',
  profileOpenPortalBtn: 'Open Stripe portal',
  profileUnsubscribeFullBtn: 'Unsubscribe from NutriCoach',
  profileManageInvoicesBtn: 'Manage invoices & cards (Stripe)',
  profilePlanLabel: 'Active plan',
  profilePlanName: 'NutriCoach Premium',
  profilePlanPrice: '€4.99 / month (No commitment)',
  profileBillingStatusLabel: 'Billing status',
  profileStripeSecure: 'Stripe secure payment',
  profileCancelOneClick: 'Cancel anytime in 1 click',
  profileYourRightsTitle: 'Your rights:',
  profileYourRightsBody: 'You can cancel your subscription anytime with no notice or fees. Your access remains active for the paid period and no further charge will occur.',
  profileTrialEndedTitle: '30-day trial ended — Subscription required',
  profileTrialOngoingPrefix: 'Free trial active',
  profileDaySingular: 'day remaining',
  profileDayPlural: 'days remaining',
  profileTrialEndedDesc: 'There is no free tier after the trial period. Activate your subscription (€4.99/month or €39.99/year) to continue using NutriCoach.',
  profileTrialOngoingDesc: 'No charge during the 30-day trial. After 30 days, a subscription (€4.99/month or €39.99/year) will be required to continue using the app.',
  profilePayToContinueBtn: 'Pay to continue (€4.99/mo)',
  profileActivatePremiumBtn: 'Activate Premium (€4.99/mo)',
  profileMetabolismTitle: 'Automatic Metabolism & Calorie Calculation',
  profileMifflinBadge: 'Mifflin-St Jeor Formula',
  profileBmrLabel: 'Basal Metabolic Rate (BMR)',
  profileBmrSub: 'Total resting needs',
  profileTdeeLabel: 'Total Expenditure (TDEE)',
  profileTdeeSub: 'Based on activity level',
  profileTargetDeficitLabel: 'Calorie Deficit Target',
  profileTargetDeficitSub: 'For gentle weight loss',
  profileBmiLabel: 'BMI Index',
  profileBmiCategories: {
    underweight: 'Underweight',
    normal: 'Healthy / Normal',
    overweight: 'Slightly overweight',
    obese: 'Obese',
  },
  profilePersonalInfoTitle: 'Personal Information',
  profileFieldName: 'First name',
  profileFieldAge: 'Age (years)',
  profileFieldSex: 'Sex',
  profileSexFemale: 'Female',
  profileSexMale: 'Male',
  profileFieldHeight: 'Height (cm)',
  profileFieldCurrentWeight: 'Current weight (kg)',
  profileFieldTargetWeight: 'Target weight (kg)',
  profileFieldActivity: 'Physical activity level',
  profileActSedentary: 'Sedentary (Desk job, little walking)',
  profileActLight: 'Lightly active (Walk 1-3x/week)',
  profileActModerate: 'Moderately active (Exercise 3-5x/week)',
  profileActVery: 'Very active (Daily intense workout)',
  profileActExtreme: 'Extremely active (Athlete)',
  profileFieldGoal: 'Main goal',
  profileGoalLose: 'Lose weight (-0.5 kg/week)',
  profileGoalMaintain: 'Maintain current weight',
  profileGoalGain: 'Build muscle mass',
  profileFieldDiet: 'Diet & Food preference',
  profileDietStandard: 'Standard / All foods',
  profileDietGlutenFree: '🌾 Gluten-Free',
  profileDietVegetarian: '🥗 Vegetarian',
  profileDietVegan: '🌱 Vegan',
  profileDietPescatarian: '🐟 Pescatarian (Fish & Plants)',
  profileDietKeto: '🥑 Low Carb / Keto',
  profileFieldWaterTarget: 'Hydration target (ml)',
  profileFieldStepTarget: 'Daily step goal',
  profileStepRecommended: 'Recommended: 8,000 to 10,000 steps / day',
  profileAccountStatusTitle: 'Account Status & Free Trial Countdown',
  profileBadgePremiumActive: '👑 Active Premium Subscription',
  profileBadgeTrialExpired: '🔒 Free trial ended (0 days left)',
  profileBadgeTrialDaysLeft: 'days left out of 30',
  profileCountdownLabel: 'Trial countdown (30 days):',
  profileCountdownExpired: 'Ended (0 days left)',
  profileCountdownDayWord: 'Day',
  profileTrialExpiredWarning: '⚠️ Trial period ended — Upgrade to Premium to continue.',
  profileTrialVerified: '✨ Registration verified • 100% complimentary evaluation period',
  profileZeroBilled: '€0 billed before the end of 30 days',
  profileGooglePlayTitle: 'NutriCoach on Google Play',
  profileGooglePlayBtn: 'Google Play Listing',
  profileWatchTitle: 'Smartwatch & Sensors',
  profileWatchUnconfigured: 'Not configured',
  profileWatchLastSync: 'Last sync:',
  profileWatchManageBtn: 'Manage / Sync',
  profileWatchConnectBtn: 'Connect my watch',
  profileVoiceAutoTitle: 'Automatic Coach Voice Greeting',
  profileEnabled: 'Enabled',
  profileDisabled: 'Disabled',
  profileVoiceAutoDesc: 'The Coach greets you out loud on launch: “What are you going to eat today?”',
  profileLangSubtitle: '21 built-in languages • Universal translation (130+ languages)',
  profileAccountSynced: 'Account synced & Trial active',
  profileGuestMode: 'Guest mode',
  profileCreateAccount: 'Create an account',
  profileCreatorCredit: '✨ Created by',
  profileCancelModalTitle: 'Confirm unsubscription',
  profileCancelModalQuestion: 'Are you sure you want to cancel your NutriCoach Premium subscription?',
  profileCancelPerk1Title: 'No cancellation fee:',
  profileCancelPerk1Body: 'Cancellation is 100% free and immediate.',
  profileCancelPerk2Title: 'Permanent stop of charges:',
  profileCancelPerk2Body: 'No further amount will be billed to your card.',
  profileCancelPerk3Title: 'Your data is preserved:',
  profileCancelPerk3Body: 'Your profile, logged meals and metabolic calculations remain intact.',
  profileKeepSubBtn: 'Keep my subscription',
  profileCancellingBtn: 'Canceling...',
  profileConfirmUnsubBtn: 'Confirm unsubscription',

  coachBannerTitle: 'Polyglot Coach',
  coachBannerBadge: '21+ languages',
  coachDropdownTitle: 'Dropdown: choose Polyglot Coach language',
  coachModalHeader: 'AI Coach Language',
  coachLangsAvailable: 'languages available',
  coachSearchPlaceholder: 'Search a language...',
  coachQuickPick: 'Quick access:',
  coachNoLangFound: 'No language found for',
  coachUniversalBtn: 'Universal Translation (130+ languages)',
  coachPolyglotHint: '💡 The AI coach will reply immediately in this language.',
  coachHeaderTitle: 'My AI Coach',
  coachOnlineStatus: 'Online • Personalized advice',
  coachMoreOptionsTitle: 'More options',
  coachTabChat: '💬 Chat',
  coachTabScan: '📸 Scan',
  coachTabMenu: '🥗 Menu',
  coachBoldLabel: 'Bold text:',
  coachBoldOn: 'ON',
  coachBoldOff: 'OFF',
  coachBoldTooltip: 'Enable or disable bold text formatting',
  coachBoldEnabledTitle: 'Bold text enabled',
  coachBoldDisabledTitle: 'Enable bold text',
  coachVoiceAskBtn: '🎙️ What will you eat? (Voice)',
  coachVoiceAskTooltip: 'The Coach asks you out loud what you plan to eat',
  coachSuggestionsLabel: 'Suggestions:',
  coachYogurtTitle: 'Plain yogurt, fruit & almonds (~160 kcal)',
  coachYogurtFoodName: 'Plain yogurt, fresh fruit & almonds',
  coachYogurtAlt: 'Yogurt with fruit and almonds',
  coachAddBtn: '+ Log',
  coachListenVoice: 'Listen',
  coachListenVoiceTitle: 'Listen to this advice out loud',
  coachThinking: 'NutriCoach is thinking...',
  coachChatInputPlaceholder: 'Ask me a question...',
  coachSendTitle: 'Send question',
  coachCameraBlocked: 'Live camera blocked. Opening photo picker...',
  coachCameraCaptureErr: 'Unable to capture image. Please try again.',
  coachPhotoLoadErr: 'Unable to load this image.',
  coachPhotoAnalyzeErr: 'Unable to analyze this photo right now. Please check your image or try again.',
  coachPhotoDefaultFood: 'Analyzed meal',
  coachPhotoStdPortion: 'Standard portion',
  coachPhotoSuccessMsg: 'Meal analyzed successfully.',
  coachPhotoTitle: 'AI Photo Scanner',
  coachPhotoSubtitle: 'Take a photo of your plate or upload an image to automatically estimate calories and macronutrients.',
  coachTakePhoto: 'Take a photo',
  coachGalleryFile: 'Gallery / File',
  coachCapturePlate: 'Capture my plate',
  coachPhotoReady: 'Photo ready! Click to change or start the analysis below.',
  coachPhotoDropzoneTitle: 'Tap here to choose a photo of your meal',
  coachPhotoDropzoneFormats: 'JPG, PNG, WebP • Auto compression',
  coachExtraNoteLabel: 'Extra details (optional)',
  coachExtraNotePlaceholder: 'e.g. Grilled salmon fillet, basmati rice and vegetables',
  coachAnalyzing: 'AI nutritional analysis in progress...',
  coachAnalyzeBtn: 'Analyze my meal',
  coachResultTitle: 'Nutritional analysis result',
  coachEstimatedPortion: 'Estimated portion:',
  coachMacroP: 'Protein',
  coachMacroC: 'Carbs',
  coachMacroF: 'Fat',
  coachSaveInto: 'Save to:',
  coachAddedSuccess: 'Successfully added to journal!',
  coachAddToJournal: 'Add this meal to my journal',
  coachResultEmpty: 'Take or upload a photo of your plate then click “Analyze my meal”.',
  coachMenuTitle: 'Custom Menu Generator',
  coachMenuSubtitle: 'Generate a complete balanced daily menu (Breakfast, Lunch, Snack, Dinner) tailored to your calorie goal.',
  coachMenuCalTarget: 'Calorie Target (kcal)',
  coachMenuDietPref: 'Dietary Preference',
  coachMenuPrefStandard: 'Balanced Standard',
  coachMenuPrefVeg: 'Vegetarian',
  coachMenuPrefGlutenFree: 'Gluten-Free',
  coachMenuPrefKeto: 'Low Carb / High Protein',
  coachMenuGenerateBtn: 'Generate my Menu',
  coachMenuSuggestedPrefix: 'Suggested menu (~',
  coachMenuAiTipPrefix: 'AI Tip:',
  coachMenuDefaultTip: 'Remember to chew thoroughly and stay hydrated throughout the day.',
  coachMenuFallbackBreakfast: 'Oatmeal porridge with berries',
  coachMenuFallbackBreakfastDesc: 'High in fiber for an energizing morning without blood sugar spikes',
  coachMenuFallbackLunch: 'Grilled chicken, quinoa & broccoli',
  coachMenuFallbackLunchDesc: 'Perfect balance of protein and slow carbs to avoid afternoon slumps',
  coachMenuFallbackSnack: 'Apple & raw almonds',
  coachMenuFallbackSnackDesc: 'Healthy snack keeping you satisfied until dinner',
  coachMenuFallbackDinner: 'White fish & steamed vegetables',
  coachMenuFallbackDinnerDesc: 'Light meal supporting restful sleep and overnight recovery',
  coachStarterMsg1Prefix: 'Hello',
  coachStarterMsg1Body: 'How are you feeling today?',
  coachStarterMsg2: 'Pretty good, though I have a slight morning craving...',
  coachStarterMsg3: 'No worries! 😊\nHere is a healthy, tasty idea:\n\nPlain yogurt with fresh fruit and a few almonds.\n\nIt will give you steady energy without excess calories.',
};

export const WLN_ES: UiWellnessDict = {
  progressHeaderTitle: 'Mi evolución',
  progressCalendarTitle: 'Calendario de pesajes y nuevo pesaje',
  progressTabWeight: 'Peso',
  progressTabCalories: 'Calorías',
  progressTabHydration: 'Hidratación',
  progressWeekPrefix: 'S',
  progressBravo: '¡Bravo!',
  progressLostSinceStart: 'desde el inicio',
  progressGoalsTitle: 'Tus objetivos',
  progressViewAll: 'Ver todo ›',
  progressOverWeeks: 'en 8 semanas',
  progressDaysUnit: 'días',
  progressActiveStreak: 'racha activa',
  progressWaterPerDay: 'agua / día',
  progressEncouragementBanner: '¡Vas por buen camino! Sigue así, lo lograrás 💚',
  progressRecordWeighInCta: 'Registrar un nuevo pesaje',
  progressChartTitle: 'Evolución Gráfica del Peso',
  progressTargetGoalLabel: 'Objetivo marcado:',
  progressModeSpline: 'Curva',
  progressModeSplineTitle: 'Curva fluida y luminosa',
  progressModeBars: 'Barras',
  progressModeBarsTitle: 'Histograma colorido',
  progressThemeAurora: 'Aurora',
  progressThemeSunset: 'Sunset',
  progressThemeElectric: 'Neón',
  progressWeighInLabel: 'Pesaje:',
  progressDeltaLabel: 'Evolución:',
  progressTargetSvgPrefix: '🎯 META',
  progressMinSvg: 'MÍN',
  progressLegendSpline: 'Curva suavizada',
  progressLegendTarget: 'Meta',
  progressLegendLow: 'Récord mínimo',
  progressTouchInspect: 'Toca un punto para inspeccionar',
  progressPhotosTitle: 'Fotos Antes / Después',
  progressModeSlider: 'Modo Deslizador ↔',
  progressModeSideBySide: 'Vista Lado a Lado',
  progressFullscreenTitle: 'Pantalla completa',
  progressPhotosDesc: 'Compara visualmente tu silueta para medir el impacto real de tu esfuerzo.',
  progressImgReadError: 'Error al leer la imagen',
  progressFileReadError: 'Error al leer el archivo',
  progressPhotoLoadError: 'No se pudo cargar la imagen. Prueba otro formato (JPG o PNG).',
  progressClose: 'Cerrar',
  progressPhotoAfterAlt: 'Después',
  progressPhotoBeforeAlt: 'Antes',
  progressBadgeCurrent: 'ACTUAL',
  progressBadgeBefore: 'ANTES',
  progressDragSlider: 'Desliza el cursor de izquierda a derecha para comparar',
  progressDiffKg: 'kg de diferencia',
  progressDeletePhotoTitle: 'Eliminar foto',
  progressChangePhoto: 'Cambiar foto',
  progressLoading: 'Cargando...',
  progressAddPhoto: 'Añadir foto',
  progressGalleryOrDevice: 'Galería o cámara',
  progressStartDateFallback: 'Fecha de inicio',
  progressRecentPhoto: 'Foto reciente',
  progressLostUnit: 'kg perdidos!',
  progressPrivacyNote: '🔒 Tus fotos permanecen 100% privadas en tu dispositivo.',
  progressLoadDemoPhotos: 'Cargar fotos de ejemplo',
  progressHistoryTitle: 'Historial de Pesajes',
  progressWaistLabel: 'Cintura:',
  progressModalTitle: 'Nuevo pesaje',
  progressModalSubtitle: 'Registra tu peso y contorno de cintura para actualizar tus gráficos.',
  progressWeightField: 'Peso (kg) *',
  progressWaistField: 'Contorno de cintura (cm - opcional)',
  progressNoteField: 'Nota personal',
  progressNotePlaceholder: 'ej: Pesaje en ayunas por la mañana',
  progressCancel: 'Cancelar',
  progressSave: 'Guardar',
  progressTransformTitle: 'Transformación Corporal',
  progressLostPill: 'kg perdidos',
  progressFromWord: 'De',
  progressToWord: 'a',

  badgesHeaderTitle: 'Mis logros',
  badgesShareCelebrateTitle: 'Compartir mis logros y celebrar',
  badgesHeroBravo: '¡Bravo',
  badgesHeroSubtext: '¡Has alcanzado 5 objetivos! Enhorabuena por tu constancia ✨',
  badgesTile1Top: '5 días',
  badgesTile1Sub: 'activos',
  badgesTile2Top: '2 L',
  badgesTile2Sub: 'agua/día',
  badgesTile3Top: 'Menú',
  badgesTile3Sub: 'equilibrado',
  badgesTile4Top: '- 2 kg',
  badgesTile4Sub: 'logrados',
  badgesTile5Top: '1 semana',
  badgesTile5Sub: 'en forma',
  badgesTile6Top: 'Serenidad',
  badgesTile6Sub: 'zen y equilibrio',
  badgesFooterEncouragement: '¡Eres increíble! Sigue cuidando de ti.',
  badgesViewChallenges: 'Ver los',
  badgesChallengesWord: 'desafíos y niveles',
  badgesUnlockedWord: 'desbloqueados',
  badgesDonePill: 'Hecho',
  badgesItems: {
    b1: { title: 'Primer Paso', description: 'Registra tu primer pesaje en la aplicación.' },
    b2: { title: 'Campeón de Hidratación', description: 'Alcanza tu objetivo diario de 8 vasos de agua.' },
    b3: { title: 'Racha de 5 Días 🔥', description: 'Completa tu diario alimentario durante 5 días seguidos.' },
    b4: { title: 'Caminante Constante', description: 'Supera la marca de los 10.000 pasos en un solo día.' },
    b5: { title: 'Meta de -5 kg 🎯', description: 'Pierde 5 kilogramos desde tu peso inicial.' },
    b6: { title: 'Gourmet Equilibrado', description: 'Añade 10 recetas favoritas a tu menú.' },
  },
  badgesRemindersTitle: 'Recordatorios Diarios y Modo Voz',
  badgesRemindersSub: 'Mantén la constancia sin esfuerzo',
  badgesVoiceBannerTitle: '🎙️ Recordatorio Vocal del Coach: «¿Qué vas a comer hoy?»',
  badgesActiveBadge: 'Activo',
  badgesVoiceBannerDesc: '¡El Coach IA te habla en voz alta para preguntarte por tu comida y ayudarte a controlar tus calorías!',
  badgesStopVoice: 'Detener voz',
  badgesListenCoach: '🔊 Escuchar la voz del Coach',
  badgesEverydayAt: 'Todos los días a las',
  badgesTtsLabel: 'Síntesis de voz IA',
  badgesStop: 'Detener',
  badgesTestVoice: 'Probar voz',
  badgesReminderSpeechPrefix: 'Hola',
  badgesReminderSpeechBody: 'Este es tu recordatorio de NutriCoach:',
  badgesRemindersItems: {
    r1: { title: 'Beber un vaso de agua 💧', subtitle: 'Recuerda hidratarte con regularidad' },
    r2: { title: 'Recordatorio de Comida: ¿Qué vas a comer? 🍽️', subtitle: 'Aviso vocal del Coach IA para registrar tu comida' },
    r3: { title: 'Pausa de Caminata Activa 🚶', subtitle: 'Objetivo 10.000 pasos: ¡muévete unos minutos!' },
    r4: { title: 'Pesaje Semanal ⚖️', subtitle: 'Sigue la tendencia de tu peso cada domingo' },
  },

  profileMemberSince: 'Miembro desde hace 12 semanas 🌸',
  profileSettingsTitle: 'Ajustes del perfil',
  profileMyGoal: 'Mi objetivo',
  profileGoalLose5: 'Perder 5 kg',
  profileEditGoalTitle: 'Editar objetivo',
  profileRemainingPrefix: 'Te faltan',
  profileDailyTipsTitle: 'Mis consejos del día',
  profileDailyTipAlt: 'Verduras frescas',
  profileDailyTipText: 'Prioriza las verduras en cada comida: ¡son ricas en nutrientes y bajas en calorías!',
  profileMenuUnsubscribe: 'Mi suscripción • Cancelar suscripción',
  profileMenuTrial: 'Suscripción y Prueba de 30 días',
  profileUnsubscribeBtn: 'Darse de baja',
  profilePaymentRequiredBadge: 'Pago requerido',
  profileDaysShort: 'd / 30',
  profileMyStats: 'Mis estadísticas',
  profileMySettings: 'Mis ajustes',
  profileBadgesAndReminders: 'Insignias, Desafíos y Recordatorios',
  profileFaqHelp: 'Preguntas frecuentes y Ayuda',
  profileFaq1Title: '📸 Escanear comida o código de barras:',
  profileFaq1Body: 'Usa los botones rápidos en la pantalla de inicio o en el Diario alimentario.',
  profileFaq2Title: '💳 Prueba y suscripción:',
  profileFaq2Body: '30 días de prueba gratis; después se requiere suscripción (4,99 €/mes o 39,99 €/año, cancelable en cualquier momento) para seguir usando la app.',
  profileFaq3Title: '📱 Abrir en pantalla completa:',
  profileFaq3Body: 'Pulsa «Modo App» en la barra superior para instalar NutriCoach en tu pantalla de inicio.',
  profileCancelSuccess: 'Tu suscripción se ha cancelado correctamente. No se realizarán más cobros.',
  profilePortalMissingEmail: 'Por favor, introduce un correo electrónico para acceder al portal de Stripe.',
  profilePortalUnavailable: 'Portal de Stripe no disponible en modo local o configuración incompleta. Puedes cancelar directamente abajo en un clic.',
  profilePortalConnError: 'Error de conexión con el portal de Stripe. Utiliza el botón directo de cancelación.',
  profileSubTitle: 'Suscripción y Facturación',
  profileSubSubtitle: 'Gestión transparente • Cancelación gratuita sin compromiso',
  profileStatusPremium: 'Premium Activo',
  profileStatusPaymentRequired: 'Pago Requerido',
  profileStatusTrial: 'Prueba Gratuita',
  profilePortalReady: 'Tu portal de Stripe está listo:',
  profileOpenPortalBtn: 'Abrir portal de Stripe',
  profileUnsubscribeFullBtn: 'Cancelar suscripción de NutriCoach',
  profileManageInvoicesBtn: 'Gestionar facturas y tarjetas (Stripe)',
  profilePlanLabel: 'Plan contratado',
  profilePlanName: 'NutriCoach Premium',
  profilePlanPrice: '4,99 € / mes (Sin permanencia)',
  profileBillingStatusLabel: 'Estado de los cobros',
  profileStripeSecure: 'Pago seguro con Stripe',
  profileCancelOneClick: 'Cancelable en 1 clic en cualquier momento',
  profileYourRightsTitle: 'Tus derechos:',
  profileYourRightsBody: 'Puedes cancelar tu suscripción en cualquier momento sin preaviso ni cargos. Tu acceso sigue activo durante el periodo abonado y no se efectuará ningún nuevo cobro.',
  profileTrialEndedTitle: 'Prueba de 30 días finalizada — Suscripción requerida',
  profileTrialOngoingPrefix: 'Periodo de prueba gratuita activo',
  profileDaySingular: 'día restante',
  profileDayPlural: 'días restantes',
  profileTrialEndedDesc: 'No hay plan gratuito tras la prueba. Activa tu suscripción (4,99 €/mes o 39,99 €/año) para seguir usando NutriCoach.',
  profileTrialOngoingDesc: 'Sin cobros durante los 30 días de prueba. Al finalizar, será necesaria una suscripción (4,99 €/mes o 39,99 €/año) para continuar usando la app.',
  profilePayToContinueBtn: 'Pagar para continuar (4,99 €/mes)',
  profileActivatePremiumBtn: 'Activar Premium (4,99 €/mes)',
  profileMetabolismTitle: 'Cálculo Automático de Metabolismo y Calorías',
  profileMifflinBadge: 'Fórmula Mifflin-St Jeor',
  profileBmrLabel: 'Metabolismo basal (BMR)',
  profileBmrSub: 'Necesidades en reposo total',
  profileTdeeLabel: 'Gasto Total (TDEE)',
  profileTdeeSub: 'Según nivel de actividad',
  profileTargetDeficitLabel: 'Objetivo Déficit Calórico',
  profileTargetDeficitSub: 'Para pérdida de peso gradual',
  profileBmiLabel: 'Índice IMC',
  profileBmiCategories: {
    underweight: 'Bajo peso',
    normal: 'Peso ideal / Normal',
    overweight: 'Sobrepeso leve',
    obese: 'Obesidad',
  },
  profilePersonalInfoTitle: 'Información Personal',
  profileFieldName: 'Nombre',
  profileFieldAge: 'Edad (años)',
  profileFieldSex: 'Sexo',
  profileSexFemale: 'Mujer',
  profileSexMale: 'Hombre',
  profileFieldHeight: 'Altura (cm)',
  profileFieldCurrentWeight: 'Peso actual (kg)',
  profileFieldTargetWeight: 'Peso objetivo (kg)',
  profileFieldActivity: 'Nivel de actividad física',
  profileActSedentary: 'Sedentario (Oficina, poca caminata)',
  profileActLight: 'Ligeramente activo (Caminata 1-3x/semana)',
  profileActModerate: 'Moderadamente activo (Deporte 3-5x/semana)',
  profileActVery: 'Muy activo (Deporte intenso diario)',
  profileActExtreme: 'Extremadamente activo (Atleta)',
  profileFieldGoal: 'Objetivo principal',
  profileGoalLose: 'Perder peso (-0,5 kg/semana)',
  profileGoalMaintain: 'Mantener mi peso actual',
  profileGoalGain: 'Ganar masa muscular',
  profileFieldDiet: 'Dieta y Preferencia alimentaria',
  profileDietStandard: 'Estándar / Todos los alimentos',
  profileDietGlutenFree: '🌾 Sin Gluten (Gluten-Free)',
  profileDietVegetarian: '🥗 Vegetariano',
  profileDietVegan: '🌱 Vegano',
  profileDietPescatarian: '🐟 Pescetariano (Pescado y Vegetales)',
  profileDietKeto: '🥑 Bajo en carbohidratos / Keto',
  profileFieldWaterTarget: 'Objetivo Hidratación (ml)',
  profileFieldStepTarget: 'Objetivo de pasos diarios',
  profileStepRecommended: 'Recomendado: 8.000 a 10.000 pasos / día',
  profileAccountStatusTitle: 'Estado de Cuenta y Cuenta Atrás de Prueba',
  profileBadgePremiumActive: '👑 Suscripción Premium Activa',
  profileBadgeTrialExpired: '🔒 Prueba gratuita finalizada (0 días)',
  profileBadgeTrialDaysLeft: 'días restantes de 30',
  profileCountdownLabel: 'Cuenta atrás de la prueba (30 días):',
  profileCountdownExpired: 'Finalizada (0 días restantes)',
  profileCountdownDayWord: 'Día',
  profileTrialExpiredWarning: '⚠️ Periodo de prueba finalizado — Pásate a Premium para continuar.',
  profileTrialVerified: '✨ Registro validado • Periodo de evaluación gratuito al 100%',
  profileZeroBilled: '0 € facturados antes de finalizar los 30 días',
  profileGooglePlayTitle: 'NutriCoach en Google Play',
  profileGooglePlayBtn: 'Ficha en Google Play',
  profileWatchTitle: 'Reloj Inteligente y Sensores',
  profileWatchUnconfigured: 'No configurado',
  profileWatchLastSync: 'Última sincronización:',
  profileWatchManageBtn: 'Gestionar / Sincronizar',
  profileWatchConnectBtn: 'Conectar mi reloj',
  profileVoiceAutoTitle: 'Saludo Vocal Automático del Coach',
  profileEnabled: 'Activado',
  profileDisabled: 'Desactivado',
  profileVoiceAutoDesc: 'El Coach te saluda en voz alta al abrir la app: «¿Qué vas a comer hoy?»',
  profileLangSubtitle: '21 idiomas disponibles • Traducción universal (130+ idiomas)',
  profileAccountSynced: 'Cuenta sincronizada y Prueba activada',
  profileGuestMode: 'Modo invitado',
  profileCreateAccount: 'Crear cuenta',
  profileCreatorCredit: '✨ Una creación de',
  profileCancelModalTitle: 'Confirmar cancelación',
  profileCancelModalQuestion: '¿Estás seguro de que quieres cancelar tu suscripción NutriCoach Premium?',
  profileCancelPerk1Title: 'Sin gastos de cancelación:',
  profileCancelPerk1Body: 'La cancelación es 100% gratuita e inmediata.',
  profileCancelPerk2Title: 'Detención definitiva de cobros:',
  profileCancelPerk2Body: 'No se cargará ningún importe más a tu tarjeta.',
  profileCancelPerk3Title: 'Tus datos se conservan:',
  profileCancelPerk3Body: 'Tu perfil, comidas registradas y cálculos metabólicos siguen intactos.',
  profileKeepSubBtn: 'Mantener mi suscripción',
  profileCancellingBtn: 'Cancelando...',
  profileConfirmUnsubBtn: 'Confirmar cancelación',

  coachBannerTitle: 'Coach Políglota',
  coachBannerBadge: '21+ idiomas',
  coachDropdownTitle: 'Desplegable: elegir idioma del Coach políglota',
  coachModalHeader: 'Idioma del Coach IA',
  coachLangsAvailable: 'idiomas disponibles',
  coachSearchPlaceholder: 'Buscar un idioma...',
  coachQuickPick: 'Acceso rápido:',
  coachNoLangFound: 'Ningún idioma encontrado para',
  coachUniversalBtn: 'Traducción Universal (130+ idiomas)',
  coachPolyglotHint: '💡 El coach IA responderá de inmediato en este idioma.',
  coachHeaderTitle: 'Mi coach IA',
  coachOnlineStatus: 'En línea • Consejos personalizados',
  coachMoreOptionsTitle: 'Más opciones',
  coachTabChat: '💬 Chat',
  coachTabScan: '📸 Escanear',
  coachTabMenu: '🥗 Menú',
  coachBoldLabel: 'Texto en negrita:',
  coachBoldOn: 'ACTIVADO',
  coachBoldOff: 'DESACTIVADO',
  coachBoldTooltip: 'Activar o desactivar el formato en negrita',
  coachBoldEnabledTitle: 'Texto en negrita activado',
  coachBoldDisabledTitle: 'Activar texto en negrita',
  coachVoiceAskBtn: '🎙️ ¿Qué vas a comer? (Voz)',
  coachVoiceAskTooltip: 'El Coach te pregunta en voz alta qué vas a comer',
  coachSuggestionsLabel: 'Sugerencias:',
  coachYogurtTitle: 'Yogur natural, fruta y almendras (~160 kcal)',
  coachYogurtFoodName: 'Yogur natural, fruta fresca y almendras',
  coachYogurtAlt: 'Yogur con frutas y almendras',
  coachAddBtn: '+ Anotar',
  coachListenVoice: 'Escuchar voz',
  coachListenVoiceTitle: 'Escuchar este consejo en voz alta',
  coachThinking: 'NutriCoach está pensando...',
  coachChatInputPlaceholder: 'Hazme una pregunta...',
  coachSendTitle: 'Enviar pregunta',
  coachCameraBlocked: 'Cámara en vivo bloqueada. Abriendo selector de fotos...',
  coachCameraCaptureErr: 'No se pudo capturar la imagen. Inténtalo de nuevo.',
  coachPhotoLoadErr: 'No se pudo cargar esta imagen.',
  coachPhotoAnalyzeErr: 'No se pudo analizar esta foto en este momento. Verifica la imagen o reinténtalo.',
  coachPhotoDefaultFood: 'Comida analizada',
  coachPhotoStdPortion: 'Ración estándar',
  coachPhotoSuccessMsg: 'Comida analizada correctamente.',
  coachPhotoTitle: 'Escáner Foto IA',
  coachPhotoSubtitle: 'Haz una foto de tu plato o sube una imagen para estimar automáticamente las calorías y macronutrientes.',
  coachTakePhoto: 'Hacer una foto',
  coachGalleryFile: 'Galería / Archivo',
  coachCapturePlate: 'Capturar mi plato',
  coachPhotoReady: '¡Foto lista! Pulsa para cambiar o inicia el análisis abajo.',
  coachPhotoDropzoneTitle: 'Pulsa aquí para elegir una foto de tu comida',
  coachPhotoDropzoneFormats: 'JPG, PNG, WebP • Compresión automática',
  coachExtraNoteLabel: 'Detalle adicional (opcional)',
  coachExtraNotePlaceholder: 'ej: Lomo de salmón a la plancha, arroz basmati y verduras',
  coachAnalyzing: 'Análisis dietético con IA en curso...',
  coachAnalyzeBtn: 'Analizar mi comida',
  coachResultTitle: 'Resultado del análisis nutricional',
  coachEstimatedPortion: 'Porción estimada:',
  coachMacroP: 'Proteínas',
  coachMacroC: 'Carbohidratos',
  coachMacroF: 'Grasas',
  coachSaveInto: 'Guardar en:',
  coachAddedSuccess: '¡Añadido correctamente al diario!',
  coachAddToJournal: 'Añadir esta comida a mi diario',
  coachResultEmpty: 'Haz o sube una foto de tu plato y pulsa «Analizar mi comida».',
  coachMenuTitle: 'Generador de Menús a Medida',
  coachMenuSubtitle: 'Genera un menú diario equilibrado completo (Desayuno, Almuerzo, Merienda, Cena) adaptado a tu objetivo calórico.',
  coachMenuCalTarget: 'Objetivo Calórico (kcal)',
  coachMenuDietPref: 'Preferencia Alimentaria',
  coachMenuPrefStandard: 'Estándar Equilibrado',
  coachMenuPrefVeg: 'Vegetariano',
  coachMenuPrefGlutenFree: 'Sin Gluten',
  coachMenuPrefKeto: 'Bajo en Carbohidratos / Proteico',
  coachMenuGenerateBtn: 'Generar mi Menú',
  coachMenuSuggestedPrefix: 'Menú sugerido (~',
  coachMenuAiTipPrefix: 'Consejo IA:',
  coachMenuDefaultTip: 'Prioriza una buena masticación y mantente hidratado todo el día.',
  coachMenuFallbackBreakfast: 'Gachas de avena con frutas',
  coachMenuFallbackBreakfastDesc: 'Rico en fibra para un despertar energético sin picos de glucosa',
  coachMenuFallbackLunch: 'Pollo a la plancha, quinoa y brócoli',
  coachMenuFallbackLunchDesc: 'Equilibrio perfecto de proteínas y carbohidratos lentos para mantener la energía',
  coachMenuFallbackSnack: 'Manzana y almendras crudas',
  coachMenuFallbackSnackDesc: 'Merienda saludable que regula la saciedad hasta la cena',
  coachMenuFallbackDinner: 'Pescado blanco y verduras al vapor',
  coachMenuFallbackDinnerDesc: 'Cena ligera que favorece un descanso reparador',
  coachStarterMsg1Prefix: 'Hola',
  coachStarterMsg1Body: '¿Cómo te sientes hoy?',
  coachStarterMsg2: 'Bastante bien, aunque tengo un poco de hambre esta mañana...',
  coachStarterMsg3: '¡Sin problema! 😊\nAquí tienes una idea sana y deliciosa:\n\nUn yogur natural con fruta fresca y unas almendras.\n\nTe dará energía sin exceso de calorías.',
};
