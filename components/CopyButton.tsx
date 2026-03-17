"use client"

import { useState } from "react"
import { Copy, Check } from "lucide-react"
import { COPY_FEEDBACK_DURATION_MS } from "@/lib/constants"

interface CopyButtonProps {
  text: string
  label?: string
  className?: string
  size?: "sm" | "md"
}

/**
 * One-click copy-to-clipboard button with 2-second "Copied!" feedback.
 * Used across CareOutput questions, DisputeLetter preview, and analysis summaries.
 */
export default function CopyButton({ text, label, className = "", size = "sm" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
    } catch {
      // Fallback for browsers without clipboard API
      const el = document.createElement("textarea")
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand("copy")
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), COPY_FEEDBACK_DURATION_MS)
    }
  }

  const iconSize = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4"

  if (label) {
    return (
      <button
        onClick={handleCopy}
        aria-label={copied ? "Copied!" : `Copy ${label}`}
        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${
          copied ? "text-green-600" : "text-gray-500 hover:text-teal-700"
        } ${className}`}
      >
        {copied ? (
          <><Check className={iconSize} /> Copied!</>
        ) : (
          <><Copy className={iconSize} /> {label}</>
        )}
      </button>
    )
  }

  return (
    <button
      onClick={handleCopy}
      aria-label={copied ? "Copied!" : "Copy to clipboard"}
      title={copied ? "Copied!" : "Copy to clipboard"}
      className={`p-1 rounded hover:bg-gray-100 transition-colors ${className}`}
    >
      {copied ? (
        <Check className={`${iconSize} text-green-600`} />
      ) : (
        <Copy className={`${iconSize} text-gray-400`} />
      )}
    </button>
  )
}
