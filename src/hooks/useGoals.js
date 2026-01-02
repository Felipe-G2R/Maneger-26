import { useMemo, useEffect } from 'react'
import { useGoalStore } from '../store/useGoalStore'
import {
  calculateProgress,
  calculateOverallProgress,
  calculateCategoryProgress,
  groupGoalsByCategory
} from '../lib/utils'

export function useGoals() {
  const {
    goals,
    progressLogs,
    loading,
    error,
    fetchGoals,
    addGoal,
    updateGoal,
    deleteGoal,
    logProgress,
    fetchProgressLogs
  } = useGoalStore()

  // Carregar metas ao montar
  useEffect(() => {
    fetchGoals()
  }, [fetchGoals])

  // Metas agrupadas por categoria
  const goalsByCategory = useMemo(() => {
    return groupGoalsByCategory(goals)
  }, [goals])

  // Progresso por categoria
  const categoryProgress = useMemo(() => {
    return calculateCategoryProgress(goals)
  }, [goals])

  // Progresso geral
  const overallProgress = useMemo(() => {
    return calculateOverallProgress(goals)
  }, [goals])

  // Estatísticas
  const stats = useMemo(() => {
    const completed = goals.filter(g =>
      calculateProgress(g.current_value, g.target_value) >= 100
    ).length

    const inProgress = goals.filter(g => {
      const progress = calculateProgress(g.current_value, g.target_value)
      return progress > 0 && progress < 100
    }).length

    const notStarted = goals.filter(g =>
      calculateProgress(g.current_value, g.target_value) === 0
    ).length

    return {
      total: goals.length,
      completed,
      inProgress,
      notStarted,
      completionRate: goals.length > 0 ? (completed / goals.length) * 100 : 0
    }
  }, [goals])

  // Metas próximas do deadline
  const urgentGoals = useMemo(() => {
    const now = new Date()
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)

    return goals.filter(goal => {
      if (!goal.deadline) return false
      const deadline = new Date(goal.deadline)
      const progress = calculateProgress(goal.current_value, goal.target_value)
      return deadline <= thirtyDaysFromNow && progress < 100
    }).sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
  }, [goals])

  // Metas que precisam de atenção (baixo progresso)
  const attentionNeeded = useMemo(() => {
    const expectedProgress = getExpectedProgress()

    return goals.filter(goal => {
      const progress = calculateProgress(goal.current_value, goal.target_value)
      return progress < expectedProgress * 0.5 // Menos de 50% do esperado
    })
  }, [goals])

  return {
    goals,
    goalsByCategory,
    categoryProgress,
    overallProgress,
    stats,
    urgentGoals,
    attentionNeeded,
    progressLogs,
    loading,
    error,
    addGoal,
    updateGoal,
    deleteGoal,
    logProgress,
    fetchGoals,
    fetchProgressLogs,
    getGoalProgress: (goal) => calculateProgress(goal.current_value, goal.target_value)
  }
}

// Calcular progresso esperado baseado no tempo
function getExpectedProgress() {
  const now = new Date()
  const startOfYear = new Date(now.getFullYear(), 0, 1)
  const endOfYear = new Date(now.getFullYear(), 11, 31)

  const totalDays = (endOfYear - startOfYear) / (1000 * 60 * 60 * 24)
  const daysPassed = (now - startOfYear) / (1000 * 60 * 60 * 24)

  return (daysPassed / totalDays) * 100
}
