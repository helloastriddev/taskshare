import { useState, useEffect } from 'react'
import { Menu, X, Download, CheckSquare, Moon, Sun, Share } from 'lucide-react'

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

function isIOS() {
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

function isInStandaloneMode() {
  return window.matchMedia('(display-mode: standalone)').matches
    || ('standalone' in navigator && (navigator as { standalone?: boolean }).standalone === true)
}

export function Header({ onMenuToggle, menuOpen, darkMode, onDarkModeToggle }: HeaderProps) {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isInstalled, setIsInstalled] = useState(false)
  const [showIOSBanner, setShowIOSBanner] = useState(false)

  useEffect(() => {
    // Déjà installée ?
    if (isInStandaloneMode()) {
      setIsInstalled(true)
      return
    }

    // iOS : pas de beforeinstallprompt, on affiche une bannière manuelle
    if (isIOS()) {
      const dismissed = localStorage.getItem('taskshare_ios_banner_dismissed')
      if (!dismissed) setShowIOSBanner(true)
      return
    }

    // Android / desktop Chrome
    const handler = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', handler)

    const mq = window.matchMedia('(display-mode: standalone)')
    mq.addEventListener('change', e => { if (e.matches) setIsInstalled(true) })

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

  const dismissIOSBanner = () => {
    localStorage.setItem('taskshare_ios_banner_dismissed', '1')
    setShowIOSBanner(false)
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
          {/* Left: burger + logo */}
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
            {/* Android / desktop */}
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

      {/* Bannière iOS */}
      {showIOSBanner && (
        <div className="bg-primary-50 dark:bg-primary-900/20 border-b border-primary-200 dark:border-primary-800 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shrink-0">
                <CheckSquare size={14} className="text-white" />
              </div>
              <p className="text-sm text-primary-800 dark:text-primary-200">
                Installez TaskShare : appuyez sur{' '}
                <Share size={13} className="inline mx-0.5 mb-0.5" />
                {' '}puis <strong>"Sur l'écran d'accueil"</strong>
              </p>
            </div>
            <button
              onClick={dismissIOSBanner}
              className="p-1 text-primary-500 hover:text-primary-700 shrink-0"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
