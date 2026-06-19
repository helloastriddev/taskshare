import type { TodoList, Share, ShareMode } from '../types/todo'

export function generateShareId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function generateSecureKey(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

// Encode en base64 URL-safe sans double-encodage (beaucoup plus court pour le français)
export function encodeListData(list: TodoList): string {
  const payload = { id: list.id, name: list.name, createdAt: list.createdAt, tasks: list.tasks }
  const json = JSON.stringify(payload)
  const bytes = new TextEncoder().encode(json)
  const binary = Array.from(bytes, b => String.fromCharCode(b)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

// Décode les données depuis l'URL
export function decodeListData(encoded: string): Pick<TodoList, 'id' | 'name' | 'createdAt' | 'tasks'> | null {
  try {
    // Nouveau format : base64 URL-safe → UTF-8
    const b64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const pad = b64.length % 4
    const padded = pad ? b64 + '='.repeat(4 - pad) : b64
    const binary = atob(padded)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
    return JSON.parse(new TextDecoder().decode(bytes))
  } catch {
    try {
      // Ancien format (rétrocompatibilité)
      return JSON.parse(decodeURIComponent(atob(encoded)))
    } catch {
      return null
    }
  }
}

// Construit l'URL de partage avec les données encodées
export function buildShareUrl(list: TodoList, share: Share): string {
  const base = window.location.origin + window.location.pathname
  const data = encodeListData(list)
  const params = new URLSearchParams({ share: share.id, mode: share.mode, data })
  return `${base}?${params.toString()}`
}

// Parse les paramètres de partage depuis l'URL courante
export function parseShareUrl(): {
  shareId: string
  mode: ShareMode
  listData: Pick<TodoList, 'id' | 'name' | 'createdAt' | 'tasks'>
} | null {
  const params = new URLSearchParams(window.location.search)
  const shareId = params.get('share')
  const mode = params.get('mode') as ShareMode | null
  const encoded = params.get('data')

  if (!shareId || !mode || !encoded) return null
  const listData = decodeListData(encoded)
  if (!listData) return null

  return { shareId, mode, listData }
}

// Raccourcit via shrtco.de (CORS natif, gratuit, sans clé)
export async function shortenUrl(longUrl: string): Promise<string> {
  // Ne pas raccourcir en local
  if (longUrl.includes('localhost')) return longUrl

  try {
    const res = await fetch(
      `https://api.shrtco.de/v2/shorten?url=${encodeURIComponent(longUrl)}`,
      { signal: AbortSignal.timeout(6000) }
    )
    if (!res.ok) throw new Error('shrtco error')
    const json = await res.json()
    if (json.ok && json.result?.full_short_link) return json.result.full_short_link
  } catch {}

  // Fallback : is.gd
  try {
    const res = await fetch(
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (res.ok) {
      const short = await res.text()
      if (short.startsWith('https://is.gd/') || short.startsWith('https://v.gd/')) return short.trim()
    }
  } catch {}

  return longUrl
}

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
