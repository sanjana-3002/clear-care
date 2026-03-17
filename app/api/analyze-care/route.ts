import { NextRequest } from "next/server"
import { ai, MODELS } from "@/lib/gemini"
import { buildCareAnalysisPrompt } from "@/lib/prompts"
import { validatePatientProfile, validateDocumentText, validationErrorResponse } from "@/lib/validation"
import { GEMINI_THINKING_BUDGET_ANALYSIS, GEMINI_TEMP_CARE } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== "object") {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { patientProfile, extractedDocumentText, additionalContext } = body as Record<string, unknown>

    // Validate inputs
    const profileValidation = validatePatientProfile(patientProfile)
    if (!profileValidation.valid) return validationErrorResponse(profileValidation)

    const textValidation = validateDocumentText(extractedDocumentText, "extractedDocumentText")
    if (!textValidation.valid) return validationErrorResponse(textValidation)

    const prompt = buildCareAnalysisPrompt(
      patientProfile as Parameters<typeof buildCareAnalysisPrompt>[0],
      extractedDocumentText as string,
      typeof additionalContext === "string" ? additionalContext : undefined
    )

    const stream = await ai.models.generateContentStream({
      model: MODELS.reasoning,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        thinkingConfig: { thinkingBudget: GEMINI_THINKING_BUDGET_ANALYSIS } as any,
        temperature: GEMINI_TEMP_CARE,
        responseMimeType: "application/json",
      },
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            const text = chunk.text
            if (text) controller.enqueue(encoder.encode(text))
          }
          controller.close()
        } catch (e) {
          controller.error(e)
        }
      },
    })

    return new Response(readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    })
  } catch (error) {
    console.error("[analyze-care] error:", error)
    return new Response(JSON.stringify({ error: "Analysis failed. Please check your API key and try again." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
