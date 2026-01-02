import {
  Target,
  CheckCircle,
  Clock,
  Calendar,
  TrendingUp,
  Flame
} from 'lucide-react'
import {
  MetricCard,
  ProgressChart,
  CategoryOverview,
  QuickActions,
  RecentActivity
} from '../components/dashboard'
import { useGoals } from '../hooks/useGoals'
import { getDaysRemainingInYear } from '../lib/utils'

export function Home() {
  const { stats, overallProgress } = useGoals()
  const daysRemaining = getDaysRemainingInYear()

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 lg:gap-4">
        <div>
          <h1 className="text-xl lg:text-3xl font-bold">
            Bem-vindo ao <span className="gradient-text">Maneger 26</span>
          </h1>
          <p className="text-sm lg:text-base text-slate-500 dark:text-dark-muted mt-1">
            Acompanhe suas metas e transforme 2026 no seu melhor ano!
          </p>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 lg:px-4 lg:py-2 rounded-xl bg-gradient-to-r from-primary-500/10 to-purple-500/10 border border-primary-500/20 self-start lg:self-auto">
          <Calendar className="w-4 h-4 lg:w-5 lg:h-5 text-primary-500" />
          <span className="text-xs lg:text-sm font-medium">
            <span className="text-primary-500 font-bold">{daysRemaining}</span> dias restantes
          </span>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <MetricCard
          title="Total de Metas"
          value={stats.total}
          icon={Target}
          color="#6366F1"
          subtitle="Definidas para 2026"
        />

        <MetricCard
          title="Completadas"
          value={stats.completed}
          icon={CheckCircle}
          color="#10B981"
          trend="up"
          trendValue={`${stats.completionRate.toFixed(0)}%`}
        />

        <MetricCard
          title="Em Progresso"
          value={stats.inProgress}
          icon={TrendingUp}
          color="#F59E0B"
          subtitle="Trabalhando nisso"
        />

        <MetricCard
          title="Progresso Geral"
          value={`${overallProgress.toFixed(1)}%`}
          icon={Flame}
          color="#EF4444"
          subtitle="Rumo ao objetivo"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <ProgressChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      {/* Category and Activity Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <CategoryOverview />
        <RecentActivity />
      </div>

      {/* Motivational Quote */}
      <div className="p-4 lg:p-6 rounded-2xl bg-gradient-to-r from-primary-500 to-purple-600 text-white">
        <div className="flex items-start gap-2 lg:gap-4">
          <div className="text-2xl lg:text-4xl">"</div>
          <div>
            <p className="text-sm lg:text-lg font-medium italic">
              O sucesso e a soma de pequenos esforcos repetidos dia apos dia.
            </p>
            <p className="text-xs lg:text-sm opacity-80 mt-1 lg:mt-2">- Robert Collier</p>
          </div>
        </div>
      </div>
    </div>
  )
}
