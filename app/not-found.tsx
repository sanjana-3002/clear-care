import Link from "next/link"
import { ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-16 h-16 rounded-2xl bg-teal-100 flex items-center justify-center mx-auto mb-6">
          <span className="text-teal-700 text-2xl font-bold">CC</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Page not found</h1>
        <p className="text-gray-500 mb-8 leading-relaxed">
          This page doesn&apos;t exist. Head back to start a care or bill analysis.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/demo"
            className="inline-flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            See Live Demo
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:border-teal-400 hover:text-teal-700 font-semibold px-5 py-2.5 rounded-xl transition-colors"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  )
}
