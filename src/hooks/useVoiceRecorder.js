import { useState, useRef, useCallback } from 'react'

export function useVoiceRecorder() {
  const [isRecording, setIsRecording] = useState(false)
  const [audioURL, setAudioURL] = useState(null)
  const [audioBlob, setAudioBlob] = useState(null)
  const [transcription, setTranscription] = useState('')
  const [isTranscribing, setIsTranscribing] = useState(false)
  const [error, setError] = useState(null)
  const [duration, setDuration] = useState(0)

  const mediaRecorderRef = useRef(null)
  const audioChunksRef = useRef([])
  const recognitionRef = useRef(null)
  const timerRef = useRef(null)

  // Iniciar gravação
  const startRecording = useCallback(async () => {
    try {
      setError(null)
      audioChunksRef.current = []

      // Solicitar permissão do microfone
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })

      // Criar MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      })

      mediaRecorderRef.current = mediaRecorder

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' })
        const audioUrl = URL.createObjectURL(audioBlob)
        setAudioBlob(audioBlob)
        setAudioURL(audioUrl)

        // Parar todas as tracks
        stream.getTracks().forEach(track => track.stop())
      }

      // Iniciar gravação
      mediaRecorder.start(100) // Capturar dados a cada 100ms
      setIsRecording(true)
      setDuration(0)

      // Timer para duração
      timerRef.current = setInterval(() => {
        setDuration(prev => prev + 1)
      }, 1000)

      // Iniciar reconhecimento de voz (Web Speech API)
      try {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
          const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
          const recognition = new SpeechRecognition()

          recognition.lang = 'pt-BR'
          recognition.continuous = true
          recognition.interimResults = true

          recognition.onresult = (event) => {
            let finalTranscript = ''

            for (let i = event.resultIndex; i < event.results.length; i++) {
              const transcript = event.results[i][0].transcript
              if (event.results[i].isFinal) {
                finalTranscript += transcript + ' '
              }
            }

            if (finalTranscript) {
              setTranscription(prev => prev + finalTranscript)
            }
          }

          recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error)
            // Ignorar erros comuns que nao afetam a gravacao
            if (event.error !== 'no-speech' && event.error !== 'aborted') {
              console.warn('Transcricao automatica indisponivel:', event.error)
            }
            setIsTranscribing(false)
          }

          recognition.onend = () => {
            // Reiniciar se ainda estiver gravando
            if (mediaRecorderRef.current?.state === 'recording') {
              try {
                recognition.start()
              } catch (e) {
                console.warn('Nao foi possivel reiniciar transcricao')
              }
            }
          }

          recognitionRef.current = recognition
          recognition.start()
          setIsTranscribing(true)
        } else {
          console.warn('Web Speech API nao suportada neste navegador')
        }
      } catch (speechError) {
        console.warn('Transcricao nao disponivel:', speechError)
      }

    } catch (err) {
      setError('Erro ao acessar o microfone: ' + err.message)
      console.error('Error starting recording:', err)
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

      if (recognitionRef.current) {
        recognitionRef.current.stop()
        setIsTranscribing(false)
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
    isTranscribing,
    error,
    duration,
    formattedDuration: formatDuration(duration),
    startRecording,
    stopRecording,
    clearRecording,
    setTranscription
  }
}
