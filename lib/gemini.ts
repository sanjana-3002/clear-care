import { GoogleGenAI } from "@google/genai"

/**
 * ClearCare — Gemini client
 *
 * Auth decision tree:
 *
 *  GOOGLE_GENAI_USE_VERTEXAI=true  →  ADC (Application Default Credentials)
 *    Requires: GOOGLE_CLOUD_PROJECT + `gcloud auth application-default login`
 *    Use for: production Vercel deploy with workload identity
 *
 *  GOOGLE_API_KEY set (default)  →  API key on Vertex AI publisher endpoint
 *    The hackathon key (AQ.xxx) is scoped to aiplatform.googleapis.com.
 *    vertexai:true WITHOUT project/location tells the SDK to use the Vertex AI
 *    URL pattern while accepting an API key.
 */

const useADC = process.env.GOOGLE_GENAI_USE_VERTEXAI === "true"

export const ai = useADC
  ? new GoogleGenAI({
      vertexai: true,
      project: process.env.GOOGLE_CLOUD_PROJECT ?? "clearcare-490218",
      location: "global",
    })
  : new GoogleGenAI({
      vertexai: true,
      apiKey: process.env.GOOGLE_API_KEY!,
    })

export const MODELS = {
  /** Document + image OCR */
  vision: "gemini-2.5-flash-lite",
  /** Medical + insurance reasoning */
  reasoning: "gemini-2.5-flash-lite",
  /** Dispute letters and fast responses */
  fast: "gemini-2.5-flash-lite",
} as const

export const MODEL_DISPLAY = {
  vision: "Gemini 2.5 Flash Lite",
  reasoning: "Gemini 2.5 Flash Lite",
  fast: "Gemini 2.5 Flash Lite",
} as const
