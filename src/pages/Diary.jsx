import { useState, useEffect } from 'react'
import { BookOpen, Calendar, Smile, Loader2 } from 'lucide-react'
import { DiaryForm, DiaryEntry } from '../components/diary'
import { Card, Modal } from '../components/common'
import { useDiaryStore } from '../store/useDiaryStore'

const moods = [
  { value: 'otimo', label: 'Otimo', emoji: '😄' },
  { value: 'bom', label: 'Bom', emoji: '🙂' },
  { value: 'neutro', label: 'Neutro', emoji: '😐' },
  { value: 'ruim', label: 'Ruim', emoji: '😕' },
  { value: 'pessimo', label: 'Pessimo', emoji: '😢' }
]

export function Diary() {
  const { entries, addEntry, getMoodStats, fetchEntries, loading } = useDiaryStore()

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const [showMoodModal, setShowMoodModal] = useState(false)
  const [pendingEntry, setPendingEntry] = useState(null)
  const [selectedMood, setSelectedMood] = useState('neutro')

  const moodStats = getMoodStats()

  const handleSaveEntry = (data) => {
    setPendingEntry(data)
    setShowMoodModal(true)
  }

  const handleCompleteSave = () => {
    if (pendingEntry) {
      addEntry({
        transcription: pendingEntry.transcription,
        mood: selectedMood
      })
      setPendingEntry(null)
      setSelectedMood('neutro')
      setShowMoodModal(false)
    }
  }

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
      <div>
        <h1 className="text-xl lg:text-3xl font-bold">Diario</h1>
        <p className="text-sm lg:text-base text-slate-500 dark:text-dark-muted mt-1">
          Registre suas reflexoes diarias e acompanhe sua jornada
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-2 lg:gap-4">
        {moods.map(mood => (
          <Card key={mood.value} className="text-center py-2 lg:py-4 px-1 lg:px-4">
            <div className="text-xl lg:text-3xl mb-1 lg:mb-2">{mood.emoji}</div>
            <div className="text-lg lg:text-2xl font-bold">{moodStats[mood.value] || 0}</div>
            <div className="text-[10px] lg:text-xs text-slate-500 dark:text-dark-muted">{mood.label}</div>
          </Card>
        ))}
      </div>

      {/* New Entry Form */}
      <DiaryForm onSave={handleSaveEntry} />

      {/* Entries List */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base lg:text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary-500" />
            Entradas do Diario
          </h2>
          <span className="text-xs lg:text-sm text-slate-500 dark:text-dark-muted">
            {entries.length} {entries.length === 1 ? 'entrada' : 'entradas'}
          </span>
        </div>

        {entries.length > 0 ? (
          <div className="space-y-4">
            {entries.map(entry => (
              <DiaryEntry key={entry.id} entry={entry} />
            ))}
          </div>
        ) : (
          <Card className="text-center py-8 lg:py-12">
            <Calendar className="w-10 h-10 lg:w-12 lg:h-12 mx-auto mb-4 text-slate-300 dark:text-slate-600" />
            <h3 className="text-base lg:text-lg font-medium mb-2">Nenhuma entrada ainda</h3>
            <p className="text-sm text-slate-500 dark:text-dark-muted">
              Clique em "Nova Anotacao" para registrar sua primeira reflexao!
            </p>
          </Card>
        )}
      </div>

      {/* Mood Selection Modal */}
      <Modal
        isOpen={showMoodModal}
        onClose={() => setShowMoodModal(false)}
        title="Como voce esta se sentindo?"
      >
        <div className="space-y-4 lg:space-y-6">
          <p className="text-sm text-slate-500 dark:text-dark-muted">
            Selecione o humor que melhor representa como voce esta hoje:
          </p>

          <div className="grid grid-cols-5 gap-2 lg:gap-3">
            {moods.map(mood => (
              <button
                key={mood.value}
                onClick={() => setSelectedMood(mood.value)}
                className={`flex flex-col items-center gap-1 lg:gap-2 p-2 lg:p-4 rounded-xl transition-all ${
                  selectedMood === mood.value
                    ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500'
                    : 'bg-slate-100 dark:bg-dark-border hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                <span className="text-2xl lg:text-4xl">{mood.emoji}</span>
                <span className="text-[10px] lg:text-xs font-medium">{mood.label}</span>
              </button>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowMoodModal(false)}
              className="btn btn-secondary flex-1"
            >
              Cancelar
            </button>
            <button
              onClick={handleCompleteSave}
              className="btn btn-primary flex-1 flex items-center justify-center gap-2"
            >
              <Smile className="w-4 h-4 lg:w-5 lg:h-5" />
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
