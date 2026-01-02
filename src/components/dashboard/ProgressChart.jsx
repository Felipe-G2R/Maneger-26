import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts'
import { Card } from '../common'

// Dados de exemplo - em produção viriam do store
const generateMockData = () => {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']
  const now = new Date()
  const currentMonth = now.getMonth()

  return months.slice(0, currentMonth + 1).map((month, index) => ({
    month,
    progresso: Math.min(((index + 1) / 12) * 100 + Math.random() * 10, 100),
    meta: ((index + 1) / 12) * 100
  }))
}

export function ProgressChart() {
  const data = generateMockData()

  return (
    <Card className="h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-bold">Progresso ao Longo do Ano</h3>
          <p className="text-sm text-slate-500 dark:text-dark-muted">
            Acompanhe sua evolucao mensal
          </p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-primary-500" />
            <span>Progresso Real</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Meta Ideal</span>
          </div>
        </div>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="metaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#334155"
              opacity={0.3}
            />

            <XAxis
              dataKey="month"
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />

            <YAxis
              stroke="#94A3B8"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value}%`}
              domain={[0, 100]}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: '#1E293B',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 40px rgba(0,0,0,0.3)'
              }}
              labelStyle={{ color: '#F8FAFC' }}
              formatter={(value) => [`${value.toFixed(1)}%`, '']}
            />

            <Area
              type="monotone"
              dataKey="meta"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#metaGradient)"
              strokeDasharray="5 5"
            />

            <Area
              type="monotone"
              dataKey="progresso"
              stroke="#6366F1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#progressGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  )
}
