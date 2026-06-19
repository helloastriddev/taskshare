export interface Task {
  id: string
  text: string
  completed: boolean
  createdAt: string
}

export interface Share {
  id: string
  mode: 'view' | 'edit'
  key: string
  createdAt: string
  lastAccessedAt: string
}

export interface TodoList {
  id: string
  name: string
  createdAt: string
  tasks: Task[]
  shares: Share[]
}

export interface AccessibleList {
  listId: string
  shareId: string
  mode: 'view' | 'edit'
  key: string
  name: string
  accessedAt: string
}

export interface AppState {
  lists: TodoList[]
  accessibleLists: AccessibleList[]
}

export type ShareMode = 'view' | 'edit'
