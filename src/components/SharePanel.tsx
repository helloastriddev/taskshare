import { useState } from 'react'
import { Link, Copy, MessageCircle, Mail, RefreshCw, Trash2, ChevronDown } from 'lucide-react'
import { buildShareUrl, buildWhatsAppUrl, buildMailtoUrl } from '../utils/shareLink'
import type { TodoList, Share, ShareMode } from '../types/todo'

interface SharePanelProps {
  list: TodoList
  onCreateShare: (mode: ShareMode) => Share
  onRevokeShare: (shareId: string) => void
  onRegenerateKey: (shareId: string) => void
}

export function SharePanel({ list, onCreateShare, onRevokeShare, onRegenerateKey }: SharePanelProps) {
  const [selectedMode, setSelectedMode] = useState<ShareMode>('view')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [modeOpen, setModeOpen] = useState(false)

  const shares = list.shares

  const handleGenerate = () => {
    onCreateShare(selectedMode)
  }

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const modeLabel = selectedMode === 'view' ? '👁️ Lecture seule' : '🤝 Édition collaborative'

  return (
    <div className="border-t border-gray-100 dark:border-gray-700 pt-5 mt-4">
      <h3 className="flex items-center gap-2 font-semibold text-gray-800 dark:text-gray-100 mb-4">
        <Link size={16} className="text-primary-500" /> Partager cette liste
      </h3>

      {/* Mode selector + generate */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">Mode de partage</label>
          <div className="relative">
            <button
              onClick={() => setModeOpen(o => !o)}
              className="w-full flex items-center justify-between px-3 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm text-gray-700 dark:text-gray-200 hover:border-primary-300 transition-colors"
            >
              <span>{modeLabel}</span>
              <ChevronDown size={15} className={`text-gray-400 transition-transform ${modeOpen ? 'rotate-180' : ''}`} />
            </button>
            {modeOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10 overflow-hidden">
                {(['view', 'edit'] as ShareMode[]).map(m => (
                  <button
                    key={m}
                    onClick={() => { setSelectedMode(m); setModeOpen(false) }}
                    className={`w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors ${selectedMode === m ? 'bg-primary-50 dark:bg-primary-500/10' : ''}`}
                  >
                    <span className="text-base">{m === 'view' ? '👁️' : '🤝'}</span>
                    <div>
                      <div className="text-sm font-medium text-gray-800 dark:text-gray-100">
                        {m === 'view' ? 'Lecture seule' : 'Édition collaborative'}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {m === 'view' ? 'Le destinataire peut voir et dupliquer' : 'Le destinataire peut modifier la liste'}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-2.5 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
        >
          Générer un nouveau lien
        </button>
      </div>

      {/* Active shares */}
      {shares.length > 0 && (
        <div className="mt-4 space-y-3">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Liens actifs</p>
          {shares.map(share => {
            const url = buildShareUrl(list.id, share)
            const waUrl = buildWhatsAppUrl(`${list.name} — ${url}`)
            const mailUrl = buildMailtoUrl(`Liste partagée : ${list.name}`, `Voici la liste "${list.name}" :\n${url}`)
            return (
              <div key={share.id} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    {share.mode === 'view' ? '👁️ Lecture seule' : '🤝 Édition collaborative'}
                  </span>
                  <button
                    onClick={() => { if (confirm('Révoquer ce lien ?')) onRevokeShare(share.id) }}
                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={13} />
                  </button>
                </div>

                {/* URL */}
                <div className="flex items-center gap-2">
                  <input
                    readOnly
                    value={url}
                    className="flex-1 text-xs px-2 py-1.5 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded text-gray-500 dark:text-gray-400 truncate"
                  />
                  <button
                    onClick={() => copyToClipboard(url, share.id)}
                    className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded text-xs font-medium transition-all ${
                      copiedId === share.id ? 'bg-green-500 text-white' : 'bg-primary-500 text-white hover:bg-primary-600'
                    }`}
                  >
                    <Copy size={12} />
                    {copiedId === share.id ? 'Copié !' : 'Copier'}
                  </button>
                </div>

                {/* Share buttons */}
                <div className="flex gap-2">
                  <a href={waUrl} target="_blank" rel="noopener noreferrer"
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-green-500 hover:bg-green-600 text-white text-xs font-medium rounded-lg transition-colors">
                    <MessageCircle size={13} /> WhatsApp
                  </a>
                  <a href={mailUrl}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-medium rounded-lg transition-colors">
                    <Mail size={13} /> Email
                  </a>
                </div>

                {/* Edit mode: regenerate key */}
                {share.mode === 'edit' && (
                  <button
                    onClick={() => { if (confirm('Régénérer la clé ? L\'ancien lien sera invalidé.')) onRegenerateKey(share.id) }}
                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-orange-500 hover:text-orange-600 border border-orange-200 hover:border-orange-300 rounded-lg transition-colors"
                  >
                    <RefreshCw size={12} /> Régénérer la clé (invalide l'ancien lien)
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
