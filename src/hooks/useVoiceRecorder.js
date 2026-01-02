import { useState, useRef, useCallback } from 'react'

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [error, setError] = useState(null)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const timerRef = useRef(null)
  const streamRef = useRef(null)

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      audioChunksRef.current = []

      // Solicitar permissão do microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Verificar mimeType suportado
      let mimeType = 'audio/webm;codecs=opus'
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm'
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4'
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '' // Usar padrão do navegador
          }
        }
      }

      // Criar MediaRecorder
      const options = mimeType ? { mimeType } : {}
      const mediaRecorder = new MediaRecorder(stream, options)
      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const blob = new Blob(audioChunksRef.current, {
          type: mimeType || 'audio/webm'
        })
        const url = URL.createObjectURL(blob)
        setAudioBlob(blob)
        setAudioURL(url)

        // Parar todas as tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
      }

      // Iniciar gravação
      mediaRecorder.start(100)
      setIsRecording(true)
      setDuration(0)

      // Timer para duração
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

    } catch (err) {
      console.error('Error starting recording:', err)
      if (err.name === 'NotAllowedError') {
        setError('Permissao de microfone negada. Por favor, permita o acesso ao microfone.')
      } else if (err.name === 'NotFoundError') {
        setError('Nenhum microfone encontrado. Conecte um microfone e tente novamente.')
      } else {
        setError('Erro ao acessar o microfone: ' + err.message)
      }
    }
  }, [])

  // Parar gravação
  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isRecording])

  // Limpar gravação
  const clearRecording = useCallback(() => {
    if (audioURL) {
      URL.revokeObjectURL(audioURL)
    }
    setAudioURL(null)
    setAudioBlob(null)
    setTranscription('')
    setDuration(0)
    setError(null)
  }, [audioURL])

  // Formatar duração
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return {
    isRecording,
    audioURL,
    audioBlob,
    transcription,
    error,
    duration,
    formattedDuration: formatDuration(duration),
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  }
}
