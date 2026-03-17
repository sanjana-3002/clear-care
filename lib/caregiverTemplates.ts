/**
 * ClearCare — Caregiver communication templates
 *
 * Ready-to-use scripts and letter templates for caregivers to communicate
 * effectively with doctors, insurers, and hospital billing departments.
 * Written at a 6th-grade reading level, clinically accurate.
 */

export interface CommunicationTemplate {
  id: string
  title: string
  context: string      // when to use this
  channel: "phone" | "letter" | "email" | "in-person"
  urgency: "routine" | "urgent" | "emergency"
  body: string         // the actual script/letter, with [PLACEHOLDER] tokens
  tips: string[]       // coaching notes for the caregiver
}

// ── Phone scripts ──────────────────────────────────────────────────────────────

export const PHONE_SCRIPTS: CommunicationTemplate[] = [
  {
    id: "pcp-follow-up-appointment",
    title: "Calling to Schedule a Post-Discharge Follow-Up",
    context: "Use within 24 hours of discharge to book the required PCP visit",
    channel: "phone",
    urgency: "urgent",
    body: `"Hi, I'm calling to schedule a follow-up appointment for my [RELATIONSHIP], [PATIENT NAME]. They were just discharged from [HOSPITAL NAME] on [DISCHARGE DATE] and the discharge paperwork says they need to be seen within [NUMBER] days. Is there any availability this week? This is post-discharge so it may be flagged as high priority in your system."

If the first available appointment is too far out:
"The discharge instructions specifically say within [NUMBER] days for safety reasons. Is there a cancellation list I can be added to, or can the doctor's nurse review the discharge summary to determine if an earlier appointment is medically necessary?"`,
    tips: [
      "Have the discharge paperwork in front of you — the follow-up timeline is on it",
      "Call first thing in the morning — more cancellation slots available",
      "If the next available is too far, ask specifically for the nurse or care coordinator",
      "If they cannot accommodate, call the hospital's care coordination team — they can often intervene",
    ],
  },
  {
    id: "pharmacy-interaction-check",
    title: "Asking a Pharmacist to Check for Drug Interactions",
    context: "Use any time a new medication is prescribed — pharmacists are the experts here",
    channel: "phone",
    urgency: "routine",
    body: `"Hi, I'm a caregiver for [PATIENT NAME] and they were just prescribed [NEW MEDICATION NAME]. They're currently taking [LIST ALL CURRENT MEDICATIONS]. I want to make sure there are no dangerous interactions I need to know about. Can the pharmacist do a quick review?"

Follow-up question:
"Are there any foods, drinks, or over-the-counter products they should avoid while on this medication?"

If concerned:
"Is there anything here that you would flag as a serious interaction? And should I call their doctor about it?"`,
    tips: [
      "Bring the complete medication list — including vitamins and supplements",
      "This service is free at all pharmacies — use it every time there's a new medication",
      "Pharmacists often catch interactions that busy doctors miss",
      "Ask about grapefruit specifically for any heart, cholesterol, or blood pressure medication",
    ],
  },
  {
    id: "hospital-billing-dispute-call",
    title: "Calling Hospital Billing to Dispute a Charge",
    context: "Use after identifying suspicious charges in an itemized bill",
    channel: "phone",
    urgency: "routine",
    body: `"Hi, my name is [YOUR NAME] and I'm calling about an itemized bill for [PATIENT NAME], account number [ACCOUNT NUMBER]. I've reviewed the bill and I have some questions about specific charges.

First, I'm looking at [CHARGE DESCRIPTION] billed at [BILLED AMOUNT]. The Medicare allowed rate for this code is approximately [MEDICARE RATE]. Can you explain why we were billed [BILLED AMOUNT]?

Second, I see a charge for [CODE A9999 or vague code] for [AMOUNT]. I need an itemized list of exactly what was provided under this code before I can agree to pay it.

I'm requesting: (1) a written explanation of each disputed charge, and (2) an itemized breakdown of any miscellaneous supply charges. Can you note this dispute in our account and send a written response within 30 days?"`,
    tips: [
      "Always get the name and employee ID of every person you speak with",
      "Ask them to put a hold on the bill while the dispute is under review — most hospitals will do this",
      "Follow up every call with a written letter (certified mail) documenting what was said",
      "If they refuse to adjust, ask to speak with the Patient Financial Advocate",
      "Hospitals often reduce bills significantly just from asking — 30-60% reduction is common",
    ],
  },
  {
    id: "insurance-prior-auth-appeal",
    title: "Appealing an Insurance Denial Over the Phone",
    context: "Use within 72 hours of receiving a denial letter",
    channel: "phone",
    urgency: "urgent",
    body: `"Hi, I'm calling to initiate an appeal for a denied claim for [PATIENT NAME], member ID [MEMBER ID]. The claim number is [CLAIM NUMBER] and it was denied on [DENIAL DATE].

The reason given was [DENIAL REASON]. My doctor has determined this treatment is medically necessary, and I'd like to know:
1. What specific criteria were used to make this determination?
2. What additional documentation would support an approval?
3. Can I request an expedited appeal given that [PATIENT] needs this [TREATMENT/MEDICATION] to [BRIEF MEDICAL REASON]?
4. Can I request a peer-to-peer review where my doctor speaks directly with your medical reviewer?"`,
    tips: [
      "Ask for an expedited appeal if the denial affects ongoing care — they must respond within 72 hours",
      "Request a peer-to-peer review — doctor-to-doctor conversations often result in reversal",
      "Get the specific denial criteria in writing — you need these to craft an effective appeal letter",
      "Your doctor's office can help with appeals — ask them to submit a letter of medical necessity",
      "External appeal: if internal appeal fails, you have the right to an independent external review",
    ],
  },
]

// ── Letter templates ──────────────────────────────────────────────────────────

export const LETTER_TEMPLATES: CommunicationTemplate[] = [
  {
    id: "medical-necessity-appeal",
    title: "Letter: Appeal for Medical Necessity Denial",
    context: "Mail certified after phone appeal if insurer still denies coverage",
    channel: "letter",
    urgency: "urgent",
    body: `[YOUR NAME]
[YOUR ADDRESS]
[DATE]

[INSURANCE COMPANY NAME]
Appeals Department
[INSURANCE ADDRESS]

Re: Appeal of Denial — Claim #[CLAIM NUMBER]
Member: [PATIENT NAME] | Member ID: [MEMBER ID]
Date of Service: [DATE OF SERVICE]
Treating Provider: [DOCTOR NAME]

Dear Appeals Department,

I am writing to formally appeal the denial of [TREATMENT/SERVICE] for [PATIENT NAME], issued on [DENIAL DATE].

REASON FOR APPEAL:
[PATIENT NAME]'s physician, [DOCTOR NAME, MD], has determined that [TREATMENT] is medically necessary due to [SPECIFIC MEDICAL CONDITION AND REASON]. The denial cites [DENIAL REASON], which does not accurately reflect [PATIENT]'s clinical situation.

SUPPORTING FACTS:
• [PATIENT NAME], age [AGE], was diagnosed with [CONDITION] on [DATE]
• Previous treatments attempted: [LIST WHAT WAS TRIED BEFORE]
• Clinical need: [WHY THIS SPECIFIC TREATMENT IS REQUIRED]
• Without this treatment: [CONSEQUENCES OF DENIAL]

DOCUMENTATION ENCLOSED:
• Letter of medical necessity from [DOCTOR NAME]
• Relevant medical records (pages [X–Y])
• Applicable clinical guidelines supporting this treatment

I request a response within 30 days per [STATE] insurance regulations, or within 72 hours if this is an expedited appeal due to urgent medical need.

Sincerely,
[YOUR NAME]
[RELATIONSHIP TO PATIENT]
[PHONE NUMBER]
[EMAIL]`,
    tips: [
      "Send via certified mail with return receipt — creates a paper trail",
      "Attach a letter of medical necessity from the doctor — this is the most powerful document",
      "Reference your state's insurance regulations — insurers must comply",
      "Keep copies of everything you send",
      "Follow up by phone in 2 weeks if no response",
    ],
  },
  {
    id: "bill-dispute-letter",
    title: "Letter: Formal Medical Bill Dispute",
    context: "Send after phone call if billing department does not resolve the dispute",
    channel: "letter",
    urgency: "routine",
    body: `[YOUR NAME]
[YOUR ADDRESS]
[DATE]

[HOSPITAL NAME] — Billing Department
[HOSPITAL ADDRESS]

Re: Formal Bill Dispute
Patient: [PATIENT NAME] | Account #: [ACCOUNT NUMBER]
Date of Service: [DATE OF SERVICE]

Dear Billing Department,

I am writing to formally dispute the following charges on the above-referenced account:

DISPUTED CHARGES:
[For each disputed item:]
• [CPT Code] — [Description] — Billed: $[AMOUNT]
  Reason: [Medicare allowed rate is $X / Service not provided / Duplicate charge / etc.]

REQUESTED ACTIONS:
1. Written explanation for each disputed charge within 30 days
2. Complete itemization of any miscellaneous supply charges (A9999 or similar)
3. Suspension of collection activity on disputed amounts during this review

I am prepared to pay all undisputed charges promptly. I am requesting the disputed amounts be reviewed, adjusted to reflect Medicare-allowed rates where applicable, and corrected charges sent to my insurer for reprocessing.

Please confirm receipt of this letter and provide a written response.

Sincerely,
[YOUR NAME]
[RELATIONSHIP TO PATIENT]
[PHONE NUMBER]
[EMAIL]`,
    tips: [
      "Send certified mail — you need proof they received it",
      "The CFPB protects consumers on medical billing disputes — reference this if needed",
      "Hospitals must suspend collections on disputed amounts in most states",
      "If the hospital sells your account to a collector, dispute it with the credit bureaus using this letter as evidence",
    ],
  },
]

// ── Quick reference talking points ────────────────────────────────────────────

export const CAREGIVER_RIGHTS = [
  "You have the right to a complete itemized bill — itemized by CPT code, not just summary totals",
  "You have the right to know your admission status (inpatient vs. observation) — ask in writing if unsure",
  "You have the right to an expedited insurance appeal when care is ongoing or time-sensitive",
  "You have the right to an external independent review if an internal appeal is denied",
  "You have the right to a Patient Financial Advocate at most hospitals — ask for them by name",
  "Medicare patients have the right to a written Notice of Medicare Non-Coverage before discharge",
  "You have the right to refuse treatment and to participate in care decisions as a healthcare proxy",
  "Hospital bills are negotiable — most hospitals have charity care programs and financial assistance for incomes under 400% of the federal poverty level",
]

export function getTemplateById(id: string): CommunicationTemplate | undefined {
  return [...PHONE_SCRIPTS, ...LETTER_TEMPLATES].find((t) => t.id === id)
}

export function getTemplatesByChannel(channel: CommunicationTemplate["channel"]): CommunicationTemplate[] {
  return [...PHONE_SCRIPTS, ...LETTER_TEMPLATES].filter((t) => t.channel === channel)
}
