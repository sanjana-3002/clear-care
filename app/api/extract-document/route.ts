import { NextRequest, NextResponse } from "next/server"
import { ai, MODELS } from "@/lib/gemini"
import { validateUploadedFile, validationErrorResponse } from "@/lib/validation"
import { GEMINI_TEMP_VISION } from "@/lib/constants"

const EXTRACTION_PROMPT = `Extract ALL text from this document exactly as written.
If this is a medical bill: extract every line item, code, amount, date, and provider name.
If this is a discharge summary: extract all diagnoses, medications, instructions, and follow-up notes.
If this is an insurance card or policy: extract the plan name, member ID, group number, copay amounts, and coverage details.
Preserve the structure. Do not summarize. Return raw extracted text only.`

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData().catch(() => null)
    if (!formData) {
      return NextResponse.json({ error: "Invalid form data" }, { status: 400 })
    }

    const file = formData.get("file") as File | null

    // Validate file
    const fileValidation = validateUploadedFile(file)
    if (!fileValidation.valid) return validationErrorResponse(fileValidation)

    const validFile = file as File
    const arrayBuffer = await validFile.arrayBuffer()
    const base64Data = Buffer.from(arrayBuffer).toString("base64")
    const mimeType = validFile.type

    let extractedText: string

    if (mimeType === "application/pdf") {
      const uploadedFile = await ai.files.upload({
        file: new Blob([arrayBuffer], { type: "application/pdf" }),
        config: { mimeType: "application/pdf" },
      })

      const response = await ai.models.generateContent({
        model: MODELS.vision,
        contents: [
          {
            role: "user",
            parts: [
              { fileData: { mimeType: "application/pdf", fileUri: uploadedFile.uri! } },
              { text: EXTRACTION_PROMPT },
            ],
          },
        ],
        config: { temperature: GEMINI_TEMP_VISION },
      })

      extractedText = response.text || ""
    } else {
      const response = await ai.models.generateContent({
        model: MODELS.vision,
        contents: [
          {
            role: "user",
            parts: [
              { inlineData: { mimeType, data: base64Data } },
              { text: EXTRACTION_PROMPT },
            ],
          },
        ],
        config: { temperature: GEMINI_TEMP_VISION },
      })

      extractedText = response.text || ""
    }

    if (!extractedText.trim()) {
      return NextResponse.json(
        { error: "Could not extract text from this document. Please try pasting the text directly." },
        { status: 422 }
      )
    }

    // Determine document type from extracted text
    const lowerText = extractedText.toLowerCase()
    let documentType: "bill" | "discharge" | "insurance" | "unknown" = "unknown"

    if (lowerText.includes("discharge") || lowerText.includes("diagnosis") || lowerText.includes("admitted")) {
      documentType = "discharge"
    } else if (
      lowerText.includes("bill") ||
      lowerText.includes("billed") ||
      lowerText.includes("amount due") ||
      lowerText.includes("cpt")
    ) {
      documentType = "bill"
    } else if (
      lowerText.includes("member id") ||
      lowerText.includes("group number") ||
      lowerText.includes("insurance card")
    ) {
      documentType = "insurance"
    }

    return NextResponse.json({ extractedText, documentType })
  } catch (error) {
    console.error("[extract-document] error:", error)
    return NextResponse.json(
      { error: "Document extraction failed. Please try pasting the text manually." },
      { status: 500 }
    )
  }
}
