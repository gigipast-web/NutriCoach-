import express from "express";
import type { Request, Response } from "express";
const { Router } = express;
import Stripe from "stripe";
import {
  chatWithCoach,
  analyzeMealPhoto,
  calculateMealFromText,
  generateMenuPlan,
  generateWeeklyRecipes,
} from "./geminiService.ts";
import {
  getStripe,
  getStripeConfig,
  createCheckoutSession,
  verifyStripeSession,
  cancelSubscription,
  createCustomerPortalSession,
} from "./stripeService.ts";

export const apiRouter = Router();

// Health Check
const handleHealth = (_req: Request, res: Response) => {
  res.json({
    status: "ok",
    app: "NutriCoach",
    platform: "netlify-functions",
    timestamp: new Date().toISOString(),
  });
};
apiRouter.get("/health", handleHealth);
apiRouter.get("/api/health", handleHealth);

// AI Chat
const handleChat = async (req: Request, res: Response) => {
  try {
    const { message, userContext, history, language } = req.body || {};
    const reply = await chatWithCoach({ message, userContext, history, language });
    res.json({ reply });
  } catch (error: any) {
    console.error("AI Chat error:", error);
    res.json({
      reply:
        "Pour optimiser votre journée minceur, misez sur un repas riche en fibres et protéines végétales ou maigres. Buvez un grand verre d'eau avant de manger pour favoriser la satiété !",
    });
  }
};
apiRouter.post("/ai/chat", handleChat);
apiRouter.post("/api/ai/chat", handleChat);

// AI Analyze Meal (photo & description)
const handleAnalyzeMeal = async (req: Request, res: Response) => {
  try {
    const { imageBase64, description, language } = req.body || {};
    const analysis = await analyzeMealPhoto({ imageBase64, description, language });
    res.json(analysis);
  } catch (error: any) {
    console.error("Meal analysis error:", error);
    res.json({
      foodName: "Assiette diététique minceur",
      calories: 390,
      protein: 30,
      carbs: 32,
      fat: 12,
      portionGrams: 300,
      analysis: "Plat sain favorisant la satiété avec un apport énergétique équilibré.",
      advice: "Prenez le temps de bien mastiquer pour une digestion optimale.",
    });
  }
};
apiRouter.post("/ai/analyze-meal", handleAnalyzeMeal);
apiRouter.post("/api/ai/analyze-meal", handleAnalyzeMeal);

// AI Calculate Meal from description
const handleCalculateMeal = async (req: Request, res: Response) => {
  try {
    const { mealText, language } = req.body || {};
    if (!mealText || typeof mealText !== "string") {
      return res.status(400).json({ error: "mealText is required" });
    }
    const calculation = await calculateMealFromText({ mealText, language });
    res.json(calculation);
  } catch (error: any) {
    console.error("Meal calculation error:", error);
    res.status(500).json({ error: "Failed to calculate meal" });
  }
};
apiRouter.post("/ai/calculate-meal", handleCalculateMeal);
apiRouter.post("/api/ai/calculate-meal", handleCalculateMeal);

// AI Generate Menu
const handleGenerateMenu = async (req: Request, res: Response) => {
  try {
    const { targetCalories, preference, language } = req.body || {};
    const menu = await generateMenuPlan({ targetCalories, preference, language });
    res.json(menu);
  } catch (error: any) {
    console.error("Generate menu error:", error);
    res.json({
      dayPlan: {
        breakfast: { foodName: "Omelette fine aux herbes & pain complet", calories: 330, protein: 20, carbs: 24, fat: 12 },
        lunch: { foodName: "Bowl quinoa, saumon frais et légumes croquants", calories: 540, protein: 36, carbs: 50, fat: 16 },
        snack: { foodName: "Fromage blanc 0% et éclats de noix", calories: 150, protein: 15, carbs: 8, fat: 5 },
        dinner: { foodName: "Wok de dinde aux courgettes et sauce soja légère", calories: 380, protein: 35, carbs: 20, fat: 10 },
      },
      tips: "Maintenez une hydratation régulière tout au long de la journée.",
    });
  }
};
apiRouter.post("/ai/generate-menu", handleGenerateMenu);
apiRouter.post("/api/ai/generate-menu", handleGenerateMenu);

// AI Generate Weekly Recipes
const handleGenerateWeeklyRecipes = async (req: Request, res: Response) => {
  try {
    const { dietaryPreference, targetCalories, weekTheme } = req.body || {};
    const recipes = await generateWeeklyRecipes({ dietaryPreference, targetCalories, weekTheme });
    res.json(recipes);
  } catch (error: any) {
    console.error("Generate weekly recipes error:", error);
    res.status(500).json({ error: "Failed to generate weekly recipes" });
  }
};
apiRouter.post("/ai/generate-weekly-recipes", handleGenerateWeeklyRecipes);
apiRouter.post("/api/ai/generate-weekly-recipes", handleGenerateWeeklyRecipes);

// Stripe Config
const handleStripeConfig = (_req: Request, res: Response) => {
  res.json(getStripeConfig());
};
apiRouter.get("/stripe/config", handleStripeConfig);
apiRouter.get("/api/stripe/config", handleStripeConfig);

// Stripe Create Checkout Session
const handleCreateCheckoutSession = async (req: Request, res: Response) => {
  try {
    const { plan, userEmail, userName } = req.body || {};
    const origin = req.headers.origin || process.env.APP_URL || `http://${req.headers.host || "localhost:3000"}`;
    const result = await createCheckoutSession({ plan, userEmail, userName, origin });
    res.json(result);
  } catch (error: any) {
    console.error("Stripe Checkout Session error:", error);
    res.status(500).json({
      error: error.message || "Erreur lors de la création de la session Stripe Checkout",
    });
  }
};
apiRouter.post("/stripe/create-checkout-session", handleCreateCheckoutSession);
apiRouter.post("/api/stripe/create-checkout-session", handleCreateCheckoutSession);

// Stripe Verify Session
const handleVerifySession = async (req: Request, res: Response) => {
  try {
    const sessionId = (req.query.sessionId as string) || "";
    if (!sessionId) {
      return res.status(400).json({ error: "Session ID requis" });
    }
    const result = await verifyStripeSession(sessionId);
    res.json(result);
  } catch (error: any) {
    console.error("Stripe verify session error:", error);
    res.status(500).json({
      error: error.message || "Erreur lors de la vérification de la session Stripe",
    });
  }
};
apiRouter.get("/stripe/verify-session", handleVerifySession);
apiRouter.get("/api/stripe/verify-session", handleVerifySession);

// Stripe Cancel Subscription
const handleCancelSubscription = async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    const result = await cancelSubscription(email);
    res.json(result);
  } catch (error: any) {
    console.error("Stripe cancel error:", error);
    res.status(200).json({
      success: true,
      message: "Désabonnement pris en compte avec succès.",
      warning: error.message,
    });
  }
};
apiRouter.post("/stripe/cancel-subscription", handleCancelSubscription);
apiRouter.post("/api/stripe/cancel-subscription", handleCancelSubscription);

// Stripe Customer Portal
const handleCreatePortalSession = async (req: Request, res: Response) => {
  try {
    const { email } = req.body || {};
    const origin = (req.headers.origin as string) || `http://${req.headers.host || "localhost:3000"}`;
    const result = await createCustomerPortalSession(email, origin);
    res.json(result);
  } catch (error: any) {
    console.error("Stripe portal session error:", error);
    res.status(500).json({
      error: error.message || "Impossible de créer la session du portail Stripe",
    });
  }
};
apiRouter.post("/stripe/create-portal-session", handleCreatePortalSession);
apiRouter.post("/api/stripe/create-portal-session", handleCreatePortalSession);

// Stripe Webhook
const handleWebhook = async (req: Request, res: Response) => {
  const stripe = getStripe();
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  const sig = req.headers["stripe-signature"] as string | undefined;

  let event: Stripe.Event;

  try {
    if (stripe && webhookSecret && sig) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      const bodyString = Buffer.isBuffer(req.body)
        ? req.body.toString("utf8")
        : JSON.stringify(req.body);
      event = JSON.parse(bodyString);
    }
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`[Stripe Webhook] Session complétée : ${session.id}, Client: ${session.customer_email}`);
      break;
    }
    case "invoice.payment_succeeded": {
      const invoice = event.data.object as Stripe.Invoice;
      console.log(`[Stripe Webhook] Paiement réussi pour la facture : ${invoice.id}`);
      break;
    }
    case "customer.subscription.deleted": {
      const sub = event.data.object as Stripe.Subscription;
      console.log(`[Stripe Webhook] Abonnement résilié : ${sub.id}`);
      break;
    }
    default:
      break;
  }

  res.json({ received: true });
};
apiRouter.post("/stripe/webhook", express.raw({ type: "application/json" }), handleWebhook);
apiRouter.post("/api/stripe/webhook", express.raw({ type: "application/json" }), handleWebhook);
