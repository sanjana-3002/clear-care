"use client"

interface AnalysisLoadingStateProps {
  title: string
  subtitle: string
  dotColor?: string
  streamingPreview?: string
}

/**
 * Reusable centered loading state shown while Gemini streams a response.
 * Used in care page, bill page, and demo page tabs.
 */
export default function AnalysisLoadingState({
  title,
  subtitle,
  dotColor = "bg-teal-600",
  streamingPreview,
}: AnalysisLoadingStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="flex gap-2 mb-5">
        {[0, 150, 300].map((d) => (
          <span
            key={d}
            className={`w-3 h-3 ${dotColor} rounded-full animate-bounce`}
            style={{ animationDelay: `${d}ms` }}
          />
        ))}
      </div>
      <p className="text-base font-semibold text-gray-800 mb-1">{title}</p>
      <p className="text-sm text-gray-400 mb-5">{subtitle}</p>
      {streamingPreview && (
        <div className="w-full max-w-lg bg-gray-50 rounded-xl p-4 max-h-24 overflow-hidden relative text-left">
          <p className="text-xs font-mono text-gray-400 leading-relaxed">
            {streamingPreview.slice(-300)}
          </p>
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-50 to-transparent rounded-b-xl" />
        </div>
      )}
    </div>
  )
}
