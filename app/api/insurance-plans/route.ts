import { NextRequest, NextResponse } from "next/server"
import { getPlanData } from "@/lib/insuranceApi"

/**
 * GET /api/insurance-plans?insurer=bcbs&planType=gold
 *
 * Returns live cost-sharing data for the given insurer + plan type.
 * Pulls from CMS Marketplace API if CMS_MARKETPLACE_API_KEY is set,
 * otherwise returns hardcoded reference data instantly.
 * Always responds — never 500s to the client.
 */
export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const insurer = searchParams.get("insurer") ?? ""
  const planType = searchParams.get("planType") ?? ""

  if (!insurer || !planType) {
    return NextResponse.json({ error: "insurer and planType are required" }, { status: 400 })
  }

  const data = await getPlanData(insurer, planType)

  return NextResponse.json(data, {
    headers: {
      // Cache at the CDN edge for 6 hours — plans don't change intra-day
      "Cache-Control": "public, s-maxage=21600, stale-while-revalidate=3600",
    },
  })
}
