import Link from "next/link"
import {
  ArrowRight,
  ChevronRight,
  Heart,
  FileText,
  Shield,
  Zap,
  Users,
  DollarSign,
  AlertCircle,
  CheckCircle,
  Clock,
  Phone,
} from "lucide-react"

export default function Home() {
  return (
    <div className="bg-[#FAFAF8]">

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pt-16 pb-12 text-center">
        <div className="inline-flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2 mb-6">
          <div className="w-2 h-2 rounded-full bg-teal-600 animate-pulse" />
          <span className="text-sm font-medium text-teal-700">Built for Google DeepMind Hackathon 2026</span>
        </div>

        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-5 leading-tight tracking-tight">
          Your family deserves
          <br />
          <span className="text-teal-700">clarity.</span> Not confusion.
        </h1>

        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-8 leading-relaxed">
          63 million Americans are caring for a loved one right now — navigating discharge papers, decoding insurance,
          and fighting medical bills completely alone. ClearCare changes that.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-base"
          >
            <Zap className="h-4 w-4" />
            See Live Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/care"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 hover:border-teal-400 text-gray-700 hover:text-teal-700 font-semibold px-6 py-3 rounded-xl transition-colors text-base"
          >
            Start for Free
          </Link>
        </div>

        {/* Trust strip */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-400">
          <span className="flex items-center gap-1.5"><Shield className="h-3.5 w-3.5 text-teal-600" /> No account needed</span>
          <span className="text-gray-200">·</span>
          <span>No data stored</span>
          <span className="text-gray-200">·</span>
          <span>Free to use</span>
          <span className="text-gray-200">·</span>
          <span>Private & secure</span>
        </div>
      </section>

      {/* ── STATS ──────────────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <Users className="h-5 w-5 text-teal-600" />
                <span className="text-3xl font-bold text-gray-900">63M</span>
              </div>
              <p className="text-sm text-gray-500">unpaid family caregivers in the US</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <span className="text-3xl font-bold text-gray-900">80%</span>
              </div>
              <p className="text-sm text-gray-500">of medical bills contain errors</p>
            </div>
            <div>
              <div className="flex items-center justify-center gap-2 mb-1">
                <DollarSign className="h-5 w-5 text-amber-600" />
                <span className="text-3xl font-bold text-gray-900">$1,300</span>
              </div>
              <p className="text-sm text-gray-500">average overcharge per hospital stay</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── TWO TOOLS ──────────────────────────────────────────── */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">Two tools. One mission.</h2>
          <p className="text-gray-500 max-w-xl mx-auto">
            Whether you&apos;re staring at a confusing discharge paper or a $15,000 hospital bill —
            ClearCare speaks your language.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Care Companion */}
          <Link href="/care" className="group">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 h-full hover:shadow-lg hover:border-teal-200 transition-all duration-200 group-hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-5">
                <Heart className="h-6 w-6 text-teal-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Care Companion</h3>
              <p className="text-gray-500 leading-relaxed mb-5">
                Upload or paste a hospital discharge summary. Get plain English answers: what happened, what to
                watch for, medication warnings, and exactly when to call 911 — personalized to your loved one.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["Discharge summaries", "Medication safety", "Red flag symptoms", "Follow-up checklist"].map((tag) => (
                  <span key={tag} className="text-xs bg-teal-50 text-teal-700 border border-teal-200 rounded-full px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-teal-700 font-semibold text-sm group-hover:gap-3 transition-all">
                Decode a discharge summary
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>

          {/* Bill Guardian */}
          <Link href="/bill" className="group">
            <div className="bg-white border border-gray-100 rounded-2xl p-8 h-full hover:shadow-lg hover:border-amber-200 transition-all duration-200 group-hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center mb-5">
                <FileText className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Bill Guardian</h3>
              <p className="text-gray-500 leading-relaxed mb-5">
                Upload or paste your medical bill. ClearCare analyzes every line item, flags overbilling, explains
                what your insurance should cover, and writes your dispute letter — ready to send certified mail.
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {["CPT code analysis", "Overbilling detection", "Insurance coverage", "Dispute letters"].map((tag) => (
                  <span key={tag} className="text-xs bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-2.5 py-1">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-amber-700 font-semibold text-sm group-hover:gap-3 transition-all">
                Analyze my medical bill
                <ArrowRight className="h-4 w-4" />
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-16">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Users className="h-5 w-5 text-teal-700" />,
                step: "1",
                title: "Tell us about the patient",
                desc: "Name, age, conditions, medications, and insurance. Takes 60 seconds. Saved for next time.",
              },
              {
                icon: <FileText className="h-5 w-5 text-teal-700" />,
                step: "2",
                title: "Upload or paste the document",
                desc: "Drop in a photo of the discharge paper or bill, or paste the text. Gemini reads it instantly.",
              },
              {
                icon: <CheckCircle className="h-5 w-5 text-teal-700" />,
                step: "3",
                title: "Get your action plan",
                desc: "Plain English summary, red flags, medication warnings, and next steps — or a ready-to-send dispute letter.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-10 h-10 rounded-full bg-teal-700 text-white font-bold text-lg flex items-center justify-center mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── POWERED BY ─────────────────────────────────────────── */}
      <section className="max-w-4xl mx-auto px-4 py-14 text-center">
        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-6">
          Powered by Google DeepMind
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 mb-6">
          <div className="flex items-center gap-2 bg-teal-50 border border-teal-200 rounded-full px-4 py-2">
            <div className="w-2 h-2 rounded-full bg-teal-600" />
            <span className="text-sm font-semibold text-teal-800 font-mono">gemini-2.5-flash-lite</span>
            <span className="text-xs text-teal-600">Care · Bills · Documents · Letters</span>
          </div>
        </div>
        <p className="text-sm text-gray-400 max-w-lg mx-auto">
          Real-time multimodal AI analyzes your documents in seconds —
          the same foundation models powering the next generation of healthcare AI.
        </p>
      </section>

      {/* ── WHAT YOU GET ───────────────────────────────────────── */}
      <section className="bg-white border-y border-gray-100 py-14">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">What ClearCare gives you</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: <Phone className="h-4 w-4 text-red-600" />, title: "When to call 911", desc: "Specific symptom thresholds for your loved one's exact conditions.", color: "border-red-100 bg-red-50/30" },
              { icon: <Heart className="h-4 w-4 text-teal-600" />, title: "Medication safety", desc: "Interactions, timing, and emergency signs for every drug on the list.", color: "border-teal-100 bg-teal-50/30" },
              { icon: <CheckCircle className="h-4 w-4 text-green-600" />, title: "Follow-up checklist", desc: "Daily action items you can check off — saved across sessions.", color: "border-green-100 bg-green-50/30" },
              { icon: <DollarSign className="h-4 w-4 text-amber-600" />, title: "Overbilling detection", desc: "CPT codes cross-checked against Medicare allowed rates.", color: "border-amber-100 bg-amber-50/30" },
              { icon: <FileText className="h-4 w-4 text-blue-600" />, title: "Dispute letter", desc: "Formal letter citing Illinois law, ready to send by certified mail.", color: "border-blue-100 bg-blue-50/30" },
              { icon: <Clock className="h-4 w-4 text-purple-600" />, title: "Seconds, not hours", desc: "Full analysis streams in real-time. No waiting. No refreshing.", color: "border-purple-100 bg-purple-50/30" },
            ].map((item) => (
              <div key={item.title} className={`rounded-xl border p-4 ${item.color}`}>
                <div className="flex items-center gap-2 mb-2">
                  {item.icon}
                  <span className="text-sm font-semibold text-gray-900">{item.title}</span>
                </div>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────── */}
      <section className="max-w-3xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-10">Common questions</h2>
        <div className="space-y-4">
          {[
            {
              q: "Is my loved one's information private?",
              a: "Yes. ClearCare processes your documents in real time using the Gemini API and never stores patient data on our servers. No account is required. Your information stays with you.",
            },
            {
              q: "Can I use this for any hospital or insurance company?",
              a: "Yes. ClearCare works with any hospital discharge summary or itemized bill regardless of which hospital or insurer issued it. For bill analysis, it cross-checks charges against Medicare allowed rates — a standard benchmark for detecting overbilling nationwide.",
            },
            {
              q: "What if I don't have a digital copy of the document?",
              a: "Take a photo with your phone. ClearCare uses Gemini's vision capabilities to read text from photos of discharge papers, bills, or prescription printouts.",
            },
            {
              q: "Is the analysis medically accurate? Can I trust it?",
              a: "ClearCare is built on Gemini 2.5 Flash Lite with a curated medical knowledge base for medication warnings, CPT codes, and condition-specific protocols. It is designed to be a knowledgeable second set of eyes — not a replacement for your care team. Always confirm important decisions with a licensed provider.",
            },
            {
              q: "What does the dispute letter actually do?",
              a: "The generated letter formally disputes overbilled or unexplained charges citing the specific line items identified in your bill. You print it, send it via certified mail to the hospital billing department, and the hospital is legally required to respond. Many patients see significant reductions or corrections after sending a formal dispute letter.",
            },
          ].map((item, i) => (
            <details key={i} className="group bg-white border border-gray-100 rounded-xl overflow-hidden">
              <summary className="flex items-center justify-between px-6 py-4 cursor-pointer list-none text-gray-900 font-medium hover:bg-gray-50 transition-colors">
                {item.q}
                <ChevronRight className="h-4 w-4 text-gray-400 group-open:rotate-90 transition-transform shrink-0 ml-4" />
              </summary>
              <div className="px-6 pb-4 text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3">
                {item.a}
              </div>
            </details>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ──────────────────────────────────────────── */}
      <section className="bg-teal-700 py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Start with the live demo</h2>
          <p className="text-teal-100 text-lg mb-8 max-w-xl mx-auto">
            Watch ClearCare analyze a real hospital discharge and itemized bill —
            no sign-up, no typing, results in seconds.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 bg-white text-teal-700 font-bold px-8 py-3.5 rounded-xl hover:bg-teal-50 transition-colors text-base"
            >
              <Zap className="h-4 w-4" />
              Launch Live Demo
            </Link>
            <Link
              href="/care"
              className="inline-flex items-center gap-2 bg-teal-600 border border-teal-500 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-teal-500 transition-colors text-base"
            >
              Analyze my document
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
