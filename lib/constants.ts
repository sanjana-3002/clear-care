/**
 * ClearCare — shared constants
 * Single source of truth for magic numbers, durations, and config values.
 */

// ── Animation ─────────────────────────────────────────────────────────────────
export const BOUNCE_DELAYS_MS = [0, 150, 300] as const
export const COUNT_UP_DURATION_MS = 1800
export const SAVINGS_COUNT_UP_DURATION_MS = 2200
export const COPY_FEEDBACK_DURATION_MS = 2000
export const ABORT_SETTLE_DELAY_MS = 80

// ── Streaming ─────────────────────────────────────────────────────────────────
export const STREAMING_PREVIEW_CHARS = 400
export const CARE_STREAMING_PREVIEW_CHARS = 300

// ── Storage keys ──────────────────────────────────────────────────────────────
export const STORAGE_KEYS = {
  patientProfile: "clearcare_patient_profile",
  careResult: "clearcare_care_result",
  billResult: "clearcare_bill_result",
} as const

export function checklistStorageKey(date: string): string {
  return `clearcare_checklist_${date}`
}

// ── API limits ────────────────────────────────────────────────────────────────
export const MAX_DOCUMENT_TEXT_CHARS = 200_000
export const MAX_DISPUTE_ITEMS = 50
export const MAX_FILE_SIZE_MB = 20
export const MAX_PATIENT_NAME_CHARS = 200

// ── Gemini config ─────────────────────────────────────────────────────────────
export const GEMINI_THINKING_BUDGET_ANALYSIS = 8192
export const GEMINI_THINKING_BUDGET_LETTER = 0
export const GEMINI_TEMP_CARE = 0.2
export const GEMINI_TEMP_BILL = 0.1
export const GEMINI_TEMP_LETTER = 0.3
export const GEMINI_TEMP_VISION = 0

// ── Demo ──────────────────────────────────────────────────────────────────────
export const DEMO_ELAPSED_INTERVAL_MS = 100
