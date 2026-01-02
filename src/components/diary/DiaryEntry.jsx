import { Trash2, Calendar, Clock } from 'lucide-react'
import { useRef } from 'react'
import { Card } from '../common'
import { useDiaryStore } from '../../store/useDiaryStore'
import { formatDate, getMoodEmoji, getMoodName } from '../../lib/utils'

export function DiaryEntry({ entry }) {
  const audioRef = useRef(null)
  const { deleteEntry } = useDiaryStore()

  const handleDelete = () => {
    if (confirm('Tem certeza que deseja excluir esta entrada?')) {
      deleteEntry(entry.id)
    }
  }

  return (
    <Card className="relative group">
      {/* Delete Button */}
      <button
        onClick={handleDelete}
        className="absolute top-4 right-4 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-4 mb-4 pr-12">
        {/* Mood */}
        {entry.mood && (
          <div className="w-14 h-14 rounded-xl bg-slate-100 dark:bg-dark-border flex items-center justify-center text-3xl flex-shrink-0">
            {getMoodEmoji(entry.mood)}
          </div>
        )}

        <div className="flex-1">
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-dark-muted mb-1">
            <Calendar className="w-4 h-4" />
            <span>{formatDate(entry.date, 'EEEE, dd MMMM yyyy')}</span>
          </div>

          {entry.mood && (
            <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              Humor: {getMoodName(entry.mood)}
            </span>
          )}
        </div>
      </div>

      {/* Audio Player */}
      {entry.audio_url && (
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50 mb-4">
          <div className="text-sm font-medium mb-2">Audio do Diario</div>
          <audio
            ref={audioRef}
            src={entry.audio_url}
            controls
            className="w-full"
            onError={(e) => console.error('Erro ao carregar audio:', e)}
          />
        </div>
      )}

      {/* Transcription */}
      {entry.transcription && (
        <div>
          <label className="label">Transcricao</label>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {entry.transcription}
          </p>
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border flex items-center gap-2 text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>Criado em {formatDate(entry.created_at, 'dd/MM/yyyy HH:mm')}</span>
      </div>
    </Card>
  )
}
