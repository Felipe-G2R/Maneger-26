import { NavLink } from 'react-router-dom'
import { useRef, useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Target,
  BookOpen,
  DollarSign,
  Heart,
  Camera,
  Apple,
  BarChart3,
  Settings,
  ChevronRight
} from 'lucide-react'

const navItems = [
  { path: '/', icon: LayoutDashboard, label: 'Home' },
  { path: '/metas', icon: Target, label: 'Metas' },
  { path: '/diario', icon: BookOpen, label: 'Diario' },
  { path: '/financeiro', icon: DollarSign, label: 'Financas' },
  { path: '/almatico', icon: Heart, label: 'Almatico' },
  { path: '/evolucao', icon: Camera, label: 'Evolucao' },
  { path: '/dieta-treino', icon: Apple, label: 'Dieta' },
  { path: '/relatorios', icon: BarChart3, label: 'Relatorios' },
  { path: '/configuracoes', icon: Settings, label: 'Config' }
]

export function BottomNav() {
  const scrollRef = useRef(null)
  const [showRightIndicator, setShowRightIndicator] = useState(true)
  const [showLeftIndicator, setShowLeftIndicator] = useState(false)

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current
      setShowLeftIndicator(scrollLeft > 10)
      setShowRightIndicator(scrollLeft < scrollWidth - clientWidth - 10)
    }
  }

  useEffect(() => {
    checkScroll()
    const ref = scrollRef.current
    if (ref) {
      ref.addEventListener('scroll', checkScroll)
      return () => ref.removeEventListener('scroll', checkScroll)
    }
  }, [])

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Safe area background */}
      <div className="absolute inset-0 bg-white dark:bg-dark-card border-t border-slate-200 dark:border-dark-border" />

      {/* Left scroll indicator */}
      {showLeftIndicator && (
        <div className="absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-white dark:from-dark-card to-transparent z-10 pointer-events-none flex items-center">
          <ChevronRight className="w-4 h-4 text-slate-400 rotate-180 ml-1" />
        </div>
      )}

      {/* Right scroll indicator */}
      {showRightIndicator && (
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white dark:from-dark-card to-transparent z-10 pointer-events-none flex items-center justify-end">
          <ChevronRight className="w-4 h-4 text-slate-400 mr-1 animate-pulse" />
        </div>
      )}

      {/* Navigation items - scrollable */}
      <div
        ref={scrollRef}
        className="relative flex items-center gap-1 px-2 py-2 pb-safe overflow-x-auto scrollbar-hide"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl transition-all flex-shrink-0 min-w-[4.5rem] ${
                isActive
                  ? 'text-primary-500 bg-primary-500/10'
                  : 'text-slate-500 dark:text-dark-muted'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-6 h-6 ${isActive ? 'scale-110' : ''} transition-transform`} />
                <span className="text-[10px] font-medium whitespace-nowrap">{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>

      {/* Hide scrollbar CSS */}
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </nav>
  )
}
