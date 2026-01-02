import { useState } from 'react'
import {
  Moon,
  Sun,
  Bell,
  Database,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Info
} from 'lucide-react'
import { Card } from '../components/common'
import { useAppStore } from '../store/useAppStore'
import { useGoalStore } from '../store/useGoalStore'
import { useDiaryStore } from '../store/useDiaryStore'
import { useTheme } from '../hooks/useTheme'

export function Settings() {
  const { theme, toggleTheme, isDark } = useTheme()
  const { preferences, updatePreferences } = useAppStore()
  const { goals, resetToInitial } = useGoalStore()
  const { entries } = useDiaryStore()

  const [showResetConfirm, setShowResetConfirm] = useState(false)

  const handleExportData = () => {
    const data = {
      goals,
      diaryEntries: entries,
      exportedAt: new Date().toISOString(),
      version: '1.0.0'
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `maneger-26-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleReset = () => {
    localStorage.removeItem('maneger-26-goals')
    localStorage.removeItem('maneger-26-diary')
    resetToInitial()
    setShowResetConfirm(false)
    window.location.reload()
  }

  return (
    <div className="space-y-6 max-w-3xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Configuracoes</h1>
        <p className="text-slate-500 dark:text-dark-muted mt-1">
          Personalize sua experiencia no Maneger 26
        </p>
      </div>

      {/* Appearance */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          {isDark ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          Aparencia
        </h3>

        <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
          <div>
            <div className="font-medium">Tema</div>
            <div className="text-sm text-slate-500 dark:text-dark-muted">
              Escolha entre modo claro e escuro
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => !isDark || toggleTheme()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                !isDark
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 dark:bg-dark-card text-slate-600 dark:text-dark-muted'
              }`}
            >
              <Sun className="w-4 h-4" />
              Claro
            </button>
            <button
              onClick={() => isDark || toggleTheme()}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                isDark
                  ? 'bg-primary-500 text-white'
                  : 'bg-slate-200 dark:bg-dark-card text-slate-600 dark:text-dark-muted'
              }`}
            >
              <Moon className="w-4 h-4" />
              Escuro
            </button>
          </div>
        </div>
      </Card>

      {/* Notifications */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notificacoes
        </h3>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <div>
              <div className="font-medium">Lembretes Diarios</div>
              <div className="text-sm text-slate-500 dark:text-dark-muted">
                Receba lembretes para registrar seu progresso
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={preferences.enableNotifications}
                onChange={(e) => updatePreferences({ enableNotifications: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 dark:bg-dark-border peer-focus:ring-4 peer-focus:ring-primary-500/25 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-500"></div>
            </label>
          </div>
        </div>
      </Card>

      {/* Data Management */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Database className="w-5 h-5" />
          Gerenciamento de Dados
        </h3>

        <div className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">{goals.length}</div>
              <div className="text-sm text-slate-500 dark:text-dark-muted">Metas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-primary-500">{entries.length}</div>
              <div className="text-sm text-slate-500 dark:text-dark-muted">Entradas do Diario</div>
            </div>
          </div>

          {/* Export */}
          <button
            onClick={handleExportData}
            className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50 hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
          >
            <Download className="w-5 h-5 text-primary-500" />
            <span className="font-medium">Exportar Dados</span>
          </button>

          {/* Reset */}
          {!showResetConfirm ? (
            <button
              onClick={() => setShowResetConfirm(true)}
              className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
              <span className="font-medium">Resetar Metas</span>
            </button>
          ) : (
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
              <p className="text-sm text-red-600 dark:text-red-400 mb-4">
                Tem certeza? Isso ira restaurar as metas para os valores iniciais.
                Seus dados de progresso serao perdidos.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="flex-1 btn btn-secondary py-2"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleReset}
                  className="flex-1 btn btn-danger py-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Confirmar Reset
                </button>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* About */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Info className="w-5 h-5" />
          Sobre
        </h3>

        <div className="space-y-4 text-sm text-slate-500 dark:text-dark-muted">
          <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <span>Versao</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">1.0.0</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <span>Desenvolvido para</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">Gestao de Metas 2026</span>
          </div>
          <div className="flex justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <span>Stack</span>
            <span className="font-medium text-slate-700 dark:text-slate-300">React + Vite + Tailwind</span>
          </div>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20">
          <p className="text-center text-sm">
            Feito com dedicacao para ajudar voce a alcancar seus objetivos em 2026
          </p>
        </div>
      </Card>
    </div>
  )
}
