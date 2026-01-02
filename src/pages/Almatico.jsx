import { useState, useEffect } from 'react'
import {
  Book,
  Heart,
  Mic,
  MicOff,
  Square,
  Save,
  Trash2,
  Calendar,
  BookOpen,
  Flame,
  Sun,
  Sparkles,
  HeartHandshake,
  Clock,
  ChevronDown,
  ChevronUp,
  Play,
  Pause,
  X,
  Loader2
} from 'lucide-react'
import { Card, Modal } from '../components/common'
import { useAlmaticoStore } from '../store/useAlmaticoStore'
import { useVoiceRecorder } from '../hooks/useVoiceRecorder'

const sentimentos = [
  { value: 'grato', label: 'Grato', emoji: '🙏', color: '#22c55e' },
  { value: 'paz', label: 'Em Paz', emoji: '☮️', color: '#3b82f6' },
  { value: 'esperanca', label: 'Esperancoso', emoji: '✨', color: '#f97316' },
  { value: 'reflexivo', label: 'Reflexivo', emoji: '🤔', color: '#8b5cf6' },
  { value: 'arrependido', label: 'Arrependido', emoji: '💔', color: '#ef4444' }
]

const livrosBiblia = [
  'Genesis', 'Exodo', 'Levitico', 'Numeros', 'Deuteronomio',
  'Josue', 'Juizes', 'Rute', '1 Samuel', '2 Samuel',
  '1 Reis', '2 Reis', '1 Cronicas', '2 Cronicas', 'Esdras',
  'Neemias', 'Ester', 'Jo', 'Salmos', 'Proverbios',
  'Eclesiastes', 'Canticos', 'Isaias', 'Jeremias', 'Lamentacoes',
  'Ezequiel', 'Daniel', 'Oseias', 'Joel', 'Amos',
  'Obadias', 'Jonas', 'Miqueias', 'Naum', 'Habacuque',
  'Sofonias', 'Ageu', 'Zacarias', 'Malaquias',
  'Mateus', 'Marcos', 'Lucas', 'Joao', 'Atos',
  'Romanos', '1 Corintios', '2 Corintios', 'Galatas', 'Efesios',
  'Filipenses', 'Colossenses', '1 Tessalonicenses', '2 Tessalonicenses',
  '1 Timoteo', '2 Timoteo', 'Tito', 'Filemom', 'Hebreus',
  'Tiago', '1 Pedro', '2 Pedro', '1 Joao', '2 Joao',
  '3 Joao', 'Judas', 'Apocalipse'
]

function VoiceRecorderAlmatico({ onSave, title = "Gravar Oracao" }) {
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
        transcription
      })
      clearRecording()
    }
  }

  return (
    <Card className="space-y-4 border-l-4 border-l-purple-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold flex items-center gap-2">
          <HeartHandshake className="w-5 h-5 text-purple-500" />
          {title}
        </h3>
        {isRecording && (
          <div className="flex items-center gap-2 text-red-500">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
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
            className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 transition-all"
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
          Clique para gravar sua oracao ou reflexao espiritual.
          Converse com Deus livremente.
        </p>
      )}

      {isRecording && (
        <p className="text-center text-sm text-purple-500">
          Gravando... Fale com Deus, Ele esta ouvindo.
          {isTranscribing && ' Transcrevendo...'}
        </p>
      )}

      {/* Audio Player */}
      {audioURL && (
        <div className="pt-4 border-t border-slate-200 dark:border-dark-border">
          <label className="block text-sm font-medium mb-2">Audio da Oracao</label>
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
          <label className="block text-sm font-medium mb-2">
            Transcricao
            {isTranscribing && (
              <span className="ml-2 text-xs text-purple-500 animate-pulse">
                (transcrevendo...)
              </span>
            )}
          </label>
          <textarea
            value={transcription}
            onChange={(e) => setTranscription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[120px] resize-none"
            placeholder="A transcricao aparecera aqui..."
          />
        </div>
      )}
    </Card>
  )
}

function AlmaticoEntry({ entry, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const sentimento = sentimentos.find(s => s.value === entry.sentimento)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    })
  }

  const formatTime = (dateStr) => {
    const date = new Date(dateStr)
    return date.toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-dark-border/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
            <Book className="w-6 h-6 text-purple-500" />
          </div>
          <div className="text-left">
            <p className="font-bold">{entry.passagem || 'Oracao'}</p>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(entry.created_at)}</span>
              <Clock className="w-3 h-3 ml-1" />
              <span>{formatTime(entry.created_at)}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {sentimento && (
            <span className="text-2xl">{sentimento.emoji}</span>
          )}
          {expanded ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-4">
          {/* Passagem Biblica */}
          {entry.passagem && (
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-400">Leitura Biblica</span>
              </div>
              <p className="text-sm text-amber-800 dark:text-amber-300">{entry.passagem}</p>
              {entry.versiculo && (
                <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 italic">"{entry.versiculo}"</p>
              )}
            </div>
          )}

          {/* Oracao/Transcricao */}
          {entry.oracao && (
            <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-500/30">
              <div className="flex items-center gap-2 mb-2">
                <HeartHandshake className="w-4 h-4 text-purple-600" />
                <span className="text-sm font-semibold text-purple-700 dark:text-purple-400">Oracao / Reflexao</span>
              </div>
              <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{entry.oracao}</p>
            </div>
          )}

          {/* Audio */}
          {entry.audioURL && (
            <div>
              <label className="block text-sm font-medium mb-2">Audio</label>
              <audio src={entry.audioURL} controls className="w-full rounded-xl" />
            </div>
          )}

          {/* Sentimento */}
          {sentimento && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Sentimento:</span>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{ backgroundColor: sentimento.color + '20', color: sentimento.color }}
              >
                {sentimento.emoji} {sentimento.label}
              </span>
            </div>
          )}

          {/* Delete Button */}
          <button
            onClick={() => onDelete(entry.id)}
            className="flex items-center gap-2 text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Excluir entrada
          </button>
        </div>
      )}
    </Card>
  )
}

export function Almatico() {
  const {
    entries,
    addEntry,
    deleteEntry,
    getTotalLeituras,
    getTotalOracoes,
    getSequenciaDias,
    getSentimentoStats,
    fetchEntries,
    loading
  } = useAlmaticoStore()

  const [showModal, setShowModal] = useState(false)
  const [selectedSentimento, setSelectedSentimento] = useState('grato')
  const [passagem, setPassagem] = useState('')
  const [versiculo, setVersiculo] = useState('')
  const [pendingOracao, setPendingOracao] = useState(null)

  useEffect(() => {
    fetchEntries()
  }, [fetchEntries])

  const totalLeituras = getTotalLeituras()
  const totalOracoes = getTotalOracoes()
  const sequenciaDias = getSequenciaDias()
  const sentimentoStats = getSentimentoStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
      </div>
    )
  }

  const handleSaveOracao = (data) => {
    setPendingOracao(data)
    setShowModal(true)
  }

  const handleCompleteSave = () => {
    addEntry({
      passagem: passagem,
      versiculo: versiculo,
      oracao: pendingOracao?.transcription || '',
      audioURL: pendingOracao?.audioURL || '',
      sentimento: selectedSentimento
    })

    // Reset
    setPassagem('')
    setVersiculo('')
    setPendingOracao(null)
    setSelectedSentimento('grato')
    setShowModal(false)
  }

  const handleQuickSave = () => {
    if (passagem || versiculo) {
      setShowModal(true)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">
          <span className="gradient-text">Almatico</span>
        </h1>
        <p className="text-slate-600 dark:text-dark-muted">
          Seu diario espiritual - Leia a Palavra e converse com Deus
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="text-center border-l-4 border-l-amber-500">
          <BookOpen className="w-8 h-8 text-amber-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalLeituras}</p>
          <p className="text-xs text-slate-500 dark:text-dark-muted">Leituras</p>
        </Card>
        <Card className="text-center border-l-4 border-l-purple-500">
          <HeartHandshake className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{totalOracoes}</p>
          <p className="text-xs text-slate-500 dark:text-dark-muted">Oracoes</p>
        </Card>
        <Card className="text-center border-l-4 border-l-orange-500">
          <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
          <p className="text-2xl font-bold">{sequenciaDias}</p>
          <p className="text-xs text-slate-500 dark:text-dark-muted">Dias seguidos</p>
        </Card>
      </div>

      {/* Sentimento Stats */}
      <Card>
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Heart className="w-5 h-5 text-pink-500" />
          Seus Sentimentos
        </h3>
        <div className="flex flex-wrap gap-2">
          {sentimentos.map(sent => (
            <div
              key={sent.value}
              className="flex items-center gap-2 px-3 py-2 rounded-xl"
              style={{ backgroundColor: sent.color + '15' }}
            >
              <span className="text-xl">{sent.emoji}</span>
              <span className="text-sm font-medium" style={{ color: sent.color }}>
                {sentimentoStats[sent.value] || 0}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Leitura Biblica */}
      <Card className="border-l-4 border-l-amber-500">
        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
          <Book className="w-5 h-5 text-amber-500" />
          Leitura Biblica de Hoje
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Passagem Lida</label>
            <input
              type="text"
              value={passagem}
              onChange={(e) => setPassagem(e.target.value)}
              placeholder="Ex: Salmos 23, Joao 3:16, Mateus 5-7..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Versiculo que Tocou seu Coracao (opcional)</label>
            <textarea
              value={versiculo}
              onChange={(e) => setVersiculo(e.target.value)}
              placeholder="Escreva aqui o versiculo que mais te marcou hoje..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-dark-border bg-transparent focus:outline-none focus:ring-2 focus:ring-amber-500 min-h-[80px] resize-none"
            />
          </div>

          {(passagem || versiculo) && !pendingOracao && (
            <button
              onClick={handleQuickSave}
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar apenas Leitura
            </button>
          )}
        </div>
      </Card>

      {/* Gravador de Oracao */}
      <VoiceRecorderAlmatico
        onSave={handleSaveOracao}
        title="Conversar com Deus"
      />

      {/* Entradas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary-500" />
            Historico Espiritual
          </h2>
          <span className="text-sm text-slate-500 dark:text-dark-muted">
            {entries.length} entradas
          </span>
        </div>

        {entries.length > 0 ? (
          <div className="space-y-3">
            {entries.map(entry => (
              <AlmaticoEntry
                key={entry.id}
                entry={entry}
                onDelete={deleteEntry}
              />
            ))}
          </div>
        ) : (
          <Card className="text-center py-12">
            <Sparkles className="w-12 h-12 mx-auto mb-4 text-purple-300" />
            <h3 className="text-lg font-medium mb-2">Comece sua Jornada Espiritual</h3>
            <p className="text-slate-500 dark:text-dark-muted">
              Leia a Biblia, grave suas oracoes e acompanhe seu crescimento com Deus.
            </p>
          </Card>
        )}
      </div>

      {/* Modal de Sentimento */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Como voce esta se sentindo espiritualmente?"
      >
        <div className="space-y-6">
          <p className="text-slate-500 dark:text-dark-muted">
            Selecione o sentimento que melhor descreve seu momento com Deus:
          </p>

          <div className="grid grid-cols-5 gap-2">
            {sentimentos.map(sent => (
              <button
                key={sent.value}
                onClick={() => setSelectedSentimento(sent.value)}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl transition-all ${
                  selectedSentimento === sent.value
                    ? 'ring-2 ring-offset-2'
                    : 'bg-slate-100 dark:bg-dark-border hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
                style={{
                  backgroundColor: selectedSentimento === sent.value ? sent.color + '20' : undefined,
                  ringColor: selectedSentimento === sent.value ? sent.color : undefined
                }}
              >
                <span className="text-3xl">{sent.emoji}</span>
                <span className="text-xs font-medium">{sent.label}</span>
              </button>
            ))}
          </div>

          {/* Resumo */}
          {(passagem || pendingOracao) && (
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-dark-border/50 space-y-2">
              <p className="text-sm font-medium">Resumo da entrada:</p>
              {passagem && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <BookOpen className="w-4 h-4 inline mr-1" />
                  Leitura: {passagem}
                </p>
              )}
              {pendingOracao?.transcription && (
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  <HeartHandshake className="w-4 h-4 inline mr-1" />
                  Oracao gravada
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-slate-50 dark:hover:bg-dark-border transition-colors font-medium"
            >
              Cancelar
            </button>
            <button
              onClick={handleCompleteSave}
              className="flex-1 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              Salvar
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
