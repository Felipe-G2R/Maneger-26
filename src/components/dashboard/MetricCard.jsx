import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Card } from '../common'

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = '#6366F1',
  trend,
  trendValue
}) {
  const getTrendIcon = () => {
    if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />
    if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />
    return <Minus className="w-4 h-4 text-slate-400" />
  }

  const getTrendColor = () => {
    if (trend === 'up') return 'text-emerald-500'
    if (trend === 'down') return 'text-red-500'
    return 'text-slate-400'
  }

  return (
    <Card hover className="relative overflow-hidden">
      {/* Background decoration */}
      <div
        className="absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10"
        style={{ backgroundColor: color }}
      />

      <div className="relative">
        <div className="flex items-start justify-between mb-2 lg:mb-4">
          <div
            className="w-10 h-10 lg:w-12 lg:h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: color + '20' }}
          >
            <Icon className="w-5 h-5 lg:w-6 lg:h-6" style={{ color }} />
          </div>

          {trend && (
            <div className={`flex items-center gap-1 text-xs lg:text-sm font-medium ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trendValue}</span>
            </div>
          )}
        </div>

        <div className="text-2xl lg:text-3xl font-bold mb-1">{value}</div>
        <div className="text-xs lg:text-sm text-slate-500 dark:text-dark-muted">{title}</div>
        {subtitle && (
          <div className="text-xs text-slate-400 dark:text-slate-500 mt-1">
            {subtitle}
          </div>
        )}
      </div>
    </Card>
  )
}
