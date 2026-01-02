import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useGoalStore = create(
  persist(
    (set, get) => ({
      goals: [],
      progressLogs: [],
      loading: false,
      error: null,
      localGoalsMigrated: false,

      // Sincronizar metas locais para o Supabase (migração)
      syncLocalGoalsToSupabase: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        const localGoals = get().goals
        const migrated = get().localGoalsMigrated

        // Se já migrou ou não tem metas locais, não faz nada
        if (migrated || localGoals.length === 0) return

        console.log('Migrando metas locais para o Supabase...')

        try {
          // Buscar metas existentes no Supabase
          const { data: supabaseGoals } = await supabase
            .from('goals')
            .select('title')
            .eq('user_id', user.id)

          const existingTitles = new Set((supabaseGoals || []).map(g => g.title))

          // Filtrar metas locais que não existem no Supabase
          const goalsToMigrate = localGoals.filter(
            goal => !goal.user_id && !existingTitles.has(goal.title)
          )

          if (goalsToMigrate.length > 0) {
            // Preparar metas para inserção (remover ids locais, adicionar user_id)
            const goalsForInsert = goalsToMigrate.map(goal => ({
              user_id: user.id,
              title: goal.title,
              description: goal.description || '',
              category: goal.category || 'personal',
              target_value: goal.target_value || 100,
              current_value: goal.current_value || 0,
              unit: goal.unit || 'unidades',
              deadline: goal.deadline || null,
              priority: goal.priority || 'medium'
            }))

            const { error } = await supabase
              .from('goals')
              .insert(goalsForInsert)

            if (error) {
              console.error('Erro ao migrar metas:', error)
            } else {
              console.log(`${goalsToMigrate.length} metas migradas com sucesso!`)
            }
          }

          set({ localGoalsMigrated: true })
        } catch (error) {
          console.error('Erro na migração:', error)
        }
      },

      // Carregar metas do usuario
      fetchGoals: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          // Se não está logado, mantém as metas locais
          return
        }

        set({ loading: true, error: null })

        try {
          // Primeiro, sincronizar metas locais para o Supabase
          await get().syncLocalGoalsToSupabase()

          const { data, error } = await supabase
            .from('goals')
            .select('*')
            .eq('user_id', user.id)
            .order('created_at', { ascending: false })

          if (error) throw error

          // Mesclar metas do Supabase com as locais (prioridade para Supabase)
          const localGoals = get().goals.filter(g => !g.user_id)
          const mergedGoals = [...(data || []), ...localGoals]

          set({ goals: mergedGoals, loading: false })
        } catch (error) {
          console.error('Erro ao carregar metas:', error)
          set({ error: error.message, loading: false })
          // Em caso de erro, mantém as metas locais
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
      clearState: () => set({ goals: [], progressLogs: [], loading: false, error: null, localGoalsMigrated: false }),

      // Resetar flag de migração (útil para debug)
      resetMigration: () => set({ localGoalsMigrated: false }),

      // Carregar metas iniciais do Projeto 2026
      seedProject2026Goals: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return { success: false, error: 'Usuário não autenticado' }

        const initialGoals = [
          // Físico
          { category: 'fisico', title: 'Emagrecer 10kg', description: 'Perder 10kg de peso corporal ao longo do ano', target_value: 10, unit: 'kg', priority: 'high' },
          { category: 'fisico', title: 'Tonificar barriga', description: 'Definir músculos abdominais com treino e dieta', target_value: 100, unit: '%', priority: 'high' },
          { category: 'fisico', title: 'Ajustar postura corporal', description: 'Corrigir postura corporal para ereta', target_value: 100, unit: '%', priority: 'medium' },
          { category: 'fisico', title: 'Treinar 1h por dia', description: 'Acumular 365 horas de treino no ano', target_value: 365, unit: 'horas', priority: 'high' },
          { category: 'fisico', title: 'Projeto 2k Day', description: 'Correr 2km por dia - 730km no ano todo', target_value: 730, unit: 'km', priority: 'high' },

          // Intelectual
          { category: 'intelectual', title: 'Inglês nível A2', description: 'Ler livros, ouvir músicas, conversar com nativos, consumir aulas e cursos em inglês', target_value: 100, unit: '%', priority: 'high' },
          { category: 'intelectual', title: 'Branding e conteúdo', description: 'Aprender criação de branding e conteúdo para redes sociais', target_value: 100, unit: '%', priority: 'medium' },
          { category: 'intelectual', title: 'Comunicação pessoal', description: 'Melhorar habilidades de comunicação interpessoal', target_value: 100, unit: '%', priority: 'medium' },
          { category: 'intelectual', title: 'APIs e integração', description: 'Aprender criação de APIs e integração de ferramentas para desenvolvimento de software', target_value: 100, unit: '%', priority: 'high' },
          { category: 'intelectual', title: 'Gestão de equipes e networking', description: 'Desenvolver habilidades de gestão de equipes e expandir networking', target_value: 100, unit: '%', priority: 'medium' },

          // Almático
          { category: 'almatico', title: 'Ajudar 10 pessoas', description: 'Ajudar 10 pessoas a perdoarem seus pais e ter desbloqueio emocional', target_value: 10, unit: 'pessoas', priority: 'high' },
          { category: 'almatico', title: 'Servir Jovens Sarados', description: 'Tornar-se servo dos Jovens Sarados novamente e resgatar almas para Deus', target_value: 100, unit: '%', priority: 'high' },

          // Financeiro
          { category: 'financeiro', title: 'Faturar R$ 250.000', description: 'Faturar duzentos e cinquenta mil reais no ano', target_value: 250000, unit: 'R$', priority: 'high' },
          { category: 'financeiro', title: 'Comprar primeiro carro', description: 'Adquirir o primeiro veículo próprio', target_value: 100, unit: '%', priority: 'medium' },
          { category: 'financeiro', title: 'Viajar para namorada', description: 'Realizar viagem para visitar a namorada', target_value: 100, unit: '%', priority: 'high' },
          { category: 'financeiro', title: 'Reserva de emergência', description: 'Guardar R$ 25.000 de reserva de emergência', target_value: 25000, unit: 'R$', priority: 'high' },

          // Social
          { category: 'social', title: '5 obras de caridade', description: 'Fazer 5 obras de caridade - doações de dinheiro, tempo ou atenção', target_value: 5, unit: 'obras', priority: 'medium' },
          { category: 'social', title: 'Entrar no BNI', description: 'Entrar para o grupo de networking BNI', target_value: 100, unit: '%', priority: 'medium' },
          { category: 'social', title: 'Entrar no The One', description: 'Entrar para o grupo de networking The One', target_value: 100, unit: '%', priority: 'medium' }
        ]

        try {
          set({ loading: true, error: null })

          // Verificar metas existentes para não duplicar
          const { data: existingGoals } = await supabase
            .from('goals')
            .select('title')
            .eq('user_id', user.id)

          const existingTitles = new Set((existingGoals || []).map(g => g.title))

          // Filtrar apenas metas que não existem
          const goalsToInsert = initialGoals
            .filter(goal => !existingTitles.has(goal.title))
            .map(goal => ({
              user_id: user.id,
              ...goal,
              current_value: 0,
              deadline: '2026-12-31'
            }))

          if (goalsToInsert.length === 0) {
            set({ loading: false })
            return { success: true, message: 'Todas as metas já existem!' }
          }

          const { error } = await supabase
            .from('goals')
            .insert(goalsToInsert)

          if (error) throw error

          // Recarregar metas
          await get().fetchGoals()

          set({ loading: false })
          return { success: true, message: `${goalsToInsert.length} metas criadas com sucesso!` }
        } catch (error) {
          console.error('Erro ao criar metas iniciais:', error)
          set({ error: error.message, loading: false })
          return { success: false, error: error.message }
        }
      }
    }),
    {
      name: 'maneger-26-goals',
      partialize: (state) => ({
        goals: state.goals,
        localGoalsMigrated: state.localGoalsMigrated
      })
    }
  )
)
