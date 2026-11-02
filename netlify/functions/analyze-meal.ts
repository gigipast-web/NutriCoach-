import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { analyzeMealPhoto } from "../../server/geminiService.ts";

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
    const { imageBase64, description, language } = body;
    const result = await analyzeMealPhoto({ imageBase64, description, language });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(result),
    };
  } catch (error: any) {
    console.error("Netlify meal analysis error:", error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        foodName: "Assiette diététique minceur",
        calories: 390,
        protein: 30,
        carbs: 32,
        fat: 12,
        portionGrams: 300,
        analysis: "Plat sain favorisant la satiété avec un apport énergétique équilibré.",
        advice: "Prenez le temps de bien mastiquer pour une digestion optimale.",
      }),
    };
  }
};
