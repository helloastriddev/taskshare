import { useState } from 'react'
import { Eye, Users, Copy, Plus, AlertCircle, Check } from 'lucide-react'
import { TaskItem } from './TaskItem'
import { AdSense } from './AdSense'
import type { TodoList } from '../types/todo'

interface SharedListViewProps {
  list: TodoList | null
  mode: 'view' | 'edit'
  valid: boolean
  onAddTask?: (text: string) => void
  onUpdateTask?: (taskId: string, changes: { text?: string; completed?: boolean }) => void
  onDeleteTask?: (taskId: string) => void
  onDuplicate?: () => void
}

export function SharedListView({ list, mode, valid, onAddTask, onUpdateTask, onDeleteTask, onDuplicate }: SharedListViewProps) {
  const [newTask, setNewTask] = useState('')
  const [copiedNotif, setCopiedNotif] = useState(false)

  if (!valid || !list) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Lien invalide ou expiré</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
          Ce lien de partage n'existe plus. Demandez un nouveau lien au propriétaire de la liste.
        </p>
      </div>
    )
  }

  const handleAddTask = () => {
    const trimmed = newTask.trim()
    if (!trimmed || !onAddTask) return
    onAddTask(trimmed)
    setNewTask('')
  }

  const completed = list.tasks.filter(t => t.completed).length
  const total = list.tasks.length
  const progress = total > 0 ? (completed / total) * 100 : 0

  const isEdit = mode === 'edit'

  return (
    <div className="flex flex-col gap-4">
      <AdSense slot="shared-top" />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-2">
            {isEdit ? (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 text-xs font-medium rounded-full">
                <Users size={12} /> Liste collaborative
              </span>
            ) : (
              <span className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 text-xs font-medium rounded-full">
                <Eye size={12} /> Lecture seule
              </span>
            )}
          </div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">{list.name}</h1>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Créée le {new Date(list.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            {' · '}{completed}/{total} tâche{total > 1 ? 's' : ''}
          </p>
          {total > 0 && (
            <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-primary-500 to-accent-500 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>

        {/* Tasks */}
        <div className="px-2 py-3">
          {list.tasks.length === 0 ? (
            <p className="text-center py-8 text-sm text-gray-400 dark:text-gray-500">Aucune tâche dans cette liste.</p>
          ) : (
            <div className="space-y-0.5">
              {list.tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  readOnly={!isEdit}
                  onToggle={() => onUpdateTask?.(task.id, { completed: !task.completed })}
                  onEdit={text => onUpdateTask?.(task.id, { text })}
                  onDelete={() => onDeleteTask?.(task.id)}
                />
              ))}
            </div>
          )}

          {/* Edit mode: add task */}
          {isEdit && (
            <div className="mt-3 flex gap-2 px-1">
              <input
                value={newTask}
                onChange={e => setNewTask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddTask() }}
                placeholder="Ajouter une tâche…"
                className="flex-1 text-sm px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 dark:text-white placeholder-gray-400 transition-all"
              />
              <button onClick={handleAddTask} className="px-3 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors">
                <Plus size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 space-y-3">
          {/* Edit mode: sync notice */}
          {isEdit && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800 rounded-lg">
              <Check size={14} className="text-green-500 shrink-0" />
              <span className="text-xs text-green-700 dark:text-green-400">
                📍 Vous pouvez éditer cette liste. Les modifications sont synchronisées entre onglets.
              </span>
            </div>
          )}

          {/* View mode: copy prompt */}
          {!isEdit && (
            <div className="space-y-2">
              <div className="flex items-start gap-2 px-3 py-2.5 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                <AlertCircle size={14} className="text-yellow-600 dark:text-yellow-400 mt-0.5 shrink-0" />
                <p className="text-xs text-yellow-700 dark:text-yellow-400">
                  C'est une liste en lecture seule. Vous ne pouvez pas modifier les tâches.
                </p>
              </div>
              {onDuplicate && (
                <button
                  onClick={() => { onDuplicate(); setCopiedNotif(true); setTimeout(() => setCopiedNotif(false), 2500) }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 border border-primary-200 text-primary-600 dark:text-primary-400 dark:border-primary-800 hover:bg-primary-50 dark:hover:bg-primary-900/10 rounded-lg text-sm font-medium transition-colors"
                >
                  <Copy size={14} />
                  {copiedNotif ? 'Liste dupliquée dans vos listes !' : 'Dupliquer cette liste dans mes listes'}
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <AdSense slot="shared-bottom" />
    </div>
  )
}
