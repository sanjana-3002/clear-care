"use client"

import { useState } from "react"
import { PatientProfile } from "@/types/patient"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Copy, Check, Download, Printer } from "lucide-react"

interface DisputeLetterProps {
  letter: string
  patientProfile: PatientProfile
}

export default function DisputeLetter({ letter, patientProfile }: DisputeLetterProps) {
  const [providerName, setProviderName] = useState("")
  const [providerAddress, setProviderAddress] = useState("")
  const [copied, setCopied] = useState(false)

  // Replace placeholders in letter with actual values if provided
  const processedLetter = letter
    .replace(/\[PROVIDER NAME\]/g, providerName || "[PROVIDER NAME]")
    .replace(/\[PROVIDER ADDRESS\]/g, providerAddress || "[PROVIDER ADDRESS]")

  const handleCopy = () => {
    navigator.clipboard.writeText(processedLetter)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const blob = new Blob([processedLetter], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `ClearCare_Dispute_Letter_${patientProfile.name.replace(/\s+/g, "_")}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (!printWindow) return
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Dispute Letter — ${patientProfile.name}</title>
          <style>
            body { font-family: Georgia, serif; font-size: 12pt; line-height: 1.6; max-width: 700px; margin: 40px auto; padding: 0 20px; }
            pre { white-space: pre-wrap; font-family: Georgia, serif; font-size: 12pt; }
          </style>
        </head>
        <body><pre>${processedLetter.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre></body>
      </html>
    `)
    printWindow.document.close()
    printWindow.focus()
    printWindow.print()
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 mb-1">Your Dispute Letter</h2>
        <p className="text-sm text-gray-500">
          Fill in the provider details, then copy or download the letter.
        </p>
      </div>

      {/* Provider details */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="providerName" className="text-xs font-semibold text-gray-600">
            Provider / Hospital Name
          </Label>
          <Input
            id="providerName"
            placeholder="e.g. Northwestern Memorial Hospital"
            value={providerName}
            onChange={(e) => setProviderName(e.target.value)}
            className="text-sm border-gray-200 focus:border-teal-400"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="providerAddress" className="text-xs font-semibold text-gray-600">
            Provider Address
          </Label>
          <Input
            id="providerAddress"
            placeholder="e.g. 251 E Huron St, Chicago, IL 60611"
            value={providerAddress}
            onChange={(e) => setProviderAddress(e.target.value)}
            className="text-sm border-gray-200 focus:border-teal-400"
          />
        </div>
      </div>

      {/* Letter preview */}
      <Card className="border-gray-100">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <span className="text-sm font-semibold text-gray-700">Letter Preview</span>
          <div className="flex gap-2">
            <Button
              onClick={handleCopy}
              variant="outline"
              size="sm"
              className="text-xs border-gray-200 hover:border-teal-400 hover:text-teal-700"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 mr-1.5 text-green-600" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5 mr-1.5" />
                  Copy Entire Letter
                </>
              )}
            </Button>
            <Button
              onClick={handleDownload}
              variant="outline"
              size="sm"
              className="text-xs border-gray-200 hover:border-teal-400 hover:text-teal-700"
            >
              <Download className="h-3.5 w-3.5 mr-1.5" />
              Download .txt
            </Button>
            <Button
              onClick={handlePrint}
              variant="outline"
              size="sm"
              className="text-xs border-gray-200 hover:border-teal-400 hover:text-teal-700"
            >
              <Printer className="h-3.5 w-3.5 mr-1.5" />
              Print
            </Button>
          </div>
        </div>
        <div className="p-5">
          <pre className="whitespace-pre-wrap font-sans text-sm text-gray-800 leading-relaxed">{processedLetter}</pre>
        </div>
      </Card>

      {/* Instructions */}
      <div className="bg-teal-50 border border-teal-100 rounded-xl p-4">
        <h4 className="text-sm font-bold text-teal-800 mb-2">How to Send This Letter</h4>
        <ol className="space-y-1.5">
          <li className="text-sm text-teal-700 flex items-start gap-2">
            <span className="font-bold shrink-0">1.</span>
            Fill in the bracketed placeholders ([PATIENT ADDRESS], [PHONE], [EMAIL], [ACCOUNT NUMBER])
          </li>
          <li className="text-sm text-teal-700 flex items-start gap-2">
            <span className="font-bold shrink-0">2.</span>
            Send via certified mail with return receipt — this creates a paper trail
          </li>
          <li className="text-sm text-teal-700 flex items-start gap-2">
            <span className="font-bold shrink-0">3.</span>
            Keep a copy for yourself and note the date sent
          </li>
          <li className="text-sm text-teal-700 flex items-start gap-2">
            <span className="font-bold shrink-0">4.</span>
            If no response in 30 days: escalate to Illinois Department of Insurance at (866) 445-5364
          </li>
        </ol>
      </div>
    </div>
  )
}
