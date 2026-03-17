"use client"

import { useState, useRef, useCallback } from "react"

export type AnalysisState = "idle" | "streaming" | "complete" | "error"

interface UseStreamingAnalysisOptions<T> {
  endpoint: string
  onComplete?: (result: T) => void
}

interface UseStreamingAnalysisReturn<T> {
  state: AnalysisState
  result: T | null
  streamingText: string
  error: string | null
  elapsed: number
  run: (body: Record<string, unknown>) => Promise<void>
  reset: () => void
  abort: () => void
}

/**
 * Generic hook for streaming JSON analysis endpoints.
 * Handles the fetch → ReadableStream → JSON parse lifecycle
 * with elapsed timing, abort, and error state.
 */
export function useStreamingAnalysis<T>({
  endpoint,
  onComplete,
}: UseStreamingAnalysisOptions<T>): UseStreamingAnalysisReturn<T> {
  const [state, setState] = useState<AnalysisState>("idle")
  const [result, setResult] = useState<T | null>(null)
  const [streamingText, setStreamingText] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const abortRef = useRef<AbortController | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
  }

  const reset = useCallback(() => {
    abortRef.current?.abort()
    clearTimer()
    setState("idle")
    setResult(null)
    setStreamingText("")
    setError(null)
    setElapsed(0)
  }, [])

  const abort = useCallback(() => {
    abortRef.current?.abort()
    clearTimer()
    setState("idle")
  }, [])

  const run = useCallback(
    async (body: Record<string, unknown>) => {
      abortRef.current?.abort()
      clearTimer()

      setState("streaming")
      setResult(null)
      setError(null)
      setStreamingText("")
      setElapsed(0)

      abortRef.current = new AbortController()

      const t0 = performance.now()
      timerRef.current = setInterval(
        () => setElapsed(Math.round((performance.now() - t0) / 100) / 10),
        100
      )

      try {
        const res = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
          signal: abortRef.current.signal,
        })

        if (!res.ok || !res.body) {
          const errData = await res.json().catch(() => ({}))
          throw new Error((errData as { error?: string }).error || `HTTP ${res.status}`)
        }

        const reader = res.body.getReader()
        const decoder = new TextDecoder()
        let full = ""

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          full += decoder.decode(value, { stream: true })
          setStreamingText(full)
        }

        const parsed = JSON.parse(full) as T
        setResult(parsed)
        setState("complete")
        onComplete?.(parsed)
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          setError(err instanceof Error ? err.message : "Analysis failed. Please try again.")
          setState("error")
        }
      } finally {
        clearTimer()
      }
    },
    [endpoint, onComplete]
  )

  return { state, result, streamingText, error, elapsed, run, reset, abort }
}
