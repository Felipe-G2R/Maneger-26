import { useState } from 'react'
import { PenLine, Save, X } from 'lucide-react'
import { Card } from '../common'

export function DiaryForm({ onSave }) {
  const [isOpen, setIsOpen] = useState(false)
  const [content, setContent] = useState('')

  const handleSave = () => {
    if (content.trim()) {
      onSave?.({
        transcription: content.trim()
      })
      setContent('')
      setIsOpen(false)
    }
  }

  const handleCancel = () => {
    setContent('')
    setIsOpen(false)
  }

  const canSave = content.trim().length > 0

  if (!isOpen) {
    return (
      <Card className="text-center py-6 lg:py-8">
        <button
          onClick={() => setIsOpen(true)}
          className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:scale-105 transition-all"
        >
          <PenLine className="w-5 h-5" />
          Nova Anotacao
        </button>
        <p className="text-xs lg:text-sm text-slate-500 dark:text-dark-muted mt-3">
          Registre suas reflexoes e pensamentos do dia
        </p>
      </Card>
    )
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-base lg:text-lg font-bold">Nova Anotacao</h3>
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border transition-colors"
        >
          <X className="w-5 h-5 text-slate-500" />
        </button>
      </div>

      <div>
        <label className="label text-sm">
          O que voce quer registrar hoje?
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="input min-h-[150px] lg:min-h-[200px] resize-none text-sm"
          placeholder="Escreva suas reflexoes, pensamentos, gratidao, aprendizados..."
          autoFocus
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={handleCancel}
          className="btn btn-secondary flex-1"
        >
          Cancelar
        </button>
        <button
          onClick={handleSave}
          disabled={!canSave}
          className={`btn flex-1 flex items-center justify-center gap-2 ${
            canSave
              ? 'btn-primary'
              : 'bg-slate-300 dark:bg-slate-600 cursor-not-allowed text-slate-500'
          }`}
        >
          <Save className="w-4 h-4" />
          Salvar
        </button>
      </div>
    </Card>
  )
}
