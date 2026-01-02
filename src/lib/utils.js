import { format, formatDistanceToNow, isToday, isYesterday, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns'
import { ptBR } from 'date-fns/locale'

// Formatar data
export function formatDate(date, formatStr = 'dd/MM/yyyy') {
  return format(new Date(date), formatStr, { locale: ptBR })
}

// Data relativa (há 2 dias, ontem, etc)
export function formatRelativeDate(date) {
  const d = new Date(date)
  if (isToday(d)) return 'Hoje'
  if (isYesterday(d)) return 'Ontem'
  return formatDistanceToNow(d, { addSuffix: true, locale: ptBR })
}

// Calcular porcentagem de progresso
export function calculateProgress(current, target) {
  if (!target || target === 0) return 0
  const progress = (current / target) * 100
  return Math.min(Math.max(progress, 0), 100)
}

// Formatar número com separador de milhares
export function formatNumber(num) {
  return new Intl.NumberFormat('pt-BR').format(num)
}

// Formatar moeda
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

// Obter cor da categoria
export function getCategoryColor(category) {
  const colors = {
    fisico: '#EF4444',
    intelectual: '#3B82F6',
    almatico: '#A855F7',
    financeiro: '#10B981',
    social: '#F59E0B'
  }
  return colors[category] || '#6366F1'
}

// Obter nome da categoria em português
export function getCategoryName(category) {
  const names = {
    fisico: 'Físico',
    intelectual: 'Intelectual',
    almatico: 'Almático',
    financeiro: 'Financeiro',
    social: 'Social'
  }
  return names[category] || category
}

// Obter ícone da categoria
export function getCategoryIcon(category) {
  const icons = {
    fisico: 'Dumbbell',
    intelectual: 'Brain',
    almatico: 'Heart',
    financeiro: 'DollarSign',
    social: 'Users'
  }
  return icons[category] || 'Target'
}

// Obter emoji do humor
export function getMoodEmoji(mood) {
  const emojis = {
    otimo: '😄',
    bom: '🙂',
    neutro: '😐',
    ruim: '😕',
    pessimo: '😢'
  }
  return emojis[mood] || '😐'
}

// Obter nome do humor
export function getMoodName(mood) {
  const names = {
    otimo: 'Ótimo',
    bom: 'Bom',
    neutro: 'Neutro',
    ruim: 'Ruim',
    pessimo: 'Péssimo'
  }
  return names[mood] || mood
}

// Gerar ID único
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

// Período da semana atual
export function getCurrentWeek() {
  const now = new Date()
  return {
    start: startOfWeek(now, { locale: ptBR }),
    end: endOfWeek(now, { locale: ptBR })
  }
}

// Período do mês atual
export function getCurrentMonth() {
  const now = new Date()
  return {
    start: startOfMonth(now),
    end: endOfMonth(now)
  }
}

// Calcular dias restantes no ano
export function getDaysRemainingInYear() {
  const now = new Date()
  const endOfYear = new Date(now.getFullYear(), 11, 31)
  const diffTime = endOfYear - now
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

// Calcular progresso geral
export function calculateOverallProgress(goals) {
  if (!goals || goals.length === 0) return 0

  const totalProgress = goals.reduce((sum, goal) => {
    return sum + calculateProgress(goal.current_value, goal.target_value)
  }, 0)

  return totalProgress / goals.length
}

// Agrupar metas por categoria
export function groupGoalsByCategory(goals) {
  return goals.reduce((groups, goal) => {
    const category = goal.category
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(goal)
    return groups
  }, {})
}

// Calcular progresso por categoria
export function calculateCategoryProgress(goals) {
  const grouped = groupGoalsByCategory(goals)

  return Object.entries(grouped).map(([category, categoryGoals]) => ({
    category,
    name: getCategoryName(category),
    color: getCategoryColor(category),
    progress: calculateOverallProgress(categoryGoals),
    goalsCount: categoryGoals.length,
    completedCount: categoryGoals.filter(g =>
      calculateProgress(g.current_value, g.target_value) >= 100
    ).length
  }))
}
