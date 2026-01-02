import { Trash2, Calendar, Clock } from 'lucide-react'
import { Card } from '../common'
import { useDiaryStore } from '../../store/useDiaryStore'
import { formatDate, getMoodEmoji, getMoodName } from '../../lib/utils'

export function DiaryEntry({ entry }) {
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
        className="absolute top-3 right-3 lg:top-4 lg:right-4 p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/20 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-4 h-4 text-red-500" />
      </button>

      {/* Header */}
      <div className="flex items-start gap-3 lg:gap-4 mb-3 lg:mb-4 pr-10 lg:pr-12">
        {/* Mood */}
        {entry.mood && (
          <div className="w-10 h-10 lg:w-14 lg:h-14 rounded-xl bg-slate-100 dark:bg-dark-border flex items-center justify-center text-xl lg:text-3xl flex-shrink-0">
            {getMoodEmoji(entry.mood)}
          </div>
        )}

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs lg:text-sm text-slate-500 dark:text-dark-muted mb-1">
            <Calendar className="w-3 h-3 lg:w-4 lg:h-4" />
            <span>{formatDate(entry.date, 'EEEE, dd MMM yyyy')}</span>
          </div>

          {entry.mood && (
            <span className="inline-block px-2 lg:px-3 py-0.5 lg:py-1 rounded-full text-[10px] lg:text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400">
              {getMoodName(entry.mood)}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      {entry.transcription && (
        <div>
          <p className="text-sm lg:text-base text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
            {entry.transcription}
          </p>
        </div>
      )}

      {/* Timestamp */}
      <div className="mt-3 lg:mt-4 pt-3 lg:pt-4 border-t border-slate-200 dark:border-dark-border flex items-center gap-2 text-[10px] lg:text-xs text-slate-400">
        <Clock className="w-3 h-3" />
        <span>Criado em {formatDate(entry.created_at, 'dd/MM/yyyy HH:mm')}</span>
      </div>
    </Card>
  )
}
