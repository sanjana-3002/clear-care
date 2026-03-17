"use client"

import { useState, useEffect, useRef } from "react"
import { PatientProfile, DEMO_DISCHARGE_TEXT } from "@/types/patient"
import PatientSetup from "@/components/PatientSetup"
import InsurancePicker from "@/components/InsurancePicker"
import DocumentUpload from "@/components/DocumentUpload"
import CareOutput, { CareAnalysisResult } from "@/components/CareOutput"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { ArrowLeft, ChevronRight } from "lucide-react"

type Step = "profile" | "insurance" | "document" | "analysis"

const STEP_LABELS: Record<Step, string> = {
  profile: "Patient Profile",
  insurance: "Insurance",
  document: "Document",
  analysis: "Analysis",
}

const STEP_ORDER: Step[] = ["profile", "insurance", "document", "analysis"]

export default function CarePage() {
  const [step, setStep] = useState<Step>("profile")
  const [profile, setProfile] = useState<PatientProfile | null>(null)
  const [documentText, setDocumentText] = useState("")
  const [additionalContext, setAdditionalContext] = useState("")
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState<CareAnalysisResult | null>(null)
  const [analysisError, setAnalysisError] = useState<string | null>(null)
  const [streamingText, setStreamingText] = useState("")
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    // Load saved profile
    const saved = localStorage.getItem("clearcare_patient_profile")
    if (saved) {
      try {
        const parsed: PatientProfile = JSON.parse(saved)
        if (parsed.name) {
          setProfile(parsed)
          // Skip to appropriate step
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
      const res = await fetch("/api/analyze-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientProfile: profile, extractedDocumentText: documentText, additionalContext }),
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

      // Parse the complete JSON
      const parsed = JSON.parse(fullText) as CareAnalysisResult
      setAnalysisResult(parsed)
      sessionStorage.setItem("clearcare_care_result", JSON.stringify(parsed))
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setAnalysisError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
      }
    } finally {
      setAnalyzing(false)
    }
  }

  const stepIndex = STEP_ORDER.indexOf(step)
  const progressValue = ((stepIndex + 1) / STEP_ORDER.length) * 100

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-gray-900">Care Companion</h1>
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
                This helps ClearCare give accurate cost and coverage guidance for {profile.name}.
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
              <h2 className="text-lg font-bold text-gray-900 mb-1">Upload Discharge Summary</h2>
              <p className="text-sm text-gray-500">
                Upload a photo of {profile.name}&apos;s discharge papers, or paste the text directly.
              </p>
            </div>

            <DocumentUpload
              onExtracted={handleDocumentExtracted}
              label="Discharge Summary or Medical Document"
              demoText={DEMO_DISCHARGE_TEXT}
              demoLabel="Use sample discharge"
            />

            {documentText && (
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-1.5">
                    Anything else we should know? (optional)
                  </label>
                  <textarea
                    value={additionalContext}
                    onChange={(e) => setAdditionalContext(e.target.value)}
                    placeholder="e.g. 'Dad lives alone and is confused about the new pain medication' or 'Mom is having trouble remembering the follow-up schedule'"
                    className="w-full h-24 text-sm border border-gray-200 rounded-xl p-3 resize-none focus:outline-none focus:border-teal-400"
                  />
                </div>

                <Button
                  onClick={handleAnalyze}
                  disabled={!documentText.trim() || analyzing}
                  className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3"
                >
                  Analyze with Gemini 2.5 Flash Lite &rarr;
                </Button>
              </div>
            )}
          </div>
        )}

        {step === "analysis" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Care Analysis</h2>
                <p className="text-sm text-gray-500">
                  Personalized guidance for {profile?.name}
                </p>
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
                  Analyze different document
                </button>
              )}
            </div>

            {analyzing && !analysisResult && (
              <div className="text-center py-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div className="flex gap-1.5">
                    <span
                      className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "0ms" }}
                    />
                    <span
                      className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "150ms" }}
                    />
                    <span
                      className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce"
                      style={{ animationDelay: "300ms" }}
                    />
                  </div>
                </div>
                <p className="text-sm font-medium text-teal-700">Analyzing with Gemini 2.5 Flash Lite...</p>
                <p className="text-xs text-gray-400 mt-1">
                  Reviewing medications, conditions, and discharge instructions
                </p>
                {streamingText && (
                  <div className="mt-4 text-left bg-gray-50 rounded-xl p-4 max-h-32 overflow-hidden">
                    <p className="text-xs font-mono text-gray-400 streaming-cursor">{streamingText.slice(-200)}</p>
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
              <CareOutput data={analysisResult} patientName={profile.name} />
            )}
          </div>
        )}
      </div>

      {/* Profile summary bar (when past profile step) */}
      {profile && step !== "profile" && (
        <div className="mt-4 flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-xl px-4 py-2.5">
          <div className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-xs">
            {profile.name ? profile.name[0].toUpperCase() : "?"}
          </div>
          <div className="flex-1 min-w-0">
            <span className="text-sm font-medium text-gray-700">
              {profile.name}, {profile.age}
            </span>
            {profile.conditions.length > 0 && (
              <span className="text-xs text-gray-400 ml-2">{profile.conditions.slice(0, 3).join(", ")}</span>
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
    </div>
  )
}
