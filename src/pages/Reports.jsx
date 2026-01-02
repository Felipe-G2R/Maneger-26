import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from 'recharts'
import {
  TrendingUp,
  Target,
  Calendar,
  Award,
  AlertTriangle,
  CheckCircle
} from 'lucide-react'
import { Card, ProgressBar } from '../components/common'
import { useGoals } from '../hooks/useGoals'
import { useDiaryStore } from '../store/useDiaryStore'
import {
  getCategoryName,
  getCategoryColor,
  getDaysRemainingInYear,
  formatNumber
} from '../lib/utils'

export function Reports() {
  const { goals, categoryProgress, overallProgress, stats, urgentGoals, attentionNeeded } = useGoals()
  const { entries, getMoodStats } = useDiaryStore()

  const daysRemaining = getDaysRemainingInYear()
  const daysElapsed = 365 - daysRemaining
  const expectedProgress = (daysElapsed / 365) * 100

  // Data for category radar chart
  const radarData = categoryProgress.map(cat => ({
    category: cat.name,
    progresso: cat.progress,
    meta: expectedProgress
  }))

  // Data for mood distribution
  const moodStats = getMoodStats()
  const moodData = [
    { name: 'Otimo', value: moodStats.otimo, color: '#10B981' },
    { name: 'Bom', value: moodStats.bom, color: '#6366F1' },
    { name: 'Neutro', value: moodStats.neutro, color: '#94A3B8' },
    { name: 'Ruim', value: moodStats.ruim, color: '#F59E0B' },
    { name: 'Pessimo', value: moodStats.pessimo, color: '#EF4444' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold">Relatorios</h1>
        <p className="text-slate-500 dark:text-dark-muted mt-1">
          Analise detalhada do seu progresso em 2026
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-primary-500" />
          </div>
          <div className="text-3xl font-bold text-primary-500">{overallProgress.toFixed(1)}%</div>
          <div className="text-sm text-slate-500 dark:text-dark-muted">Progresso Geral</div>
          <div className="text-xs text-slate-400 mt-1">Meta: {expectedProgress.toFixed(1)}%</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-3xl font-bold text-emerald-500">{stats.completed}</div>
          <div className="text-sm text-slate-500 dark:text-dark-muted">Metas Completadas</div>
          <div className="text-xs text-slate-400 mt-1">de {stats.total} total</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Calendar className="w-6 h-6 text-amber-500" />
          </div>
          <div className="text-3xl font-bold text-amber-500">{daysRemaining}</div>
          <div className="text-sm text-slate-500 dark:text-dark-muted">Dias Restantes</div>
          <div className="text-xs text-slate-400 mt-1">{daysElapsed} dias passados</div>
        </Card>

        <Card className="text-center">
          <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <Award className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-3xl font-bold text-purple-500">{entries.length}</div>
          <div className="text-sm text-slate-500 dark:text-dark-muted">Entradas no Diario</div>
          <div className="text-xs text-slate-400 mt-1">reflexoes gravadas</div>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Chart */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Progresso por Categoria</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="#334155" />
                <PolarAngleAxis
                  dataKey="category"
                  tick={{ fill: '#94A3B8', fontSize: 12 }}
                />
                <PolarRadiusAxis
                  angle={90}
                  domain={[0, 100]}
                  tick={{ fill: '#94A3B8', fontSize: 10 }}
                />
                <Radar
                  name="Progresso"
                  dataKey="progresso"
                  stroke="#6366F1"
                  fill="#6366F1"
                  fillOpacity={0.3}
                  strokeWidth={2}
                />
                <Radar
                  name="Meta Esperada"
                  dataKey="meta"
                  stroke="#10B981"
                  fill="#10B981"
                  fillOpacity={0.1}
                  strokeDasharray="5 5"
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Mood Chart */}
        <Card>
          <h3 className="text-lg font-bold mb-4">Distribuicao de Humor</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={moodData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                <XAxis type="number" stroke="#94A3B8" fontSize={12} />
                <YAxis
                  type="category"
                  dataKey="name"
                  stroke="#94A3B8"
                  fontSize={12}
                  width={80}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1E293B',
                    border: 'none',
                    borderRadius: '12px'
                  }}
                />
                <Bar
                  dataKey="value"
                  radius={[0, 8, 8, 0]}
                  fill="#6366F1"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Category Details */}
      <Card>
        <h3 className="text-lg font-bold mb-4">Detalhes por Categoria</h3>
        <div className="space-y-6">
          {categoryProgress.map(cat => (
            <div key={cat.category}>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-sm text-slate-500 dark:text-dark-muted">
                    ({cat.completedCount}/{cat.goalsCount} metas)
                  </span>
                </div>
                <span className="font-bold" style={{ color: cat.color }}>
                  {cat.progress.toFixed(1)}%
                </span>
              </div>
              <ProgressBar
                value={cat.progress}
                max={100}
                color={cat.color}
                showLabel={false}
              />
            </div>
          ))}
        </div>
      </Card>

      {/* Alerts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Urgent Goals */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <h3 className="text-lg font-bold">Metas Urgentes</h3>
          </div>

          {urgentGoals.length > 0 ? (
            <div className="space-y-3">
              {urgentGoals.slice(0, 5).map(goal => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20"
                >
                  <div>
                    <div className="font-medium text-sm">{goal.title}</div>
                    <div className="text-xs text-amber-600 dark:text-amber-400">
                      Prazo: {goal.deadline}
                    </div>
                  </div>
                  <span
                    className="text-sm font-bold"
                    style={{ color: getCategoryColor(goal.category) }}
                  >
                    {((goal.current_value / goal.target_value) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-slate-500 dark:text-dark-muted">
              Nenhuma meta urgente no momento
            </p>
          )}
        </Card>

        {/* Attention Needed */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-red-500" />
            <h3 className="text-lg font-bold">Precisam de Atencao</h3>
          </div>

          {attentionNeeded.length > 0 ? (
            <div className="space-y-3">
              {attentionNeeded.slice(0, 5).map(goal => (
                <div
                  key={goal.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-red-50 dark:bg-red-900/20"
                >
                  <div>
                    <div className="font-medium text-sm">{goal.title}</div>
                    <div className="text-xs text-red-600 dark:text-red-400">
                      Progresso abaixo do esperado
                    </div>
                  </div>
                  <span className="text-sm font-bold text-red-500">
                    {((goal.current_value / goal.target_value) * 100).toFixed(0)}%
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-slate-500 dark:text-dark-muted">
              Todas as metas estao no caminho certo!
            </p>
          )}
        </Card>
      </div>

      {/* Recommendations */}
      <Card gradient gradientColors="from-primary-600 to-purple-700">
        <h3 className="text-lg font-bold mb-4">Recomendacoes</h3>
        <div className="space-y-3">
          {overallProgress < expectedProgress && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10">
              <TrendingUp className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Acelere seu progresso</div>
                <div className="text-sm opacity-80">
                  Voce esta {(expectedProgress - overallProgress).toFixed(1)}% atras da meta ideal.
                  Foque nas metas mais atrasadas.
                </div>
              </div>
            </div>
          )}

          {stats.notStarted > 0 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10">
              <Target className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Inicie suas metas pendentes</div>
                <div className="text-sm opacity-80">
                  Voce tem {stats.notStarted} metas que ainda nao foram iniciadas.
                  Comece com pequenos passos!
                </div>
              </div>
            </div>
          )}

          {entries.length < 7 && (
            <div className="flex items-start gap-3 p-3 rounded-xl bg-white/10">
              <Calendar className="w-5 h-5 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-medium">Mantenha seu diario</div>
                <div className="text-sm opacity-80">
                  Grave reflexoes diarias para acompanhar melhor sua jornada e manter a motivacao.
                </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  )
}
