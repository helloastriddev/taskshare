import type { Share, ShareMode } from '../types/todo'

export function generateShareId(): string {
  return crypto.randomUUID().replace(/-/g, '').slice(0, 12)
}

export function generateSecureKey(): string {
  return crypto.randomUUID().replace(/-/g, '')
}

export function buildShareUrl(listId: string, share: Share): string {
  const base = window.location.origin + window.location.pathname
  const params = new URLSearchParams({ list: listId, share: share.id, mode: share.mode })
  if (share.mode === 'edit') params.set('key', share.key)
  return `${base}?${params.toString()}`
}

export function parseShareUrl(): { listId: string; shareId: string; mode: ShareMode; key: string } | null {
  const params = new URLSearchParams(window.location.search)
  const listId = params.get('list')
  const shareId = params.get('share')
  const mode = params.get('mode') as ShareMode | null
  const key = params.get('key') ?? ''

  if (!listId || !shareId || !mode) return null
  return { listId, shareId, mode, key }
}

export function buildWhatsAppUrl(text: string): string {
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

export function buildMailtoUrl(subject: string, body: string): string {
  return `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}
