import { NextResponse } from "next/server"
import { ai, MODELS, MODEL_DISPLAY } from "@/lib/gemini"

/**
 * GET /api/test
 * Quick health check — verifies that GOOGLE_API_KEY is set and Gemini responds.
 * Returns 200 on success, 500 on failure.
 */
export async function GET() {
  const hasKey = !!(process.env.GOOGLE_API_KEY || process.env.GOOGLE_GENAI_USE_VERTEXAI === "true")

  if (!hasKey) {
    return NextResponse.json(
      {
        success: false,
        error: "GOOGLE_API_KEY is not set. Add it to .env.local and restart the server.",
        model: MODELS.fast,
      },
      { status: 500 }
    )
  }

  try {
    const response = await ai.models.generateContent({
      model: MODELS.fast,
      contents: [{ role: "user", parts: [{ text: "Reply with just the word WORKING" }] }],
      config: { temperature: 0 },
    })

    const text = response.text?.trim() ?? ""

    return NextResponse.json({
      success: true,
      response: text,
      model: MODELS.fast,
      displayName: MODEL_DISPLAY.fast,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    const error = err as Error
    return NextResponse.json(
      {
        success: false,
        error: error.message,
        model: MODELS.fast,
        hint: "Check that your GOOGLE_API_KEY is valid at https://aistudio.google.com/apikey",
      },
      { status: 500 }
    )
  }
}
