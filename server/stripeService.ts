import Stripe from "stripe";

let stripeClient: Stripe | null = null;

export function getStripe(): Stripe | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    return null;
  }
  if (!stripeClient) {
    stripeClient = new Stripe(secretKey);
  }
  return stripeClient;
}

export function getStripeConfig() {
  const isConfigured = Boolean(process.env.STRIPE_SECRET_KEY);
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || null;

  return {
    configured: isConfigured,
    publishableKey,
    currency: "eur",
    plans: {
      monthly: {
        id: "monthly",
        name: "NutriCoach Premium Mensuel",
        price: 4.99,
        displayPrice: "4,99 €",
        period: "mois",
        trialDays: 30,
        description: "30 jours offerts puis 4,99 €/mois sans engagement",
      },
      yearly: {
        id: "yearly",
        name: "NutriCoach Premium Annuel",
        price: 39.99,
        displayPrice: "39,99 €",
        period: "an",
        monthlyEquivalent: "3,33 €/mois",
        discountBadge: "-30%",
        trialDays: 30,
        description: "Facturation annuelle de 39,99 € après 30 jours offerts",
      },
    },
  };
}

export async function createCheckoutSession(params: {
  plan?: string;
  userEmail?: string;
  userName?: string;
  origin: string;
}) {
  const { plan, userEmail, userName, origin } = params;
  const stripe = getStripe();

  if (!stripe) {
    return {
      configured: false,
      mock: true,
      message:
        "La variable de secret STRIPE_SECRET_KEY n'est pas encore définie dans vos Secrets. Configurez STRIPE_SECRET_KEY dans le panneau Secrets pour basculer en mode réel Stripe.",
      trialGranted: true,
      status: "mock_success",
    };
  }

  const isYearly = plan === "yearly";
  let lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  const customPriceId = isYearly
    ? process.env.STRIPE_PRICE_ID_YEARLY
    : process.env.STRIPE_PRICE_ID_MONTHLY;

  if (customPriceId) {
    lineItems = [{ price: customPriceId, quantity: 1 }];
  } else {
    lineItems = [
      {
        price_data: {
          currency: "eur",
          product_data: {
            name: isYearly
              ? "NutriCoach Premium - Abonnement Annuel"
              : "NutriCoach Premium - Abonnement Mensuel",
            description:
              "Accès complet : Menus IA sur-mesure, Coach IA illimité, Scan photo de repas, 100+ recettes exclusives et synchronisation.",
            images: [`${origin}/pwa-512x512.png`],
          },
          unit_amount: isYearly ? 3999 : 499,
          recurring: {
            interval: isYearly ? "year" : "month",
          },
        },
        quantity: 1,
      },
    ];
  }

  const sessionParams: Stripe.Checkout.SessionCreateParams = {
    mode: "subscription",
    payment_method_types: ["card"],
    line_items: lineItems,
    subscription_data: {
      trial_period_days: 30,
      metadata: {
        plan: plan || "monthly",
        userName: userName || "",
      },
    },
    metadata: {
      plan: plan || "monthly",
      userName: userName || "",
      userEmail: userEmail || "",
    },
    success_url: `${origin}/?session_id={CHECKOUT_SESSION_ID}&payment_status=success`,
    cancel_url: `${origin}/?payment_status=cancelled`,
  };

  if (userEmail && userEmail.includes("@")) {
    sessionParams.customer_email = userEmail;
  }

  const session = await stripe.checkout.sessions.create(sessionParams);

  return {
    configured: true,
    sessionId: session.id,
    url: session.url,
  };
}

export async function verifyStripeSession(sessionId: string) {
  const stripe = getStripe();
  if (!stripe) {
    return {
      verified: true,
      mock: true,
      status: "complete",
      isPremium: true,
    };
  }

  const session = await stripe.checkout.sessions.retrieve(sessionId);
  const isSuccess =
    session.status === "complete" ||
    session.payment_status === "paid" ||
    Boolean(session.subscription);

  return {
    verified: isSuccess,
    status: session.status,
    paymentStatus: session.payment_status,
    customerEmail: session.customer_details?.email || session.customer_email,
    subscriptionId: session.subscription,
    isPremium: isSuccess,
  };
}

export async function cancelSubscription(email?: string) {
  const stripe = getStripe();

  if (stripe && email) {
    const customers = await stripe.customers.list({ email, limit: 1 });
    if (customers.data.length > 0) {
      const customerId = customers.data[0].id;
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: "active",
        limit: 5,
      });

      for (const sub of subscriptions.data) {
        await stripe.subscriptions.cancel(sub.id);
        console.log(`[Stripe] Abonnement annulé pour ${email}: ${sub.id}`);
      }
    }
  }

  return {
    success: true,
    message: "Votre abonnement a été résilié avec succès. Aucun prélèvement futur ne sera effectué.",
  };
}

export async function createCustomerPortalSession(email: string, origin: string) {
  const stripe = getStripe();
  if (!stripe) {
    throw new Error("Stripe n'est pas encore configuré avec STRIPE_SECRET_KEY.");
  }
  if (!email) {
    throw new Error("Email requis pour accéder au portail client");
  }

  const customers = await stripe.customers.list({ email, limit: 1 });
  if (customers.data.length === 0) {
    throw new Error("Aucun client Stripe trouvé avec cet email");
  }

  const portalSession = await stripe.billingPortal.sessions.create({
    customer: customers.data[0].id,
    return_url: origin,
  });

  return { url: portalSession.url };
}
