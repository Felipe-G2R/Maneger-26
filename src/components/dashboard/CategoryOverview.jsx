import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip
} from 'recharts'
import { Card } from '../common'
import { useGoals } from '../../hooks/useGoals'
import { getCategoryName, getCategoryColor } from '../../lib/utils'

export function CategoryOverview() {
  const { categoryProgress } = useGoals()

  const data = categoryProgress.map(cat => ({
    name: cat.name,
    value: cat.progress,
    color: cat.color,
    goals: cat.goalsCount,
    completed: cat.completedCount
  }))

  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Progresso por Categoria</h3>
          <p className="text-sm text-slate-500 dark:text-dark-muted">
            Visao geral das suas metas
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="none"
                  />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E293B',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
                }}
                formatter={(value) => [`${value.toFixed(1)}%`, 'Progresso']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-col justify-center space-y-3">
          {data.map((cat, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-dark-border/50"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: cat.color }}
                />
                <div>
                  <span className="font-medium">{cat.name}</span>
                  <span className="text-xs text-slate-500 dark:text-dark-muted ml-2">
                    ({cat.completed}/{cat.goals} metas)
                  </span>
                </div>
              </div>
              <span
                className="font-bold"
                style={{ color: cat.color }}
              >
                {cat.value.toFixed(0)}%
              </span>
            </div>
          ))}
        </div>
      </div>
    </Card>
  )
}
