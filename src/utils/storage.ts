import type { AppState, TodoList } from '../types/todo'

const STORAGE_KEY = 'taskshare_data'

const DEMO_LISTS: TodoList[] = [
  {
    id: 'demo-1',
    name: '🛒 Courses',
    createdAt: '2026-06-19',
    tasks: [
      { id: 't1', text: 'Pain', completed: false, createdAt: '2026-06-19' },
      { id: 't2', text: 'Lait', completed: true, createdAt: '2026-06-19' },
      { id: 't3', text: 'Oeufs', completed: false, createdAt: '2026-06-19' },
    ],
    shares: [],
  },
  {
    id: 'demo-2',
    name: '🏠 Maison',
    createdAt: '2026-06-18',
    tasks: [
      { id: 't4', text: 'Ranger le salon', completed: false, createdAt: '2026-06-18' },
      { id: 't5', text: 'Nettoyer la cuisine', completed: false, createdAt: '2026-06-18' },
    ],
    shares: [],
  },
]

const DEFAULT_STATE: AppState = {
  lists: DEMO_LISTS,
  accessibleLists: [],
}

export function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      saveState(DEFAULT_STATE)
      return DEFAULT_STATE
    }
    return JSON.parse(raw) as AppState
  } catch {
    return DEFAULT_STATE
  }
}

export function saveState(state: AppState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}
