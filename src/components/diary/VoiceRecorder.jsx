import { Mic, MicOff, Square, Trash2, Save } from 'lucide-react'
import { useVoiceRecorder } from '../../hooks/useVoiceRecorder'
import { Card } from '../common'

export function VoiceRecorder({ onSave }) {
  const {
    isRecording,
    audioURL,
    transcription,
    isTranscribing,
    error,
    formattedDuration,
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  } = useVoiceRecorder()

  const handleSave = () => {
    if (transcription || audioURL) {
      onSave?.({
        audioURL,
        audioBlob,
        transcription
      })
      clearRecording()
    }
  }

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold">Gravar Reflexao Diaria</h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-500">
            <div className="w-3 h-3 rounded-full bg-red-500 recording-pulse" />
            <span className="font-mono font-medium">{formattedDuration}</span>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      {/* Recording Controls */}
      <div className="flex items-center justify-center gap-4 py-6">
        {!isRecording && !audioURL && (
          <button
            onClick={startRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center text-white shadow-lg shadow-red-500/30 hover:shadow-red-500/50 hover:scale-105 transition-all"
          >
            <Mic className="w-8 h-8" />
          </button>
        )}

        {isRecording && (
          <button
            onClick={stopRecording}
            className="w-20 h-20 rounded-full bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center text-white shadow-lg hover:scale-105 transition-all"
          >
            <Square className="w-8 h-8 fill-current" />
          </button>
        )}

        {audioURL && !isRecording && (
          <div className="flex items-center gap-4">
            <button
              onClick={clearRecording}
              className="w-14 h-14 rounded-full bg-slate-200 dark:bg-dark-border flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors"
            >
              <Trash2 className="w-6 h-6 text-slate-600 dark:text-slate-400" />
            </button>

            <button
              onClick={handleSave}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-105 transition-all"
            >
              <Save className="w-8 h-8" />
            </button>
          </div>
        )}
      </div>

      {/* Instructions */}
      {!isRecording && !audioURL && (
        <p className="text-center text-sm text-slate-500 dark:text-dark-muted">
          Clique no botao acima para comecar a gravar sua reflexao diaria.
          O audio sera transcrito automaticamente.
        </p>
      )}

      {isRecording && (
        <p className="text-center text-sm text-red-500">
          Gravando... Fale suas reflexoes do dia.
          {isTranscribing && ' Transcrevendo em tempo real...'}
        </p>
      )}

      {/* Audio Player */}
      {audioURL && (
        <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
          <label className="label">Audio Gravado</label>
          <audio
            src={audioURL}
            controls
            className="w-full rounded-xl"
          />
        </div>
      )}

      {/* Transcription */}
      {(transcription || isRecording) && (
        <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
          <label className="label">
            Transcricao
            {isTranscribing && (
              <span className="ml-2 text-xs text-primary-500 animate-pulse">
                (transcrevendo...)
              </span>
            )}
          </label>
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="input min-h-[120px] resize-none"
            placeholder="A transcricao aparecera aqui..."
          />
        </div>
      )}
    </Card>
  )
}
