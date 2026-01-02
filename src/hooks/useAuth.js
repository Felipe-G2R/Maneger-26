import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export const useAuth = create(
  persist(
    (set, get) => ({
      user: null,
      session: null,
      loading: false,
      error: null,
      initialized: false,

      // Inicializar autenticacao
      initialize: async () => {
        try {
          set({ loading: true, error: null })

          // Verificar sessao existente
          const { data: { session } } = await supabase.auth.getSession()

          if (session) {
            set({
              user: session.user,
              session: session,
              initialized: true,
              loading: false
            })
          } else {
            set({
              user: null,
              session: null,
              initialized: true,
              loading: false
            })
          }

          // Listener para mudancas de autenticacao
          supabase.auth.onAuthStateChange((event, session) => {
            if (event === 'SIGNED_IN') {
              set({
                user: session?.user || null,
                session: session,
                error: null
              })
            } else if (event === 'SIGNED_OUT') {
              set({
                user: null,
                session: null
              })
            } else if (event === 'TOKEN_REFRESHED') {
              set({
                session: session
              })
            }
          })

        } catch (error) {
          console.error('Erro ao inicializar auth:', error)
          set({
            error: 'Erro ao verificar autenticacao',
            initialized: true,
            loading: false
          })
        }
      },

      // Login
      login: async (email, password) => {
        try {
          set({ loading: true, error: null })

          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password
          })

          if (error) {
            let errorMessage = 'Erro ao fazer login'

            if (error.message.includes('Invalid login credentials')) {
              errorMessage = 'Email ou senha incorretos'
            } else if (error.message.includes('Email not confirmed')) {
              errorMessage = 'Email nao confirmado. Verifique sua caixa de entrada.'
            } else if (error.message.includes('Too many requests')) {
              errorMessage = 'Muitas tentativas. Aguarde alguns minutos.'
            }

            set({ error: errorMessage, loading: false })
            return false
          }

          set({
            user: data.user,
            session: data.session,
            loading: false,
            error: null
          })

          return true

        } catch (error) {
          console.error('Erro no login:', error)
          set({
            error: 'Erro inesperado. Tente novamente.',
            loading: false
          })
          return false
        }
      },

      // Logout
      logout: async () => {
        try {
          set({ loading: true })
          await supabase.auth.signOut()
          set({
            user: null,
            session: null,
            loading: false,
            error: null
          })
          return true
        } catch (error) {
          console.error('Erro no logout:', error)
          set({
            error: 'Erro ao sair',
            loading: false
          })
          return false
        }
      },

      // Limpar erro
      clearError: () => set({ error: null }),

      // Verificar se esta autenticado
      isAuthenticated: () => {
        const state = get()
        return !!state.user && !!state.session
      }
    }),
    {
      name: 'maneger-26-auth',
      partialize: (state) => ({
        // Nao persistir dados sensiveis - apenas flag
        initialized: state.initialized
      })
    }
  )
)
