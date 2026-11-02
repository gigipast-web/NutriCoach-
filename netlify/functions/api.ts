import serverless from "serverless-http";
import express from "express";
import { createExpressApp } from "../../server/app.ts";

const app = createExpressApp();

// Normalization middleware for Netlify Functions path prefixes
app.use((req, _res, next) => {
  if (req.url.startsWith("/.netlify/functions/api")) {
    req.url = req.url.replace(/^\/\.netlify\/functions\/api/, "");
    if (!req.url.startsWith("/")) {
      req.url = "/" + req.url;
    }
  }
  next();
});

export const handler = serverless(app);
