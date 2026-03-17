export function GET() {
  return new Response(
    `User-agent: *
Allow: /
Disallow: /api/

Sitemap: https://clearcare.vercel.app/sitemap.xml
`,
    {
      headers: { "Content-Type": "text/plain" },
    }
  )
}
