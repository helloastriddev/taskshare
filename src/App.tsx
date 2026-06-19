import { useState, useEffect } from 'react'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { ListEditor } from './components/ListEditor'
import { SharedListView } from './components/SharedListView'
import { AdSense } from './components/AdSense'
import { useTodoLists } from './hooks/useTodoLists'
import { parseShareUrl } from './utils/shareLink'
import { CheckSquare, Plus } from 'lucide-react'

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedListId, setSelectedListId] = useState<string | null>(null)
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem('taskshare_dark') === 'true')

  const {
    lists,
    accessibleLists,
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
    getListById,
  } = useTodoLists()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('taskshare_dark', String(darkMode))
  }, [darkMode])

  const shareParams = parseShareUrl()
  const isSharedView = !!shareParams

  useEffect(() => {
    if (!shareParams) return
    const list = getListById(shareParams.listId)
    if (!list) return
    const share = list.shares.find(s => s.id === shareParams.shareId)
    if (!share) return
    if (share.mode === 'edit' && share.key !== shareParams.key) return
    addAccessibleList({
      listId: shareParams.listId,
      shareId: shareParams.shareId,
      mode: shareParams.mode,
      key: shareParams.key,
      name: list.name,
      accessedAt: new Date().toISOString(),
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleCreateList = (name: string) => {
    const id = createList(name)
    setSelectedListId(id)
    setMenuOpen(false)
  }

  const selectedList = selectedListId ? getListById(selectedListId) ?? null : null

  if (isSharedView && shareParams) {
    const sharedList = getListById(shareParams.listId) ?? null
    const share = sharedList?.shares.find(s => s.id === shareParams.shareId)
    const valid = !!share && (share.mode === 'view' || share.key === shareParams.key)

    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
        <Header menuOpen={false} onMenuToggle={() => {}} darkMode={darkMode} onDarkModeToggle={() => setDarkMode(d => !d)} />
        <main className="max-w-2xl mx-auto px-4 py-6">
          <SharedListView
            list={sharedList}
            mode={shareParams.mode}
            valid={valid}
            onAddTask={valid && shareParams.mode === 'edit' ? text => addTask(shareParams.listId, text) : undefined}
            onUpdateTask={valid && shareParams.mode === 'edit' ? (taskId, changes) => updateTask(shareParams.listId, taskId, changes) : undefined}
            onDeleteTask={valid && shareParams.mode === 'edit' ? taskId => deleteTask(shareParams.listId, taskId) : undefined}
            onDuplicate={
              valid && sharedList
                ? () => {
                    const newId = duplicateList(shareParams.listId)
                    window.location.href = window.location.origin + '/?selected=' + newId
                  }
                : undefined
            }
          />
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      <Header
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen(o => !o)}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(d => !d)}
      />

      <div className="flex h-[calc(100vh-64px)]">
        {/* Desktop sidebar */}
        <aside className="hidden lg:flex flex-col w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto shrink-0">
          <Sidebar
            lists={lists}
            accessibleLists={accessibleLists}
            selectedId={selectedListId}
            onSelect={setSelectedListId}
            onCreate={handleCreateList}
            onDelete={deleteList}
          />
        </aside>

        {/* Mobile sidebar overlay */}
        {menuOpen && (
          <>
            <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMenuOpen(false)} />
            <aside className="fixed left-0 top-16 bottom-0 z-50 w-72 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 overflow-y-auto lg:hidden shadow-xl">
              <Sidebar
                lists={lists}
                accessibleLists={accessibleLists}
                selectedId={selectedListId}
                onSelect={setSelectedListId}
                onCreate={handleCreateList}
                onDelete={deleteList}
                onClose={() => setMenuOpen(false)}
              />
            </aside>
          </>
        )}

        {/* Main */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-2xl mx-auto px-4 py-6">
            {selectedList ? (
              <ListEditor
                list={selectedList}
                onRename={name => renameList(selectedList.id, name)}
                onDelete={() => { deleteList(selectedList.id); setSelectedListId(null) }}
                onDuplicate={() => { const id = duplicateList(selectedList.id); setSelectedListId(id) }}
                onAddTask={text => addTask(selectedList.id, text)}
                onUpdateTask={(taskId, changes) => updateTask(selectedList.id, taskId, changes)}
                onDeleteTask={taskId => deleteTask(selectedList.id, taskId)}
                onCreateShare={mode => createShare(selectedList.id, mode)}
                onRevokeShare={shareId => revokeShare(selectedList.id, shareId)}
                onRegenerateKey={shareId => regenerateKey(selectedList.id, shareId)}
              />
            ) : (
              <EmptyState onCreateList={() => handleCreateList('Ma nouvelle liste')} />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

function EmptyState({ onCreateList }: { onCreateList: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center gap-6">
      <div className="w-20 h-20 bg-gradient-to-br from-primary-100 to-accent-100 dark:from-primary-900/20 dark:to-accent-900/20 rounded-2xl flex items-center justify-center">
        <CheckSquare size={36} className="text-primary-500" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Commencez !</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm max-w-xs">
          Créez votre première liste de tâches ou sélectionnez-en une dans la sidebar à gauche.
        </p>
      </div>
      <button
        onClick={onCreateList}
        className="flex items-center gap-2 px-5 py-3 bg-primary-500 hover:bg-primary-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-primary-200 dark:shadow-primary-900/30"
      >
        <Plus size={18} /> Créer une liste
      </button>
      <AdSense slot="empty-state" />
    </div>
  )
}

export default App
