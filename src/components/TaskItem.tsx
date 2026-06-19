import { useState, useRef, useEffect } from 'react'
import { Pencil, Trash2, Check, X } from 'lucide-react'
import type { Task } from '../types/todo'

interface TaskItemProps {
  task: Task
  readOnly?: boolean
  onToggle: () => void
  onEdit: (text: string) => void
  onDelete: () => void
}

export function TaskItem({ task, readOnly, onToggle, onEdit, onDelete }: TaskItemProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(task.text)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (editing) inputRef.current?.focus()
  }, [editing])

  const saveEdit = () => {
    const trimmed = draft.trim()
    if (trimmed && trimmed !== task.text) onEdit(trimmed)
    setEditing(false)
  }

  const cancelEdit = () => {
    setDraft(task.text)
    setEditing(false)
  }

  return (
    <div className={`group flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all animate-in ${task.completed ? 'opacity-60' : ''}`}>
      {/* Checkbox */}
      <button
        onClick={readOnly ? undefined : onToggle}
        disabled={readOnly}
        className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-all ${
          task.completed
            ? 'bg-primary-500 border-primary-500'
            : 'border-gray-300 dark:border-gray-600 hover:border-primary-400'
        } ${readOnly ? 'cursor-default' : 'cursor-pointer'}`}
      >
        {task.completed && <Check size={12} className="text-white" strokeWidth={3} />}
      </button>

      {/* Text / edit input */}
      {editing ? (
        <div className="flex-1 flex items-center gap-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
            className="flex-1 text-sm px-2 py-1 border border-primary-300 rounded outline-none focus:ring-2 focus:ring-primary-200 dark:bg-gray-800 dark:border-gray-600 dark:text-white"
          />
          <button onClick={saveEdit} className="p-1 text-green-500 hover:text-green-600">
            <Check size={15} strokeWidth={2.5} />
          </button>
          <button onClick={cancelEdit} className="p-1 text-gray-400 hover:text-gray-600">
            <X size={15} />
          </button>
        </div>
      ) : (
        <span
          className={`flex-1 text-sm text-gray-700 dark:text-gray-200 ${task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}
          onDoubleClick={() => { if (!readOnly) setEditing(true) }}
        >
          {task.text}
        </span>
      )}

      {/* Actions */}
      {!readOnly && !editing && (
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setEditing(true)}
            className="p-1.5 text-gray-400 hover:text-primary-500 rounded transition-colors"
          >
            <Pencil size={13} />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 text-gray-400 hover:text-red-500 rounded transition-colors"
          >
            <Trash2 size={13} />
          </button>
        </div>
      )}
    </div>
  )
}
