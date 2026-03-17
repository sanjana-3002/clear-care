import { NextRequest, NextResponse } from "next/server"
import { ai, MODELS } from "@/lib/gemini"
import { buildDisputeLetterPrompt } from "@/lib/prompts"
import { validatePatientProfile, validateDisputeItems, validationErrorResponse } from "@/lib/validation"
import { GEMINI_THINKING_BUDGET_LETTER, GEMINI_TEMP_LETTER } from "@/lib/constants"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null)

    if (!body || typeof body !== "object") {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 })
    }

    const { patientProfile, disputeItems, providerName, providerAddress } = body as Record<string, unknown>

    // Validate inputs
    const profileValidation = validatePatientProfile(patientProfile)
    if (!profileValidation.valid) return validationErrorResponse(profileValidation)

    const itemsValidation = validateDisputeItems(disputeItems)
    if (!itemsValidation.valid) return validationErrorResponse(itemsValidation)

    const prompt = buildDisputeLetterPrompt(
      patientProfile as Parameters<typeof buildDisputeLetterPrompt>[0],
      disputeItems as Parameters<typeof buildDisputeLetterPrompt>[1],
      typeof providerName === "string" ? providerName : "",
      typeof providerAddress === "string" ? providerAddress : ""
    )

    const response = await ai.models.generateContent({
      model: MODELS.fast,
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        thinkingConfig: { thinkingBudget: GEMINI_THINKING_BUDGET_LETTER } as any,
        temperature: GEMINI_TEMP_LETTER,
      },
    })

    const letterText = response.text || ""
    return NextResponse.json({ letter: letterText })
  } catch (error) {
    console.error("[generate-letter] error:", error)
    return NextResponse.json({ error: "Failed to generate letter. Please try again." }, { status: 500 })
  }
}
