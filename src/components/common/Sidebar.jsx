import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Target,
  BookOpen,
  BarChart3,
  Settings,
  X,
  Dumbbell,
  Brain,
  Heart,
  DollarSign,
  Users,
  Camera,
  Apple
} from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useGoals } from '../../hooks/useGoals'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { path: '/metas', icon: Target, label: 'Metas' },
  { path: '/evolucao', icon: Camera, label: 'Mural de Evolucao' },
  { path: '/diario', icon: BookOpen, label: 'Diario' },
  { path: '/dieta-treino', icon: Apple, label: 'Dieta/Treino' },
  { path: '/financeiro', icon: DollarSign, label: 'Financeiro' },
  { path: '/almatico', icon: Heart, label: 'Almatico' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatorios' },
  { path: '/configuracoes', icon: Settings, label: 'Configuracoes' }
]

const categoryIcons = {
  fisico: Dumbbell,
  intelectual: Brain,
  almatico: Heart,
  financeiro: DollarSign,
  social: Users
}

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useAppStore()
  const { categoryProgress } = useGoals()

  return (
    <>
      {/* Overlay mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-72 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border transform transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-dark-border lg:hidden">
            <span className="text-lg font-bold gradient-text">Menu</span>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-border"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            <div className="mb-6">
              <p className="px-4 mb-2 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-dark-muted">
                Menu Principal
              </p>
              {navItems.map(item => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && toggleSidebar()}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? 'active' : ''}`
                  }
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Category Progress */}
            <div>
              <p className="px-4 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-dark-muted">
                Progresso por Categoria
              </p>
              <div className="space-y-3">
                {categoryProgress.map(cat => {
                  const Icon = categoryIcons[cat.category] || Target
                  return (
                    <div
                      key={cat.category}
                      className="px-4 py-3 rounded-xl bg-slate-50 dark:bg-dark-border/50"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: cat.color + '20' }}
                          >
                            <Icon
                              className="w-4 h-4"
                              style={{ color: cat.color }}
                            />
                          </div>
                          <span className="text-sm font-medium">{cat.name}</span>
                        </div>
                        <span
                          className="text-sm font-bold"
                          style={{ color: cat.color }}
                        >
                          {cat.progress.toFixed(0)}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-slate-200 dark:bg-dark-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${cat.progress}%`,
                            backgroundColor: cat.color
                          }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-slate-200 dark:border-dark-border">
            <div className="text-center text-xs text-slate-400 dark:text-dark-muted">
              <p>Maneger 26 v1.0.0</p>
              <p className="mt-1">Feito com dedicacao</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  )
}
