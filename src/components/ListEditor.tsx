import { useState, useRef, useEffect } from 'react'
import { Plus, Copy, Trash2, Calendar } from 'lucide-react'
import { TaskItem } from './TaskItem'
import { SharePanel } from './SharePanel'
import { AdSense } from './AdSense'
import type { TodoList, Share, ShareMode } from '../types/todo'

interface ListEditorProps {
  list: TodoList
  onRename: (name: string) => void
  onDelete: () => void
  onDuplicate: () => void
  onAddTask: (text: string) => void
  onUpdateTask: (taskId: string, changes: { text?: string; completed?: boolean }) => void
  onDeleteTask: (taskId: string) => void
  onCreateShare: (mode: ShareMode) => Share
  onRevokeShare: (shareId: string) => void
  onRegenerateKey: (shareId: string) => void
}

export function ListEditor({
  list,
  onRename,
  onDelete,
  onDuplicate,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onCreateShare,
  onRevokeShare,
  onRegenerateKey,
}: ListEditorProps) {
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleDraft, setTitleDraft] = useState(list.name)
  const [newTask, setNewTask] = useState('')
  const titleRef = useRef<HTMLInputElement>(null)
  const taskInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setTitleDraft(list.name)
  }, [list.id, list.name])

  useEffect(() => {
    if (editingTitle) titleRef.current?.focus()
  }, [editingTitle])

  const saveTitle = () => {
    const trimmed = titleDraft.trim()
    if (trimmed && trimmed !== list.name) onRename(trimmed)
    else setTitleDraft(list.name)
    setEditingTitle(false)
  }

  const handleAddTask = () => {
    const trimmed = newTask.trim()
    if (!trimmed) return
    onAddTask(trimmed)
    setNewTask('')
    taskInputRef.current?.focus()
  }

  const completed = list.tasks.filter(t => t.completed).length
  const total = list.tasks.length
  const progress = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="flex flex-col gap-0">
      {/* AdSense top */}
      <AdSense slot="top-banner" />

      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="px-5 pt-5 pb-4 border-b border-gray-100 dark:border-gray-700">
          <div className="flex items-start justify-between gap-3 mb-2">
            {/* Title */}
            {editingTitle ? (
              <input
                ref={titleRef}
                value={titleDraft}
                onChange={e => setTitleDraft(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') saveTitle(); if (e.key === 'Escape') { setTitleDraft(list.name); setEditingTitle(false) } }}
                onBlur={saveTitle}
                className="flex-1 text-xl font-bold bg-transparent border-b-2 border-primary-400 outline-none text-gray-900 dark:text-white"
              />
            ) : (
              <h1
                className="flex-1 text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:text-primary-600 transition-colors"
                onClick={() => setEditingTitle(true)}
                title="Cliquer pour renommer"
              >
                {list.name}
              </h1>
            )}
            <div className="flex items-center gap-1 shrink-0">
              <button onClick={onDuplicate} title="Dupliquer" className="p-2 text-gray-400 hover:text-primary-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Copy size={15} />
              </button>
              <button onClick={() => { if (confirm(`Supprimer "${list.name}" ?`)) onDelete() }} title="Supprimer" className="p-2 text-gray-400 hover:text-red-500 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                <Trash2 size={15} />
              </button>
            </div>
          </div>

          {/* Meta */}
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 text-xs text-gray-400 dark:text-gray-500">
              <Calendar size={11} /> Créée le {new Date(list.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </span>
            <span className="text-xs text-gray-400">·</span>
            <span className="text-xs text-gray-400 dark:text-gray-500">{completed}/{total} tâche{total > 1 ? 's' : ''}</span>
          </div>

          {/* Progress bar */}
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
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-sm">Aucune tâche pour le moment.</p>
              <p className="text-xs mt-1">Ajoutez votre première tâche ci-dessous !</p>
            </div>
          ) : (
            <div className="space-y-0.5">
              {list.tasks.map(task => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={() => onUpdateTask(task.id, { completed: !task.completed })}
                  onEdit={text => onUpdateTask(task.id, { text })}
                  onDelete={() => onDeleteTask(task.id)}
                />
              ))}
            </div>
          )}

          {/* Add task input */}
          <div className="mt-3 flex gap-2 px-1">
            <input
              ref={taskInputRef}
              value={newTask}
              onChange={e => setNewTask(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleAddTask() }}
              placeholder="Ajouter une tâche… (Entrée pour valider)"
              className="flex-1 text-sm px-3 py-2.5 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg outline-none focus:ring-2 focus:ring-primary-200 focus:border-primary-400 dark:text-white placeholder-gray-400 transition-all"
            />
            <button
              onClick={handleAddTask}
              className="px-3 py-2.5 bg-primary-500 hover:bg-primary-600 text-white rounded-lg transition-colors"
            >
              <Plus size={18} />
            </button>
          </div>
        </div>

        {/* Share panel */}
        <div className="px-5 pb-5">
          <SharePanel
            list={list}
            onCreateShare={onCreateShare}
            onRevokeShare={onRevokeShare}
            onRegenerateKey={onRegenerateKey}
          />
        </div>
      </div>
    </div>
  )
}
