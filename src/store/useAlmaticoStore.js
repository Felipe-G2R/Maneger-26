import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useAlmaticoStore = create((set, get) => ({
  entries: [],
  stats: null,
  loading: false,
  error: null,

  // Estatisticas computadas (funções)
  getTotalLeituras: () => {
    return get().entries.filter(e => e.passagem).length
  },

  getTotalOracoes: () => {
    return get().entries.filter(e => e.oracao).length
  },

  getSequenciaDias: () => {
    return get().stats?.sequencia_dias || 0
  },

  // Carregar entradas do usuario
  fetchEntries: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    set({ loading: true, error: null })

    try {
      // Carregar entradas
      const { data: entriesData, error: entriesError } = await supabase
        .from('almatico_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (entriesError) throw entriesError

      // Carregar stats
      const { data: statsData } = await supabase
        .from('almatico_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      set({
        entries: entriesData || [],
        stats: statsData,
        loading: false
      })
    } catch (error) {
      console.error('Erro ao carregar almatico:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Adicionar entrada
  addEntry: async (entry) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      // Upload de audio se existir
      let audioUrl = entry.audioURL

      if (entry.audioBlob) {
        const fileName = `${user.id}/almatico_${Date.now()}.webm`

        const { error: uploadError } = await supabase.storage
          .from('audio-recordings')
          .upload(fileName, entry.audioBlob, {
            contentType: 'audio/webm'
          })

        if (uploadError) throw uploadError

        const { data: urlData } = supabase.storage
          .from('audio-recordings')
          .getPublicUrl(fileName)

        audioUrl = urlData.publicUrl
      }

      const { data, error } = await supabase
        .from('almatico_entries')
        .insert([{
          user_id: user.id,
          date: new Date().toISOString().split('T')[0],
          passagem: entry.passagem,
          versiculo: entry.versiculo,
          oracao: entry.oracao,
          audio_url: audioUrl,
          sentimento: entry.sentimento
        }])
        .select()
        .single()

      if (error) throw error

      // Recarregar stats apos adicionar (trigger atualiza automaticamente)
      const { data: statsData } = await supabase
        .from('almatico_stats')
        .select('*')
        .eq('user_id', user.id)
        .single()

      set(state => ({
        entries: [data, ...state.entries],
        stats: statsData
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
        .from('almatico_entries')
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
      const entry = get().entries.find(e => e.id === id)

      // Deletar audio do storage se existir
      if (entry?.audio_url) {
        const path = entry.audio_url.split('/').slice(-2).join('/')
        await supabase.storage.from('audio-recordings').remove([path])
      }

      const { error } = await supabase
        .from('almatico_entries')
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

  // Obter estatísticas de sentimento
  getSentimentoStats: () => {
    const entries = get().entries
    const stats = {
      grato: 0,
      paz: 0,
      esperanca: 0,
      reflexivo: 0,
      arrependido: 0
    }

    entries.forEach(entry => {
      if (entry.sentimento && stats[entry.sentimento] !== undefined) {
        stats[entry.sentimento]++
      }
    })

    return stats
  },

  // Limpar estado
  clearState: () => set({ entries: [], stats: null, loading: false, error: null })
}))
