import { TrendingDown, TrendingUp, Calendar, Camera, Scale } from 'lucide-react'
import { Card } from '../common'
import { useEvolutionStore } from '../../store/useEvolutionStore'
import { formatDate } from '../../lib/utils'

export function EvolutionStats() {
  const { weeklyEntries, getStats } = useEvolutionStore()
  const stats = getStats()

  // Não mostrar se não houver dados
  if (!stats || (weeklyEntries.length === 0 && !stats.totalPhotos)) {
    return null
  }

  const weightTrend = stats.weightChange < 0 ? 'down' : stats.weightChange > 0 ? 'up' : 'neutral'

  return (
    <Card gradient gradientColors="from-category-fisico to-orange-600">
      <h3 className="text-lg font-bold mb-4 text-white">Estatisticas de Evolucao</h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total de Registros */}
        <div className="p-4 rounded-xl bg-white/10">
          <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
            <Camera className="w-4 h-4" />
            Registros
          </div>
          <div className="text-2xl font-bold text-white">{stats.totalEntries || 0}</div>
        </div>

        {/* Peso Inicial */}
        {stats.initialWeight && (
          <div className="p-4 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <Scale className="w-4 h-4" />
              Peso Inicial
            </div>
            <div className="text-2xl font-bold text-white">{stats.initialWeight} kg</div>
          </div>
        )}

        {/* Peso Atual */}
        {stats.currentWeight && (
          <div className="p-4 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              <Scale className="w-4 h-4" />
              Peso Atual
            </div>
            <div className="text-2xl font-bold text-white">{stats.currentWeight} kg</div>
          </div>
        )}

        {/* Variacao de Peso */}
        {stats.weightChange !== 0 && stats.weightChange && (
          <div className="p-4 rounded-xl bg-white/10">
            <div className="flex items-center gap-2 text-white/80 text-sm mb-1">
              {weightTrend === 'down' ? (
                <TrendingDown className="w-4 h-4" />
              ) : (
                <TrendingUp className="w-4 h-4" />
              )}
              Variacao
            </div>
            <div className={`text-2xl font-bold ${weightTrend === 'down' ? 'text-emerald-300' : 'text-white'}`}>
              {stats.weightChange > 0 ? '+' : ''}{stats.weightChange.toFixed(1)} kg
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      {stats.firstEntry && stats.lastEntry && (
        <div className="mt-4 pt-4 border-t border-white/20">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 text-sm">
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span>Primeiro registro: {formatDate(stats.firstEntry, 'dd/MM/yyyy')}</span>
            </div>
            <div className="flex items-center gap-2 text-white/80">
              <Calendar className="w-4 h-4" />
              <span>Ultimo registro: {formatDate(stats.lastEntry, 'dd/MM/yyyy')}</span>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}
