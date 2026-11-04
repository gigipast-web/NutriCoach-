import express from "express";
import path from "path";
import { apiRouter } from "./routes.ts";

export function createExpressApp() {
  const app = express();

  // CORS headers for all incoming API requests
  app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, stripe-signature");
    if (req.method === "OPTIONS") {
      return res.sendStatus(200);
    }
    next();
  });

  // Parse JSON and urlencoded payloads
  app.use(express.json({ limit: "25mb" }));
  app.use(express.urlencoded({ extended: true, limit: "25mb" }));

  // Explicit service worker & manifest routes
  app.get("/sw.js", (_req, res) => {
    res.setHeader("Content-Type", "application/javascript");
    res.setHeader("Service-Worker-Allowed", "/");
    res.sendFile(path.join(process.cwd(), "public", "sw.js"));
  });

  app.get("/manifest.json", (_req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.sendFile(path.join(process.cwd(), "public", "manifest.json"));
  });

  app.get("/manifest.webmanifest", (_req, res) => {
    res.setHeader("Content-Type", "application/manifest+json; charset=utf-8");
    res.sendFile(path.join(process.cwd(), "public", "manifest.webmanifest"));
  });

  app.get("/offline.html", (_req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.sendFile(path.join(process.cwd(), "public", "offline.html"));
  });

  // Digital Asset Links for Google Play Store (TWA) verification
  app.get("/.well-known/assetlinks.json", (_req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.sendFile(path.join(process.cwd(), "public", ".well-known", "assetlinks.json"));
  });

  // Explicit Privacy Policy routes (Google Play Console requirement)
  const servePrivacyPolicy = (_req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(path.join(process.cwd(), "public", "privacy.html"));
  };

  app.get("/privacy", servePrivacyPolicy);
  app.get("/privacy.html", servePrivacyPolicy);
  app.get("/privacy-policy", servePrivacyPolicy);
  app.get("/privacy_policy", servePrivacyPolicy);
  app.get("/politique-de-confidentialite", servePrivacyPolicy);
  app.get("/politique-confidentialite", servePrivacyPolicy);
  app.get("/politique", servePrivacyPolicy);
  app.get("/legal/privacy", servePrivacyPolicy);

  // Explicit Account Deletion routes (Google Play requirement)
  const serveDeleteAccount = (_req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(path.join(process.cwd(), "public", "delete-account.html"));
  };

  app.get("/delete-account", serveDeleteAccount);
  app.get("/delete-account.html", serveDeleteAccount);
  app.get("/suppression-compte", serveDeleteAccount);
  app.get("/delete_account", serveDeleteAccount);

  // Explicit Tester Sheet routes
  const serveTester = (_req: express.Request, res: express.Response) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.sendFile(path.join(process.cwd(), "public", "tester.html"));
  };

  app.get("/tester", serveTester);
  app.get("/tester.html", serveTester);

  // Mount API router
  app.use(apiRouter);
  app.use("/api", apiRouter);

  // Serve public static assets
  app.use(express.static(path.join(process.cwd(), "public")));

  return app;
}
