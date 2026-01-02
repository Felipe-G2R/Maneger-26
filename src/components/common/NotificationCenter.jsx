import { useState, useEffect } from 'react'
import { X, Bell, CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useNotifications } from '../../hooks/useNotifications'

const iconMap = {
  success: CheckCircle,
  warning: AlertTriangle,
  info: Info,
  error: XCircle
}

const colorMap = {
  success: 'bg-emerald-500',
  warning: 'bg-amber-500',
  info: 'bg-primary-500',
  error: 'bg-red-500'
}

export function NotificationCenter() {
  const { notifications, removeNotification } = useAppStore()
  const { checkGoalsStatus, getMotivationalMessage, requestPermission } = useNotifications()
  const [showPanel, setShowPanel] = useState(false)
  const [alerts, setAlerts] = useState([])

  // Verificar metas ao carregar
  useEffect(() => {
    const goalAlerts = checkGoalsStatus()
    setAlerts(goalAlerts.slice(0, 5)) // Limitar a 5 alertas
  }, [checkGoalsStatus])

  // Solicitar permissao de notificacao
  useEffect(() => {
    requestPermission()
  }, [requestPermission])

  const allNotifications = [...alerts, ...notifications]
  const hasNotifications = allNotifications.length > 0

  return (
    <div className="relative">
      {/* Botao de Notificacoes */}
      <button
        onClick={() => setShowPanel(!showPanel)}
        className="relative p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-card transition-colors"
      >
        <Bell className="w-6 h-6" />
        {hasNotifications && (
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Painel de Notificacoes */}
      {showPanel && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPanel(false)}
          />

          {/* Panel */}
          <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 max-h-[70vh] overflow-y-auto bg-white dark:bg-dark-card rounded-2xl shadow-2xl border border-slate-200 dark:border-dark-border z-50">
            {/* Header */}
            <div className="sticky top-0 flex items-center justify-between p-4 border-b border-slate-200 dark:border-dark-border bg-white dark:bg-dark-card">
              <h3 className="font-bold">Notificacoes</h3>
              <button
                onClick={() => setShowPanel(false)}
                className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="p-2">
              {hasNotifications ? (
                <div className="space-y-2">
                  {allNotifications.map((notification, index) => {
                    const Icon = iconMap[notification.type] || Info
                    const color = colorMap[notification.type] || colorMap.info

                    return (
                      <div
                        key={notification.id || index}
                        className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-dark-border/50 transition-colors"
                      >
                        <div className={`w-8 h-8 rounded-lg ${color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-4 h-4 text-white" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm">{notification.title}</div>
                          <div className="text-xs text-slate-500 dark:text-dark-muted mt-0.5">
                            {notification.message}
                          </div>
                        </div>
                        {notification.id && (
                          <button
                            onClick={() => removeNotification(notification.id)}
                            className="p-1 rounded hover:bg-slate-200 dark:hover:bg-dark-border"
                          >
                            <X className="w-4 h-4 text-slate-400" />
                          </button>
                        )}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="py-8 text-center">
                  <Bell className="w-12 h-12 mx-auto mb-3 text-slate-300 dark:text-slate-600" />
                  <p className="text-sm text-slate-500 dark:text-dark-muted">
                    Nenhuma notificacao
                  </p>
                </div>
              )}
            </div>

            {/* Motivational Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-gradient-to-r from-primary-500/10 to-purple-500/10">
              <p className="text-xs text-center text-slate-600 dark:text-slate-400 italic">
                "{getMotivationalMessage()}"
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
