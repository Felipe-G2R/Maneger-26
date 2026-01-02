import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useGoalStore = create((set, get) => ({
  goals: [],
  progressLogs: [],
  loading: false,
  error: null,

  // Carregar metas do usuario
  fetchGoals: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ goals: data || [], loading: false })
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Adicionar meta
  addGoal: async (goal) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('goals')
        .insert([{
          user_id: user.id,
          ...goal,
          current_value: 0
        }])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        goals: [data, ...state.goals]
      }))

      return data
    } catch (error) {
      console.error('Erro ao adicionar meta:', error)
      set({ error: error.message })
      return null
    }
  },

  // Atualizar meta
  updateGoal: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('goals')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        goals: state.goals.map(goal =>
          goal.id === id ? data : goal
        )
      }))

      return data
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      set({ error: error.message })
      return null
    }
  },

  // Deletar meta
  deleteGoal: async (id) => {
    try {
      const { error } = await supabase
        .from('goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        goals: state.goals.filter(goal => goal.id !== id)
      }))

      return true
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
      set({ error: error.message })
      return false
    }
  },

  // Registrar progresso
  logProgress: async (goalId, value, notes = '') => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      // Criar log de progresso
      const { data: logData, error: logError } = await supabase
        .from('progress_logs')
        .insert([{
          user_id: user.id,
          goal_id: goalId,
          value,
          notes
        }])
        .select()
        .single()

      if (logError) throw logError

      // Buscar meta atual
      const goal = get().goals.find(g => g.id === goalId)
      if (goal) {
        // Atualizar valor atual da meta
        const { data: updatedGoal, error: updateError } = await supabase
          .from('goals')
          .update({
            current_value: (goal.current_value || 0) + value,
            updated_at: new Date().toISOString()
          })
          .eq('id', goalId)
          .select()
          .single()

        if (updateError) throw updateError

        set(state => ({
          progressLogs: [logData, ...state.progressLogs],
          goals: state.goals.map(g =>
            g.id === goalId ? updatedGoal : g
          )
        }))
      }

      return logData
    } catch (error) {
      console.error('Erro ao registrar progresso:', error)
      set({ error: error.message })
      return null
    }
  },

  // Carregar logs de progresso
  fetchProgressLogs: async (goalId = null) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      let query = supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', user.id)
        .order('logged_at', { ascending: false })

      if (goalId) {
        query = query.eq('goal_id', goalId)
      }

      const { data, error } = await query

      if (error) throw error

      set({ progressLogs: data || [] })
    } catch (error) {
      console.error('Erro ao carregar logs:', error)
    }
  },

  // Obter metas por categoria
  getGoalsByCategory: (category) => {
    return get().goals.filter(goal => goal.category === category)
  },

  // Limpar estado
  clearState: () => set({ goals: [], progressLogs: [], loading: false, error: null })
}))
