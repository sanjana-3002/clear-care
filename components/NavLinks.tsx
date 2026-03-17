"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function NavLinks() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/care"
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
          isActive("/care")
            ? "text-teal-700 bg-teal-50"
            : "text-gray-600 hover:text-teal-700 hover:bg-teal-50"
        }`}
      >
        Care Companion
      </Link>
      <Link
        href="/bill"
        className={`text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
          isActive("/bill")
            ? "text-amber-700 bg-amber-50"
            : "text-gray-600 hover:text-teal-700 hover:bg-teal-50"
        }`}
      >
        Bill Guardian
      </Link>
      <Link
        href="/demo"
        className={`ml-2 text-sm font-semibold px-4 py-1.5 rounded-lg transition-colors ${
          isActive("/demo")
            ? "bg-teal-800 text-white"
            : "bg-teal-700 hover:bg-teal-800 text-white"
        }`}
      >
        Try Demo
      </Link>
    </div>
  )
}
