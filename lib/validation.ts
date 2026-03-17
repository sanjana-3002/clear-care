/**
 * ClearCare — API input validation helpers
 * Lightweight schema checks without adding a Zod dependency.
 */

export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
}

function ok(): ValidationResult {
  return { valid: true, errors: [] }
}

function fail(errors: ValidationError[]): ValidationResult {
  return { valid: false, errors }
}

// ── PatientProfile ────────────────────────────────────────────────────────────
export function validatePatientProfile(profile: unknown): ValidationResult {
  if (!profile || typeof profile !== "object") {
    return fail([{ field: "patientProfile", message: "Must be an object" }])
  }

  const p = profile as Record<string, unknown>
  const errors: ValidationError[] = []

  if (!p.name || typeof p.name !== "string" || p.name.trim().length === 0) {
    errors.push({ field: "patientProfile.name", message: "Name is required" })
  }
  if (p.name && typeof p.name === "string" && p.name.length > 200) {
    errors.push({ field: "patientProfile.name", message: "Name must be under 200 characters" })
  }

  if (p.age !== undefined) {
    const age = Number(p.age)
    if (!Number.isInteger(age) || age < 0 || age > 150) {
      errors.push({ field: "patientProfile.age", message: "Age must be an integer between 0 and 150" })
    }
  }

  if (!Array.isArray(p.conditions)) {
    errors.push({ field: "patientProfile.conditions", message: "Conditions must be an array" })
  }

  if (!Array.isArray(p.medications)) {
    errors.push({ field: "patientProfile.medications", message: "Medications must be an array" })
  }

  if (!p.insurer || typeof p.insurer !== "string") {
    errors.push({ field: "patientProfile.insurer", message: "Insurer is required" })
  }

  if (!p.planType || typeof p.planType !== "string") {
    errors.push({ field: "patientProfile.planType", message: "Plan type is required" })
  }

  return errors.length > 0 ? fail(errors) : ok()
}

// ── Document text ─────────────────────────────────────────────────────────────
export function validateDocumentText(text: unknown, fieldName = "extractedDocumentText"): ValidationResult {
  if (typeof text !== "string" || text.trim().length === 0) {
    return fail([{ field: fieldName, message: "Document text is required" }])
  }
  if (text.length > 200_000) {
    return fail([{ field: fieldName, message: "Document text exceeds 200,000 character limit" }])
  }
  return ok()
}

// ── Dispute items ─────────────────────────────────────────────────────────────
export function validateDisputeItems(items: unknown): ValidationResult {
  if (!Array.isArray(items) || items.length === 0) {
    return fail([{ field: "disputeItems", message: "At least one dispute item is required" }])
  }
  if (items.length > 50) {
    return fail([{ field: "disputeItems", message: "Maximum 50 dispute items allowed" }])
  }

  const errors: ValidationError[] = []
  items.forEach((item, i) => {
    if (!item || typeof item !== "object") {
      errors.push({ field: `disputeItems[${i}]`, message: "Must be an object" })
      return
    }
    const d = item as Record<string, unknown>
    if (!d.description || typeof d.description !== "string") {
      errors.push({ field: `disputeItems[${i}].description`, message: "Description is required" })
    }
    if (typeof d.amount !== "number" || d.amount < 0) {
      errors.push({ field: `disputeItems[${i}].amount`, message: "Amount must be a non-negative number" })
    }
  })

  return errors.length > 0 ? fail(errors) : ok()
}

// ── File upload ───────────────────────────────────────────────────────────────
export const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]

export const MAX_FILE_SIZE_BYTES = 20 * 1024 * 1024 // 20 MB

export function validateUploadedFile(file: File | null): ValidationResult {
  if (!file) {
    return fail([{ field: "file", message: "No file provided" }])
  }
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return fail([
      {
        field: "file",
        message: `File type "${file.type}" is not supported. Please upload a PDF or image (JPEG, PNG, WebP).`,
      },
    ])
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return fail([
      {
        field: "file",
        message: `File size (${(file.size / 1024 / 1024).toFixed(1)} MB) exceeds the 20 MB limit.`,
      },
    ])
  }
  return ok()
}

// ── Build a 422 JSON response from validation errors ─────────────────────────
export function validationErrorResponse(result: ValidationResult): Response {
  return new Response(
    JSON.stringify({
      error: "Validation failed",
      details: result.errors,
    }),
    {
      status: 422,
      headers: { "Content-Type": "application/json" },
    }
  )
}
