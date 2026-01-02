import { CheckCircle, TrendingUp, Mic, Target } from 'lucide-react'
import { Card } from '../common'
import { useGoalStore } from '../../store/useGoalStore'
import { useDiaryStore } from '../../store/useDiaryStore'
import { formatRelativeDate } from '../../lib/utils'

export function RecentActivity() {
  const { progressLogs, goals } = useGoalStore()
  const { entries } = useDiaryStore()

  // Combinar e ordenar atividades recentes
  const activities = [
    ...progressLogs.slice(-5).map(log => {
      const goal = goals.find(g => g.id === log.goal_id)
      return {
        type: 'progress',
        icon: TrendingUp,
        color: '#10B981',
        title: `Progresso em "${goal?.title || 'Meta'}"`,
        description: `+${log.value} ${goal?.unit || ''}`,
        date: log.logged_at
      }
    }),
    ...entries.slice(0, 3).map(entry => ({
      type: 'diary',
      icon: Mic,
      color: '#6366F1',
      title: 'Entrada no diario',
      description: entry.transcription?.slice(0, 50) + '...' || 'Audio gravado',
      date: entry.created_at
    }))
  ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5)

  if (activities.length === 0) {
    return (
      <Card>
        <h3 className="text-lg font-bold mb-4">Atividade Recente</h3>
        <div className="text-center py-8 text-slate-500 dark:text-dark-muted">
          <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>Nenhuma atividade ainda</p>
          <p className="text-sm">Comece registrando seu progresso!</p>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <h3 className="text-lg font-bold mb-4">Atividade Recente</h3>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 dark:bg-dark-border/50"
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: activity.color + '20' }}
            >
              <activity.icon
                className="w-5 h-5"
                style={{ color: activity.color }}
              />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm truncate">{activity.title}</div>
              <div className="text-xs text-slate-500 dark:text-dark-muted truncate">
                {activity.description}
              </div>
            </div>
            <div className="text-xs text-slate-400 dark:text-slate-500 whitespace-nowrap">
              {formatRelativeDate(activity.date)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
