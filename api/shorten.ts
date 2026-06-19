export default async function handler(req: any, res: any) {
  const url = req.query?.url as string
  if (!url) return res.status(400).json({ error: 'Missing url' })

  try {
    const response = await fetch(
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(url)}`
    )
    const text = await response.text()
    if (text.startsWith('https://is.gd/') || text.startsWith('https://v.gd/')) {
      return res.json({ short: text.trim() })
    }
  } catch {}

  // Fallback shrtco.de
  try {
    const response = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(url)}`
    )
    const json = await response.json()
    if (json.ok && json.result?.full_short_link) {
      return res.json({ short: json.result.full_short_link })
    }
  } catch {}

  return res.json({ short: url })
}
