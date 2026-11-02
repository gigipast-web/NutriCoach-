import express from "express";
import path from "path";
import { createExpressApp } from "./server/app.ts";

const app = createExpressApp();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

async function setupVite() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`NutriCoach server running on http://0.0.0.0:${PORT}`);
  });
}

setupVite();
