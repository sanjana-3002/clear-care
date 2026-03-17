export interface CPTCode {
  code: string
  description: string
  plainEnglish: string
  medicareAllowedRate: number
  commonlyOverbilled: boolean
  overbillingPattern?: string
}

export interface Medication {
  name: string
  aliases: string[]
  whatItDoes: string
  warnings: string[]
  emergencySign: string
}

export interface RedFlagsByCondition {
  condition: string
  call911: string[]
  callDoctor: string[]
  monitorAtHome: string[]
}

export const CPT_CODES: CPTCode[] = [
  // Office visits - new patients
  { code: "99202", description: "Office visit, new patient, low complexity", plainEnglish: "New patient doctor visit — short, simple problem", medicareAllowedRate: 78, commonlyOverbilled: false },
  { code: "99203", description: "Office visit, new patient, moderate complexity", plainEnglish: "New patient doctor visit — moderate problem", medicareAllowedRate: 115, commonlyOverbilled: false },
  { code: "99204", description: "Office visit, new patient, moderate-high complexity", plainEnglish: "New patient doctor visit — complex problem", medicareAllowedRate: 168, commonlyOverbilled: true, overbillingPattern: "Often upcoded when a simpler visit was actually provided" },
  { code: "99205", description: "Office visit, new patient, high complexity", plainEnglish: "New patient doctor visit — very complex problem", medicareAllowedRate: 215, commonlyOverbilled: true, overbillingPattern: "Should only be used for highest complexity cases" },
  // Office visits - established patients
  { code: "99211", description: "Office visit, established patient, minimal", plainEnglish: "Quick nurse visit — blood pressure check, etc.", medicareAllowedRate: 25, commonlyOverbilled: false },
  { code: "99212", description: "Office visit, established patient, low", plainEnglish: "Established patient visit — simple problem", medicareAllowedRate: 57, commonlyOverbilled: false },
  { code: "99213", description: "Office visit, established patient, moderate", plainEnglish: "Established patient visit — routine follow-up", medicareAllowedRate: 92, commonlyOverbilled: false },
  { code: "99214", description: "Office visit, established patient, moderate-high", plainEnglish: "Established patient visit — complex follow-up", medicareAllowedRate: 130, commonlyOverbilled: true, overbillingPattern: "Most commonly upcoded office visit code — often billed when 99213 is appropriate" },
  { code: "99215", description: "Office visit, established patient, high complexity", plainEnglish: "Established patient visit — very complex problem", medicareAllowedRate: 175, commonlyOverbilled: true, overbillingPattern: "Reserved for truly complex medical decision making" },
  // Emergency
  { code: "99281", description: "Emergency department visit, Level 1", plainEnglish: "ER visit — minor problem (headache, minor injury)", medicareAllowedRate: 42, commonlyOverbilled: false },
  { code: "99282", description: "Emergency department visit, Level 2", plainEnglish: "ER visit — low complexity problem", medicareAllowedRate: 76, commonlyOverbilled: false },
  { code: "99283", description: "Emergency department visit, Level 3", plainEnglish: "ER visit — moderate complexity", medicareAllowedRate: 116, commonlyOverbilled: false },
  { code: "99284", description: "Emergency department visit, Level 4", plainEnglish: "ER visit — high complexity (fracture, chest pain, etc.)", medicareAllowedRate: 182, commonlyOverbilled: true, overbillingPattern: "Frequently upcoded to Level 4/5 for routine visits" },
  { code: "99285", description: "Emergency department visit, Level 5", plainEnglish: "ER visit — highest complexity (life-threatening)", medicareAllowedRate: 275, commonlyOverbilled: true, overbillingPattern: "Should be reserved for true high-acuity emergencies" },
  // Hospital
  { code: "99221", description: "Hospital inpatient admission, low complexity", plainEnglish: "Hospital admission — straightforward admission", medicareAllowedRate: 220, commonlyOverbilled: false },
  { code: "99222", description: "Hospital inpatient admission, moderate complexity", plainEnglish: "Hospital admission — moderate medical problem", medicareAllowedRate: 285, commonlyOverbilled: false },
  { code: "99223", description: "Hospital inpatient admission, high complexity", plainEnglish: "Hospital admission — complex medical problem", medicareAllowedRate: 400, commonlyOverbilled: false },
  { code: "99238", description: "Hospital discharge, 30 minutes or less", plainEnglish: "Hospital discharge day services", medicareAllowedRate: 145, commonlyOverbilled: false },
  { code: "99239", description: "Hospital discharge, more than 30 minutes", plainEnglish: "Hospital discharge day — extended services", medicareAllowedRate: 215, commonlyOverbilled: true, overbillingPattern: "Often billed when 99238 is more appropriate" },
  // Radiology
  { code: "70450", description: "CT scan head/brain without contrast", plainEnglish: "CT scan of the head — no dye used", medicareAllowedRate: 195, commonlyOverbilled: false },
  { code: "71046", description: "Chest X-ray, 2 views", plainEnglish: "Chest X-ray — front and side views", medicareAllowedRate: 42, commonlyOverbilled: false },
  { code: "73030", description: "Shoulder X-ray, minimum 2 views", plainEnglish: "Shoulder X-ray", medicareAllowedRate: 38, commonlyOverbilled: false },
  { code: "73560", description: "Knee X-ray, 1-2 views", plainEnglish: "Knee X-ray", medicareAllowedRate: 36, commonlyOverbilled: false },
  { code: "73100", description: "Wrist X-ray, 2 views", plainEnglish: "Wrist X-ray — 2 images", medicareAllowedRate: 35, commonlyOverbilled: false },
  { code: "73110", description: "Wrist X-ray, minimum 3 views", plainEnglish: "Wrist X-ray — 3 or more images (more complete)", medicareAllowedRate: 42, commonlyOverbilled: false },
  // Labs
  { code: "80053", description: "Comprehensive metabolic panel", plainEnglish: "Blood test checking kidney, liver, electrolytes, blood sugar", medicareAllowedRate: 14, commonlyOverbilled: false },
  { code: "85025", description: "Complete blood count with differential", plainEnglish: "Complete blood count — checks red cells, white cells, platelets", medicareAllowedRate: 11, commonlyOverbilled: false },
  { code: "85610", description: "Prothrombin time (PT/INR)", plainEnglish: "Blood clotting test — especially for Warfarin monitoring", medicareAllowedRate: 8, commonlyOverbilled: false },
  { code: "93000", description: "Electrocardiogram (EKG/ECG)", plainEnglish: "Heart rhythm tracing — 12-lead EKG", medicareAllowedRate: 17, commonlyOverbilled: false },
  // Physical/Occupational Therapy
  { code: "97161", description: "Physical therapy evaluation, low complexity", plainEnglish: "PT evaluation — initial assessment, simple case", medicareAllowedRate: 102, commonlyOverbilled: false },
  { code: "97162", description: "Physical therapy evaluation, moderate complexity", plainEnglish: "PT evaluation — initial assessment, moderate case", medicareAllowedRate: 145, commonlyOverbilled: false },
  { code: "97163", description: "Physical therapy evaluation, high complexity", plainEnglish: "PT evaluation — complex case with multiple conditions", medicareAllowedRate: 182, commonlyOverbilled: false },
  { code: "97165", description: "Occupational therapy evaluation, low complexity", plainEnglish: "OT evaluation — daily living skills assessment, simple", medicareAllowedRate: 102, commonlyOverbilled: false },
  { code: "97166", description: "Occupational therapy evaluation, moderate complexity", plainEnglish: "OT evaluation — moderate case", medicareAllowedRate: 145, commonlyOverbilled: false },
  { code: "97167", description: "Occupational therapy evaluation, high complexity", plainEnglish: "OT evaluation — complex case", medicareAllowedRate: 182, commonlyOverbilled: false },
  // Procedures
  { code: "29125", description: "Application of short arm splint, static", plainEnglish: "Putting on a wrist/forearm splint", medicareAllowedRate: 58, commonlyOverbilled: false },
  { code: "97750", description: "Physical performance test", plainEnglish: "Fall risk / functional assessment testing", medicareAllowedRate: 89, commonlyOverbilled: true, overbillingPattern: "Medicare allowed ~$89 but frequently billed $300-500. Always dispute if billed over $150." },
  // Supplies
  { code: "A4570", description: "Splint", plainEnglish: "The physical splint device", medicareAllowedRate: 45, commonlyOverbilled: false },
  { code: "A9999", description: "Miscellaneous DME supply", plainEnglish: "Unspecified medical supplies — catch-all code", medicareAllowedRate: 0, commonlyOverbilled: true, overbillingPattern: "This is a vague catch-all code. Always demand itemization. Never pay A9999 charges over $50 without a complete list of exactly what was provided." },
  { code: "E0110", description: "Crutches, underarm, pair", plainEnglish: "Standard underarm crutches", medicareAllowedRate: 28, commonlyOverbilled: false },
  // Observation
  { code: "99218", description: "Hospital observation care, initial (low complexity)", plainEnglish: "Hospital observation — you're in the hospital but not 'officially' admitted", medicareAllowedRate: 220, commonlyOverbilled: true, overbillingPattern: "Critical: Under Medicare's 2-midnight rule, if you stay more than 2 midnights, you should be reclassified as an inpatient admission (99221). Observation status has major implications — it does NOT count toward the 3-day hospital stay required for skilled nursing facility coverage under Medicare. Always ask: 'Am I admitted or on observation?'" },
]

export const MEDICATIONS: Medication[] = [
  {
    name: "Warfarin",
    aliases: ["Coumadin", "Jantoven", "warfarin sodium"],
    whatItDoes: "A blood thinner (anticoagulant) that prevents dangerous blood clots in people with atrial fibrillation, artificial heart valves, or history of clots.",
    warnings: [
      "NEVER take NSAIDs (Advil, Aleve, Motrin, ibuprofen, naproxen) — significantly increases bleeding risk, can be life-threatening",
      "Avoid large amounts of leafy greens (spinach, kale, broccoli) — vitamin K reduces warfarin effectiveness",
      "Alcohol increases bleeding risk significantly — limit strictly",
      "ANY new medication (prescription or over-the-counter) must be checked for interaction before taking",
      "Aspirin also increases bleeding risk — only take if doctor specifically says to",
      "Get INR checked regularly as directed — skipping tests is dangerous",
    ],
    emergencySign: "Any head injury, fall, or bump to the head — go to ER immediately, even if feeling fine. Internal brain bleeding can develop over hours. Also go to ER for: black or tarry stools (internal bleeding), coughing or vomiting blood, unusual bruising that is spreading rapidly, or any injury that won't stop bleeding after 10 minutes of firm pressure.",
  },
  {
    name: "Metformin",
    aliases: ["Glucophage", "Fortamet", "Glumetza"],
    whatItDoes: "Lowers blood sugar for Type 2 Diabetes by reducing glucose production in the liver and improving insulin sensitivity.",
    warnings: [
      "HOLD for 48 hours before AND after any CT scan, MRI, or procedure using iodine contrast dye — can cause serious kidney problems",
      "Take with food to reduce stomach upset (nausea, diarrhea) — especially when first starting",
      "Alcohol increases hypoglycemia (low blood sugar) risk and lactic acidosis risk",
      "If you have a stomach illness with vomiting or diarrhea, hold medication and call doctor — risk of dehydration",
      "Do not crush or chew extended-release tablets",
    ],
    emergencySign: "Unusual muscle pain, weakness, trouble breathing, stomach pain, nausea, or vomiting — may indicate lactic acidosis (rare but life-threatening). Call 911. Also: blood sugar below 70mg/dL with symptoms (shakiness, sweating, confusion) — eat 15g fast sugar (juice, glucose tablets) immediately.",
  },
  {
    name: "Lisinopril",
    aliases: ["Prinivil", "Zestril", "lisinopril"],
    whatItDoes: "An ACE inhibitor that lowers blood pressure and protects the kidneys, especially in people with diabetes or heart failure.",
    warnings: [
      "Dry cough is a common side effect — annoying but not dangerous. Tell your doctor, who may switch to a similar medication (ARB), but don't just stop taking it",
      "Avoid potassium supplements and high-potassium salt substitutes — can cause dangerous potassium buildup",
      "Can cause dizziness when standing up (orthostatic hypotension) — rise slowly from bed or chair",
      "Avoid NSAIDs (Advil, Aleve) — reduce effectiveness and can harm kidneys",
      "NEVER take during pregnancy",
    ],
    emergencySign: "Sudden swelling of face, lips, tongue, or throat (especially throat tightening or difficulty swallowing/breathing) — this is angioedema, call 911 immediately. Can develop even after years of taking the medication.",
  },
  {
    name: "Metoprolol",
    aliases: ["Lopressor", "Toprol-XL", "metoprolol succinate", "metoprolol tartrate"],
    whatItDoes: "A beta-blocker that slows heart rate and lowers blood pressure, used for heart failure, atrial fibrillation, high blood pressure, and after heart attacks.",
    warnings: [
      "NEVER stop abruptly — must taper slowly under doctor supervision. Sudden stopping can cause dangerous rebound rapid heart rate or heart attack",
      "Can mask signs of low blood sugar in diabetics (shakiness, rapid heart rate) — rely on glucose monitoring",
      "Avoid cold and flu medicines containing pseudoephedrine (Sudafed) — can counteract the medication",
      "Take at the same time each day — consistency is important for heart rhythm control",
      "Metoprolol tartrate (Lopressor) is twice-daily; metoprolol succinate (Toprol-XL) is once-daily — don't confuse them",
    ],
    emergencySign: "Heart rate consistently below 50 beats per minute, severe dizziness, fainting, or sudden shortness of breath — these may indicate the dose is too high. Call doctor urgently. If unconscious: call 911.",
  },
  {
    name: "Atorvastatin",
    aliases: ["Lipitor", "atorvastatin calcium"],
    whatItDoes: "A statin that lowers LDL ('bad') cholesterol and triglycerides, reducing risk of heart attack and stroke.",
    warnings: [
      "Take at night — cholesterol production peaks at night, so evening dosing is most effective",
      "Avoid large amounts of grapefruit juice — can increase medication levels in blood dangerously",
      "Report any new muscle pain, tenderness, or weakness to doctor — important potential side effect",
      "Liver function should be monitored periodically",
    ],
    emergencySign: "Severe muscle pain or weakness COMBINED with dark, cola-colored urine — this is rhabdomyolysis (muscle breakdown), a rare but serious emergency. Stop medication and go to ER immediately.",
  },
  {
    name: "Furosemide",
    aliases: ["Lasix", "furosemide"],
    whatItDoes: "A diuretic ('water pill') that removes excess fluid from the body, used for heart failure, kidney disease, and high blood pressure.",
    warnings: [
      "Take in the morning — causes frequent urination for several hours, disrupts sleep if taken at night",
      "Monitor for dizziness when standing (can cause dehydration) — rise slowly",
      "Eat potassium-rich foods: bananas, oranges, potatoes, avocado — furosemide depletes potassium",
      "Weigh yourself daily at the same time — weight gain of 2+ lbs in a day means call your doctor",
      "Avoid excessive sun exposure — increases sensitivity to sunburn",
    ],
    emergencySign: "Muscle cramps WITH irregular heartbeat or palpitations — may indicate dangerously low potassium (hypokalemia). Also: severe dizziness or fainting, extreme thirst with decreased urination (dehydration). Call doctor urgently; go to ER if having chest pain or palpitations.",
  },
  {
    name: "Hydrocodone",
    aliases: ["Vicodin", "Norco", "Lortab", "hydrocodone/acetaminophen", "hydrocodone bitartrate"],
    whatItDoes: "An opioid pain reliever combined with acetaminophen (Tylenol), used for moderate to severe pain, typically after injury or surgery.",
    warnings: [
      "NEVER mix with alcohol — can slow breathing to the point of death",
      "Do not drive or operate heavy machinery while taking — causes sedation",
      "Can cause constipation — use a stool softener (docusate) from day 1, don't wait until constipated",
      "NEVER take with other opioids, benzodiazepines (Xanax, Valium, Ativan), or sleep medications — extremely dangerous combination",
      "The acetaminophen (Tylenol) component: do not take additional Tylenol or products containing acetaminophen — max 3,000mg/day total",
      "Highly addictive — take only as prescribed, use minimum necessary dose for minimum necessary time",
      "Store locked away — accidental ingestion by children or theft is serious",
    ],
    emergencySign: "Breathing very slow, shallow, or stopped. Blue or gray lips or fingertips. Won't wake up or respond. Pinpoint (very small) pupils. CALL 911 IMMEDIATELY. If Narcan (naloxone) is available, administer it right away — this is an opioid overdose emergency.",
  },
  {
    name: "Oxycodone",
    aliases: ["OxyContin", "Percocet", "Roxicodone", "oxycodone HCl"],
    whatItDoes: "A strong opioid pain reliever used for moderate to severe pain. OxyContin is extended-release; Percocet contains acetaminophen.",
    warnings: [
      "NEVER crush, chew, or dissolve extended-release tablets — releases entire dose at once, can be fatal",
      "NEVER mix with alcohol — can stop breathing",
      "Do not drive — severe impairment",
      "Extremely addictive — highest abuse potential of common pain medications",
      "If stopping after prolonged use: must taper slowly under medical supervision to avoid withdrawal",
    ],
    emergencySign: "Breathing very slow, shallow, or stopped. Won't wake up. Blue lips. Pinpoint pupils. CALL 911 IMMEDIATELY. Administer Narcan if available.",
  },
  {
    name: "Prednisone",
    aliases: ["Deltasone", "Rayos", "prednisone"],
    whatItDoes: "A corticosteroid (steroid) that powerfully reduces inflammation and suppresses the immune system, used for COPD flares, allergic reactions, arthritis, and many other conditions.",
    warnings: [
      "NEVER stop abruptly if taken for more than 1 week — adrenal glands need time to restart; must taper the dose gradually",
      "Take with food — can cause significant stomach irritation or ulcers on empty stomach",
      "May raise blood sugar in diabetics — monitor glucose more frequently",
      "Increases infection risk — avoid people who are sick; report any fever to doctor immediately",
      "Can cause mood changes, insomnia, increased appetite — these are expected, tell doctor if severe",
      "Long-term use: bone density loss, vision changes (cataracts), weight gain — discuss with doctor",
    ],
    emergencySign: "Severe abdominal pain, sudden vision changes, or high fever with confusion — can indicate serious complications. Adrenal crisis (if stopped abruptly): severe weakness, dizziness, vomiting — call 911.",
  },
  {
    name: "Albuterol",
    aliases: ["ProAir", "Ventolin", "Proventil", "albuterol sulfate"],
    whatItDoes: "A fast-acting bronchodilator ('rescue inhaler') that quickly opens the airways during asthma or COPD attacks — works within minutes.",
    warnings: [
      "This is a RESCUE inhaler — for acute symptoms only, NOT for daily maintenance",
      "If using more than 2 times per week (not counting exercise), tell your doctor — asthma/COPD is not well controlled",
      "Shake well before each use",
      "Rinse mouth with water after each use to prevent throat irritation",
      "Can cause rapid heartbeat and shakiness — normal, temporary side effects",
      "Check expiration date — expired inhalers may not work in an emergency",
    ],
    emergencySign: "Rescue inhaler not working or making symptoms WORSE after 2 puffs. Lips or fingernails turning blue or gray (cyanosis). Can't speak in full sentences due to breathlessness. Breathing muscles in neck visibly straining. CALL 911 IMMEDIATELY — this is a respiratory emergency.",
  },
  {
    name: "Gabapentin",
    aliases: ["Neurontin", "Gralise", "gabapentin"],
    whatItDoes: "Treats nerve pain (neuropathy), seizures, and restless leg syndrome. Also used off-label for anxiety and pain.",
    warnings: [
      "Can cause significant dizziness and drowsiness — serious fall risk, especially in elderly",
      "Do not drive until you know how it affects you",
      "Do not stop abruptly — can cause withdrawal seizures; taper slowly",
      "Avoid alcohol — compounds drowsiness and risk of respiratory depression",
      "DANGEROUS combination with opioids — together can cause fatal breathing suppression",
    ],
    emergencySign: "Extreme dizziness with difficulty breathing — especially if combined with opioids or other sedatives. This is potentially fatal respiratory depression. Call 911.",
  },
  {
    name: "Amlodipine",
    aliases: ["Norvasc", "amlodipine besylate"],
    whatItDoes: "A calcium channel blocker that lowers blood pressure and treats chest pain (angina) by relaxing blood vessels.",
    warnings: [
      "Can cause ankle swelling — common side effect, tell your doctor but don't panic",
      "Avoid grapefruit juice — can increase medication levels",
      "Rise slowly from sitting or lying — can cause dizziness (orthostatic hypotension)",
      "Do not stop abruptly if taking for angina — can worsen chest pain",
    ],
    emergencySign: "Severe chest pain not relieved by rest (possible heart attack), accompanied by severe worsening leg swelling and difficulty breathing (possible heart failure exacerbation). Call 911.",
  },
  {
    name: "Spironolactone",
    aliases: ["Aldactone", "Carospir", "spironolactone"],
    whatItDoes: "A potassium-sparing diuretic and aldosterone blocker used for heart failure (improves survival in HFrEF), high blood pressure, and fluid retention.",
    warnings: [
      "AVOID potassium supplements, potassium-containing salt substitutes, and high-potassium foods in large amounts — can cause dangerous hyperkalemia (high potassium)",
      "AVOID combining with ACE inhibitors (lisinopril) or ARBs without regular potassium monitoring — triple whammy risk",
      "Avoid NSAIDs (Advil, Aleve, ibuprofen) — reduce effectiveness and can harm kidneys",
      "Potassium level must be checked within 1 week of starting and regularly thereafter",
      "Can cause breast tenderness or enlargement in men (gynecomastia) — common, tell doctor if bothersome",
      "Take with food to reduce stomach upset",
    ],
    emergencySign: "Muscle weakness, extreme fatigue, palpitations, or irregular heartbeat — may indicate dangerously high potassium (hyperkalemia). This can cause cardiac arrest. Call 911 if having chest pain or palpitations. Call doctor urgently for muscle weakness.",
  },
  {
    name: "Aspirin",
    aliases: ["ASA", "acetylsalicylic acid", "Bayer", "Ecotrin", "aspirin 81mg", "baby aspirin"],
    whatItDoes: "A blood thinner and anti-inflammatory used to prevent heart attacks, strokes, and blood clots in people with cardiovascular disease or who have had a cardiac event.",
    warnings: [
      "NEVER take with other NSAIDs (Advil, Aleve, ibuprofen) unless directed — increases bleeding risk and stomach damage",
      "Taking with Warfarin or Plavix (clopidogrel): ONLY if specifically prescribed by doctor — doubles bleeding risk",
      "Take with food or a full glass of water to reduce stomach irritation",
      "Stop before scheduled surgery ONLY if doctor specifically instructs — never decide this alone",
      "Reye's syndrome risk: NEVER give to children or teenagers with viral illness",
      "Can cause stomach ulcers with long-term use — call doctor if black, tarry stools develop",
    ],
    emergencySign: "Black or tarry stools (gastrointestinal bleeding), vomiting blood, or any injury that won't stop bleeding — call 911. Also: if taking for a heart condition and experiencing chest pain, call 911 immediately and take an additional 325mg aspirin if available (chew, don't swallow whole) unless allergic.",
  },
  {
    name: "Insulin glargine",
    aliases: ["Lantus", "Basaglar", "Toujeo", "insulin glargine", "Lantus SoloStar"],
    whatItDoes: "A long-acting (basal) insulin that provides steady 24-hour blood sugar control for people with Type 1 or Type 2 Diabetes. It is NOT for low blood sugar emergencies.",
    warnings: [
      "NEVER mix with other insulins in the same syringe — glargine must be injected alone",
      "Inject at the SAME TIME each day — consistency is critical",
      "Rotate injection sites every dose — thighs, abdomen, upper arms — to prevent lumpy skin (lipohypertrophy)",
      "Store in refrigerator; opened pen/vial can be kept at room temperature for 28 days maximum",
      "NEVER shake the vial or pen — roll gently if needed",
      "Alcohol can cause unpredictable blood sugar changes — monitor closely",
      "Missing a dose: take as soon as remembered the same day. If it is the next day, skip the missed dose — NEVER double up",
    ],
    emergencySign: "Blood sugar below 70 mg/dL with symptoms (shakiness, confusion, sweating, fast heartbeat): eat 15g fast-acting sugar immediately (4 oz juice, 4 glucose tablets, 5 hard candies). Recheck in 15 minutes. If unresponsive or seizuring: call 911, inject glucagon kit if available.",
  },
  {
    name: "Clopidogrel",
    aliases: ["Plavix", "clopidogrel bisulfate"],
    whatItDoes: "A blood thinner (antiplatelet) that prevents blood clots, used after heart attacks, stents, strokes, or for atrial fibrillation. Often used with aspirin ('dual antiplatelet therapy').",
    warnings: [
      "NEVER stop abruptly after a heart stent — can cause stent thrombosis (sudden clot in stent), which is life-threatening. Only stop under doctor supervision",
      "Omeprazole (Prilosec) significantly reduces effectiveness — use pantoprazole (Protonix) instead if a stomach protector is needed",
      "Avoid NSAIDs (Advil, Aleve) — greatly increases bleeding risk",
      "Any procedure (dental, surgical) requires telling the provider about this medication",
      "Easy bruising is common and expected — not a reason to stop",
    ],
    emergencySign: "Uncontrolled bleeding, black or tarry stools, blood in urine, or coughing/vomiting blood — call 911. Any sudden chest pain in a patient with a stent — call 911 immediately (possible stent thrombosis).",
  },
  {
    name: "Levothyroxine",
    aliases: ["Synthroid", "Levoxyl", "Unithroid", "levothyroxine sodium"],
    whatItDoes: "Replaces or supplements thyroid hormone for people with hypothyroidism (underactive thyroid).",
    warnings: [
      "Take on an EMPTY stomach, 30-60 minutes BEFORE eating — food dramatically reduces absorption",
      "Many medications interfere: take levothyroxine ALONE, then wait before other morning medications",
      "Calcium supplements, iron supplements, and antacids containing calcium or magnesium: take at least 4 hours apart",
      "Consistent brand matters — don't switch between brand and generic without doctor's knowledge",
      "TSH levels must be monitored every 6-12 months — don't skip labs",
    ],
    emergencySign: "Chest pain with rapid or irregular heartbeat — may indicate the dose is too high (hyperthyroid state). Also: severe chest pain with sweating and shortness of breath. Call 911.",
  },
]

export const RED_FLAGS: RedFlagsByCondition[] = [
  {
    condition: "Post-Fall",
    call911: [
      "Confusion, unusual sleepiness, or 'not acting right' — especially if on blood thinners (possible slow brain bleed that worsens over hours)",
      "Cannot move limbs on one side, or face drooping on one side (possible stroke from fall)",
      "Seizure after fall",
      "Lost consciousness at any point during or after fall",
    ],
    callDoctor: [
      "Wrist, ankle, or injury swelling significantly increasing after first 48 hours",
      "Fever over 101°F",
      "Wound showing increasing redness, warmth, discharge, or bad smell",
      "Pain suddenly much worse — especially if improving then worsens",
      "Numbness or tingling in fingers or toes near injury",
      "Splint or cast feels too tight",
    ],
    monitorAtHome: [
      "Mild swelling around injury — normal for first 48 hours",
      "Bruising spreading slightly — normal, gravity moves bruising downward",
      "Fatigue and soreness — normal after hospitalization",
      "Sleep disruption — common after any hospital stay",
    ],
  },
  {
    condition: "Post-Cardiac Event",
    call911: [
      "Chest pain or pressure returning — even if different from before",
      "Shortness of breath at rest or with minimal activity",
      "Pain spreading to left arm, jaw, neck, or back",
      "Fainting or near-fainting (presyncope)",
      "Sudden severe headache unlike any before",
    ],
    callDoctor: [
      "Swelling in legs or ankles that is new or worsening",
      "Rapid or irregular heartbeat that is new or concerning",
      "Extreme fatigue with minimal activity that is getting worse",
      "Weight gain of 2+ lbs in a single day (fluid retention)",
      "Wound site redness, increasing pain, or discharge (if had surgery)",
    ],
    monitorAtHome: [
      "Mild fatigue — expected and normal after cardiac event",
      "Incision site — watch for early signs of infection",
      "Weight: weigh daily at same time, same scale — trend matters",
      "Activity tolerance — should slowly improve each week",
    ],
  },
  {
    condition: "COPD Exacerbation",
    call911: [
      "Cannot speak full sentences due to breathlessness",
      "Lips, fingertips, or fingernails turning blue or gray (cyanosis)",
      "Rescue inhaler has no effect after 2 puffs and waiting 15-20 minutes",
      "Confusion or extreme agitation from lack of oxygen",
      "Breathing muscles in neck visibly straining",
    ],
    callDoctor: [
      "More breathless than usual doing normal daily activities",
      "Cough producing more mucus than usual OR change in color (yellow, green, brown)",
      "Using rescue inhaler more than twice a day",
      "Fever with increased cough",
      "Oxygen saturation below 90% if you have an oximeter",
    ],
    monitorAtHome: [
      "Track daily activity level — note if you can do less than the day before",
      "Note if cough is productive and record mucus color daily",
      "Check oxygen levels with home pulse oximeter if available — target above 92%",
      "Note how many times using rescue inhaler per day",
    ],
  },
  {
    condition: "Dementia/Confusion",
    call911: [
      "Sudden dramatic change in mental status compared to baseline — new acute confusion is often a medical emergency",
      "Aggressive behavior with risk of harm to self or others",
      "Sudden inability to recognize family members (new change, not gradual)",
      "Seizure",
    ],
    callDoctor: [
      "New or worsening confusion — the most common cause is UTI or medication interaction, both very treatable",
      "Refusing all food and water for more than 24 hours",
      "Falls — especially with blood thinners",
      "Fever with confusion — suggests infection",
      "New medication recently started before confusion began",
    ],
    monitorAtHome: [
      "Track sleep patterns — disruption is very common and can worsen confusion",
      "Note triggers for agitation — certain times of day, specific activities",
      "Assess home for wandering risks: door alarms, stove safety",
      "Note any pattern to good days vs. bad days",
    ],
  },
  {
    condition: "Atrial Fibrillation",
    call911: [
      "Chest pain or pressure with irregular heartbeat — possible heart attack coinciding with AFib",
      "Sudden stroke symptoms: face drooping, arm weakness, speech difficulty (F.A.S.T.) — AFib is the #1 cause of cardioembolic stroke",
      "Heart rate above 150 beats per minute sustained for more than 30 minutes with lightheadedness or shortness of breath",
      "Fainting or loss of consciousness",
      "Sudden severe shortness of breath at rest",
    ],
    callDoctor: [
      "Heart rate consistently above 100 or below 50 at rest",
      "Missed dose of blood thinner (Warfarin, Eliquis, Xarelto) — call for guidance, do not just take a double dose",
      "Any new medication started — all new meds can interact with AFib medications",
      "Swelling in legs or ankles that is new or worsening",
      "INR out of range (if on Warfarin) — above 4.0 or below 1.5",
      "Palpitations that are new, more frequent, or feel different than before",
    ],
    monitorAtHome: [
      "Take pulse daily: count heartbeats for 60 seconds. Know your target rate range (usually 60-100 resting)",
      "Weigh daily — sudden gain means fluid retention and potential heart failure",
      "Note any triggers for AFib episodes: caffeine, alcohol, dehydration, poor sleep",
      "Keep a log of symptoms and when they occur — helpful for doctor visits",
    ],
  },
  {
    condition: "Heart Failure",
    call911: [
      "Sudden severe shortness of breath — especially if can't complete sentences or lie flat",
      "Chest pain with shortness of breath",
      "Coughing up pink or frothy mucus — pulmonary edema emergency",
      "Confusion or extreme agitation from low oxygen",
      "Fainting or near-fainting",
    ],
    callDoctor: [
      "Weight gain of 2 or more pounds in a single day OR 5 pounds in a week — fluid is returning, needs medication adjustment",
      "Cannot lie flat to sleep — must prop up with more pillows than usual",
      "Swelling in legs, ankles, or feet that is new or worsening",
      "Shortness of breath with activities that were previously easy",
      "Feeling much more fatigued than usual",
      "Decreased urine output despite taking the water pill (furosemide)",
    ],
    monitorAtHome: [
      "DAILY WEIGHT — same time (morning, after bathroom, before eating), same scale, same clothing. This is the most important thing you can do",
      "Track how many pillows needed to sleep comfortably — increasing pillows = worsening fluid",
      "Note shortness of breath level: how far can walk before breathless? Trending worse = call doctor",
      "Sodium diary: under 2,000mg daily. Read every food label",
      "Fluid restriction if prescribed: count ALL liquids including soup, ice cream, gelatin",
    ],
  },
  {
    condition: "Post-Surgery General",
    call911: [
      "Severe chest pain or sudden shortness of breath (possible pulmonary embolism or cardiac event)",
      "Calf pain AND swelling AND shortness of breath together — classic DVT/PE presentation, call 911",
      "Wound opens or organ/bowel becomes visible through incision",
      "Uncontrolled bleeding from wound",
    ],
    callDoctor: [
      "Wound redness that is spreading, warmth, pus, or bad smell",
      "Fever over 101°F at any point in first 2 weeks",
      "Swelling in calf that is new or one-sided",
      "Not urinating or having bowel movement by day 3 post-surgery",
      "Nausea or vomiting preventing medication or fluid intake",
    ],
    monitorAtHome: [
      "Normal bruising around incision — expected",
      "Mild wound itching — sign of healing, not infection",
      "Track temperature twice daily for first week — write it down",
      "Note any changes in pain level — it should gradually improve, not worsen",
    ],
  },
]

export function getMedicationInfo(medicationName: string): Medication | undefined {
  const lower = medicationName.toLowerCase()
  return MEDICATIONS.find(
    (m) =>
      m.name.toLowerCase() === lower ||
      m.aliases.some((a) => a.toLowerCase().includes(lower) || lower.includes(a.toLowerCase()))
  )
}

export function getCPTCodeInfo(code: string): CPTCode | undefined {
  return CPT_CODES.find((c) => c.code === code)
}

export function getRedFlagsForConditions(conditions: string[]): RedFlagsByCondition[] {
  const lower = conditions.map((c) => c.toLowerCase())
  return RED_FLAGS.filter((rf) => {
    const condLower = rf.condition.toLowerCase()
    return lower.some(
      (c) =>
        condLower.includes(c) ||
        c.includes(condLower.split(" ")[0]) ||
        (c.includes("fall") && condLower.includes("fall")) ||
        (c.includes("copd") && condLower.includes("copd")) ||
        (c.includes("dementia") && condLower.includes("dementia")) ||
        (c.includes("cardiac") && condLower.includes("cardiac")) ||
        (c.includes("heart") && condLower.includes("cardiac")) ||
        ((c.includes("atrial") || c.includes("afib") || c.includes("fibrillation")) && condLower.includes("atrial")) ||
        ((c.includes("heart failure") || c.includes("chf") || c.includes("hfref") || c.includes("congestive")) && condLower.includes("heart failure"))
    )
  })
}

export function getMedicationsForProfile(medications: string[]): Medication[] {
  const found: Medication[] = []
  for (const med of medications) {
    const info = getMedicationInfo(med)
    if (info && !found.find((f) => f.name === info.name)) {
      found.push(info)
    }
  }
  return found
}

export function getRelevantCPTCodes(billText: string): CPTCode[] {
  return CPT_CODES.filter((code) => billText.includes(code.code))
}
