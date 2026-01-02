import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useAppStore = create(
  persist(
    (set, get) => ({
      // Theme
      theme: 'dark',
      toggleTheme: () => {
        const newTheme = get().theme === 'dark' ? 'light' : 'dark'
        set({ theme: newTheme })
        document.documentElement.classList.toggle('dark', newTheme === 'dark')
      },

      // Sidebar
      sidebarOpen: true,
      toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),

      // Loading states
      isLoading: false,
      setLoading: (isLoading) => set({ isLoading }),

      // Notifications
      notifications: [],
      addNotification: (notification) => set(state => ({
        notifications: [...state.notifications, {
          id: Date.now(),
          ...notification
        }]
      })),
      removeNotification: (id) => set(state => ({
        notifications: state.notifications.filter(n => n.id !== id)
      })),

      // User preferences
      preferences: {
        language: 'pt-BR',
        dateFormat: 'dd/MM/yyyy',
        showCompletedGoals: true,
        enableNotifications: true
      },
      updatePreferences: (updates) => set(state => ({
        preferences: { ...state.preferences, ...updates }
      })),
    }),
    {
      name: 'maneger-26-app',
      partialize: (state) => ({
        theme: state.theme,
        sidebarOpen: state.sidebarOpen,
        preferences: state.preferences
      })
    }
  )
)

// Inicializar tema
if (typeof window !== 'undefined') {
  const stored = localStorage.getItem('maneger-26-app')
  if (stored) {
    const { state } = JSON.parse(stored)
    document.documentElement.classList.toggle('dark', state?.theme === 'dark')
  } else {
    document.documentElement.classList.add('dark')
  }
}
