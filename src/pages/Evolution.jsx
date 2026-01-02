import { useEffect } from 'react'
import { Dumbbell, TrendingUp, Camera, Calendar, Loader2 } from 'lucide-react'
import {
  PhotoComparison,
  WeeklyDiary,
  EvolutionStats
} from '../components/evolution'
import { Card } from '../components/common'
import { useEvolutionStore } from '../store/useEvolutionStore'

export function Evolution() {
  const { photos, fetchPhotos, loading, getStats } = useEvolutionStore()

  useEffect(() => {
    fetchPhotos()
  }, [fetchPhotos])

  const stats = getStats()
  const currentPhoto = photos.length > 0 ? photos[0] : null
  const goalPhoto = photos.find(p => p.category === 'meta') || null

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
              <Dumbbell className="w-6 h-6 text-white" />
            </div>
            Mural de Evolucao
          </h1>
          <p className="text-slate-500 dark:text-dark-muted mt-2">
            Acompanhe sua transformacao fisica com fotos e registros semanais
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="text-center py-4">
          <Camera className="w-8 h-8 mx-auto mb-2 text-primary-500" />
          <div className="text-2xl font-bold">{photos.length}</div>
          <div className="text-xs text-slate-500 dark:text-dark-muted">Registros</div>
        </Card>

        <Card className="text-center py-4">
          <Calendar className="w-8 h-8 mx-auto mb-2 text-emerald-500" />
          <div className="text-2xl font-bold">
            {stats?.weeksTracked || 0}
          </div>
          <div className="text-xs text-slate-500 dark:text-dark-muted">Semanas</div>
        </Card>

        <Card className="text-center py-4">
          <TrendingUp className="w-8 h-8 mx-auto mb-2 text-amber-500" />
          <div className="text-2xl font-bold">
            {currentPhoto ? '1' : '0'}/{goalPhoto ? '1' : '0'}
          </div>
          <div className="text-xs text-slate-500 dark:text-dark-muted">Atual/Meta</div>
        </Card>

        <Card className="text-center py-4 bg-gradient-to-br from-red-500 to-orange-600 text-white border-0">
          <Dumbbell className="w-8 h-8 mx-auto mb-2" />
          <div className="text-2xl font-bold">2026</div>
          <div className="text-xs opacity-80">Seu Ano</div>
        </Card>
      </div>

      {/* Estatisticas de Evolucao */}
      <EvolutionStats />

      {/* Comparativo de Fotos */}
      <PhotoComparison />

      {/* Diario Semanal */}
      <WeeklyDiary />

      {/* Dicas */}
      <Card>
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <span className="text-2xl">💡</span>
          Dicas para Melhores Resultados
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <div className="font-medium mb-2">Consistencia nas Fotos</div>
            <p className="text-sm text-slate-500 dark:text-dark-muted">
              Tire fotos sempre no mesmo horario, local e com a mesma roupa/posicao para comparar melhor.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <div className="font-medium mb-2">Registre Semanalmente</div>
            <p className="text-sm text-slate-500 dark:text-dark-muted">
              Mantenha uma rotina de registro semanal para acompanhar sua evolucao de forma consistente.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50">
            <div className="font-medium mb-2">Alem do Peso</div>
            <p className="text-sm text-slate-500 dark:text-dark-muted">
              Registre tambem medidas corporais. O peso nem sempre reflete a real transformacao.
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
