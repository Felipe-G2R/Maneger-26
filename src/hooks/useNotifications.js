import { useEffect, useCallback } from 'react'
import { useGoalStore } from '../store/useGoalStore'
import { useAppStore } from '../store/useAppStore'
import { calculateProgress, getCategoryName } from '../lib/utils'

export function useNotifications() {
  const { goals } = useGoalStore()
  const { preferences, addNotification } = useAppStore()

  // Solicitar permissao de notificacao
  const requestPermission = useCallback(async () => {
    if (!('Notification' in window)) {
      console.log('Este navegador nao suporta notificacoes')
      return false
    }

    if (Notification.permission === 'granted') {
      return true
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }

    return false
  }, [])

  // Enviar notificacao do sistema
  const sendSystemNotification = useCallback((title, body, icon = '/favicon.svg') => {
    if (Notification.permission === 'granted') {
      new Notification(title, {
        body,
        icon,
        badge: icon,
        tag: 'maneger-26',
        requireInteraction: false
      })
    }
  }, [])

  // Enviar notificacao in-app
  const sendAppNotification = useCallback((type, title, message) => {
    addNotification({
      type, // 'success' | 'warning' | 'info' | 'error'
      title,
      message,
      timestamp: new Date().toISOString()
    })
  }, [addNotification])

  // Verificar metas que precisam de atencao
  const checkGoalsStatus = useCallback(() => {
    const now = new Date()
    const alerts = []

    goals.forEach(goal => {
      const progress = calculateProgress(goal.current_value, goal.target_value)
      const deadline = new Date(goal.deadline)
      const daysUntilDeadline = Math.ceil((deadline - now) / (1000 * 60 * 60 * 24))

      // Meta quase no prazo (menos de 30 dias)
      if (daysUntilDeadline <= 30 && daysUntilDeadline > 0 && progress < 90) {
        alerts.push({
          type: 'warning',
          title: 'Meta proxima do prazo',
          message: `"${goal.title}" vence em ${daysUntilDeadline} dias e esta em ${progress.toFixed(0)}%`
        })
      }

      // Meta com progresso muito baixo
      const expectedProgress = ((365 - daysUntilDeadline) / 365) * 100
      if (progress < expectedProgress * 0.5 && progress < 50) {
        alerts.push({
          type: 'info',
          title: 'Meta precisa de atencao',
          message: `"${goal.title}" esta ${(expectedProgress - progress).toFixed(0)}% atras do esperado`
        })
      }

      // Meta completada
      if (progress >= 100) {
        alerts.push({
          type: 'success',
          title: 'Parabens!',
          message: `Voce completou a meta "${goal.title}"!`
        })
      }
    })

    return alerts
  }, [goals])

  // Lembrete diario
  const sendDailyReminder = useCallback(() => {
    const hour = new Date().getHours()

    if (hour >= 8 && hour <= 10) {
      sendSystemNotification(
        'Bom dia! Hora de registrar seu progresso',
        'Comece o dia atualizando suas metas no Maneger 26'
      )
    } else if (hour >= 18 && hour <= 20) {
      sendSystemNotification(
        'Fim do dia! Como foi seu progresso?',
        'Registre suas conquistas de hoje no Maneger 26'
      )
    }
  }, [sendSystemNotification])

  // Notificacoes motivacionais
  const getMotivationalMessage = useCallback(() => {
    const messages = [
      'Pequenos passos levam a grandes conquistas!',
      'Voce esta mais perto do seu objetivo do que ontem.',
      'Consistencia e a chave do sucesso!',
      'Cada dia e uma nova oportunidade de progredir.',
      'Acredite no processo e continue em frente!',
      'O sucesso e a soma de pequenos esforcos diarios.',
      'Voce e capaz de conquistar suas metas!',
      'Mantenha o foco, o resultado vem!'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }, [])

  return {
    requestPermission,
    sendSystemNotification,
    sendAppNotification,
    checkGoalsStatus,
    sendDailyReminder,
    getMotivationalMessage
  }
}
