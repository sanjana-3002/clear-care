"use client"

import { useState, useEffect } from "react"
import { PatientProfile } from "@/types/patient"
import { Check, Upload, Wifi, Database } from "lucide-react"
import type { LivePlanData } from "@/lib/insuranceApi"

const INSURERS = [
  { id: "bcbs", name: "Blue Cross Blue Shield" },
  { id: "united", name: "UnitedHealthcare" },
  { id: "cigna", name: "Cigna" },
  { id: "aetna", name: "Aetna" },
  { id: "ambetter", name: "Ambetter" },
  { id: "oscar", name: "Oscar Health" },
  { id: "molina", name: "Molina Healthcare" },
  { id: "medicare", name: "Medicare" },
]

const PLAN_TYPES: Record<string, Array<{ id: string; label: string }>> = {
  bcbs: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
    { id: "platinum", label: "Platinum" },
    { id: "hmo", label: "HMO" },
    { id: "ppo", label: "PPO" },
  ],
  united: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
    { id: "platinum", label: "Platinum" },
    { id: "ppo", label: "PPO" },
  ],
  cigna: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
    { id: "platinum", label: "Platinum" },
    { id: "ppo", label: "PPO" },
  ],
  aetna: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
    { id: "platinum", label: "Platinum" },
    { id: "ppo", label: "PPO" },
  ],
  ambetter: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
  ],
  oscar: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
  ],
  molina: [
    { id: "medicaid", label: "Medicaid" },
    { id: "marketplace", label: "Marketplace" },
  ],
  medicare: [
    { id: "medicare-a", label: "Part A (Hospital)" },
    { id: "medicare-b", label: "Part B (Medical)" },
    { id: "medicare-ab-plus-bcbs-supplement", label: "A+B + Supplement" },
    { id: "medicare-advantage", label: "Medicare Advantage" },
    { id: "medicare-d", label: "Part D (Drugs)" },
  ],
  default: [
    { id: "bronze", label: "Bronze" },
    { id: "silver", label: "Silver" },
    { id: "gold", label: "Gold" },
    { id: "platinum", label: "Platinum" },
    { id: "hmo", label: "HMO" },
    { id: "ppo", label: "PPO" },
    { id: "unknown", label: "Not sure" },
  ],
}

interface InsurancePickerProps {
  profile: PatientProfile
  onUpdate: (profile: PatientProfile) => void
}

function fmt(n: number) {
  return n === 0 ? "$0" : `$${n.toLocaleString()}`
}

export default function InsurancePicker({ profile, onUpdate }: InsurancePickerProps) {
  const [uploadingCard, setUploadingCard] = useState(false)
  const [uploadedCardName, setUploadedCardName] = useState<string | null>(null)
  const [planData, setPlanData] = useState<LivePlanData | null>(null)
  const [loadingPlan, setLoadingPlan] = useState(false)

  const selectInsurer = (id: string) => {
    setPlanData(null)
    onUpdate({ ...profile, insurer: id, planType: "" })
  }

  const selectPlanType = (id: string) => {
    const updated = { ...profile, planType: id }
    onUpdate(updated)
    localStorage.setItem("clearcare_last_insurer", profile.insurer)
    localStorage.setItem("clearcare_patient_profile", JSON.stringify(updated))
    fetchPlanData(profile.insurer, id)
  }

  const fetchPlanData = async (insurer: string, planType: string) => {
    if (!insurer || !planType || planType === "unknown") return
    setLoadingPlan(true)
    setPlanData(null)
    try {
      const res = await fetch(`/api/insurance-plans?insurer=${insurer}&planType=${planType}`)
      if (res.ok) {
        const data: LivePlanData = await res.json()
        setPlanData(data)
      }
    } catch {
      // silently ignore — not critical
    } finally {
      setLoadingPlan(false)
    }
  }

  // Re-fetch if profile loads with existing insurer + planType (return visit)
  useEffect(() => {
    if (profile.insurer && profile.planType && profile.planType !== "unknown") {
      fetchPlanData(profile.insurer, profile.planType)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleCardUpload = async (file: File) => {
    setUploadingCard(true)
    setUploadedCardName(file.name)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/extract-document", { method: "POST", body: formData })
      const data = await res.json()
      if (data.extractedText) {
        onUpdate({ ...profile, insurancePolicyText: data.extractedText })
      }
    } catch {
      // ignore
    } finally {
      setUploadingCard(false)
    }
  }

  const planOptions = PLAN_TYPES[profile.insurer] || PLAN_TYPES.default

  return (
    <div className="space-y-6">
      {/* Insurer selection */}
      <div>
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Insurance Provider</h3>
        <div className="flex flex-wrap gap-2">
          {INSURERS.map((insurer) => {
            const selected = profile.insurer === insurer.id
            return (
              <button
                key={insurer.id}
                onClick={() => selectInsurer(insurer.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  selected
                    ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                    : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-700"
                }`}
              >
                {selected && <Check className="h-3.5 w-3.5" />}
                {insurer.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* Plan type — animates in after insurer selected */}
      {profile.insurer && (
        <div className="animate-in fade-in slide-in-from-top-2 duration-300">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Plan Type</h3>
          <div className="flex flex-wrap gap-2">
            {planOptions.map((plan) => {
              const selected = profile.planType === plan.id
              return (
                <button
                  key={plan.id}
                  onClick={() => selectPlanType(plan.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                    selected
                      ? "bg-teal-700 text-white border-teal-700 shadow-sm"
                      : "bg-white text-gray-700 border-gray-200 hover:border-teal-400 hover:text-teal-700"
                  }`}
                >
                  {selected && <Check className="h-3.5 w-3.5" />}
                  {plan.label}
                </button>
              )
            })}
            {/* "Not sure" option only for non-Medicare insurers */}
            {profile.insurer !== "medicare" && (
              <button
                onClick={() => selectPlanType("unknown")}
                className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all ${
                  profile.planType === "unknown"
                    ? "bg-teal-700 text-white border-teal-700"
                    : "bg-white text-gray-500 border-gray-200 hover:border-teal-400 border-dashed"
                }`}
              >
                Not sure
              </button>
            )}
          </div>
        </div>
      )}

      {/* Live plan data card — appears after plan type selected */}
      {profile.planType && profile.planType !== "unknown" && (
        <div className="animate-in fade-in duration-300">
          {loadingPlan && (
            <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
              <div className="h-3 w-3 rounded-full bg-teal-500 animate-pulse" />
              Loading live plan data from CMS Marketplace...
            </div>
          )}

          {planData && !loadingPlan && (
            <div className="rounded-xl border border-teal-100 bg-teal-50/60 p-4 space-y-3">
              {/* Header with source badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-teal-900">{planData.planName}</p>
                  <p className="text-xs text-teal-700 mt-0.5">{planData.metalLevel} · {planData.planType}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium shrink-0 ${
                    planData.source === "live"
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {planData.source === "live" ? (
                    <><Wifi className="h-3 w-3" /> Live CMS data</>
                  ) : (
                    <><Database className="h-3 w-3" /> Reference data</>
                  )}
                </span>
              </div>

              {/* Cost-sharing grid */}
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                <div>
                  <span className="text-gray-500">Deductible (individual)</span>
                  <span className="ml-2 font-semibold text-gray-900">{fmt(planData.deductibleIndividual)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Out-of-pocket max</span>
                  <span className="ml-2 font-semibold text-gray-900">{fmt(planData.oopMaxIndividual)}</span>
                </div>
                <div>
                  <span className="text-gray-500">Coinsurance (your share)</span>
                  <span className="ml-2 font-semibold text-gray-900">{planData.coinsuranceInNetwork}%</span>
                </div>
                {planData.primaryCareCopay > 0 && (
                  <div>
                    <span className="text-gray-500">PCP copay</span>
                    <span className="ml-2 font-semibold text-gray-900">{fmt(planData.primaryCareCopay)}</span>
                  </div>
                )}
                {planData.specialistCopay > 0 && (
                  <div>
                    <span className="text-gray-500">Specialist copay</span>
                    <span className="ml-2 font-semibold text-gray-900">{fmt(planData.specialistCopay)}</span>
                  </div>
                )}
                {planData.erCopay > 0 && (
                  <div>
                    <span className="text-gray-500">ER copay</span>
                    <span className="ml-2 font-semibold text-gray-900">{fmt(planData.erCopay)}</span>
                  </div>
                )}
              </div>

              <p className="text-xs text-gray-400">
                {planData.source === "live"
                  ? "Pulled from CMS Marketplace API · Used in your bill analysis"
                  : "Reference data · Set CMS_MARKETPLACE_API_KEY for live Illinois plan data"}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Upload insurance card */}
      <div className="border-t border-gray-100 pt-4">
        <label className="cursor-pointer">
          <div className="flex items-center gap-2 text-sm text-gray-500 hover:text-teal-700 transition-colors">
            <Upload className="h-4 w-4" />
            <span>
              {uploadedCardName
                ? uploadingCard
                  ? "Reading card with Gemini Vision..."
                  : `Card uploaded: ${uploadedCardName} ✓`
                : "Don't see yours? Upload your insurance card or policy"}
            </span>
          </div>
          <input
            type="file"
            accept="image/*,application/pdf"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) handleCardUpload(file)
            }}
          />
        </label>
        {uploadedCardName && !uploadingCard && (
          <p className="text-xs text-gray-400 mt-1 ml-6">
            Policy text extracted — Gemini will use this when analyzing your bill
          </p>
        )}
      </div>
    </div>
  )
}
