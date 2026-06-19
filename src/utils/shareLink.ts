import type { TodoList, Share, ShareMode } from '../types/todo'

export function generateShareId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function generateSecureKey(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

// Encode les données de la liste dans l'URL (gère les accents)
export function encodeListData(list: TodoList): string {
  const payload = { id: list.id, name: list.name, createdAt: list.createdAt, tasks: list.tasks }
  return btoa(encodeURIComponent(JSON.stringify(payload)))
}

// Décode les données depuis l'URL
export function decodeListData(encoded: string): Pick<TodoList, 'id' | 'name' | 'createdAt' | 'tasks'> | null {
  try {
    return JSON.parse(decodeURIComponent(atob(encoded)))
  } catch {
    return null
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

// Raccourcit une URL via is.gd (gratuit, sans clé API)
export async function shortenUrl(longUrl: string): Promise<string> {
  try {
    const res = await fetch(
      `https://is.gd/create.php?format=simple&url=${encodeURIComponent(longUrl)}`,
      { signal: AbortSignal.timeout(5000) }
    )
    if (!res.ok) return longUrl
    const short = await res.text()
    return short.startsWith('https://is.gd/') ? short.trim() : longUrl
  } catch {
    return longUrl
  }
}

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
