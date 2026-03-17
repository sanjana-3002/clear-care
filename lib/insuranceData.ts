export interface InsurancePlan {
  id: string
  displayName: string
  planTypes: {
    [key: string]: {
      deductible: string
      coinsurance: string
      outOfPocketMax: string
      notes: string[]
    }
  }
  generalCoverageRules: string[]
  commonDenials: string[]
  tipsForPatients: string[]
}

export const INSURERS: InsurancePlan[] = [
  // BCBS Illinois
  {
    id: "bcbs",
    displayName: "Blue Cross Blue Shield",
    planTypes: {
      bronze: { deductible: "$7,500", coinsurance: "60/40 after deductible", outOfPocketMax: "$9,100", notes: ["Lowest premium, highest cost sharing", "Preventive care 100% covered"] },
      silver: { deductible: "$4,500", coinsurance: "70/30 after deductible", outOfPocketMax: "$7,900", notes: ["CSR subsidies available for eligible income levels"] },
      gold: { deductible: "$1,000", coinsurance: "80/20 after deductible", outOfPocketMax: "$5,000", notes: ["Best for those with regular medical needs"] },
      platinum: { deductible: "$0", coinsurance: "90/10", outOfPocketMax: "$2,500", notes: ["Highest premium but lowest cost when care is needed"] },
      hmo: { deductible: "$1,500", coinsurance: "80/20 in-network", outOfPocketMax: "$5,500", notes: ["Requires PCP referral for specialists", "In-network only (except emergencies)"] },
      ppo: { deductible: "$2,000", coinsurance: "80/20 in-network, 60/40 out-of-network", outOfPocketMax: "$6,500", notes: ["No referral needed", "Out-of-network coverage available but costly"] },
    },
    generalCoverageRules: [
      "Preventive care 100% covered at in-network providers with no deductible",
      "Emergency services covered at in-network rates regardless of network status",
      "Mental health services at parity with medical (Illinois mandate)",
      "Telehealth visits covered same as in-person for many services",
      "Prior authorization required for: MRI, CT scans, specialist visits (HMO), certain medications",
    ],
    commonDenials: [
      "Out-of-network provider without prior authorization",
      "Missing referral on HMO plan",
      "Service deemed 'not medically necessary' without documentation",
      "Duplicate billing within same episode of care",
    ],
    tipsForPatients: [
      "Always verify your provider is in-network BEFORE the appointment",
      "Request a pre-authorization number and keep it on file",
      "You have 180 days to appeal any denial",
      "Ask for a peer-to-peer review if your doctor's recommended service is denied",
    ],
  },
  // UnitedHealthcare
  {
    id: "united",
    displayName: "UnitedHealthcare",
    planTypes: {
      bronze: { deductible: "$8,000", coinsurance: "60/40", outOfPocketMax: "$9,450", notes: [] },
      silver: { deductible: "$4,800", coinsurance: "70/30", outOfPocketMax: "$8,200", notes: [] },
      gold: { deductible: "$1,200", coinsurance: "80/20", outOfPocketMax: "$5,200", notes: [] },
      platinum: { deductible: "$0", coinsurance: "90/10", outOfPocketMax: "$2,800", notes: [] },
      ppo: { deductible: "$2,500", coinsurance: "80/20 in-network", outOfPocketMax: "$7,000", notes: ["Open Choice PPO widely available"] },
    },
    generalCoverageRules: [
      "Strong telehealth coverage via Rally Health integration",
      "Prior authorization commonly required for specialist visits",
      "Step therapy requirements for certain brand-name medications",
      "Emergency care covered worldwide",
    ],
    commonDenials: [
      "Step therapy not followed for medications (must try generics first)",
      "Specialist visit without PCP referral on HMO",
      "Out-of-network services on restrictive plans",
    ],
    tipsForPatients: [
      "Use the Rally Health app to track claims and authorizations",
      "Step therapy: try the required lower-cost drug first, document failure, then request brand name",
      "Appeal denials — UHC has high overturn rate on first appeals",
    ],
  },
  // Cigna
  {
    id: "cigna",
    displayName: "Cigna",
    planTypes: {
      bronze: { deductible: "$7,800", coinsurance: "60/40", outOfPocketMax: "$9,100", notes: [] },
      silver: { deductible: "$4,600", coinsurance: "70/30", outOfPocketMax: "$8,000", notes: [] },
      gold: { deductible: "$1,100", coinsurance: "80/20", outOfPocketMax: "$5,100", notes: [] },
      platinum: { deductible: "$0", coinsurance: "90/10", outOfPocketMax: "$2,600", notes: [] },
      ppo: { deductible: "$2,200", coinsurance: "80/20 in-network, 60/40 out-of-network", outOfPocketMax: "$6,800", notes: [] },
    },
    generalCoverageRules: [
      "Strong preventive care emphasis — 100% covered",
      "Behavioral health integrated with medical coverage",
      "Lower out-of-network costs than average among major insurers",
      "Chronic condition management programs available",
    ],
    commonDenials: [
      "Behavioral health services without treatment plan documentation",
      "Experimental or investigational treatments",
    ],
    tipsForPatients: [
      "Cigna's behavioral health benefits are often better than competitors",
      "Chronic condition management programs can reduce copays",
    ],
  },
  // Aetna
  {
    id: "aetna",
    displayName: "Aetna",
    planTypes: {
      bronze: { deductible: "$7,600", coinsurance: "60/40", outOfPocketMax: "$9,200", notes: [] },
      silver: { deductible: "$4,700", coinsurance: "70/30", outOfPocketMax: "$8,100", notes: [] },
      gold: { deductible: "$1,050", coinsurance: "80/20", outOfPocketMax: "$5,050", notes: [] },
      platinum: { deductible: "$0", coinsurance: "90/10", outOfPocketMax: "$2,700", notes: [] },
      ppo: { deductible: "$2,300", coinsurance: "80/20 in-network", outOfPocketMax: "$6,900", notes: ["Open Choice PPO widely available"] },
    },
    generalCoverageRules: [
      "CVS Health integration — strong pharmacy benefits",
      "Chronic condition management programs with reduced costs",
      "MinuteClinic visits often covered at low/no cost",
      "Robust mail-order pharmacy program for 90-day supplies",
    ],
    commonDenials: [
      "Non-formulary prescription drugs without prior authorization",
      "Services at non-contracted facilities",
    ],
    tipsForPatients: [
      "Use CVS/MinuteClinic for minor issues to save on copays",
      "Mail-order pharmacy typically saves 33% on 90-day supplies",
    ],
  },
  // Ambetter
  {
    id: "ambetter",
    displayName: "Ambetter",
    planTypes: {
      bronze: { deductible: "$8,500", coinsurance: "60/40", outOfPocketMax: "$9,450", notes: ["ACA marketplace focus"] },
      silver: { deductible: "$4,500", coinsurance: "70/30", outOfPocketMax: "$7,900", notes: ["CSR subsidies available — can significantly reduce costs"] },
      gold: { deductible: "$1,500", coinsurance: "80/20", outOfPocketMax: "$6,000", notes: [] },
    },
    generalCoverageRules: [
      "ACA marketplace focus — good for lower income households",
      "Silver plans with Cost Sharing Reduction (CSR) subsidies available",
      "Narrower networks than BCBS or United — verify providers carefully",
      "Prior authorization required for most specialist visits",
    ],
    commonDenials: [
      "Out-of-network providers (narrow network)",
      "Specialist visits without referral",
    ],
    tipsForPatients: [
      "Always check the provider directory BEFORE scheduling — network is narrow",
      "If income is 100-250% FPL, Silver plan CSR subsidies can make Gold-equivalent coverage at Silver premiums",
    ],
  },
  // Oscar
  {
    id: "oscar",
    displayName: "Oscar Health",
    planTypes: {
      bronze: { deductible: "$7,500", coinsurance: "60/40", outOfPocketMax: "$9,100", notes: [] },
      silver: { deductible: "$4,500", coinsurance: "70/30", outOfPocketMax: "$8,000", notes: [] },
      gold: { deductible: "$1,000", coinsurance: "80/20", outOfPocketMax: "$5,000", notes: [] },
    },
    generalCoverageRules: [
      "Tech-forward with strong mobile app — track claims in real time",
      "Good mental health coverage",
      "Step therapy requirements for some medications",
      "Free telehealth visits with Oscar doctors",
    ],
    commonDenials: [
      "Step therapy not followed",
      "Out-of-network services",
    ],
    tipsForPatients: [
      "Use the Oscar app to get prior authorization status in real time",
      "Free virtual urgent care available 24/7",
    ],
  },
  // Molina
  {
    id: "molina",
    displayName: "Molina Healthcare",
    planTypes: {
      medicaid: { deductible: "$0", coinsurance: "Minimal to none", outOfPocketMax: "Capped by state", notes: ["Medicaid managed care", "Low-income households"] },
      marketplace: { deductible: "$2,500", coinsurance: "70/30", outOfPocketMax: "$7,900", notes: [] },
    },
    generalCoverageRules: [
      "Medicaid managed care specialist",
      "Strong care coordination services",
      "Limited network — verify all providers before scheduling",
      "Low or no cost sharing for Medicaid members",
    ],
    commonDenials: [
      "Out-of-network services (very narrow network)",
      "Non-covered services under Medicaid rules",
    ],
    tipsForPatients: [
      "Care coordinators available to help navigate complex medical situations",
      "Transportation to medical appointments may be covered",
    ],
  },
  // Medicare
  {
    id: "medicare",
    displayName: "Medicare",
    planTypes: {
      "medicare-a": {
        deductible: "$1,632 per benefit period (2026)",
        coinsurance: "Days 1-60: $0 coinsurance; Days 61-90: $408/day; Days 91+: $816/day (lifetime reserve)",
        outOfPocketMax: "No out-of-pocket max for Part A alone",
        notes: [
          "Hospital insurance",
          "Days 1-20 skilled nursing: $0 coinsurance",
          "Days 21-100 skilled nursing: $204/day coinsurance",
          "Hospice care covered",
        ],
      },
      "medicare-b": {
        deductible: "$240 annual (2026)",
        coinsurance: "80/20 after deductible",
        outOfPocketMax: "No out-of-pocket max for Part B alone",
        notes: [
          "Medical insurance — doctor visits, outpatient",
          "$185/month standard premium (2026)",
          "Preventive services 100% covered",
          "Durable medical equipment 80% covered",
        ],
      },
      "medicare-ab-plus-bcbs-supplement": {
        deductible: "$240 (Part B only)",
        coinsurance: "Supplement covers most gaps",
        outOfPocketMax: "Very low with supplement",
        notes: [
          "Medicare Part A + B with BCBS Medigap supplement",
          "Supplement covers Part A and B deductibles and coinsurance",
          "Most services effectively covered at near 100%",
        ],
      },
      "medicare-advantage": {
        deductible: "Varies by plan",
        coinsurance: "Varies by plan",
        outOfPocketMax: "Max $8,850 in-network (2026 federal limit)",
        notes: ["Private insurance covering Medicare benefits", "Often includes Part D drug coverage"],
      },
      "medicare-d": {
        deductible: "Up to $590 (2026)",
        coinsurance: "Varies by tier",
        outOfPocketMax: "$2,000 out-of-pocket cap (2026 IRA)",
        notes: ["Prescription drug coverage", "$2,000 catastrophic cap new for 2026"],
      },
    },
    generalCoverageRules: [
      "Medicare Part A covers hospital stays, skilled nursing, hospice",
      "Medicare Part B covers doctor visits, outpatient, preventive care",
      "Emergency services covered anywhere in the US",
      "Preventive services (mammograms, colonoscopies, annual wellness) 100% covered under Part B",
      "Medicare does NOT cover most dental, vision, or hearing without a Medicare Advantage plan",
      "The '2-midnight rule': hospital stays under 2 midnights are typically billed as observation, not inpatient — this matters for SNF coverage",
    ],
    commonDenials: [
      "Skilled nursing facility after observation stay (must be inpatient admission first)",
      "Services deemed 'not medically necessary' without documentation",
      "Custodial care (help with daily activities) — Medicare only covers skilled care",
    ],
    tipsForPatients: [
      "If admitted to hospital: ask specifically whether you are 'admitted' or on 'observation status' — it matters for SNF coverage",
      "You can appeal ANY Medicare denial — you have 120 days for Part A/B appeals",
      "Medicare Rights Center (800-333-4114) offers free counseling",
      "SHIP (State Health Insurance Assistance Program) counselors are free in every state",
    ],
  },
]

export function getInsurerById(id: string): InsurancePlan | undefined {
  return INSURERS.find((i) => i.id === id)
}

export function getCoverageRules(insurerId: string, planType: string): string {
  const insurer = getInsurerById(insurerId)
  if (!insurer) return "Insurance information not available."

  const plan = insurer.planTypes[planType]
  const planInfo = plan
    ? `
Plan: ${insurer.displayName} - ${planType.toUpperCase()}
Deductible: ${plan.deductible}
Coinsurance: ${plan.coinsurance}
Out-of-Pocket Maximum: ${plan.outOfPocketMax}
Plan Notes: ${plan.notes.join("; ")}
`
    : ""

  return `
INSURER: ${insurer.displayName}
${planInfo}
GENERAL COVERAGE RULES:
${insurer.generalCoverageRules.map((r, i) => `${i + 1}. ${r}`).join("\n")}

COMMON DENIAL REASONS:
${insurer.commonDenials.map((r, i) => `${i + 1}. ${r}`).join("\n")}

PATIENT TIPS:
${insurer.tipsForPatients.map((r, i) => `${i + 1}. ${r}`).join("\n")}
`.trim()
}
