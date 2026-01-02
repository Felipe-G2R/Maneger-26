import { useState, useEffect } from 'react'
import { Download, X, Smartphone } from 'lucide-react'

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState(null)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Verificar se ja esta instalado
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    // Verificar se foi dispensado recentemente
    const dismissed = localStorage.getItem('pwa-prompt-dismissed')
    if (dismissed) {
      const dismissedTime = parseInt(dismissed)
      const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000
      if (dismissedTime > oneDayAgo) {
        return
      }
    }

    // Capturar evento beforeinstallprompt
    const handleBeforeInstall = (e) => {
      e.preventDefault()
      setDeferredPrompt(e)
      // Mostrar apos 3 segundos
      setTimeout(() => setShowPrompt(true), 3000)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)

    // Verificar quando instalado
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true)
      setShowPrompt(false)
      setDeferredPrompt(null)
    })

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === 'accepted') {
      setIsInstalled(true)
    }

    setDeferredPrompt(null)
    setShowPrompt(false)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    localStorage.setItem('pwa-prompt-dismissed', Date.now().toString())
  }

  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 z-50 install-prompt lg:hidden">
      <div className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border p-4">
        {/* Close button */}
        <button
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border"
        >
          <X className="w-5 h-5 text-slate-400" />
        </button>

        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center flex-shrink-0">
            <Smartphone className="w-7 h-7 text-white" />
          </div>

          {/* Content */}
          <div className="flex-1 pr-6">
            <h3 className="font-bold text-lg">Instalar Maneger 26</h3>
            <p className="text-sm text-slate-500 dark:text-dark-muted mt-1">
              Adicione o app na tela inicial para acesso rapido e uso offline!
            </p>

            {/* Install button */}
            <button
              onClick={handleInstall}
              className="mt-3 w-full btn btn-primary py-2.5"
            >
              <Download className="w-5 h-5" />
              Instalar App
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
