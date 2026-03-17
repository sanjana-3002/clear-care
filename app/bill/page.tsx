"use client"

import { useState, useEffect, useRef } from "react"
import { PatientProfile, DEMO_BILL_TEXT } from "@/types/patient"
import PatientSetup from "@/components/PatientSetup"
import InsurancePicker from "@/components/InsurancePicker"
import DocumentUpload from "@/components/DocumentUpload"
import BillOutput, { BillAnalysisResult, DisputeItem } from "@/components/BillOutput"
import DisputeLetter from "@/components/DisputeLetter"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ChevronRight, X } from "lucide-react"

type Step = "profile" | "insurance" | "document" | "analysis"

const STEP_LABELS: Record<Step, string> = {
  profile: "Patient Profile",
  insurance: "Insurance",
  document: "Bill",
  analysis: "Analysis",
}

const STEP_ORDER: Step[] = ["profile", "insurance", "document", "analysis"]

export default function BillPage() {
  const [step, setStep] = useState<Step>("profile")
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [documentText, setDocumentText] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<BillAnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [streamingText, setStreamingText] = useState("")
  const [showLetter, setShowLetter] = useState(false)
  const [letter, setLetter] = useState("")
  const [generatingLetter, setGeneratingLetter] = useState(false)
  // disputeItems is used for letter generation tracking
  const [, setDisputeItems] = useState<DisputeItem[]>([])
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    const saved = localStorage.getItem("clearcare_patient_profile")
    if (saved) {
      try {
        const parsed: PatientProfile = JSON.parse(saved)
        if (parsed.name) {
          setProfile(parsed)
          if (parsed.insurer && parsed.planType) {
            setStep("document")
          } else {
            setStep("insurance")
          }
        }
      } catch {
        // ignore
      }
    }
  }, [])

  const handleProfileComplete = (p: PatientProfile) => {
    setProfile(p)
    if (p.insurer && p.planType) {
      setStep("document")
    } else {
      setStep("insurance")
    }
  }

  const handleInsuranceUpdate = (p: PatientProfile) => {
    setProfile(p)
    if (p.planType) {
      setStep("document")
    }
  }

  const handleDocumentExtracted = (text: string) => {
    setDocumentText(text)
  }

  const handleAnalyze = async () => {
    if (!profile || !documentText.trim()) return

    setAnalyzing(true)
    setAnalysisError(null)
    setAnalysisResult(null)
    setStreamingText("")
    setStep("analysis")

    abortRef.current = new AbortController()

    try {
      const res = await fetch("/api/analyze-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientProfile: profile, extractedBillText: documentText }),
        signal: abortRef.current.signal,
      })

      if (!res.ok) throw new Error("Analysis failed")
      if (!res.body) throw new Error("No response body")

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let fullText = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        fullText += chunk
        setStreamingText(fullText)
      }

      const parsed = JSON.parse(fullText) as BillAnalysisResult
      setAnalysisResult(parsed)
      sessionStorage.setItem("clearcare_bill_result", JSON.stringify(parsed))
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
      }
    } finally {
      setAnalyzing(false)
    }
  }

  const handleGenerateLetter = async (items: DisputeItem[]) => {
    if (!profile) return
    setDisputeItems(items)
    setGeneratingLetter(true)
    setShowLetter(true)
    setLetter("")

    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientProfile: profile,
          disputeItems: items,
          providerName: "",
          providerAddress: "",
        }),
      })
      const data = await res.json()
      setLetter(data.letter || "")
    } catch {
      setLetter("Failed to generate letter. Please try again.")
    } finally {
      setGeneratingLetter(false)
    }
  }

  const stepIndex = STEP_ORDER.indexOf(step)
  const progressValue = ((stepIndex + 1) / STEP_ORDER.length) * 100

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Bill Guardian</h1>
          {step !== "profile" && (
            <button
              onClick={() => {
                const prevStep = STEP_ORDER[STEP_ORDER.indexOf(step) - 1]
                if (prevStep) setStep(prevStep)
              }}
              className="flex items-center gap-1 text-sm text-gray-500 hover:text-teal-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
          )}
        </div>

        {/* Steps indicator */}
        <div className="flex items-center gap-2 mb-3">
          {STEP_ORDER.map((s, i) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`flex items-center gap-1.5 text-xs font-medium ${
                  s === step ? "text-teal-700" : i < stepIndex ? "text-gray-400" : "text-gray-300"
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                    i < stepIndex
                      ? "bg-teal-700 text-white"
                      : s === step
                        ? "border-2 border-teal-700 text-teal-700"
                        : "border-2 border-gray-200 text-gray-300"
                  }`}
                >
                  {i < stepIndex ? "✓" : i + 1}
                </div>
                <span className="hidden sm:inline">{STEP_LABELS[s]}</span>
              </div>
              {i < STEP_ORDER.length - 1 && <ChevronRight className="h-3 w-3 text-gray-200" />}
            </div>
          ))}
        </div>
        <Progress value={progressValue} className="h-1.5 bg-gray-100" />
      </div>

      {/* Step content */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        {step === "profile" && (
          <PatientSetup onComplete={handleProfileComplete} initialProfile={profile || undefined} />
        )}

        {step === "insurance" && profile && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Insurance Information</h2>
              <p className="text-sm text-gray-500">
                ClearCare uses this to analyze exactly what your plan covers and detect overbilling.
              </p>
            </div>
            <InsurancePicker profile={profile} onUpdate={handleInsuranceUpdate} />
            {profile.planType && (
              <Button
                onClick={() => setStep("document")}
                className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold"
              >
                Continue &rarr;
              </Button>
            )}
          </div>
        )}

        {step === "document" && profile && (
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-bold text-gray-900 mb-1">Upload Medical Bill</h2>
              <p className="text-sm text-gray-500">
                Upload or paste {profile.name}&apos;s itemized medical bill. The more detail the better.
              </p>
            </div>

            <DocumentUpload
              onExtracted={handleDocumentExtracted}
              label="Medical Bill or Explanation of Benefits"
              demoText={DEMO_BILL_TEXT}
              demoLabel="Use sample bill"
            />

            {documentText && (
              <Button
                onClick={handleAnalyze}
                disabled={!documentText.trim() || analyzing}
                className="w-full bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3"
              >
                Analyze Bill with Gemini 2.5 Flash Lite &rarr;
              </Button>
            )}
          </div>
        )}

        {step === "analysis" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Bill Analysis</h2>
                <p className="text-sm text-gray-500">Reviewing every charge for {profile?.name}</p>
              </div>
              {analysisResult && (
                <button
                  onClick={() => {
                    setStep("document")
                    setAnalysisResult(null)
                    setStreamingText("")
                  }}
                  className="text-xs text-gray-400 hover:text-teal-700 transition-colors"
                >
                  Analyze different bill
                </button>
              )}
            </div>

            {analyzing && !analysisResult && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2.5 h-2.5 bg-amber-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium text-amber-700">Analyzing your bill with Gemini 2.5 Flash Lite...</p>
                <p className="text-xs text-gray-400 mt-1">Checking every line for overbilling and coverage</p>
                {streamingText && (
                  <div className="mt-4 text-left bg-gray-50 rounded-xl p-4 max-h-32 overflow-hidden">
                    <p className="text-xs font-mono text-gray-400">{streamingText.slice(-200)}</p>
                  </div>
                )}
              </div>
            )}

            {analysisError && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                <p className="text-sm text-red-700 mb-3">{analysisError}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAnalyze}
                  className="border-red-200 text-red-700 hover:bg-red-50"
                >
                  Try Again
                </Button>
              </div>
            )}

            {analysisResult && profile && (
              <BillOutput data={analysisResult} patientProfile={profile} onGenerateLetter={handleGenerateLetter} />
            )}
          </div>
        )}
      </div>

      {/* Profile summary bar */}
      {profile && step !== "profile" && (
        <div className="mt-4 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center text-amber-700 font-bold text-xs">
            {profile.name ? profile.name[0].toUpperCase() : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-700">
              {profile.name}, {profile.age}
            </span>
            {profile.insurer && (
              <span className="text-xs text-gray-400 ml-2">
                {profile.insurer} / {profile.planType}
              </span>
            )}
          </div>
          <button
            onClick={() => setStep("profile")}
            className="text-xs text-gray-400 hover:text-teal-700 transition-colors shrink-0"
          >
            Edit
          </button>
        </div>
      )}

      {/* Dispute Letter Modal */}
      {showLetter && profile && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Dispute Letter</h2>
              <button
                onClick={() => setShowLetter(false)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5">
              {generatingLetter ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    <span
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2 h-2 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                  <p className="text-sm text-teal-700 font-medium">Drafting your dispute letter...</p>
                </div>
              ) : (
                <DisputeLetter letter={letter} patientProfile={profile} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
