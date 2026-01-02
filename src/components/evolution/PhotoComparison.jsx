import { ArrowRight, Calendar } from 'lucide-react'
import { Card } from '../common'
import { ImageUpload } from './ImageUpload'
import { useEvolutionStore } from '../../store/useEvolutionStore'
import { formatDate } from '../../lib/utils'

export function PhotoComparison() {
  const {
    currentPhoto,
    goalPhoto,
    setCurrentPhoto,
    setGoalPhoto,
    clearCurrentPhoto,
    clearGoalPhoto
  } = useEvolutionStore()

  return (
    <Card>
      <h3 className="text-lg font-bold mb-6">Comparativo de Evolucao</h3>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
        {/* Foto Atual */}
        <div>
          <ImageUpload
            label="Situacao Atual"
            description="Sua foto atual"
            currentImage={currentPhoto?.imageData}
            onImageSelect={(imageData) => setCurrentPhoto(imageData)}
            onClear={clearCurrentPhoto}
            aspectRatio="portrait"
          />
          {currentPhoto?.date && (
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-dark-muted justify-center">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(currentPhoto.date, 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>

        {/* Seta de Progresso */}
        <div className="hidden md:flex flex-col items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-gradient-to-r from-primary-500 to-emerald-500 flex items-center justify-center shadow-lg">
            <ArrowRight className="w-8 h-8 text-white" />
          </div>
          <p className="mt-3 text-sm font-medium text-center gradient-text">
            Sua Transformacao
          </p>
        </div>

        {/* Foto Meta */}
        <div>
          <ImageUpload
            label="Meta / Objetivo"
            description="Sua foto objetivo"
            currentImage={goalPhoto?.imageData}
            onImageSelect={(imageData) => setGoalPhoto(imageData)}
            onClear={clearGoalPhoto}
            aspectRatio="portrait"
          />
          {goalPhoto?.date && (
            <div className="flex items-center gap-2 mt-2 text-xs text-slate-500 dark:text-dark-muted justify-center">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(goalPhoto.date, 'dd/MM/yyyy')}</span>
            </div>
          )}
        </div>
      </div>

      {/* Dica */}
      <div className="mt-6 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
        <p className="text-sm text-center">
          <span className="font-medium text-primary-500">Dica:</span>{' '}
          Tire fotos sempre no mesmo lugar, horario e iluminacao para uma comparacao mais precisa.
        </p>
      </div>
    </Card>
  )
}
