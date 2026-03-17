/**
 * ClearCare — Live Insurance Plan Data
 *
 * Fetches real plan cost-sharing data from the CMS Health Insurance Marketplace API.
 * https://developer.cms.gov/marketplace-api/
 *
 * Free API key from: https://developer.cms.gov/marketplace-api/key-request.html
 * Set CMS_MARKETPLACE_API_KEY in .env.local to enable live data.
 * Falls back to hardcoded baseline data if key not set or API unavailable.
 *
 * No extra user input needed — we use state=IL + the insurer/planType the user
 * already picked. We run the search with generic household params (single adult,
 * median IL income) which returns the plan's cost-sharing structure regardless
 * of premium subsidy eligibility.
 */

const CMS_BASE = "https://marketplace.api.healthcare.gov/api/v1"
const CACHE_TTL_MS = 6 * 60 * 60 * 1000 // 6 hours — plans don't change intra-day

export interface LivePlanData {
  planName: string
  metalLevel: string
  planType: string
  deductibleIndividual: number
  deductibleFamily: number
  oopMaxIndividual: number
  oopMaxFamily: number
  coinsuranceInNetwork: number // e.g. 20 = patient pays 20%
  primaryCareCopay: number
  specialistCopay: number
  erCopay: number
  source: "live" | "fallback"
  fetchedAt: number
}

/** In-memory cache keyed by `${insurerId}-${planType}` */
const planCache = new Map<string, LivePlanData>()

/**
 * Maps our internal insurer IDs to strings that appear in CMS issuer names.
 * Searches are partial-match — e.g. "Blue Cross" matches "Blue Cross and Blue Shield of Illinois".
 */
const ISSUER_NAME_MAP: Record<string, string> = {
  bcbs: "Blue Cross",
  united: "UnitedHealthcare",
  cigna: "Cigna",
  aetna: "Aetna",
  ambetter: "Ambetter",
  oscar: "Oscar",
  molina: "Molina",
}

/** Maps our planType IDs to CMS metal_level values */
const METAL_LEVEL_MAP: Record<string, string> = {
  bronze: "Bronze",
  silver: "Silver",
  gold: "Gold",
  platinum: "Platinum",
  hmo: "Silver", // HMO is a network type, not a metal — default to Silver
  ppo: "Gold",   // PPO plans often group as Gold tier
  medicaid: "Expanded Bronze",
  marketplace: "Silver",
}

/** Maps our planType IDs to CMS plan type values (HMO, PPO, etc.) */
const PLAN_TYPE_MAP: Record<string, string | null> = {
  hmo: "HMO",
  ppo: "PPO",
  bronze: null,
  silver: null,
  gold: null,
  platinum: null,
}

// ---------------------------------------------------------------------------
// CMS API response types (simplified)
// ---------------------------------------------------------------------------

interface CMSPlan {
  id: string
  name: string
  metal_level: string
  type: string
  issuer?: { name?: string }
  deductibles?: Array<{ amount: number; type: string; family_cost: string }>
  moops?: Array<{ amount: number; type: string; family_cost: string }>
  benefits?: Array<{
    name: string
    cost_sharings?: Array<{
      copay_amount?: number
      coinsurance_rate?: number
      network_tier?: string
    }>
  }>
}

interface CMSSearchResponse {
  plans?: CMSPlan[]
  total?: number
}

// ---------------------------------------------------------------------------
// Fallback data (used when CMS API unavailable)
// ---------------------------------------------------------------------------

const FALLBACK_DATA: Record<string, Partial<LivePlanData>> = {
  "bcbs-bronze": { deductibleIndividual: 7500, oopMaxIndividual: 9100, coinsuranceInNetwork: 40, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "bcbs-silver": { deductibleIndividual: 4500, oopMaxIndividual: 7900, coinsuranceInNetwork: 30, primaryCareCopay: 35, specialistCopay: 65, erCopay: 300 },
  "bcbs-gold":   { deductibleIndividual: 1000, oopMaxIndividual: 5000, coinsuranceInNetwork: 20, primaryCareCopay: 25, specialistCopay: 50, erCopay: 250 },
  "bcbs-platinum": { deductibleIndividual: 0, oopMaxIndividual: 2500, coinsuranceInNetwork: 10, primaryCareCopay: 15, specialistCopay: 30, erCopay: 150 },
  "bcbs-hmo":    { deductibleIndividual: 1500, oopMaxIndividual: 5500, coinsuranceInNetwork: 20, primaryCareCopay: 30, specialistCopay: 60, erCopay: 300 },
  "bcbs-ppo":    { deductibleIndividual: 2000, oopMaxIndividual: 6500, coinsuranceInNetwork: 20, primaryCareCopay: 30, specialistCopay: 60, erCopay: 300 },
  "united-bronze": { deductibleIndividual: 8000, oopMaxIndividual: 9450, coinsuranceInNetwork: 40, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "united-silver": { deductibleIndividual: 4800, oopMaxIndividual: 8200, coinsuranceInNetwork: 30, primaryCareCopay: 40, specialistCopay: 70, erCopay: 350 },
  "united-gold":   { deductibleIndividual: 1200, oopMaxIndividual: 5200, coinsuranceInNetwork: 20, primaryCareCopay: 25, specialistCopay: 55, erCopay: 250 },
  "united-platinum": { deductibleIndividual: 0, oopMaxIndividual: 2800, coinsuranceInNetwork: 10, primaryCareCopay: 15, specialistCopay: 35, erCopay: 150 },
  "cigna-bronze":  { deductibleIndividual: 7800, oopMaxIndividual: 9100, coinsuranceInNetwork: 40, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "cigna-silver":  { deductibleIndividual: 4600, oopMaxIndividual: 8000, coinsuranceInNetwork: 30, primaryCareCopay: 35, specialistCopay: 65, erCopay: 300 },
  "cigna-gold":    { deductibleIndividual: 1100, oopMaxIndividual: 5100, coinsuranceInNetwork: 20, primaryCareCopay: 25, specialistCopay: 50, erCopay: 250 },
  "aetna-bronze":  { deductibleIndividual: 7600, oopMaxIndividual: 9200, coinsuranceInNetwork: 40, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "aetna-silver":  { deductibleIndividual: 4700, oopMaxIndividual: 8100, coinsuranceInNetwork: 30, primaryCareCopay: 35, specialistCopay: 65, erCopay: 300 },
  "aetna-gold":    { deductibleIndividual: 1050, oopMaxIndividual: 5050, coinsuranceInNetwork: 20, primaryCareCopay: 25, specialistCopay: 50, erCopay: 250 },
  "ambetter-bronze": { deductibleIndividual: 8500, oopMaxIndividual: 9450, coinsuranceInNetwork: 40, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "ambetter-silver": { deductibleIndividual: 4500, oopMaxIndividual: 7900, coinsuranceInNetwork: 30, primaryCareCopay: 35, specialistCopay: 65, erCopay: 300 },
  "ambetter-gold":   { deductibleIndividual: 1500, oopMaxIndividual: 6000, coinsuranceInNetwork: 20, primaryCareCopay: 25, specialistCopay: 55, erCopay: 250 },
  "oscar-bronze":  { deductibleIndividual: 7500, oopMaxIndividual: 9100, coinsuranceInNetwork: 40, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "oscar-silver":  { deductibleIndividual: 4500, oopMaxIndividual: 8000, coinsuranceInNetwork: 30, primaryCareCopay: 35, specialistCopay: 65, erCopay: 300 },
  "oscar-gold":    { deductibleIndividual: 1000, oopMaxIndividual: 5000, coinsuranceInNetwork: 20, primaryCareCopay: 25, specialistCopay: 50, erCopay: 250 },
  "molina-medicaid":    { deductibleIndividual: 0, oopMaxIndividual: 2000, coinsuranceInNetwork: 0, primaryCareCopay: 3, specialistCopay: 4, erCopay: 8 },
  "molina-marketplace": { deductibleIndividual: 2500, oopMaxIndividual: 7900, coinsuranceInNetwork: 30, primaryCareCopay: 35, specialistCopay: 65, erCopay: 300 },
  "medicare-medicare-a": { deductibleIndividual: 1632, oopMaxIndividual: 0, coinsuranceInNetwork: 0, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "medicare-medicare-b": { deductibleIndividual: 240, oopMaxIndividual: 0, coinsuranceInNetwork: 20, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "medicare-medicare-ab-plus-bcbs-supplement": { deductibleIndividual: 240, oopMaxIndividual: 3500, coinsuranceInNetwork: 0, primaryCareCopay: 0, specialistCopay: 0, erCopay: 0 },
  "medicare-medicare-advantage": { deductibleIndividual: 500, oopMaxIndividual: 8850, coinsuranceInNetwork: 20, primaryCareCopay: 10, specialistCopay: 40, erCopay: 120 },
}

function makeFallback(insurerId: string, planType: string): LivePlanData {
  const key = `${insurerId}-${planType}`
  const base = FALLBACK_DATA[key] ?? {}
  return {
    planName: `${insurerId.toUpperCase()} ${planType}`,
    metalLevel: METAL_LEVEL_MAP[planType] ?? planType,
    planType: PLAN_TYPE_MAP[planType] ?? planType.toUpperCase(),
    deductibleIndividual: base.deductibleIndividual ?? 3000,
    deductibleFamily: base.deductibleFamily ?? (base.deductibleIndividual ?? 3000) * 2,
    oopMaxIndividual: base.oopMaxIndividual ?? 7500,
    oopMaxFamily: base.oopMaxFamily ?? (base.oopMaxIndividual ?? 7500) * 2,
    coinsuranceInNetwork: base.coinsuranceInNetwork ?? 20,
    primaryCareCopay: base.primaryCareCopay ?? 30,
    specialistCopay: base.specialistCopay ?? 60,
    erCopay: base.erCopay ?? 300,
    source: "fallback",
    fetchedAt: Date.now(),
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function extractPlanData(plan: CMSPlan, insurerId: string, planType: string): LivePlanData {
  // Deductibles
  const indivDeductible = plan.deductibles?.find(
    d => d.family_cost === "Individual" && d.type === "Medical EHB Deductible"
  )?.amount ?? plan.deductibles?.find(d => d.family_cost === "Individual")?.amount ?? 0

  const famDeductible = plan.deductibles?.find(
    d => d.family_cost === "Family" && d.type === "Medical EHB Deductible"
  )?.amount ?? plan.deductibles?.find(d => d.family_cost === "Family")?.amount ?? indivDeductible * 2

  // OOP Max
  const indivOOP = plan.moops?.find(
    m => m.family_cost === "Individual"
  )?.amount ?? 0
  const famOOP = plan.moops?.find(
    m => m.family_cost === "Family"
  )?.amount ?? indivOOP * 2

  // Coinsurance — look for primary care benefit
  const primaryBenefit = plan.benefits?.find(b => b.name.toLowerCase().includes("primary care"))
  const erBenefit = plan.benefits?.find(b => b.name.toLowerCase().includes("emergency"))
  const specialistBenefit = plan.benefits?.find(b => b.name.toLowerCase().includes("specialist"))

  const primaryCopay = primaryBenefit?.cost_sharings?.find(c => c.network_tier === "In-Network")?.copay_amount ?? 30
  const erCopay = erBenefit?.cost_sharings?.find(c => c.network_tier === "In-Network")?.copay_amount ?? 300
  const specialistCopay = specialistBenefit?.cost_sharings?.find(c => c.network_tier === "In-Network")?.copay_amount ?? 60

  const coinsuranceRate = primaryBenefit?.cost_sharings?.find(c => c.network_tier === "In-Network")?.coinsurance_rate
  const coinsuranceInNetwork = coinsuranceRate != null ? Math.round(coinsuranceRate * 100) : 20

  return {
    planName: plan.name,
    metalLevel: plan.metal_level,
    planType: plan.type,
    deductibleIndividual: indivDeductible,
    deductibleFamily: famDeductible,
    oopMaxIndividual: indivOOP,
    oopMaxFamily: famOOP,
    coinsuranceInNetwork,
    primaryCareCopay: primaryCopay,
    specialistCopay,
    erCopay,
    source: "live",
    fetchedAt: Date.now(),
  }
}

/**
 * Fetch live plan data from CMS Marketplace API.
 * Returns null if CMS_MARKETPLACE_API_KEY is not set (caller uses fallback).
 */
async function fetchFromCMS(insurerId: string, planType: string): Promise<LivePlanData | null> {
  const apiKey = process.env.CMS_MARKETPLACE_API_KEY
  if (!apiKey) return null

  // Medicare and Medicaid are not on the ACA marketplace
  if (insurerId === "medicare" || planType === "medicaid") return null

  const issuerSearch = ISSUER_NAME_MAP[insurerId]
  if (!issuerSearch) return null

  const metalLevel = METAL_LEVEL_MAP[planType] ?? "Silver"
  const planTypeFilter = PLAN_TYPE_MAP[planType]

  const params = new URLSearchParams({
    state: "IL",
    year: "2026",
    "market": "Individual",
    "household.people": "1",
    "household.income": "40000",
    "aptc_override": "0",
    apikey: apiKey,
  })

  const url = `${CMS_BASE}/plans/search?${params}`

  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 * 60 * 6 }, // ISR: revalidate every 6h in Next.js
  })

  if (!res.ok) {
    console.warn(`CMS API returned ${res.status} — falling back to local data`)
    return null
  }

  const data = (await res.json()) as CMSSearchResponse
  const plans = data.plans ?? []

  // Filter by issuer name (partial match) + metal level
  const matches = plans.filter(p => {
    const issuerName = p.issuer?.name ?? p.name ?? ""
    const issuerMatch = issuerName.toLowerCase().includes(issuerSearch.toLowerCase())
    const metalMatch = p.metal_level?.toLowerCase() === metalLevel.toLowerCase()
    const typeMatch = planTypeFilter ? p.type?.toLowerCase() === planTypeFilter.toLowerCase() : true
    return issuerMatch && metalMatch && typeMatch
  })

  if (matches.length === 0) return null

  // Use the first matching plan (most representative)
  return extractPlanData(matches[0], insurerId, planType)
}

/**
 * Main export — get live or fallback plan data.
 * Always returns something; never throws.
 */
export async function getPlanData(insurerId: string, planType: string): Promise<LivePlanData> {
  const cacheKey = `${insurerId}-${planType}`

  // Check in-memory cache
  const cached = planCache.get(cacheKey)
  if (cached && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached
  }

  try {
    const live = await fetchFromCMS(insurerId, planType)
    if (live) {
      planCache.set(cacheKey, live)
      return live
    }
  } catch (err) {
    console.warn("CMS API fetch failed:", err)
  }

  const fallback = makeFallback(insurerId, planType)
  planCache.set(cacheKey, fallback)
  return fallback
}

/**
 * Format plan data as a human-readable string for injection into Gemini prompts.
 */
export function formatPlanDataForPrompt(data: LivePlanData): string {
  const src = data.source === "live" ? "CMS Marketplace API (live)" : "Reference data"
  const coins = data.coinsuranceInNetwork
  return `
LIVE PLAN COST-SHARING DATA (source: ${src}):
  Plan: ${data.planName}
  Individual Deductible: $${data.deductibleIndividual.toLocaleString()}
  Family Deductible: $${data.deductibleFamily.toLocaleString()}
  Individual Out-of-Pocket Maximum: $${data.oopMaxIndividual.toLocaleString()}
  Family Out-of-Pocket Maximum: $${data.oopMaxFamily.toLocaleString()}
  Coinsurance (patient share after deductible): ${coins}%
  Primary Care Copay: $${data.primaryCareCopay}
  Specialist Copay: $${data.specialistCopay}
  ER Copay: $${data.erCopay}
`.trim()
}
