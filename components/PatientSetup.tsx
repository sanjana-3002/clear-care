"use client"

import { useState, useEffect, KeyboardEvent } from "react"
import { PatientProfile, DEFAULT_PROFILE } from "@/types/patient"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

const SUGGESTED_CONDITIONS = [
  "COPD",
  "Diabetes",
  "Hypertension",
  "Heart Disease",
  "Dementia",
  "Cancer",
  "Arthritis",
  "Kidney Disease",
  "Stroke",
  "Fall Risk",
  "Atrial Fibrillation",
  "Heart Failure",
  "Parkinson's Disease",
  "Osteoporosis",
]

const SUGGESTED_MEDICATIONS = [
  "Warfarin",
  "Metformin",
  "Lisinopril",
  "Metoprolol",
  "Atorvastatin",
  "Furosemide",
  "Albuterol",
  "Prednisone",
  "Gabapentin",
  "Amlodipine",
  "Levothyroxine",
  "Hydrocodone",
]

interface PatientSetupProps {
  onComplete: (profile: PatientProfile) => void
  initialProfile?: PatientProfile
}

export default function PatientSetup({ onComplete, initialProfile }: PatientSetupProps) {
  const [profile, setProfile] = useState<PatientProfile>(initialProfile || DEFAULT_PROFILE)
  const [conditionInput, setConditionInput] = useState("")
  const [medicationInput, setMedicationInput] = useState("")

  useEffect(() => {
    const saved = localStorage.getItem("clearcare_patient_profile")
    if (saved && !initialProfile) {
      try {
        const parsed = JSON.parse(saved)
        setProfile(parsed)
      } catch {
        // ignore
      }
    }
  }, [initialProfile])

  const saveToStorage = (updated: PatientProfile) => {
    localStorage.setItem("clearcare_patient_profile", JSON.stringify(updated))
  }

  const updateProfile = (updates: Partial<PatientProfile>) => {
    const updated = { ...profile, ...updates }
    setProfile(updated)
    saveToStorage(updated)
  }

  const addCondition = (condition: string) => {
    const trimmed = condition.trim()
    if (trimmed && !profile.conditions.includes(trimmed)) {
      updateProfile({ conditions: [...profile.conditions, trimmed] })
    }
    setConditionInput("")
  }

  const removeCondition = (condition: string) => {
    updateProfile({ conditions: profile.conditions.filter((c) => c !== condition) })
  }

  const addMedication = (medication: string) => {
    const trimmed = medication.trim()
    if (trimmed && !profile.medications.includes(trimmed)) {
      updateProfile({ medications: [...profile.medications, trimmed] })
    }
    setMedicationInput("")
  }

  const removeMedication = (medication: string) => {
    updateProfile({ medications: profile.medications.filter((m) => m !== medication) })
  }

  const handleConditionKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addCondition(conditionInput)
    }
  }

  const handleMedicationKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      addMedication(medicationInput)
    }
  }

  const canContinue = profile.name.trim().length > 0 && profile.age > 0

  const filteredConditions = SUGGESTED_CONDITIONS.filter(
    (c) =>
      !profile.conditions.includes(c) &&
      (conditionInput === "" || c.toLowerCase().includes(conditionInput.toLowerCase()))
  )

  const filteredMedications = SUGGESTED_MEDICATIONS.filter(
    (m) =>
      !profile.medications.includes(m) &&
      (medicationInput === "" || m.toLowerCase().includes(medicationInput.toLowerCase()))
  )

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell us about your patient</h2>
        <p className="text-gray-500">This helps ClearCare give personalized, accurate guidance.</p>
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
          Patient&apos;s Name
        </Label>
        <Input
          id="name"
          placeholder="e.g. Robert Chen"
          value={profile.name}
          onChange={(e) => updateProfile({ name: e.target.value })}
          className="border-gray-200 focus:border-teal-600 focus:ring-teal-600"
        />
      </div>

      {/* Age */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold text-gray-700">
          Age: <span className="text-teal-700 font-bold">{profile.age}</span>
        </Label>
        <input
          type="range"
          min={18}
          max={100}
          value={profile.age}
          onChange={(e) => updateProfile({ age: parseInt(e.target.value) })}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-teal-700"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>18</span>
          <span>100</span>
        </div>
      </div>

      {/* Conditions */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Medical Conditions</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {profile.conditions.map((condition) => (
            <Badge
              key={condition}
              className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100 cursor-default flex items-center gap-1 px-2 py-1"
            >
              {condition}
              <button
                onClick={() => removeCondition(condition)}
                className="ml-1 hover:text-teal-600 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Type condition and press Enter..."
          value={conditionInput}
          onChange={(e) => setConditionInput(e.target.value)}
          onKeyDown={handleConditionKeyDown}
          className="border-gray-200 focus:border-teal-600 focus:ring-teal-600"
        />
        {conditionInput.length > 0 && filteredConditions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {filteredConditions.slice(0, 6).map((c) => (
              <button
                key={c}
                onClick={() => addCondition(c)}
                className="text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-300 rounded-full px-3 py-1 transition-colors"
              >
                + {c}
              </button>
            ))}
          </div>
        )}
        {conditionInput.length === 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-xs text-gray-400 mr-1 self-center">Quick add:</span>
            {filteredConditions.slice(0, 7).map((c) => (
              <button
                key={c}
                onClick={() => addCondition(c)}
                className="text-xs bg-gray-100 hover:bg-teal-50 hover:text-teal-700 border border-gray-200 hover:border-teal-300 rounded-full px-3 py-1 transition-colors"
              >
                + {c}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Medications */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-700">Current Medications</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {profile.medications.map((medication) => (
            <Badge
              key={medication}
              className="bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-100 cursor-default flex items-center gap-1 px-2 py-1"
            >
              {medication}
              <button
                onClick={() => removeMedication(medication)}
                className="ml-1 hover:text-amber-600 focus:outline-none"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <Input
          placeholder="Type medication and press Enter (include dose if known)..."
          value={medicationInput}
          onChange={(e) => setMedicationInput(e.target.value)}
          onKeyDown={handleMedicationKeyDown}
          className="border-gray-200 focus:border-teal-600 focus:ring-teal-600"
        />
        {medicationInput.length > 0 && filteredMedications.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {filteredMedications.slice(0, 6).map((m) => (
              <button
                key={m}
                onClick={() => addMedication(m)}
                className="text-xs bg-gray-100 hover:bg-amber-50 hover:text-amber-700 border border-gray-200 hover:border-amber-300 rounded-full px-3 py-1 transition-colors"
              >
                + {m}
              </button>
            ))}
          </div>
        )}
        {medicationInput.length === 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            <span className="text-xs text-gray-400 mr-1 self-center">Quick add:</span>
            {filteredMedications.slice(0, 6).map((m) => (
              <button
                key={m}
                onClick={() => addMedication(m)}
                className="text-xs bg-gray-100 hover:bg-amber-50 hover:text-amber-700 border border-gray-200 hover:border-amber-300 rounded-full px-3 py-1 transition-colors"
              >
                + {m}
              </button>
            ))}
          </div>
        )}
      </div>

      <Button
        onClick={() => onComplete(profile)}
        disabled={!canContinue}
        className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3 rounded-lg disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Continue &rarr;
      </Button>
    </div>
  )
}
