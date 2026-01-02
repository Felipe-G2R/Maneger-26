import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export const useFinanceiroStore = create((set, get) => ({
  transacoes: [],
  metas: [],
  loading: false,
  error: null,

  // Carregar transacoes do usuario
  fetchTransacoes: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    set({ loading: true, error: null })

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: false })

      if (error) throw error

      set({ transacoes: data || [], loading: false })
    } catch (error) {
      console.error('Erro ao carregar transacoes:', error)
      set({ error: error.message, loading: false })
    }
  },

  // Carregar metas financeiras
  fetchMetas: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      set({ metas: data || [] })
    } catch (error) {
      console.error('Erro ao carregar metas:', error)
      set({ error: error.message })
    }
  },

  // Carregar tudo
  fetchAll: async () => {
    await Promise.all([
      get().fetchTransacoes(),
      get().fetchMetas()
    ])
  },

  // Adicionar transacao
  addTransacao: async (transacao) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('financial_transactions')
        .insert([{
          user_id: user.id,
          type: transacao.tipo,
          category_id: transacao.categoria,
          description: transacao.descricao,
          value: transacao.valor,
          date: transacao.data
        }])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        transacoes: [data, ...state.transacoes]
      }))

      return data
    } catch (error) {
      console.error('Erro ao adicionar transacao:', error)
      set({ error: error.message })
      return null
    }
  },

  // Deletar transacao
  deleteTransacao: async (id) => {
    try {
      const { error } = await supabase
        .from('financial_transactions')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        transacoes: state.transacoes.filter(t => t.id !== id)
      }))

      return true
    } catch (error) {
      console.error('Erro ao deletar transacao:', error)
      set({ error: error.message })
      return false
    }
  },

  // Adicionar meta financeira
  addMeta: async (meta) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      const { data, error } = await supabase
        .from('financial_goals')
        .insert([{
          user_id: user.id,
          name: meta.nome,
          target_value: meta.valorMeta,
          current_value: meta.valorAtual || 0,
          color: meta.cor,
          deadline: meta.prazo || null
        }])
        .select()
        .single()

      if (error) throw error

      set(state => ({
        metas: [...state.metas, data]
      }))

      return data
    } catch (error) {
      console.error('Erro ao adicionar meta:', error)
      set({ error: error.message })
      return null
    }
  },

  // Atualizar meta financeira
  updateMeta: async (id, updates) => {
    try {
      const updateData = {}
      if (updates.nome !== undefined) updateData.name = updates.nome
      if (updates.valorMeta !== undefined) updateData.target_value = updates.valorMeta
      if (updates.valorAtual !== undefined) updateData.current_value = updates.valorAtual
      if (updates.cor !== undefined) updateData.color = updates.cor
      if (updates.prazo !== undefined) updateData.deadline = updates.prazo

      const { data, error } = await supabase
        .from('financial_goals')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        metas: state.metas.map(m => m.id === id ? data : m)
      }))

      return data
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
      set({ error: error.message })
      return null
    }
  },

  // Deletar meta financeira
  deleteMeta: async (id) => {
    try {
      const { error } = await supabase
        .from('financial_goals')
        .delete()
        .eq('id', id)

      if (error) throw error

      set(state => ({
        metas: state.metas.filter(m => m.id !== id)
      }))

      return true
    } catch (error) {
      console.error('Erro ao deletar meta:', error)
      set({ error: error.message })
      return false
    }
  },

  // Adicionar valor a meta
  addToMeta: async (metaId, valor) => {
    const meta = get().metas.find(m => m.id === metaId)
    if (!meta) return null

    const novoValor = Math.min((meta.current_value || 0) + valor, meta.target_value)

    return get().updateMeta(metaId, { valorAtual: novoValor })
  },

  // Limpar estado
  clearState: () => set({ transacoes: [], metas: [], loading: false, error: null })
}))
