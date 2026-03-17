import type { Metadata } from "next"
import "./globals.css"
import Link from "next/link"
import { Toaster } from "@/components/ui/toaster"
import NavLinks from "@/components/NavLinks"

export const metadata: Metadata = {
  title: "ClearCare — Medical Clarity for Family Caregivers",
  description:
    "ClearCare decodes hospital discharge papers and audits medical bills using Gemini AI. Plain English guidance for the 63 million Americans caring for a loved one.",
  keywords: "medical billing, discharge summary, insurance, caregiver, healthcare, AI, Gemini, bill dispute, CPT codes",
  openGraph: {
    title: "ClearCare — Medical Clarity for Family Caregivers",
    description:
      "Decode discharge papers. Fight overbilling. Generate dispute letters. Powered by Google DeepMind Gemini 2.5 Flash Lite.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "ClearCare — Medical Clarity for Family Caregivers",
    description: "63 million caregivers. One AI expert. Free, private, no account needed.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-[#FAFAF8] text-gray-900 antialiased">
        {/* Navigation */}
        <nav className="border-b border-gray-100 bg-white/90 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-7 h-7 rounded-lg bg-teal-700 flex items-center justify-center">
                <span className="text-white text-xs font-bold">CC</span>
              </div>
              <span className="font-bold text-gray-900">ClearCare</span>
            </Link>

            <NavLinks />
          </div>
        </nav>

        {/* Main content */}
        <main className="min-h-screen">{children}</main>

        {/* Footer */}
        <footer className="border-t border-gray-100 bg-white mt-16">
          <div className="max-w-6xl mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-teal-700 flex items-center justify-center">
                  <span className="text-white text-xs font-bold">CC</span>
                </div>
                <span className="text-sm font-semibold text-gray-700">ClearCare</span>
                <span className="text-xs text-gray-400">— Google DeepMind Hackathon 2026</span>
              </div>
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <Link href="/care" className="hover:text-teal-700 transition-colors">Care Companion</Link>
                <span>·</span>
                <Link href="/bill" className="hover:text-teal-700 transition-colors">Bill Guardian</Link>
                <span>·</span>
                <Link href="/demo" className="hover:text-teal-700 transition-colors">Live Demo</Link>
                <span>·</span>
                <span className="flex items-center gap-1">
                  Powered by
                  <span className="font-semibold text-gray-600 ml-1">Google DeepMind Gemini</span>
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-50 text-center">
              <p className="text-xs text-gray-400">
                ClearCare provides informational analysis only — not medical or legal advice.
                Always consult a qualified healthcare provider for medical decisions.
              </p>
            </div>
          </div>
        </footer>

        <Toaster />
      </body>
    </html>
  )
}
