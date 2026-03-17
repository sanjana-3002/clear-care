/**
 * Small badge shown throughout the app to credit Gemini 2.5 Flash Lite.
 * Used in page headers and streaming status bars.
 */
export default function GeminiBadge({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 bg-gray-50 border border-gray-200 text-gray-600 text-xs font-mono px-2.5 py-1 rounded-full ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
      gemini-2.5-flash-lite
    </span>
  )
}
