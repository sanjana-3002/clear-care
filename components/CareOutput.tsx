"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Copy, Check, AlertCircle, Phone, Eye, Zap } from "lucide-react"

export interface MedicationInfo {
  name: string
  whatItDoes: string
  warnings: string[]
  emergencySign: string
}

export interface WatchFor {
  call911: string[]
  callDoctor: string[]
  monitorAtHome: string[]
}

export interface MedicationInteraction {
  drug1: string
  drug2: string
  severity: "mild" | "moderate" | "serious"
  description: string
}

export interface CareAnalysisResult {
  whatHappened: string
  medications: MedicationInfo[]
  medicationInteractions?: MedicationInteraction[]
  urgentFlags?: string[]
  watchFor: WatchFor
  questionsToAsk: string[]
  nextSteps: string[]
  urgencyLevel: "routine" | "soon" | "urgent"
  summary: string
  followUpActions?: string[]
}

interface CareOutputProps {
  data: CareAnalysisResult
  patientName: string
}

const URGENCY_CONFIG = {
  routine: { label: "Routine Follow-Up", color: "bg-green-100 text-green-700 border-green-200" },
  soon: { label: "Needs Attention Soon", color: "bg-amber-100 text-amber-700 border-amber-200" },
  urgent: { label: "Urgent — Act Today", color: "bg-red-100 text-red-700 border-red-200" },
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)
  const handleCopy = () => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  return (
    <button onClick={handleCopy} className="p-1 rounded hover:bg-gray-100 transition-colors" title="Copy">
      {copied ? <Check className="h-3.5 w-3.5 text-green-600" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
    </button>
  )
}

export default function CareOutput({ data, patientName }: CareOutputProps) {
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({})
  const [summaryCopied, setSummaryCopied] = useState(false)

  const today = new Date().toISOString().split("T")[0]
  const storageKey = `clearcare_checklist_${today}`

  useEffect(() => {
    const saved = localStorage.getItem(storageKey)
    if (saved) {
      try {
        setCheckedSteps(JSON.parse(saved))
      } catch {
        // ignore
      }
    }
  }, [storageKey])

  const toggleStep = (idx: number) => {
    const updated = { ...checkedSteps, [idx]: !checkedSteps[idx] }
    setCheckedSteps(updated)
    localStorage.setItem(storageKey, JSON.stringify(updated))
  }

  const handleShareSummary = () => {
    const text = `ClearCare Update for ${patientName}:\n${data.summary}\n\nUrgency: ${data.urgencyLevel.toUpperCase()}`
    navigator.clipboard.writeText(text)
    setSummaryCopied(true)
    setTimeout(() => setSummaryCopied(false), 2000)
  }

  const urgencyConf = URGENCY_CONFIG[data.urgencyLevel] || URGENCY_CONFIG.routine

  return (
    <div className="space-y-6">
      {/* What Happened */}
      <Card className="p-5 bg-teal-50 border-teal-100">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-sm font-bold text-teal-900 uppercase tracking-wide">What Happened</h3>
          <Badge className={`text-xs shrink-0 ${urgencyConf.color}`}>{urgencyConf.label}</Badge>
        </div>
        <p className="text-gray-800 leading-relaxed">{data.whatHappened}</p>
      </Card>

      {/* Urgent Flags */}
      {data.urgentFlags && data.urgentFlags.length > 0 && (
        <Card className="p-4 border-red-200 bg-red-50">
          <div className="flex items-center gap-2 mb-3">
            <Zap className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-bold text-red-800 uppercase tracking-wide">Urgent Attention Required</h3>
          </div>
          <ul className="space-y-1.5">
            {data.urgentFlags.map((flag, i) => (
              <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-500 mt-0.5 shrink-0 font-bold">!</span>
                {flag}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Medication Interactions */}
      {data.medicationInteractions && data.medicationInteractions.length > 0 && (
        <Card className="p-4 border-orange-200 bg-orange-50">
          <h3 className="text-sm font-bold text-orange-800 uppercase tracking-wide mb-3">Drug Interactions</h3>
          <div className="space-y-2">
            {data.medicationInteractions.map((interaction, i) => (
              <div key={i} className="flex items-start gap-3 text-sm">
                <span className={`shrink-0 text-xs font-bold px-1.5 py-0.5 rounded ${
                  interaction.severity === "serious"
                    ? "bg-red-100 text-red-700"
                    : interaction.severity === "moderate"
                    ? "bg-orange-100 text-orange-700"
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {interaction.severity}
                </span>
                <div>
                  <span className="font-semibold text-orange-900">{interaction.drug1} + {interaction.drug2}</span>
                  <p className="text-orange-700 text-xs mt-0.5">{interaction.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Medications */}
      {data.medications && data.medications.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Medications</h3>
          <div className="grid gap-3">
            {data.medications.map((med, i) => (
              <Card key={i} className="p-4 border-gray-100">
                <div className="font-semibold text-gray-900 mb-1">{med.name}</div>
                <p className="text-sm text-gray-600 mb-3">{med.whatItDoes}</p>
                {med.warnings && med.warnings.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {med.warnings.map((w, j) => (
                      <span
                        key={j}
                        className="text-xs bg-amber-50 text-amber-800 border border-amber-200 rounded-full px-2.5 py-1"
                      >
                        {w}
                      </span>
                    ))}
                  </div>
                )}
                {med.emergencySign && (
                  <div className="flex items-start gap-2 mt-2 bg-red-50 rounded-lg p-2.5">
                    <AlertCircle className="h-4 w-4 text-red-600 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700">{med.emergencySign}</p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Watch For */}
      {data.watchFor && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Watch For This</h3>
          <div className="grid md:grid-cols-3 gap-3">
            {/* Call 911 */}
            <Card className="p-4 border-red-100 bg-red-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-red-600" />
                <span className="text-sm font-bold text-red-700">Call 911</span>
              </div>
              <ul className="space-y-2">
                {(data.watchFor.call911 || []).map((item, i) => (
                  <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                    <span className="text-red-400 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Call Doctor */}
            <Card className="p-4 border-amber-100 bg-amber-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Phone className="h-4 w-4 text-amber-600" />
                <span className="text-sm font-bold text-amber-700">Call Doctor</span>
              </div>
              <ul className="space-y-2">
                {(data.watchFor.callDoctor || []).map((item, i) => (
                  <li key={i} className="text-sm text-amber-800 flex items-start gap-2">
                    <span className="text-amber-400 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>

            {/* Monitor */}
            <Card className="p-4 border-green-100 bg-green-50/50">
              <div className="flex items-center gap-2 mb-3">
                <Eye className="h-4 w-4 text-green-600" />
                <span className="text-sm font-bold text-green-700">Monitor at Home</span>
              </div>
              <ul className="space-y-2">
                {(data.watchFor.monitorAtHome || []).map((item, i) => (
                  <li key={i} className="text-sm text-green-800 flex items-start gap-2">
                    <span className="text-green-400 mt-0.5 shrink-0">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      )}

      {/* Questions to Ask */}
      {data.questionsToAsk && data.questionsToAsk.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Questions to Ask the Doctor</h3>
          <Card className="p-4 border-gray-100">
            <ol className="space-y-3">
              {data.questionsToAsk.map((q, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-teal-700 font-bold text-sm shrink-0">{i + 1}.</span>
                  <span className="text-sm text-gray-700 flex-1">{q}</span>
                  <CopyButton text={q} />
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}

      {/* Next Steps */}
      {data.nextSteps && data.nextSteps.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Next Steps</h3>
          <Card className="p-4 border-gray-100">
            <ul className="space-y-3">
              {data.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={!!checkedSteps[i]}
                    onChange={() => toggleStep(i)}
                    className="mt-0.5 h-4 w-4 rounded border-gray-300 text-teal-600 focus:ring-teal-500 shrink-0 cursor-pointer"
                  />
                  <span className={`text-sm ${checkedSteps[i] ? "text-gray-400 line-through" : "text-gray-700"}`}>
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      )}

      {/* Summary Footer */}
      {data.summary && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 flex items-center justify-between gap-3">
          <p className="text-sm text-gray-600 italic flex-1">&ldquo;{data.summary}&rdquo;</p>
          <button
            onClick={handleShareSummary}
            className="flex items-center gap-1.5 text-xs font-medium text-teal-700 hover:text-teal-800 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg px-3 py-2 transition-colors shrink-0"
          >
            {summaryCopied ? (
              <>
                <Check className="h-3.5 w-3.5" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                Share with family
              </>
            )}
          </button>
        </div>
      )}
    </div>
  )
}
