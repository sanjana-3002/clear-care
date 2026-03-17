"use client"

import { useState } from "react"
import { PatientProfile } from "@/types/patient"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, AlertTriangle, Shield, FileText } from "lucide-react"

export interface LineItem {
  lineNumber: number
  originalDescription: string
  plainEnglish: string
  cptCode: string
  billedAmount: number
  verdict: "covered" | "partially_covered" | "overbilled" | "not_covered" | "needs_itemization"
  patientOwes: number
  reason: string
  action: string
  disputeScript?: string
}

export interface BillSummary {
  totalBilled: number
  totalActuallyOwed: number
  potentialSavings: number
  itemsToDispute: number
  highPriorityDisputes: string[]
}

export interface BillAnalysisResult {
  lineItems: LineItem[]
  summary: BillSummary
  illinoisRights: string[]
  nextSteps: string[]
}

export interface DisputeItem {
  description: string
  amount: number
  reason: string
}

interface BillOutputProps {
  data: BillAnalysisResult
  patientProfile: PatientProfile
  onGenerateLetter: (items: DisputeItem[]) => void
}

const VERDICT_CONFIG: Record<LineItem["verdict"], { label: string; color: string; rowColor: string }> = {
  covered: { label: "Covered", color: "bg-green-100 text-green-700 border-green-200", rowColor: "bg-white" },
  partially_covered: {
    label: "Partial",
    color: "bg-blue-100 text-blue-700 border-blue-200",
    rowColor: "bg-blue-50/30",
  },
  overbilled: { label: "Overbilled", color: "bg-red-100 text-red-700 border-red-200", rowColor: "bg-red-50/30" },
  not_covered: {
    label: "Not Covered",
    color: "bg-gray-100 text-gray-600 border-gray-200",
    rowColor: "bg-gray-50/50",
  },
  needs_itemization: {
    label: "Need Details",
    color: "bg-amber-100 text-amber-700 border-amber-200",
    rowColor: "bg-amber-50/30",
  },
}

function fmt(amount: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount)
}

export default function BillOutput({ data, patientProfile, onGenerateLetter }: BillOutputProps) {
  void patientProfile // available for future use (e.g. personalised dispute language)
  const [expandedRows, setExpandedRows] = useState<Record<number, boolean>>({})

  const toggleRow = (idx: number) => {
    setExpandedRows((prev) => ({ ...prev, [idx]: !prev[idx] }))
  }

  const disputeItems: DisputeItem[] = data.lineItems
    .filter((item) => item.verdict === "overbilled" || item.verdict === "needs_itemization")
    .map((item) => ({
      description: item.originalDescription,
      amount: item.billedAmount,
      reason: item.reason,
    }))

  return (
    <div className="space-y-6">
      {/* Sticky Summary Bar */}
      <div className="sticky top-0 z-10 bg-white border border-gray-100 rounded-xl shadow-sm p-4">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Total Billed</div>
            <div className="text-xl font-bold text-gray-900">{fmt(data.summary.totalBilled)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">You Actually Owe</div>
            <div className="text-xl font-bold text-green-700">{fmt(data.summary.totalActuallyOwed)}</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 font-medium mb-1">Potential Savings</div>
            <div className="text-xl font-bold text-teal-700">{fmt(data.summary.potentialSavings)}</div>
          </div>
        </div>
        {data.summary.itemsToDispute > 0 && (
          <div className="mt-3 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-1.5">
              <AlertTriangle className="h-4 w-4" />
              <span>{data.summary.itemsToDispute} item{data.summary.itemsToDispute !== 1 ? "s" : ""} to dispute</span>
            </div>
            {disputeItems.length > 0 && (
              <Button
                onClick={() => onGenerateLetter(disputeItems)}
                size="sm"
                className="bg-teal-700 hover:bg-teal-800 text-white text-xs"
              >
                <FileText className="h-3.5 w-3.5 mr-1.5" />
                Generate Dispute Letter
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Line Items Table */}
      <div>
        <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Line-by-Line Analysis</h3>
        <div className="border border-gray-100 rounded-xl overflow-hidden">
          {data.lineItems.map((item, idx) => {
            const conf = VERDICT_CONFIG[item.verdict] || VERDICT_CONFIG.covered
            const isExpanded = expandedRows[idx]
            const canExpand = item.disputeScript || item.reason

            return (
              <div key={idx} className={`${conf.rowColor} ${idx !== 0 ? "border-t border-gray-100" : ""}`}>
                <div
                  className={`flex items-start gap-3 p-4 ${canExpand ? "cursor-pointer hover:bg-gray-50/50" : ""}`}
                  onClick={() => canExpand && toggleRow(idx)}
                >
                  <div className="text-xs text-gray-400 font-mono pt-0.5 w-6 shrink-0">{item.lineNumber}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">{item.plainEnglish}</span>
                      {item.cptCode && (
                        <span className="text-xs text-gray-400 font-mono shrink-0">({item.cptCode})</span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">{item.originalDescription}</div>
                    {isExpanded && (
                      <div className="mt-3 space-y-2 animate-in fade-in duration-200">
                        <p className="text-sm text-gray-700">{item.reason}</p>
                        <p className="text-sm font-medium text-teal-700">Action: {item.action}</p>
                        {item.disputeScript && (
                          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                            <p className="text-xs font-semibold text-amber-700 mb-1">Script for phone call:</p>
                            <p className="text-sm text-amber-800 italic">&ldquo;{item.disputeScript}&rdquo;</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-2 shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-gray-900">{fmt(item.billedAmount)}</div>
                      {item.patientOwes !== item.billedAmount && (
                        <div className="text-xs text-green-600">You owe: {fmt(item.patientOwes)}</div>
                      )}
                    </div>
                    <Badge className={`text-xs shrink-0 ${conf.color}`}>{conf.label}</Badge>
                    {canExpand && (
                      <div className="text-gray-400 mt-0.5">
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* High Priority Disputes */}
      {data.summary.highPriorityDisputes && data.summary.highPriorityDisputes.length > 0 && (
        <Card className="p-4 border-red-100 bg-red-50/50">
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-600" />
            <h3 className="text-sm font-bold text-red-700">High Priority Disputes</h3>
          </div>
          <ul className="space-y-2">
            {data.summary.highPriorityDisputes.map((dispute, i) => (
              <li key={i} className="text-sm text-red-800 flex items-start gap-2">
                <span className="text-red-400 mt-0.5 shrink-0">•</span>
                {dispute}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Illinois Rights */}
      {data.illinoisRights && data.illinoisRights.length > 0 && (
        <Card className="p-4 border-teal-100 bg-teal-50/50">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-teal-600" />
            <h3 className="text-sm font-bold text-teal-700">Your Illinois Patient Rights</h3>
          </div>
          <ul className="space-y-2">
            {data.illinoisRights.map((right, i) => (
              <li key={i} className="text-sm text-teal-800 flex items-start gap-2">
                <span className="text-teal-400 mt-0.5 shrink-0">•</span>
                {right}
              </li>
            ))}
          </ul>
        </Card>
      )}

      {/* Next Steps */}
      {data.nextSteps && data.nextSteps.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide mb-3">Next Steps</h3>
          <Card className="p-4 border-gray-100">
            <ol className="space-y-3">
              {data.nextSteps.map((step, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-teal-700 font-bold text-sm shrink-0">{i + 1}.</span>
                  <span className="text-sm text-gray-700">{step}</span>
                </li>
              ))}
            </ol>
          </Card>
        </div>
      )}

      {/* Generate Letter Button (bottom) */}
      {disputeItems.length > 0 && (
        <Button
          onClick={() => onGenerateLetter(disputeItems)}
          className="w-full bg-teal-700 hover:bg-teal-800 text-white font-semibold py-3"
        >
          <FileText className="h-4 w-4 mr-2" />
          Generate Dispute Letter for {disputeItems.length} Item{disputeItems.length !== 1 ? "s" : ""}
        </Button>
      )}
    </div>
  )
}
