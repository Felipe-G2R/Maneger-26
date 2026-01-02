import { Target, Settings, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'
import { ThemeToggle } from './ThemeToggle'
import { NotificationCenter } from './NotificationCenter'
import { useGoals } from '../../hooks/useGoals'
import { useAuth } from '../../hooks/useAuth'

export function MobileHeader() {
  const { overallProgress } = useGoals()
  const { logout } = useAuth()

  return (
    <header className="sticky top-0 z-40 lg:hidden">
      {/* Glass effect background */}
      <div className="absolute inset-0 bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl border-b border-slate-200/50 dark:border-dark-border/50" />

      <div className="relative px-4 py-3">
        {/* Top row */}
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-purple-600 flex items-center justify-center shadow-lg shadow-primary-500/25">
              <Target className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold gradient-text leading-tight">Maneger 26</h1>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            <NotificationCenter />
            <ThemeToggle />
            <Link
              to="/configuracoes"
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
            >
              <Settings className="w-5 h-5" />
            </Link>
            <button
              onClick={logout}
              className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mt-3 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-200 dark:bg-dark-border rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          <span className="text-sm font-bold text-primary-500 min-w-[3rem] text-right">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
      </div>
    </header>
  )
}
