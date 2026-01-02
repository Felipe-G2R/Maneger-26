import { useState } from 'react'
import { Plus, Calendar, Weight, Ruler, Trash2, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, Modal } from '../common'
import { ImageUpload } from './ImageUpload'
import { useEvolutionStore } from '../../store/useEvolutionStore'
import { formatDate } from '../../lib/utils'

export function WeeklyDiary() {
  const { weeklyEntries, addWeeklyEntry, deleteWeeklyEntry } = useEvolutionStore()
  const [showModal, setShowModal] = useState(false)
  const [expandedEntry, setExpandedEntry] = useState(null)
  const [formData, setFormData] = useState({
    imageData: null,
    weight: '',
    measurements: '',
    notes: ''
  })

  const handleSubmit = () => {
    if (!formData.imageData) return

    addWeeklyEntry({
      imageData: formData.imageData,
      weight: formData.weight ? parseFloat(formData.weight) : null,
      measurements: formData.measurements,
      notes: formData.notes
    })

    setFormData({ imageData: null, weight: '', measurements: '', notes: '' })
    setShowModal(false)
  }

  const handleDelete = (id) => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      deleteWeeklyEntry(id)
    }
  }

  return (
    <>
      <Card>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold">Diario Semanal de Evolucao</h3>
            <p className="text-sm text-slate-500 dark:text-dark-muted">
              Registre seu progresso semanalmente
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary"
          >
            <Plus className="w-5 h-5" />
            Nova Entrada
          </button>
        </div>

        {weeklyEntries.length > 0 ? (
          <div className="space-y-4">
            {weeklyEntries.map((entry) => (
              <div
                key={entry.id}
                className="border border-slate-200 dark:border-dark-border rounded-xl overflow-hidden"
              >
                {/* Header */}
                <div
                  className="flex items-center gap-4 p-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-dark-border/50 transition-colors"
                  onClick={() => setExpandedEntry(expandedEntry === entry.id ? null : entry.id)}
                >
                  {/* Thumbnail */}
                  <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={entry.imageData}
                      alt={`Semana ${entry.week}`}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <Calendar className="w-4 h-4 text-primary-500" />
                      <span>{formatDate(entry.date, 'dd/MM/yyyy')}</span>
                      <span className="px-2 py-0.5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 text-xs">
                        Semana {entry.week}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 dark:text-dark-muted">
                      {entry.weight && (
                        <div className="flex items-center gap-1">
                          <Weight className="w-4 h-4" />
                          <span>{entry.weight} kg</span>
                        </div>
                      )}
                      {entry.measurements && (
                        <div className="flex items-center gap-1">
                          <Ruler className="w-4 h-4" />
                          <span>{entry.measurements}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleDelete(entry.id)
                      }}
                      className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                    {expandedEntry === entry.id ? (
                      <ChevronUp className="w-5 h-5 text-slate-400" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-400" />
                    )}
                  </div>
                </div>

                {/* Expanded Content */}
                {expandedEntry === entry.id && (
                  <div className="p-4 border-t border-slate-200 dark:border-dark-border bg-slate-50 dark:bg-dark-border/30">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Imagem Grande */}
                      <div className="aspect-[3/4] rounded-xl overflow-hidden">
                        <img
                          src={entry.imageData}
                          alt={`Semana ${entry.week}`}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Detalhes */}
                      <div className="space-y-4">
                        {entry.weight && (
                          <div className="p-4 rounded-xl bg-white dark:bg-dark-card">
                            <div className="text-sm text-slate-500 dark:text-dark-muted">Peso</div>
                            <div className="text-2xl font-bold">{entry.weight} kg</div>
                          </div>
                        )}

                        {entry.measurements && (
                          <div className="p-4 rounded-xl bg-white dark:bg-dark-card">
                            <div className="text-sm text-slate-500 dark:text-dark-muted">Medidas</div>
                            <div className="font-medium">{entry.measurements}</div>
                          </div>
                        )}

                        {entry.notes && (
                          <div className="p-4 rounded-xl bg-white dark:bg-dark-card">
                            <div className="text-sm text-slate-500 dark:text-dark-muted mb-2">Observacoes</div>
                            <p className="text-sm">{entry.notes}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100 dark:bg-dark-border flex items-center justify-center">
              <Calendar className="w-8 h-8 text-slate-400" />
            </div>
            <h4 className="font-medium mb-2">Nenhuma entrada ainda</h4>
            <p className="text-sm text-slate-500 dark:text-dark-muted">
              Comece a registrar sua evolucao semanal!
            </p>
          </div>
        )}
      </Card>

      {/* Modal Nova Entrada */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Nova Entrada Semanal"
        size="lg"
      >
        <div className="space-y-6">
          {/* Upload de Imagem */}
          <ImageUpload
            label="Foto desta semana"
            description="Tire uma foto do seu progresso"
            currentImage={formData.imageData}
            onImageSelect={(imageData) => setFormData({ ...formData, imageData })}
            onClear={() => setFormData({ ...formData, imageData: null })}
            aspectRatio="portrait"
          />

          {/* Peso */}
          <div>
            <label className="label">Peso (kg)</label>
            <input
              type="number"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              className="input"
              placeholder="Ex: 75.5"
              step="0.1"
            />
          </div>

          {/* Medidas */}
          <div>
            <label className="label">Medidas (opcional)</label>
            <input
              type="text"
              value={formData.measurements}
              onChange={(e) => setFormData({ ...formData, measurements: e.target.value })}
              className="input"
              placeholder="Ex: Cintura 85cm, Peito 100cm"
            />
          </div>

          {/* Observacoes */}
          <div>
            <label className="label">Observacoes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="input min-h-[100px] resize-none"
              placeholder="Como foi sua semana? O que funcionou bem?"
            />
          </div>

          {/* Acoes */}
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit}
              className="btn btn-primary flex-1"
              disabled={!formData.imageData}
            >
              Salvar Entrada
            </button>
          </div>
        </div>
      </Modal>
    </>
  )
}
