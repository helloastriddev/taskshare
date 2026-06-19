import { useState, useEffect } from 'react'
import { Menu, X, Download, CheckSquare, Moon, Sun } from 'lucide-react'

interface HeaderProps {
  onMenuToggle: () => void
  menuOpen: boolean
  darkMode: boolean
  onDarkModeToggle: () => void
}

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function Header({ onMenuToggle, menuOpen, darkMode, onDarkModeToggle }: HeaderProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const mediaQuery = window.matchMedia('(display-mode: standalone)')
    setIsInstalled(mediaQuery.matches)
    mediaQuery.addEventListener('change', e => setIsInstalled(e.matches))

    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!installPrompt) return
    await installPrompt.prompt()
    const { outcome } = await installPrompt.userChoice
    if (outcome === 'accepted') {
      setInstallPrompt(null)
      setIsInstalled(true)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: burger (mobile) + logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Menu"
          >
            {menuOpen ? <X size={22} className="text-gray-600 dark:text-gray-300" /> : <Menu size={22} className="text-gray-600 dark:text-gray-300" />}
          </button>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center">
              <CheckSquare size={16} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-lg text-gray-900 dark:text-white leading-none">TaskShare</span>
              <p className="text-xs text-gray-500 dark:text-gray-400 leading-none hidden sm:block">Partagez vos listes de tâches</p>
            </div>
          </div>
        </div>

        {/* Right: install + dark mode */}
        <div className="flex items-center gap-2">
          {!isInstalled && installPrompt && (
            <button
              onClick={handleInstall}
              className="flex items-center gap-2 px-3 py-2 bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              <Download size={15} />
              <span className="hidden sm:inline">Installer l'app</span>
            </button>
          )}
          <button
            onClick={onDarkModeToggle}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Dark mode"
          >
            {darkMode ? <Sun size={18} className="text-yellow-400" /> : <Moon size={18} className="text-gray-500" />}
          </button>
        </div>
      </div>
    </header>
  )
}
