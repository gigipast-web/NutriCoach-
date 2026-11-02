import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      status: "ok",
      app: "NutriCoach",
      platform: "Netlify Functions (Serverless)",
      timestamp: new Date().toISOString(),
    }),
  };
};
