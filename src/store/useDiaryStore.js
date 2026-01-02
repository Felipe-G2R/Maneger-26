import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useDiaryStore = create((set, get) => ({
  entries: [],
  loading: false,
  error: null,

  // Carregar entradas do usuario
  fetchEntries: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      set({ entries: data || [], loading: false })
    } catch (error) {
      console.error('Erro ao carregar diario:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Adicionar entrada
  addEntry: async (entry) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .insert([{
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          ...entry
        }])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        entries: [data, ...state.entries]
      }))

      return data
    } catch (error) {
      console.error('Erro ao adicionar entrada:', error)
      set({ error: error.message })
      return null
    }
  },

  // Atualizar entrada
  updateEntry: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('diary_entries')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        entries: state.entries.map(entry =>
          entry.id === id ? data : entry
        )
      }))

      return data
    } catch (error) {
      console.error('Erro ao atualizar entrada:', error)
      set({ error: error.message })
      return null
    }
  },

  // Deletar entrada
  deleteEntry: async (id) => {
    try {
      const { error } = await supabase
        .from('diary_entries')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        entries: state.entries.filter(entry => entry.id !== id)
      }))

      return true
    } catch (error) {
      console.error('Erro ao deletar entrada:', error)
      set({ error: error.message })
      return false
    }
  },

  // Obter entradas por data
  getEntriesByDate: (date) => {
    return get().entries.filter(entry => entry.date === date)
  },

  // Obter entrada de hoje
  getTodayEntry: () => {
    const today = new Date().toISOString().split('T')[0]
    return get().entries.find(entry => entry.date === today)
  },

  // Obter estatísticas de humor
  getMoodStats: () => {
    const entries = get().entries
    const moodCounts = {
      otimo: 0,
      bom: 0,
      neutro: 0,
      ruim: 0,
      pessimo: 0
    }

    entries.forEach(entry => {
      if (entry.mood && moodCounts[entry.mood] !== undefined) {
        moodCounts[entry.mood]++
      }
    })

    return moodCounts
  },

  // Limpar estado
  clearState: () => set({ entries: [], loading: false, error: null })
}))
