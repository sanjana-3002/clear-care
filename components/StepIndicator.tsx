"use client"

import { ChevronRight } from "lucide-react"

interface Step {
  id: string
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: string
  onStepClick?: (stepId: string) => void
  /** Steps that have been completed and are clickable */
  completedSteps?: string[]
}

/**
 * Horizontal step indicator used in Care Companion and Bill Guardian flows.
 * Completed steps show a checkmark and are optionally clickable.
 */
export default function StepIndicator({
  steps,
  currentStep,
  onStepClick,
  completedSteps = [],
}: StepIndicatorProps) {
  const currentIndex = steps.findIndex((s) => s.id === currentStep)

  return (
    <div className="flex items-center gap-2 flex-wrap" role="navigation" aria-label="Progress steps">
      {steps.map((step, i) => {
        const isActive = step.id === currentStep
        const isCompleted = completedSteps.includes(step.id) || i < currentIndex
        const isClickable = isCompleted && onStepClick

        return (
          <div key={step.id} className="flex items-center gap-2">
            <button
              onClick={() => isClickable && onStepClick(step.id)}
              disabled={!isClickable}
              aria-current={isActive ? "step" : undefined}
              className={`flex items-center gap-1.5 text-xs font-medium transition-colors rounded-lg px-1 py-0.5 ${
                isActive
                  ? "text-teal-700"
                  : isCompleted
                  ? "text-gray-400 hover:text-teal-600 cursor-pointer"
                  : "text-gray-300 cursor-default"
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${
                  isCompleted
                    ? "bg-teal-700 text-white"
                    : isActive
                    ? "border-2 border-teal-700 text-teal-700"
                    : "border-2 border-gray-200 text-gray-300"
                }`}
              >
                {isCompleted ? "✓" : i + 1}
              </div>
              <span className="hidden sm:inline">{step.label}</span>
            </button>
            {i < steps.length - 1 && (
              <ChevronRight className="h-3 w-3 text-gray-200 shrink-0" aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
