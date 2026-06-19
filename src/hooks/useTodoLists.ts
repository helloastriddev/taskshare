import { useState, useEffect, useCallback } from 'react'
import { loadState, saveState } from '../utils/storage'
import { generateShareId, generateSecureKey } from '../utils/shareLink'
import type { AppState, TodoList, Task, Share, ShareMode, AccessibleList } from '../types/todo'

export function useTodoLists() {
  const [state, setState] = useState<AppState>(loadState)

  // Sync between tabs via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'taskshare_data' && e.newValue) {
        try {
          setState(JSON.parse(e.newValue))
        } catch {}
      }
    }
    window.addEventListener('storage', handleStorage)
    return () => window.removeEventListener('storage', handleStorage)
  }, [])

  const update = useCallback((updater: (prev: AppState) => AppState) => {
    setState(prev => {
      const next = updater(prev)
      saveState(next)
      return next
    })
  }, [])

  // --- List operations ---

  const createList = useCallback((name: string): string => {
    const id = crypto.randomUUID()
    update(prev => ({
      ...prev,
      lists: [
        ...prev.lists,
        {
          id,
          name,
          createdAt: new Date().toISOString().split('T')[0],
          tasks: [],
          shares: [],
        },
      ],
    }))
    return id
  }, [update])

  const renameList = useCallback((listId: string, name: string) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l => (l.id === listId ? { ...l, name } : l)),
    }))
  }, [update])

  const deleteList = useCallback((listId: string) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.filter(l => l.id !== listId),
    }))
  }, [update])

  const duplicateList = useCallback((listId: string): string => {
    const newId = crypto.randomUUID()
    update(prev => {
      const original = prev.lists.find(l => l.id === listId)
      if (!original) return prev
      const copy: TodoList = {
        ...original,
        id: newId,
        name: `${original.name} (copie)`,
        createdAt: new Date().toISOString().split('T')[0],
        tasks: original.tasks.map(t => ({ ...t, id: crypto.randomUUID() })),
        shares: [],
      }
      return { ...prev, lists: [...prev.lists, copy] }
    })
    return newId
  }, [update])

  // --- Task operations ---

  const addTask = useCallback((listId: string, text: string) => {
    const id = crypto.randomUUID()
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId
          ? {
              ...l,
              tasks: [
                ...l.tasks,
                { id, text, completed: false, createdAt: new Date().toISOString().split('T')[0] },
              ],
            }
          : l
      ),
    }))
  }, [update])

  const updateTask = useCallback((listId: string, taskId: string, changes: Partial<Task>) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId
          ? { ...l, tasks: l.tasks.map(t => (t.id === taskId ? { ...t, ...changes } : t)) }
          : l
      ),
    }))
  }, [update])

  const deleteTask = useCallback((listId: string, taskId: string) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId ? { ...l, tasks: l.tasks.filter(t => t.id !== taskId) } : l
      ),
    }))
  }, [update])

  // --- Share operations ---

  const createShare = useCallback((listId: string, mode: ShareMode): Share => {
    const share: Share = {
      id: generateShareId(),
      mode,
      key: mode === 'edit' ? generateSecureKey() : '',
      createdAt: new Date().toISOString(),
      lastAccessedAt: new Date().toISOString(),
    }
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId ? { ...l, shares: [...l.shares, share] } : l
      ),
    }))
    return share
  }, [update])

  const revokeShare = useCallback((listId: string, shareId: string) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId ? { ...l, shares: l.shares.filter(s => s.id !== shareId) } : l
      ),
    }))
  }, [update])

  const setShortUrl = useCallback((listId: string, shareId: string, shortUrl: string) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId
          ? { ...l, shares: l.shares.map(s => s.id === shareId ? { ...s, shortUrl } : s) }
          : l
      ),
    }))
  }, [update])

  const regenerateKey = useCallback((listId: string, shareId: string) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l =>
        l.id === listId
          ? {
              ...l,
              shares: l.shares.map(s =>
                s.id === shareId ? { ...s, key: generateSecureKey() } : s
              ),
            }
          : l
      ),
    }))
  }, [update])

  // Importe une liste reçue via un lien de partage dans le localStorage local
  // Conserve l'ID original pour que addTask/updateTask/deleteTask fonctionnent immédiatement après
  const importList = useCallback((list: Pick<TodoList, 'id' | 'name' | 'createdAt' | 'tasks'>): string => {
    update(prev => {
      if (prev.lists.some(l => l.id === list.id)) return prev
      const imported: TodoList = {
        id: list.id,
        name: list.name,
        createdAt: list.createdAt,
        tasks: list.tasks,
        shares: [],
      }
      return { ...prev, lists: [...prev.lists, imported] }
    })
    return list.id
  }, [update])

  // Applique une modification sur une liste partagée (mode edit en session)
  const applySharedTask = useCallback((
    listId: string,
    action: 'add' | 'update' | 'delete',
    payload: { taskId?: string; text?: string; completed?: boolean }
  ) => {
    update(prev => ({
      ...prev,
      lists: prev.lists.map(l => {
        if (l.id !== listId) return l
        if (action === 'add') {
          return { ...l, tasks: [...l.tasks, { id: crypto.randomUUID(), text: payload.text!, completed: false, createdAt: new Date().toISOString().split('T')[0] }] }
        }
        if (action === 'update') {
          return { ...l, tasks: l.tasks.map(t => t.id === payload.taskId ? { ...t, ...payload } : t) }
        }
        if (action === 'delete') {
          return { ...l, tasks: l.tasks.filter(t => t.id !== payload.taskId) }
        }
        return l
      }),
    }))
  }, [update])

  // --- Accessible lists (lists received via share) ---

  const addAccessibleList = useCallback((entry: AccessibleList) => {
    update(prev => {
      const exists = prev.accessibleLists.some(a => a.shareId === entry.shareId)
      if (exists) return prev
      return { ...prev, accessibleLists: [...prev.accessibleLists, entry] }
    })
  }, [update])

  const getListById = useCallback(
    (id: string) => state.lists.find(l => l.id === id),
    [state.lists]
  )

  return {
    lists: state.lists,
    accessibleLists: state.accessibleLists,
    createList,
    renameList,
    deleteList,
    duplicateList,
    addTask,
    updateTask,
    deleteTask,
    createShare,
    revokeShare,
    regenerateKey,
    addAccessibleList,
    importList,
    applySharedTask,
    setShortUrl,
    getListById,
    rawState: state,
  }
}
