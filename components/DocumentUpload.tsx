"use client"

import { useState, useRef, DragEvent, ChangeEvent } from "react"
import { Upload, FileText, Edit3, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface DocumentUploadProps {
  onExtracted: (text: string, type: string) => void
  label?: string
  demoText?: string
  demoLabel?: string
}

type UploadMode = "drop" | "text"

const PROGRESS_MESSAGES = [
  "Reading document with Gemini 2.5 Flash Lite...",
  "Extracting text and structure...",
  "Parsing line items and dates...",
  "Almost done...",
]

const ACCEPTED_TYPES = "image/jpeg,image/jpg,image/png,image/webp,image/heic,application/pdf"

export default function DocumentUpload({
  onExtracted,
  label = "Upload Document",
  demoText,
  demoLabel = "Use demo text",
}: DocumentUploadProps) {
  const [mode, setMode] = useState<UploadMode>("drop")
  const [dragging, setDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [progressMsg, setProgressMsg] = useState("")
  const [extractedText, setExtractedText] = useState("")
  const [editableText, setEditableText] = useState("")
  const [fileName, setFileName] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const startProgressMessages = () => {
    let idx = 0
    setProgressMsg(PROGRESS_MESSAGES[0])
    progressInterval.current = setInterval(() => {
      idx = (idx + 1) % PROGRESS_MESSAGES.length
      setProgressMsg(PROGRESS_MESSAGES[idx])
    }, 1800)
  }

  const stopProgressMessages = () => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current)
      progressInterval.current = null
    }
    setProgressMsg("")
  }

  const processFile = async (file: File) => {
    setUploading(true)
    setError(null)
    setFileName(file.name)
    startProgressMessages()

    try {
      const formData = new FormData()
      formData.append("file", file)

      const res = await fetch("/api/extract-document", {
        method: "POST",
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "Extraction failed")
      }

      setExtractedText(data.extractedText)
      setEditableText(data.extractedText)
      onExtracted(data.extractedText, data.documentType)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to extract. Please paste text manually.")
    } finally {
      setUploading(false)
      stopProgressMessages()
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(true)
  }
  const handleDragLeave = () => setDragging(false)

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) processFile(file)
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) processFile(file)
  }

  const detectType = (text: string): string => {
    const lower = text.toLowerCase()
    if (lower.includes("discharge") || lower.includes("diagnosis")) return "discharge"
    if (lower.includes("billed") || lower.includes("cpt") || lower.includes("amount due")) return "bill"
    return "unknown"
  }

  const handleTextChange = (text: string) => {
    setEditableText(text)
    if (text.trim()) onExtracted(text, detectType(text))
  }

  const loadDemoText = () => {
    if (!demoText) return
    setEditableText(demoText)
    setMode("text")
    onExtracted(demoText, detectType(demoText))
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className="flex items-center gap-2">
          {demoText && (
            <button
              onClick={loadDemoText}
              className="flex items-center gap-1.5 text-xs font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <FileText className="h-3.5 w-3.5" />
              {demoLabel}
            </button>
          )}
          <div className="flex bg-gray-100 rounded-lg p-1 gap-1">
            <button
              onClick={() => setMode("drop")}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                mode === "drop" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Upload className="h-3.5 w-3.5" />
              Upload file
            </button>
            <button
              onClick={() => setMode("text")}
              className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md transition-colors ${
                mode === "text" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              <Edit3 className="h-3.5 w-3.5" />
              Paste text
            </button>
          </div>
        </div>
      </div>

      {mode === "drop" && (
        <>
          {!extractedText && !uploading && (
            <div
              role="button"
              tabIndex={0}
              aria-label="Upload document by clicking or dropping a file"
              onClick={() => fileInputRef.current?.click()}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all h-48 focus:outline-none focus:ring-2 focus:ring-teal-500 ${
                dragging
                  ? "border-teal-500 bg-teal-50 scale-[1.01]"
                  : "border-gray-200 bg-gray-50 hover:border-teal-400 hover:bg-teal-50/50"
              }`}
            >
              <Upload className={`h-8 w-8 mb-3 transition-colors ${dragging ? "text-teal-600" : "text-gray-400"}`} />
              <p className="text-sm font-medium text-gray-700">Drop your document here</p>
              <p className="text-xs text-gray-400 mt-1">PDF, JPG, PNG, WebP — up to 20 MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept={ACCEPTED_TYPES}
                aria-label="File upload input"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          )}

          {uploading && (
            <div className="border-2 border-teal-200 bg-teal-50 rounded-xl flex flex-col items-center justify-center h-48 gap-3">
              <div className="flex gap-1.5">
                {[0, 150, 300].map((d) => (
                  <span
                    key={d}
                    className="w-2.5 h-2.5 bg-teal-600 rounded-full animate-bounce"
                    style={{ animationDelay: `${d}ms` }}
                  />
                ))}
              </div>
              <p className="text-sm font-medium text-teal-700">{progressMsg}</p>
              {fileName && <p className="text-xs text-teal-500">{fileName}</p>}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-red-700 mb-2">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => { setError(null); setMode("text") }}
                  className="text-xs border-red-200 text-red-700 hover:bg-red-50"
                >
                  Switch to paste mode
                </Button>
              </div>
            </div>
          )}

          {extractedText && !uploading && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-teal-700 font-medium">
                  <FileText className="h-4 w-4" />
                  <span>Extracted from {fileName}</span>
                </div>
                <button
                  onClick={() => { setExtractedText(""); setEditableText(""); setFileName(null) }}
                  className="text-xs text-gray-400 hover:text-red-600 transition-colors"
                >
                  Replace
                </button>
              </div>
              <textarea
                value={editableText}
                onChange={(e) => { setEditableText(e.target.value); onExtracted(e.target.value, detectType(e.target.value)) }}
                className="w-full h-40 text-xs font-mono border border-gray-200 rounded-xl p-3 resize-y focus:outline-none focus:border-teal-400 bg-gray-50"
                placeholder="Extracted text appears here — you can edit it..."
                aria-label="Extracted document text — editable"
              />
              <p className="text-xs text-gray-400">Review and edit if needed, then continue.</p>
            </div>
          )}
        </>
      )}

      {mode === "text" && (
        <div className="space-y-2">
          <textarea
            value={editableText}
            onChange={(e) => handleTextChange(e.target.value)}
            className="w-full h-48 text-sm border border-gray-200 rounded-xl p-4 resize-y focus:outline-none focus:border-teal-400"
            placeholder="Paste your discharge summary, medical bill, or insurance document text here..."
            aria-label="Paste document text"
          />
          {editableText.trim() && (
            <div className="flex items-center gap-1.5 text-xs text-teal-600 font-medium">
              <FileText className="h-3.5 w-3.5" />
              Text ready — continue to analysis
            </div>
          )}
        </div>
      )}
    </div>
  )
}
