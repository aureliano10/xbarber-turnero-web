"use server";

import { summarizeTurnDetails } from "@/ai/flows/summarize-turn-details";

export async function getTurnSummary(
  customerName: string,
  appointmentDetails: string,
  customerPreferences: string
) {
  try {
    const result = await summarizeTurnDetails({
      customerName,
      appointmentDetails,
      customerPreferences,
    });
    return { summary: result.summary, error: null };
  } catch (error) {
    console.error("Error summarizing turn details:", error);
    return { summary: null, error: "No se pudo generar el resumen. Inténtalo de nuevo." };
  }
}
