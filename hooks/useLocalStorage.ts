"use client"

import { useState, useEffect } from "react"

/**
 * A typed localStorage hook that handles SSR safely.
 * Returns [value, setValue] — same API as useState.
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  // Hydrate from localStorage on mount (client-only)
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key)
      if (item !== null) {
        setStoredValue(JSON.parse(item) as T)
      }
    } catch {
      // ignore — use initial value
    }
  }, [key])

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch {
      // ignore write failures (private browsing quota, etc.)
    }
  }

  return [storedValue, setValue]
}
