import type { Handler, HandlerEvent, HandlerContext } from "@netlify/functions";
import { chatWithCoach } from "../../server/geminiService.ts";

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
    const { message, userContext, history, language } = body;
    const reply = await chatWithCoach({ message, userContext, history, language });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ reply }),
    };
  } catch (error: any) {
    console.error("Netlify chat function error:", error);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        reply:
          "Pour optimiser votre journée minceur, misez sur un repas riche en fibres et protéines végétales ou maigres. Buvez un grand verre d'eau avant de manger pour favoriser la satiété !",
      }),
    };
  }
};
