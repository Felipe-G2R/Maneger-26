import { Menu, Target, LogOut } from 'lucide-react'
import { ThemeToggle } from './ThemeToggle'
import { NotificationCenter } from './NotificationCenter'
import { useAppStore } from '../../store/useAppStore'
import { useGoals } from '../../hooks/useGoals'
import { useAuth } from '../../hooks/useAuth'

export function Header() {
  const { toggleSidebar } = useAppStore()
  const { overallProgress } = useGoals()
  const { logout, user } = useAuth()

  return (
    <header className="glass sticky top-0 z-40 border-b border-slate-200 dark:border-dark-border">
      <div className="flex items-center justify-between px-4 py-3 lg:px-6">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-card transition-colors lg:hidden"
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Target className="w-6 h-6 text-white" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-xl font-bold gradient-text">Maneger 26</h1>
              <p className="text-xs text-slate-500 dark:text-dark-muted">
                Gestão de Metas 2026
              </p>
            </div>
          </div>
        </div>

        {/* Center - Progress indicator */}
        <div className="hidden md:flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100 dark:bg-dark-card">
          <div className="text-sm font-medium text-slate-600 dark:text-dark-muted">
            Progresso Geral
          </div>
          <div className="w-32 h-2 bg-slate-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-primary-500">
            {overallProgress.toFixed(1)}%
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          <NotificationCenter />
          <ThemeToggle />
          <button
            onClick={logout}
            className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  )
}
