import { Sun, Moon } from 'lucide-react'
import { useTheme } from '../../hooks/useTheme'

export function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-slate-200 dark:bg-dark-border hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300"
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
    >
      <div className="relative w-6 h-6">
        <Sun
          className={`absolute inset-0 w-6 h-6 text-amber-500 transition-all duration-300 ${
            isDark ? 'opacity-0 rotate-90 scale-0' : 'opacity-100 rotate-0 scale-100'
          }`}
        />
        <Moon
          className={`absolute inset-0 w-6 h-6 text-indigo-400 transition-all duration-300 ${
            isDark ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-0'
          }`}
        />
      </div>
    </button>
  )
}
