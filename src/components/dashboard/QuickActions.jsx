import { Plus, Mic, Target, TrendingUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Card } from '../common'

const actions = [
  {
    icon: Plus,
    label: 'Nova Meta',
    description: 'Criar uma nova meta',
    color: '#6366F1',
    path: '/metas'
  },
  {
    icon: Mic,
    label: 'Gravar Diario',
    description: 'Registrar reflexao diaria',
    color: '#10B981',
    path: '/diario'
  },
  {
    icon: Target,
    label: 'Atualizar Progresso',
    description: 'Registrar avancos',
    color: '#F59E0B',
    path: '/metas'
  },
  {
    icon: TrendingUp,
    label: 'Ver Relatorios',
    description: 'Analisar resultados',
    color: '#A855F7',
    path: '/relatorios'
  }
]

export function QuickActions() {
  const navigate = useNavigate()

  return (
    <Card>
      <h3 className="text-base lg:text-lg font-bold mb-3 lg:mb-4">Acoes Rapidas</h3>

      <div className="grid grid-cols-2 gap-2 lg:gap-3">
        {actions.map((action, index) => (
          <button
            key={index}
            onClick={() => navigate(action.path)}
            className="flex flex-col items-center gap-1.5 lg:gap-2 p-3 lg:p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50 hover:bg-slate-100 dark:hover:bg-dark-border transition-all duration-300 group"
          >
            <div
              className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
              style={{ backgroundColor: action.color + '20' }}
            >
              <action.icon
                className="w-5 h-5 lg:w-6 lg:h-6"
                style={{ color: action.color }}
              />
            </div>
            <div className="text-center">
              <div className="font-medium text-xs lg:text-sm">{action.label}</div>
              <div className="text-[10px] lg:text-xs text-slate-500 dark:text-dark-muted hidden lg:block">
                {action.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </Card>
  )
}
