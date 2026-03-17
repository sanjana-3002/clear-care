export interface PatientProfile {
  name: string
  age: number
  conditions: string[]
  medications: string[]
  insurer: string
  planType: string
  insurancePolicyText?: string
}

export const DEFAULT_PROFILE: PatientProfile = {
  name: "",
  age: 65,
  conditions: [],
  medications: [],
  insurer: "",
  planType: "",
}

export const DEMO_PROFILE: PatientProfile = {
  name: "Robert Chen",
  age: 74,
  conditions: ["COPD", "Atrial Fibrillation", "Type 2 Diabetes", "Hypertension", "Fall Risk"],
  medications: ["Warfarin 5mg daily", "Metformin 500mg twice daily", "Metoprolol 25mg daily", "Furosemide 40mg daily", "Albuterol inhaler as needed"],
  insurer: "medicare",
  planType: "medicare-ab-plus-bcbs-supplement",
}

export const DEMO_DISCHARGE_TEXT = `DISCHARGE SUMMARY — Northwestern Memorial Hospital
Patient: Robert Chen  |  DOB: 03/12/1951  |  MRN: 847291
Admission: 03/10/2026  |  Discharge: 03/13/2026
Attending: Dr. Sarah Okafor, MD

REASON FOR ADMISSION:
Patient presented to ED via EMS following ground-level fall at home. Found by daughter on kitchen floor. Complaint of left wrist pain and confusion.

DIAGNOSES:
1. Left distal radius fracture, non-displaced (S52.501A)
2. Acute confusion — resolved, likely medication-related
3. COPD — stable, no acute exacerbation
4. Atrial fibrillation — rate controlled on current regimen
5. Type 2 Diabetes Mellitus — blood glucose elevated on admission, stabilized

PROCEDURES:
- Left wrist splinting applied
- CT Head without contrast: negative for intracranial bleed
- Fall risk assessment completed
- INR check: 2.8 (therapeutic range 2.0-3.0)

MEDICATIONS ON DISCHARGE:
Continue ALL home medications unchanged.
ADD: Hydrocodone/Acetaminophen 5/325mg every 6 hours as needed for pain, maximum 5 days.
IMPORTANT: Patient on Warfarin — blood thinner on board. INR on discharge 2.8. Recheck INR in 3 days at PCP or anticoagulation clinic. Any fall or head injury requires immediate ED evaluation.

FOLLOW-UP REQUIRED:
- Orthopedics: within 1 week for wrist fracture reassessment
- Primary Care: within 3-5 days
- Physical Therapy referral placed — will contact patient to schedule

DISCHARGE INSTRUCTIONS:
Keep left wrist elevated above heart level when possible. Apply ice 20 minutes on, 20 minutes off for first 48 hours. Maintain non-weight-bearing status for left hand. Splint must remain dry. Return precautions: worsening pain, fever above 101°F, increased swelling, numbness or tingling in fingers, any fall or head injury (patient on warfarin — ER immediately).`

export const DEMO_BILL_TEXT = `ITEMIZED BILL — Northwestern Memorial Hospital
Date of Service: 03/10/2026 - 03/13/2026
Patient: Robert Chen  |  Account: 9847261
Insurance: Medicare Part A+B + BCBS Supplement

1.  Emergency Department Level 4 Visit (99284) ......... $1,850.00
2.  CT Head without contrast (70450) ................... $2,100.00
3.  Left wrist X-ray 3 views (73110) ................... $480.00
4.  Fall Risk Assessment (97750) ....................... $380.00
5.  Left wrist splint application (29125) .............. $290.00
6.  Medical supplies — unspecified (A9999) ............. $210.00
7.  Physical therapy evaluation (97162) ................ $340.00
8.  INR blood test/Prothrombin time (85610) ............ $180.00
9.  Comprehensive metabolic panel (80053) .............. $220.00
10. Hospital observation care — 3 nights (99218 x3) ... $3,600.00

TOTAL BILLED:  $9,650.00`

// ─── PATIENT 2: Maria Santos ─────────────────────────────────────────────────

export const DEMO_PROFILE_2: PatientProfile = {
  name: "Maria Santos",
  age: 58,
  conditions: ["Breast Cancer (Stage IIB)", "Hypertension", "Anxiety"],
  medications: ["Lisinopril 10mg daily", "Lorazepam 0.5mg as needed", "Oxycodone 5mg as needed", "Ondansetron 4mg as needed"],
  insurer: "bcbs",
  planType: "gold",
}

export const DEMO_DISCHARGE_TEXT_2 = `DISCHARGE SUMMARY — Rush University Medical Center
Patient: Maria Santos  |  DOB: 07/15/1967  |  MRN: 382947
Admission: 03/09/2026  |  Discharge: 03/11/2026
Attending: Dr. Aisha Patel, MD — Breast Surgery

REASON FOR ADMISSION:
Elective admission for left modified radical mastectomy with sentinel lymph node biopsy. Diagnosis: Left breast invasive ductal carcinoma, Stage IIB (T2N1M0). ER+/PR+/HER2-.

PROCEDURES:
- Left modified radical mastectomy (19303) — margins clear
- Sentinel lymph node biopsy: 2 nodes removed, 1 positive for micrometastasis (38525)
- Jackson-Pratt wound drain placed
- Pathology confirmed: invasive ductal carcinoma, grade 2

MEDICATIONS ON DISCHARGE:
Continue: Lisinopril 10mg daily (blood pressure)
Continue: Lorazepam 0.5mg as needed for anxiety
NEW: Oxycodone 5mg every 6 hours as needed for pain, maximum 5 days
NEW: Ondansetron 4mg as needed for nausea
HOLD: Do NOT start Tamoxifen until instructed by oncologist — timing with upcoming chemotherapy matters
Drain care: empty twice daily, record output volume, call if >30mL/day after day 5

FOLLOW-UP REQUIRED:
- Breast Surgery: 1 week — drain removal if output below 30mL/day
- Medical Oncology: 2 weeks — discuss chemotherapy + hormone therapy (Tamoxifen) plan
- Radiation Oncology: 3 weeks — treatment planning
- Physical Therapy: lymphedema prevention exercises for left arm

DISCHARGE INSTRUCTIONS:
No lifting over 5 lbs with left arm — permanent restriction until PT clears. Monitor drain site for redness, warmth, or foul odor. Call immediately for fever above 101°F, sudden increase in drain output, or signs of wound infection. Patient has hypertension — monitor blood pressure daily. Lorazepam: use only as prescribed, do not combine with Oxycodone without doctor guidance — sedation risk. The opioid pain medication must not be combined with alcohol.`

export const DEMO_BILL_TEXT_2 = `ITEMIZED BILL — Rush University Medical Center
Date of Service: 03/09/2026 - 03/11/2026
Patient: Maria Santos  |  Account: 7291847
Insurance: Blue Cross Blue Shield Gold PPO

1.  Mastectomy, modified radical (19303) .............. $12,400.00
2.  Sentinel lymph node biopsy (38525) ................. $3,200.00
3.  Pathology — surgical specimen (88305 x3) ........... $2,100.00
4.  Anesthesia — general, 3 hours (00402) .............. $4,800.00
5.  Hospital room — 2 nights semi-private .............. $3,600.00
6.  Wound drain supplies (A9999) ........................ $890.00
7.  IV medications — unspecified (96365) ................. $740.00
8.  Chest X-ray 2 views, pre-op (71046) .................. $480.00
9.  Breast MRI with contrast (77059) ................... $3,900.00
10. Post-op hospital care (99232 x2) ..................... $860.00

TOTAL BILLED:  $32,970.00`

// ─── PATIENT 3: James Wilson ──────────────────────────────────────────────────

export const DEMO_PROFILE_3: PatientProfile = {
  name: "James Wilson",
  age: 67,
  conditions: ["Congestive Heart Failure (EF 35%)", "Type 2 Diabetes", "Chronic Kidney Disease Stage 3", "Hypertension"],
  medications: ["Furosemide 40mg daily", "Metoprolol succinate 50mg daily", "Lisinopril 5mg daily", "Metformin 500mg twice daily", "Atorvastatin 40mg nightly", "Insulin glargine 20 units bedtime"],
  insurer: "united",
  planType: "silver",
}

export const DEMO_DISCHARGE_TEXT_3 = `DISCHARGE SUMMARY — University of Chicago Medical Center
Patient: James Wilson  |  DOB: 11/02/1958  |  MRN: 591847
Admission: 03/08/2026  |  Discharge: 03/12/2026
Attending: Dr. Marcus Chen, MD — Cardiology

REASON FOR ADMISSION:
Patient presented with 4-day history of progressive shortness of breath, orthopnea (must sleep sitting up), and bilateral leg swelling. BNP on admission: 2,840 pg/mL (severely elevated, normal <100). Chest X-ray confirmed pulmonary edema. Diagnosis: Acute decompensated congestive heart failure, HFrEF with ejection fraction of 35%.

DIAGNOSES:
1. Acute decompensated heart failure, HFrEF EF 35% — primary
2. Type 2 Diabetes Mellitus — blood glucose 280 on admission, controlled by discharge
3. Chronic Kidney Disease Stage 3 — creatinine 1.8, stable throughout admission
4. Hypertension — controlled

PROCEDURES:
- IV Furosemide diuresis — 3 days, patient lost 8 lbs of fluid weight
- Echocardiogram: confirmed EF 35%, moderate mitral regurgitation, dilated left ventricle
- Cardiology consultation completed
- Diabetic education session — insulin technique and dose adjustment
- Continuous cardiac telemetry monitoring throughout admission

MEDICATIONS ON DISCHARGE:
INCREASED: Furosemide 80mg daily (was 40mg) — critical, do not skip
NEW: Spironolactone 25mg daily — added for heart failure, watch for high potassium
CONTINUE: Metoprolol succinate 50mg daily
CONTINUE: Lisinopril 5mg daily
CONTINUE: Metformin 500mg twice daily — MUST HOLD 48 hours before/after any contrast imaging
CONTINUE: Atorvastatin 40mg nightly
INSULIN ADJUSTED: Lantus (glargine) 20 units at bedtime — new dose

FOLLOW-UP REQUIRED:
- Cardiology: 1 week — basic metabolic panel to check potassium (spironolactone + furosemide combination requires monitoring)
- Primary Care: 3-5 days — weight check, blood pressure
- Diabetes educator: 2 weeks

DISCHARGE INSTRUCTIONS:
Weigh yourself every morning — same time, same scale, before eating. Call doctor immediately if weight increases 2 or more pounds in a single day (fluid is returning). Fluid restriction: maximum 64 oz (8 cups) per day total. Low-sodium diet: under 2,000mg sodium daily — read all food labels. Elevate feet on a pillow when sitting. NEVER skip the Furosemide water pill. Rise slowly from bed — dizziness risk. Return to ER for: sudden worsening shortness of breath, chest pain, inability to lie flat, weight gain of 3+ lbs in 2 days.`

export const DEMO_BILL_TEXT_3 = `ITEMIZED BILL — University of Chicago Medical Center
Date of Service: 03/08/2026 - 03/12/2026
Patient: James Wilson  |  Account: 4829173
Insurance: UnitedHealthcare Silver PPO

1.  Hospital admission, high complexity (99223) ........ $2,800.00
2.  Hospital daily care (99232 x3) ..................... $1,620.00
3.  Hospital discharge (99238) ........................... $580.00
4.  Echocardiogram with Doppler (93306) ................ $2,400.00
5.  Cardiology consultation (99254) ...................... $890.00
6.  BNP blood test (83880) ............................... $380.00
7.  Comprehensive metabolic panel (80053 x3) ............. $660.00
8.  Chest X-ray 2 views (71046 x2) ....................... $760.00
9.  IV Furosemide administration (96365 x3) .............. $540.00
10. Diabetic education, individual session (G0108) ....... $320.00
11. Medical supplies — unspecified (A9999) ............... $430.00
12. Telemetry monitoring — 4 days (99226) .............. $3,200.00

TOTAL BILLED:  $15,580.00`

// ─── SCENARIO REGISTRY ────────────────────────────────────────────────────────

export interface DemoScenario {
  id: string
  profile: PatientProfile
  dischargeText: string
  billText: string
  hook: string        // one-line "what happened" for the selector card
  billHook: string    // one-line billing teaser
  color: "teal" | "rose" | "blue"
}

export const DEMO_SCENARIOS: DemoScenario[] = [
  {
    id: "robert",
    profile: DEMO_PROFILE,
    dischargeText: DEMO_DISCHARGE_TEXT,
    billText: DEMO_BILL_TEXT,
    hook: "Fall at home on Warfarin — wrist fracture, 3-night hospital stay",
    billHook: "$9,650 billed · observation vs. inpatient issue · fall assessment overbilled",
    color: "teal",
  },
  {
    id: "maria",
    profile: DEMO_PROFILE_2,
    dischargeText: DEMO_DISCHARGE_TEXT_2,
    billText: DEMO_BILL_TEXT_2,
    hook: "Post-mastectomy discharge — opioid + anxiety med interaction warning",
    billHook: "$32,970 billed · $890 unitemized supplies · pre-op MRI dispute",
    color: "rose",
  },
  {
    id: "james",
    profile: DEMO_PROFILE_3,
    dischargeText: DEMO_DISCHARGE_TEXT_3,
    billText: DEMO_BILL_TEXT_3,
    hook: "Acute heart failure — 8 lbs of fluid, new medications, daily weight critical",
    billHook: "$15,580 billed · $3,200 telemetry charge · unspecified supplies",
    color: "blue",
  },
]
