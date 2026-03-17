"use client"

import { useState, useEffect, useRef } from "react"
import { DEMO_SCENARIOS, type DemoScenario } from "@/types/patient"
import CareOutput, { CareAnalysisResult } from "@/components/CareOutput"
import BillOutput, { BillAnalysisResult, DisputeItem } from "@/components/BillOutput"
import DisputeLetter from "@/components/DisputeLetter"
import { RefreshCw, X, ChevronRight, Zap, FileText, Heart, DollarSign, LayoutDashboard } from "lucide-react"

type AnalysisState = "idle" | "streaming" | "complete" | "error"
type Tab = "overview" | "care" | "bill" | "docs"

// ── Animated count-up number ─────────────────────────────────────────────────
function CountUp({ target, duration = 1800 }: { target: number; duration?: number }) {
  const [current, setCurrent] = useState(0)
  const started = useRef(false)

  useEffect(() => {
    started.current = false
    setCurrent(0)
  }, [target])

  useEffect(() => {
    if (target === 0 || started.current) return
    started.current = true
    const start = performance.now()
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setCurrent(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])

  return <>{new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(current)}</>
}

// ── Color config per scenario ─────────────────────────────────────────────────
const COLOR = {
  teal: {
    avatar: "from-teal-500 to-teal-700",
    card: "border-teal-200 bg-teal-50",
    cardSelected: "border-teal-500 bg-teal-50 ring-2 ring-teal-400",
    badge: "bg-teal-100 text-teal-700",
    dot: "bg-teal-500",
    label: "bg-teal-700 text-white",
    streamDot: "bg-teal-600",
    streamText: "text-teal-700",
    impactFrom: "from-teal-600",
    impactTo: "to-teal-700",
    tabActive: "bg-teal-700 text-white shadow-sm",
    tabInactive: "text-gray-500 hover:text-teal-700 hover:bg-teal-50",
  },
  rose: {
    avatar: "from-rose-500 to-rose-700",
    card: "border-rose-200 bg-rose-50",
    cardSelected: "border-rose-500 bg-rose-50 ring-2 ring-rose-400",
    badge: "bg-rose-100 text-rose-700",
    dot: "bg-rose-500",
    label: "bg-rose-700 text-white",
    streamDot: "bg-rose-600",
    streamText: "text-rose-700",
    impactFrom: "from-rose-600",
    impactTo: "to-rose-700",
    tabActive: "bg-rose-700 text-white shadow-sm",
    tabInactive: "text-gray-500 hover:text-rose-700 hover:bg-rose-50",
  },
  blue: {
    avatar: "from-blue-500 to-blue-700",
    card: "border-blue-200 bg-blue-50",
    cardSelected: "border-blue-500 bg-blue-50 ring-2 ring-blue-400",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-500",
    label: "bg-blue-700 text-white",
    streamDot: "bg-blue-600",
    streamText: "text-blue-700",
    impactFrom: "from-blue-600",
    impactTo: "to-blue-700",
    tabActive: "bg-blue-700 text-white shadow-sm",
    tabInactive: "text-gray-500 hover:text-blue-700 hover:bg-blue-50",
  },
}

function initials(name: string) {
  return name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase()
}

function _Cursor() {
  return <span className="inline-block w-0.5 h-3.5 bg-current ml-0.5 animate-pulse align-middle" />
}

// ── Streaming skeleton loader ─────────────────────────────────────────────────
function StreamingLoader({ label, subtext, dots, raw }: { label: string; subtext: string; dots: string; raw: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-8 text-center">
      <div className="flex gap-2 mb-6">
        {[0, 150, 300].map((d) => (
          <span key={d} className={`w-3 h-3 ${dots} rounded-full animate-bounce`} style={{ animationDelay: `${d}ms` }} />
        ))}
      </div>
      <p className="text-base font-semibold text-gray-800 mb-1">{label}</p>
      <p className="text-sm text-gray-400 mb-6">{subtext}</p>
      {raw && (
        <div className="w-full max-w-lg bg-gray-50 rounded-xl p-4 max-h-24 overflow-hidden relative text-left">
          <p className="text-xs font-mono text-gray-400 leading-relaxed">{raw.slice(-300)}</p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent rounded-b-xl" />
        </div>
      )}
    </div>
  )
}

export default function DemoPage() {
  const [activeId, setActiveId] = useState<string>(DEMO_SCENARIOS[0].id)
  const [careState, setCareState] = useState<AnalysisState>("idle")
  const [billState, setBillState] = useState<AnalysisState>("idle")
  const [careResult, setCareResult] = useState<CareAnalysisResult | null>(null)
  const [billResult, setBillResult] = useState<BillAnalysisResult | null>(null)
  const [careError, setCareError] = useState<string | null>(null)
  const [billError, setBillError] = useState<string | null>(null)
  const [careStreaming, setCareStreaming] = useState("")
  const [billStreaming, setBillStreaming] = useState("")
  const [showLetter, setShowLetter] = useState(false)
  const [letter, setLetter] = useState("")
  const [generatingLetter, setGeneratingLetter] = useState(false)
  const [elapsedCare, setElapsedCare] = useState(0)
  const [elapsedBill, setElapsedBill] = useState(0)
  const [activeTab, setActiveTab] = useState<Tab>("overview")
  const abortCare = useRef<AbortController | null>(null)
  const abortBill = useRef<AbortController | null>(null)

  const scenario = DEMO_SCENARIOS.find((s) => s.id === activeId) ?? DEMO_SCENARIOS[0]
  const c = COLOR[scenario.color]

  const runCareAnalysis = async (s: DemoScenario) => {
    setCareState("streaming")
    setCareResult(null)
    setCareError(null)
    setCareStreaming("")
    abortCare.current = new AbortController()
    const t0 = performance.now()
    const timer = setInterval(() => setElapsedCare(Math.round((performance.now() - t0) / 100) / 10), 100)
    try {
      const res = await fetch("/api/analyze-care", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientProfile: s.profile, extractedDocumentText: s.dischargeText }),
        signal: abortCare.current.signal,
      })
      if (!res.ok || !res.body) throw new Error("failed")
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setCareStreaming(full)
      }
      setCareResult(JSON.parse(full) as CareAnalysisResult)
      setCareState("complete")
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setCareError("Check GOOGLE_API_KEY in .env.local")
        setCareState("error")
      }
    } finally {
      clearInterval(timer)
    }
  }

  const runBillAnalysis = async (s: DemoScenario) => {
    setBillState("streaming")
    setBillResult(null)
    setBillError(null)
    setBillStreaming("")
    abortBill.current = new AbortController()
    const t0 = performance.now()
    const timer = setInterval(() => setElapsedBill(Math.round((performance.now() - t0) / 100) / 10), 100)
    try {
      const res = await fetch("/api/analyze-bill", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ patientProfile: s.profile, extractedBillText: s.billText }),
        signal: abortBill.current.signal,
      })
      if (!res.ok || !res.body) throw new Error("failed")
      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let full = ""
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        full += decoder.decode(value, { stream: true })
        setBillStreaming(full)
      }
      setBillResult(JSON.parse(full) as BillAnalysisResult)
      setBillState("complete")
    } catch (err) {
      if ((err as Error).name !== "AbortError") {
        setBillError("Check GOOGLE_API_KEY in .env.local")
        setBillState("error")
      }
    } finally {
      clearInterval(timer)
    }
  }

  const runDemo = (s: DemoScenario) => {
    abortCare.current?.abort()
    abortBill.current?.abort()
    setCareState("idle")
    setBillState("idle")
    setCareResult(null)
    setBillResult(null)
    setCareError(null)
    setBillError(null)
    setCareStreaming("")
    setBillStreaming("")
    setElapsedCare(0)
    setElapsedBill(0)
    setShowLetter(false)
    setLetter("")
    setActiveTab("overview")
    setTimeout(() => {
      runCareAnalysis(s)
      runBillAnalysis(s)
    }, 80)
  }

  const selectScenario = (s: DemoScenario) => {
    setActiveId(s.id)
    runDemo(s)
  }

  useEffect(() => { runDemo(DEMO_SCENARIOS[0]) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleGenerateLetter = async (items: DisputeItem[]) => {
    setGeneratingLetter(true)
    setShowLetter(true)
    setLetter("")
    try {
      const res = await fetch("/api/generate-letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          patientProfile: scenario.profile,
          disputeItems: items,
          providerName: scenario.id === "robert"
            ? "Northwestern Memorial Hospital"
            : scenario.id === "maria"
            ? "Rush University Medical Center"
            : "University of Chicago Medical Center",
          providerAddress: scenario.id === "robert"
            ? "251 E Huron St, Chicago, IL 60611"
            : scenario.id === "maria"
            ? "1620 W Harrison St, Chicago, IL 60612"
            : "5841 S Maryland Ave, Chicago, IL 60637",
        }),
      })
      const data = await res.json()
      setLetter(data.letter || "")
    } catch {
      setLetter("Failed to generate letter.")
    } finally {
      setGeneratingLetter(false)
    }
  }

  const anyStreaming = careState === "streaming" || billState === "streaming"
  const bothComplete = careState === "complete" && billState === "complete"
  const savings = billResult?.summary?.potentialSavings ?? 0

  const tabs: { id: Tab; label: string; icon: React.ReactNode; available: boolean }[] = [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="h-3.5 w-3.5" />, available: true },
    { id: "care", label: "Care Analysis", icon: <Heart className="h-3.5 w-3.5" />, available: careState !== "idle" },
    { id: "bill", label: "Bill Analysis", icon: <DollarSign className="h-3.5 w-3.5" />, available: billState !== "idle" },
    { id: "docs", label: "Documents", icon: <FileText className="h-3.5 w-3.5" />, available: true },
  ]

  return (
    <div className="min-h-screen bg-[#F7F7F5]">

      {/* ── STICKY HEADER ───────────────────────────────────── */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">CC</span>
            </div>
            <span className="font-bold text-gray-900 text-lg">ClearCare</span>
            <div className="h-5 w-px bg-gray-200" />
            <span className="hidden sm:flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-mono px-2.5 py-1 rounded-full">
              gemini-2.5-flash-lite
            </span>
          </div>
          <div className="flex items-center gap-2">
            {anyStreaming && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-pulse" />
                Analyzing…
              </span>
            )}
            {bothComplete && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs font-medium text-green-700 bg-green-50 border border-green-200 rounded-full px-3 py-1">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                Complete
              </span>
            )}
            {(careState === "error" || billState === "error") && (
              <button onClick={() => runDemo(scenario)} className="flex items-center gap-1.5 text-xs font-semibold text-white bg-teal-700 hover:bg-teal-800 rounded-lg px-3 py-1.5 transition-colors">
                <Zap className="h-3.5 w-3.5" /> Retry
              </button>
            )}
            <button
              onClick={() => runDemo(scenario)}
              disabled={anyStreaming}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-700 border border-gray-200 hover:border-teal-300 rounded-lg px-3 py-1.5 transition-colors disabled:opacity-40"
            >
              <RefreshCw className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">

        {/* ── STEP 1: PATIENT SELECTOR ─────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold shrink-0">1</span>
            <p className="text-sm font-semibold text-gray-700">Choose a patient scenario</p>
          </div>
          <div className="grid sm:grid-cols-3 gap-3">
            {DEMO_SCENARIOS.map((s) => {
              const sc = COLOR[s.color]
              const isActive = s.id === activeId
              const isLoading = isActive && anyStreaming
              return (
                <button
                  key={s.id}
                  onClick={() => selectScenario(s)}
                  disabled={anyStreaming && isActive}
                  className={`text-left rounded-2xl border-2 p-4 transition-all duration-200 group ${
                    isActive ? sc.cardSelected : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sc.avatar} flex items-center justify-center shrink-0 shadow-sm`}>
                      <span className="text-white text-sm font-bold">{initials(s.profile.name)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-bold text-gray-900 text-sm">{s.profile.name}</span>
                        <span className="text-xs text-gray-400">{s.profile.age}</span>
                        {isLoading && <span className={`w-1.5 h-1.5 rounded-full ${sc.dot} animate-pulse shrink-0`} />}
                        {isActive && !isLoading && bothComplete && <span className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />}
                      </div>
                      <p className="text-xs text-gray-600 leading-snug mb-2">{s.hook}</p>
                      <div className="flex flex-wrap gap-1">
                        {s.profile.conditions.slice(0, 2).map((cond) => (
                          <span key={cond} className={`text-xs px-2 py-0.5 rounded-full ${sc.badge}`}>{cond}</span>
                        ))}
                        {s.profile.conditions.length > 2 && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">+{s.profile.conditions.length - 2}</span>
                        )}
                      </div>
                    </div>
                    <ChevronRight className={`h-4 w-4 shrink-0 mt-1 transition-transform ${isActive ? "text-gray-700" : "text-gray-300 group-hover:text-gray-500"}`} />
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── STEP 2: RESULTS ─────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center w-6 h-6 rounded-full bg-gray-900 text-white text-xs font-bold shrink-0">2</span>
            <p className="text-sm font-semibold text-gray-700">AI Analysis Results</p>
            {anyStreaming && (
              <span className="text-xs text-gray-400 flex items-center gap-1">
                <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
                Gemini is working…
              </span>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">

            {/* Patient strip */}
            <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
              <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.avatar} flex items-center justify-center shrink-0 shadow-sm`}>
                <span className="text-white font-bold">{initials(scenario.profile.name)}</span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-bold text-gray-900">{scenario.profile.name}</h2>
                  <span className="text-gray-400 text-sm">{scenario.profile.age} yrs</span>
                  <span className={`text-xs rounded-full px-2.5 py-0.5 font-medium ${c.badge}`}>
                    {scenario.profile.insurer.toUpperCase()} · {scenario.profile.planType}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {scenario.profile.conditions.map((cond) => (
                    <span key={cond} className="text-xs bg-gray-50 border border-gray-200 text-gray-500 rounded-full px-2 py-0.5">{cond}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-end gap-0.5 text-xs text-gray-400 shrink-0">
                {careState !== "idle" && (
                  <span>Care: {careState === "complete"
                    ? <span className="text-green-600 font-semibold">{elapsedCare}s ✓</span>
                    : <span className="text-gray-400">{elapsedCare}s…</span>}
                  </span>
                )}
                {billState !== "idle" && (
                  <span>Bill: {billState === "complete"
                    ? <span className="text-green-600 font-semibold">{elapsedBill}s ✓</span>
                    : <span className="text-gray-400">{elapsedBill}s…</span>}
                  </span>
                )}
              </div>
            </div>

            {/* Impact bar — only when bill result ready */}
            {billResult && (
              <div className={`bg-gradient-to-r ${c.impactFrom} ${c.impactTo} px-6 py-5`}>
                <div className="grid grid-cols-3 gap-6 text-center">
                  <div>
                    <div className="text-xs font-medium text-white/70 mb-1">Hospital Billed</div>
                    <div className="text-2xl font-bold text-white"><CountUp target={billResult.summary.totalBilled} /></div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-white/70 mb-1">You Actually Owe</div>
                    <div className="text-2xl font-bold text-white"><CountUp target={billResult.summary.totalActuallyOwed} /></div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-amber-200 mb-1">💰 Savings Found</div>
                    <div className="text-3xl font-bold text-amber-300"><CountUp target={savings} duration={2200} /></div>
                  </div>
                </div>
                {billResult.summary.itemsToDispute > 0 && (
                  <p className="text-center text-xs text-white/60 mt-3">
                    {billResult.summary.itemsToDispute} billing errors identified · dispute letter ready in one click
                  </p>
                )}
              </div>
            )}

            {/* Tab bar */}
            <div className="flex gap-1 px-4 pt-4 pb-0 border-b border-gray-100 overflow-x-auto">
              {tabs.filter(t => t.available).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-t-lg transition-all whitespace-nowrap border-b-2 -mb-px ${
                    activeTab === tab.id
                      ? `border-current ${c.streamText} bg-gray-50`
                      : "border-transparent text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab.icon}
                  {tab.label}
                  {tab.id === "care" && careState === "streaming" && (
                    <span className={`w-1.5 h-1.5 rounded-full ${c.dot} animate-pulse`} />
                  )}
                  {tab.id === "bill" && billState === "streaming" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  )}
                  {tab.id === "care" && careState === "complete" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                  {tab.id === "bill" && billState === "complete" && (
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                  )}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[340px]">

              {/* ── OVERVIEW TAB ── */}
              {activeTab === "overview" && (
                <div className="p-6">
                  {!billResult && !careResult && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <div className="flex gap-2 mb-5">
                        {[0, 150, 300].map((d) => (
                          <span key={d} className={`w-3 h-3 ${c.dot} rounded-full animate-bounce`} style={{ animationDelay: `${d}ms` }} />
                        ))}
                      </div>
                      <p className="text-base font-semibold text-gray-700 mb-1">Gemini is analyzing both documents…</p>
                      <p className="text-sm text-gray-400">Care plan · medication review · bill audit running in parallel</p>
                    </div>
                  )}

                  {(careResult || billResult) && (
                    <div className="space-y-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Summary</p>

                      {/* Quick stat cards */}
                      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {careResult && (
                          <>
                            {(careResult.urgentFlags?.length ?? 0) > 0 && (
                              <div className="rounded-xl bg-red-50 border border-red-200 p-4">
                                <p className="text-xs font-semibold text-red-600 mb-1">⚠️ Urgent Flags</p>
                                <p className="text-2xl font-bold text-red-700">{careResult.urgentFlags?.length ?? 0}</p>
                                <p className="text-xs text-red-500 mt-0.5">needs immediate attention</p>
                              </div>
                            )}
                            {(careResult.medicationInteractions?.length ?? 0) > 0 && (
                              <div className="rounded-xl bg-orange-50 border border-orange-200 p-4">
                                <p className="text-xs font-semibold text-orange-600 mb-1">💊 Med Interactions</p>
                                <p className="text-2xl font-bold text-orange-700">{careResult.medicationInteractions?.length ?? 0}</p>
                                <p className="text-xs text-orange-500 mt-0.5">potential interactions</p>
                              </div>
                            )}
                            {(careResult.followUpActions?.length ?? 0) > 0 && (
                              <div className={`rounded-xl border p-4 ${c.card}`}>
                                <p className={`text-xs font-semibold mb-1 ${c.streamText}`}>📋 Follow-up Actions</p>
                                <p className={`text-2xl font-bold ${c.streamText}`}>{careResult.followUpActions?.length ?? 0}</p>
                                <p className={`text-xs mt-0.5 opacity-70 ${c.streamText}`}>recommended next steps</p>
                              </div>
                            )}
                          </>
                        )}
                        {billResult && (
                          <>
                            <div className="rounded-xl bg-amber-50 border border-amber-200 p-4">
                              <p className="text-xs font-semibold text-amber-600 mb-1">🔍 Items to Dispute</p>
                              <p className="text-2xl font-bold text-amber-700">{billResult.summary.itemsToDispute}</p>
                              <p className="text-xs text-amber-500 mt-0.5">billing errors found</p>
                            </div>
                            <div className="rounded-xl bg-green-50 border border-green-200 p-4">
                              <p className="text-xs font-semibold text-green-600 mb-1">💰 Potential Savings</p>
                              <p className="text-2xl font-bold text-green-700">
                                {new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(savings)}
                              </p>
                              <p className="text-xs text-green-500 mt-0.5">you may be overpaying</p>
                            </div>
                          </>
                        )}
                      </div>

                      {/* Next steps prompt */}
                      <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">
                        <p className="text-xs font-semibold text-gray-600 mb-2">Explore the full analysis</p>
                        <div className="flex flex-wrap gap-2">
                          <button onClick={() => setActiveTab("care")} className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg ${c.label} transition-opacity hover:opacity-90`}>
                            <Heart className="h-3.5 w-3.5" /> View Care Analysis
                          </button>
                          <button onClick={() => setActiveTab("bill")} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-amber-600 text-white hover:opacity-90 transition-opacity">
                            <DollarSign className="h-3.5 w-3.5" /> View Bill Analysis
                          </button>
                          <button onClick={() => setActiveTab("docs")} className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors">
                            <FileText className="h-3.5 w-3.5" /> Source Documents
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ── CARE ANALYSIS TAB ── */}
              {activeTab === "care" && (
                <div className="p-6">
                  {careState === "streaming" && !careResult && (
                    <StreamingLoader
                      label="Gemini is reading the discharge summary…"
                      subtext="Reviewing medications · interactions · red flag symptoms"
                      dots={c.streamDot}
                      raw={careStreaming}
                    />
                  )}
                  {careState === "error" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-sm font-medium text-red-700 mb-3">⚠️ {careError}</p>
                      <button onClick={() => runCareAnalysis(scenario)} className="text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-colors">
                        Retry Care Analysis
                      </button>
                    </div>
                  )}
                  {careResult && (
                    <div className="animate-in fade-in duration-500">
                      <CareOutput data={careResult} patientName={scenario.profile.name} />
                    </div>
                  )}
                </div>
              )}

              {/* ── BILL ANALYSIS TAB ── */}
              {activeTab === "bill" && (
                <div className="p-6">
                  {billState === "streaming" && !billResult && (
                    <StreamingLoader
                      label="Gemini is auditing the itemized bill…"
                      subtext="Checking CPT codes · Medicare rates · insurance rules"
                      dots="bg-amber-500"
                      raw={billStreaming}
                    />
                  )}
                  {billState === "error" && (
                    <div className="flex flex-col items-center justify-center py-16 text-center">
                      <p className="text-sm font-medium text-red-700 mb-3">⚠️ {billError}</p>
                      <button onClick={() => runBillAnalysis(scenario)} className="text-xs text-white bg-red-600 hover:bg-red-700 rounded-lg px-4 py-2 transition-colors">
                        Retry Bill Analysis
                      </button>
                    </div>
                  )}
                  {billResult && (
                    <div className="animate-in fade-in duration-500">
                      <BillOutput data={billResult} patientProfile={scenario.profile} onGenerateLetter={handleGenerateLetter} />
                    </div>
                  )}
                </div>
              )}

              {/* ── DOCUMENTS TAB ── */}
              {activeTab === "docs" && (
                <div className="divide-y divide-gray-100">
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className={`w-2 h-2 rounded-full ${c.dot}`} />
                      <span className="text-sm font-semibold text-gray-800">Discharge Summary</span>
                      <span className="text-xs text-gray-400">· fed into Care Analysis</span>
                    </div>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 rounded-xl p-4 max-h-72 overflow-y-auto border border-gray-100">{scenario.dischargeText}</pre>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      <span className="text-sm font-semibold text-gray-800">Itemized Bill</span>
                      <span className="text-xs text-gray-400">· fed into Bill Analysis</span>
                    </div>
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap font-mono leading-relaxed bg-gray-50 rounded-xl p-4 max-h-72 overflow-y-auto border border-gray-100">{scenario.billText}</pre>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* ── FOOTER ──────────────────────────────────────────── */}
        <div className="border-t border-gray-100 pt-5 pb-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-400">
          <span>
            <span className="font-mono text-gray-500">gemini-2.5-flash-lite</span>
            {" · "}care analysis · bill auditing · dispute letters
          </span>
          <span>Google DeepMind Hackathon 2026 · ClearCare</span>
        </div>
      </main>

      {/* ── DISPUTE LETTER MODAL ────────────────────────────── */}
      {showLetter && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Dispute Letter</h2>
                <p className="text-xs text-gray-500 mt-0.5">Generated by gemini-2.5-flash-lite · Ready to send</p>
              </div>
              <button onClick={() => setShowLetter(false)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
                <X className="h-5 w-5 text-gray-400" />
              </button>
            </div>
            <div className="p-5">
              {generatingLetter ? (
                <div className="text-center py-12">
                  <div className="flex items-center justify-center gap-1.5 mb-3">
                    {[0, 150, 300].map((d) => (
                      <span key={d} className="w-2 h-2 bg-teal-600 rounded-full animate-bounce" style={{ animationDelay: `${d}ms` }} />
                    ))}
                  </div>
                  <p className="text-sm text-teal-700 font-medium">Drafting dispute letter…</p>
                  <p className="text-xs text-gray-400 mt-1">Citing Medicare rates · Illinois patient rights · 30-day deadline</p>
                </div>
              ) : (
                <DisputeLetter letter={letter} patientProfile={scenario.profile} />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
