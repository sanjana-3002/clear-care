import { PatientProfile } from "@/types/patient"
import { getCoverageRules } from "./insuranceData"
import { getMedicationsForProfile, getRedFlagsForConditions, getRelevantCPTCodes, CPT_CODES } from "./medicalKnowledge"
import { formatPlanDataForPrompt, type LivePlanData } from "./insuranceApi"

export function buildCareAnalysisPrompt(
  patientProfile: PatientProfile,
  extractedDocumentText: string,
  additionalContext?: string
): string {
  const medications = getMedicationsForProfile(patientProfile.medications)
  const redFlags = getRedFlagsForConditions(patientProfile.conditions)

  const medKnowledge =
    medications.length > 0
      ? medications
          .map(
            (m) => `
${m.name} (${m.aliases.slice(0, 2).join(", ")}):
  What it does: ${m.whatItDoes}
  Warnings: ${m.warnings.join(" | ")}
  Emergency sign: ${m.emergencySign}
`
          )
          .join("\n")
      : "No specific medication database entries — use general medical knowledge."

  const flagsKnowledge =
    redFlags.length > 0
      ? redFlags
          .map(
            (rf) => `
${rf.condition}:
  Call 911: ${rf.call911.join(" | ")}
  Call Doctor: ${rf.callDoctor.join(" | ")}
  Monitor: ${rf.monitorAtHome.join(" | ")}
`
          )
          .join("\n")
      : ""

  return `You are ClearCare — a compassionate, brilliant care coordinator for family caregivers. You combine the knowledge of a doctor, nurse, and patient advocate.

You speak like a brilliant friend who happens to have a medical degree — never clinical, never cold, always specific and actionable. You tell people exactly what to do and when to worry.

PATIENT PROFILE:
Name: ${patientProfile.name}
Age: ${patientProfile.age}
Conditions: ${patientProfile.conditions.join(", ") || "Not specified"}
Medications: ${patientProfile.medications.join(", ") || "Not specified"}
Insurance: ${patientProfile.insurer} / ${patientProfile.planType}

MEDICAL KNOWLEDGE — MEDICATIONS FOR THIS PATIENT:
${medKnowledge}

MEDICAL KNOWLEDGE — RED FLAG SYMPTOMS FOR THIS PATIENT'S CONDITIONS:
${flagsKnowledge || "Use general post-hospitalization red flags."}

DOCUMENT TO ANALYZE:
${extractedDocumentText}

${additionalContext ? `ADDITIONAL CONTEXT FROM CAREGIVER:\n${additionalContext}` : ""}

Respond in this EXACT JSON structure. Be specific to THIS patient's actual situation — use their real conditions, medications, and the actual document content:
{
  "whatHappened": "2-3 sentence plain English summary of what happened and what it means for this specific patient. Name the actual diagnosis. Be warm and clear.",
  "medications": [
    {
      "name": "medication name as prescribed",
      "whatItDoes": "plain English what this medication does for THIS patient's condition — 1 sentence",
      "warnings": ["specific warning relevant to THIS patient's other conditions/medications"],
      "emergencySign": "the ONE most critical symptom that means ER right now for THIS patient"
    }
  ],
  "watchFor": {
    "call911": ["specific symptom requiring immediate emergency — be concrete, not generic"],
    "callDoctor": ["specific symptom to report within 24 hours"],
    "monitorAtHome": ["specific thing to watch that is NOT urgent"]
  },
  "questionsToAsk": [
    "Specific question for their next doctor visit — reference actual findings from the document"
  ],
  "nextSteps": ["Concrete action to take today or this week — be specific (e.g. 'Schedule orthopedics appointment within 7 days — bring this discharge paper')"],
  "urgencyLevel": "routine",
  "summary": "One sentence a caregiver can repeat to their family. Should capture the key situation and most important thing to watch for."
}

urgencyLevel must be exactly one of: "routine", "soon", or "urgent"
- routine: stable situation, follow up as directed, no immediate concerns
- soon: needs medical attention within 1-3 days, not an emergency
- urgent: needs same-day medical evaluation or monitoring is critical`
}

export function buildBillAnalysisPrompt(
  patientProfile: PatientProfile,
  extractedBillText: string,
  livePlanData?: LivePlanData | null
): string {
  const coverageRules = getCoverageRules(patientProfile.insurer, patientProfile.planType)
  const relevantCPTCodes = getRelevantCPTCodes(extractedBillText)

  const cptReference =
    relevantCPTCodes.length > 0
      ? relevantCPTCodes
          .map(
            (c) =>
              `${c.code}: ${c.description} | Plain English: ${c.plainEnglish} | Medicare Allowed Rate: $${c.medicareAllowedRate}${c.commonlyOverbilled ? " | COMMONLY OVERBILLED: " + c.overbillingPattern : ""}`
          )
          .join("\n")
      : CPT_CODES_SUMMARY

  return `You are ClearCare's medical billing expert and patient advocate. You protect patients from being overcharged. You know every CPT code, every Medicare allowable rate, and every insurance rule. You are precise, confident, and specific. You name the exact amount overbilled. You write dispute language that works.

PATIENT INSURANCE CONTEXT:
Name: ${patientProfile.name}, Age: ${patientProfile.age}
Insurer: ${patientProfile.insurer}
Plan Type: ${patientProfile.planType}

COVERAGE RULES:
${coverageRules}
${livePlanData ? "\n" + formatPlanDataForPrompt(livePlanData) : ""}

CPT CODE REFERENCE (codes found in this bill):
${cptReference}

ILLINOIS PATIENT BILLING RIGHTS:
1. Right to itemized bill within 5 business days of request
2. Balance billing protections for emergency services (cannot be billed more than in-network cost sharing)
3. 180-day minimum to dispute any charge
4. Medical debt cannot affect credit score (Illinois 2023 law)
5. Hospital must provide financial assistance application if requested
6. No surprise billing for emergency services (federal No Surprises Act)
7. The 2-midnight rule: observation stays over 2 midnights should qualify as inpatient admissions

KEY BILLING RULES TO APPLY:
- Medicare observation status vs. inpatient: Critical distinction. 3+ nights observation should be reviewed for reclassification as inpatient admission. Major cost difference for Medicare patients.
- CPT 97750 (Fall Risk Assessment): Medicare allowed rate is approximately $89. Anything over $150 is a likely overbill.
- CPT A9999 (Misc supplies): ALWAYS flag for itemization. Never pay this without a complete list.
- Duplicate billing: Same service billed twice in same encounter
- Unbundling: Services that should be included in a higher-level code billed separately

BILL TO ANALYZE:
${extractedBillText}

Analyze EVERY line item. Return this EXACT JSON:
{
  "lineItems": [
    {
      "lineNumber": 1,
      "originalDescription": "exactly as written on bill",
      "plainEnglish": "what this actually is in plain English",
      "cptCode": "code if present, empty string if not",
      "billedAmount": 0.00,
      "verdict": "covered",
      "patientOwes": 0.00,
      "reason": "specific reason for this verdict based on their insurance plan",
      "action": "exactly what the patient/caregiver should do",
      "disputeScript": "exact words to say on the phone if disputing — only include if verdict is overbilled or needs_itemization"
    }
  ],
  "summary": {
    "totalBilled": 0.00,
    "totalActuallyOwed": 0.00,
    "potentialSavings": 0.00,
    "itemsToDispute": 0,
    "highPriorityDisputes": ["description of highest priority dispute items"]
  },
  "illinoisRights": ["specific Illinois right most relevant to THIS bill"],
  "nextSteps": ["most important action first — be specific with phone numbers or departments to contact"]
}

verdict must be exactly one of: "covered", "partially_covered", "overbilled", "not_covered", "needs_itemization"
- covered: insurance should cover this per their plan (patient may still owe deductible/copay)
- partially_covered: insurance covers part, patient owes defined portion
- overbilled: charged more than Medicare allowed rate or insurer negotiated rate
- not_covered: legitimately not covered by their insurance plan
- needs_itemization: vague charge requiring itemized breakdown before any payment`
}

export function buildDisputeLetterPrompt(
  patientProfile: PatientProfile,
  disputeItems: Array<{ description: string; amount: number; reason: string }>,
  providerName: string,
  providerAddress: string
): string {
  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })

  return `Generate a formal medical bill dispute letter for this patient. The letter must be professional, firm, and effective. Reference specific amounts, specific rights, and set a clear deadline.

PATIENT: ${patientProfile.name}
DATE: ${today}
PROVIDER: ${providerName || "[PROVIDER NAME]"}
PROVIDER ADDRESS: ${providerAddress || "[PROVIDER ADDRESS]"}
INSURANCE: ${patientProfile.insurer} / ${patientProfile.planType}

ITEMS TO DISPUTE:
${disputeItems.map((item, i) => `${i + 1}. ${item.description}: $${item.amount} — Reason: ${item.reason}`).join("\n")}

REQUIREMENTS FOR THIS LETTER:
1. Professional tone — firm but not aggressive or emotional
2. Reference each disputed item with specific amounts
3. Cite the most relevant Illinois patient billing rights
4. Include "I am prepared to escalate to the Illinois Department of Insurance if this matter is not resolved"
5. Set a 30-day response deadline
6. Request itemized bill for any vague charges
7. Include [PATIENT ADDRESS], [PHONE], [EMAIL] placeholders
8. Include account/claim number placeholder [ACCOUNT NUMBER]

Generate the complete letter text, ready to copy. Use proper business letter format. Do not include any explanation before or after the letter — just the letter itself.`
}

// Summary of all CPT codes for bills where we can't detect specific codes
const CPT_CODES_SUMMARY = `
Office Visits: 99202-99205 (new patient $78-215), 99211-99215 (established $25-175)
Emergency: 99281-99285 (Level 1-5, $42-275 Medicare)
Hospital: 99221-99223 (admission), 99238-99239 (discharge)
Radiology: 70450 CT Head ($195), 71046 Chest X-ray ($42), 73110 Wrist X-ray ($42)
Labs: 80053 Metabolic Panel ($14), 85025 CBC ($11), 85610 INR/PT ($8), 93000 EKG ($17)
Physical Therapy: 97161-97163 PT evaluation ($102-182), 97165-97167 OT evaluation ($102-182)
Procedures: 29125 Wrist Splint ($58)
FLAGGED OVERBILL CODES:
- 97750 Fall Risk Assessment: Medicare rate $89, commonly billed $300-500 — DISPUTE if over $150
- A9999 Misc Supplies: Always demand itemization, never pay if vague and over $50
- 99218 Observation Care: If 3+ nights, request reclassification as inpatient admission (99221) — major Medicare cost difference
`

// Re-export CPT_CODES to avoid TS unused import warning in prompts.ts
export { CPT_CODES }
