import { NextRequest, NextResponse } from "next/server"

/**
 * ClearCare edge middleware
 *
 * Runs on every request before any route handler. Adds:
 * - Unique request ID for log correlation
 * - Canonical security headers on all API responses
 * - Basic API key presence guard (fails fast before hitting Gemini)
 */

// Routes that require the API to be configured
const API_ROUTES = /^\/api\//

export function middleware(request: NextRequest) {
  const requestId = crypto.randomUUID()
  const response = NextResponse.next()

  // Propagate request ID through for log correlation
  response.headers.set("X-Request-ID", requestId)

  // Guard: if calling the API and GEMINI_API_KEY is not set, return a clear 503
  // rather than a cryptic Gemini error. This protects against misconfigured deploys.
  if (API_ROUTES.test(request.nextUrl.pathname)) {
    if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY && !process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      return new NextResponse(
        JSON.stringify({
          error: "Service not configured. Please set GEMINI_API_KEY in your environment.",
          requestId,
        }),
        {
          status: 503,
          headers: {
            "Content-Type": "application/json",
            "X-Request-ID": requestId,
          },
        }
      )
    }

    // Security headers on all API responses
    response.headers.set("X-Content-Type-Options", "nosniff")
    response.headers.set("X-Frame-Options", "DENY")
    response.headers.set("Cache-Control", "no-store")
  }

  return response
}

export const config = {
  matcher: [
    // Match all API routes
    "/api/:path*",
    // Exclude static assets and Next.js internals
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
