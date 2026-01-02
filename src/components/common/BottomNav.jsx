import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  BookOpen,
  DollarSign,
  Heart
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/metas', icon: Target, label: 'Metas' },
  { path: '/diario', icon: BookOpen, label: 'Diario' },
  { path: '/financeiro', icon: DollarSign, label: 'Financas' },
  { path: '/almatico', icon: Heart, label: 'Almatico' }
]

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Safe area background */}
      <div className="absolute inset-0 bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border" />

      {/* Navigation items */}
      <div className="relative flex items-center justify-around px-2 py-2 pb-safe">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-3 py-2 rounded-xl transition-all ${
                isActive
                  ? 'text-primary-500 bg-primary-500/10'
                  : 'text-slate-500 dark:text-dark-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
