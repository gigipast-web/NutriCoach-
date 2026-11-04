import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { calculateMealFromText } from "../../server/geminiService.ts";

export const handler: Handler = async (event: HandlerEvent, _context: HandlerContext) => {
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: "",
    };
  }

  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const { mealText, language } = body;
    if (!mealText || typeof mealText !== "string") {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "mealText is required" }),
      };
    }

    const result = await calculateMealFromText({ mealText, language });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.error("Netlify calculate-meal error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: "Failed to calculate meal" }),
    };
  }
};
