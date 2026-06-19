import { useState } from 'react'
import { Plus, List, Share2, Trash2, X, Info } from 'lucide-react'
import type { TodoList, AccessibleList } from '../types/todo'

interface SidebarProps {
  lists: TodoList[]
  accessibleLists: AccessibleList[]
  selectedId: string | null
  onSelect: (id: string) => void
  onCreate: (name: string) => void
  onDelete: (id: string) => void
  onClose?: () => void
}

export function Sidebar({ lists, accessibleLists, selectedId, onSelect, onCreate, onDelete, onClose }: SidebarProps) {
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')

  const handleCreate = () => {
    const trimmed = newName.trim()
    if (!trimmed) return
    onCreate(trimmed)
    setNewName('')
    setCreating(false)
    onClose?.()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleCreate()
    if (e.key === 'Escape') { setCreating(false); setNewName('') }
  }

  return (
    <aside className="flex flex-col h-full bg-white dark:bg-gray-900 p-4 gap-4">
      {/* Mobile close */}
      <div className="flex items-center justify-between lg:hidden">
        <span className="font-semibold text-gray-700 dark:text-gray-200">Navigation</span>
        <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800">
          <X size={18} className="text-gray-500" />
        </button>
      </div>

      {/* My lists */}
      <section>
        <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          <List size={13} /> Mes listes
        </h2>
        <ul className="space-y-1">
          {lists.map(list => {
            const done = list.tasks.filter(t => t.completed).length
            return (
              <li key={list.id}>
                <div
                  className={`group flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-all ${
                    selectedId === list.id
                      ? 'bg-primary-50 dark:bg-primary-500/10 text-primary-600 dark:text-primary-400'
                      : 'hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300'
                  }`}
                  onClick={() => { onSelect(list.id); onClose?.() }}
                >
                  <span className="truncate text-sm font-medium">{list.name}</span>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className="text-xs text-gray-400">{done}/{list.tasks.length}</span>
                    <button
                      onClick={e => { e.stopPropagation(); if (confirm(`Supprimer "${list.name}" ?`)) onDelete(list.id) }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-500 transition-all"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>

        {/* Create list */}
        {creating ? (
          <div className="mt-2 flex gap-2">
            <input
              autoFocus
              value={newName}
              onChange={e => setNewName(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Nom de la liste…"
              className="flex-1 text-sm px-3 py-2 border border-primary-300 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
            />
            <button onClick={handleCreate} className="px-3 py-2 bg-primary-500 text-white text-sm rounded-lg hover:bg-primary-600 transition-colors">
              OK
            </button>
          </div>
        ) : (
          <button
            onClick={() => setCreating(true)}
            className="mt-2 w-full flex items-center gap-2 px-3 py-2 text-sm text-primary-600 dark:text-primary-400 hover:bg-primary-50 dark:hover:bg-primary-500/10 rounded-lg transition-colors font-medium"
          >
            <Plus size={15} /> Créer une liste
          </button>
        )}
      </section>

      {/* Shared with me */}
      {accessibleLists.length > 0 && (
        <section>
          <h2 className="flex items-center gap-2 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            <Share2 size={13} /> Partagées avec moi
          </h2>
          <ul className="space-y-1">
            {accessibleLists.map(al => (
              <li key={al.shareId}>
                <div
                  className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm"
                  onClick={() => { onSelect(al.listId); onClose?.() }}
                >
                  <span className="text-xs">{al.mode === 'edit' ? '🤝' : '👁️'}</span>
                  <span className="truncate">{al.name}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Footer */}
      <div className="mt-auto border-t border-gray-100 dark:border-gray-700 pt-4">
        <div className="flex items-start gap-2 text-xs text-gray-400 dark:text-gray-500">
          <Info size={13} className="mt-0.5 shrink-0" />
          <span>Données stockées dans votre navigateur. Aucun compte requis.</span>
        </div>
      </div>
    </aside>
  )
}
