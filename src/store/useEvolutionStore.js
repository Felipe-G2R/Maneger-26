import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

// Helper para obter numero da semana
function getWeekNumber(date) {
  const d = new Date(date)
  const startOfYear = new Date(d.getFullYear(), 0, 1)
  const diff = d - startOfYear
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.ceil(diff / oneWeek)
}

export const useEvolutionStore = create(
  persist(
    (set, get) => ({
      // Estado
      photos: [],
      weeklyEntries: [],
      currentPhoto: null,
      goalPhoto: null,
      loading: false,
      error: null,

      // ==========================================
      // FOTOS DO SUPABASE
      // ==========================================

      fetchPhotos: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        set({ loading: true, error: null })

        try {
          const { data, error } = await supabase
            .from('evolution_photos')
            .select('*')
            .eq('user_id', user.id)
            .order('date', { ascending: false })

          if (error) throw error

          set({ photos: data || [], loading: false })
        } catch (error) {
          console.error('Erro ao carregar fotos:', error)
          set({ error: error.message, loading: false })
        }
      },

      addPhoto: async (photoData) => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        try {
          let photoUrl = photoData.photo_url

          if (photoData.file) {
            const fileExt = photoData.file.name.split('.').pop()
            const fileName = `${user.id}/${Date.now()}.${fileExt}`

            const { error: uploadError } = await supabase.storage
              .from('evolution-photos')
              .upload(fileName, photoData.file)

            if (uploadError) throw uploadError

            const { data: urlData } = supabase.storage
              .from('evolution-photos')
              .getPublicUrl(fileName)

            photoUrl = urlData.publicUrl
          }

          const { data, error } = await supabase
            .from('evolution_photos')
            .insert([{
              user_id: user.id,
              photo_url: photoUrl,
              category: photoData.category || 'fisico',
              title: photoData.title,
              description: photoData.description || photoData.notes,
              date: photoData.date || new Date().toISOString().split('T')[0]
            }])
            .select()
            .single()

          if (error) throw error

          set(state => ({
            photos: [data, ...state.photos]
          }))

          return data
        } catch (error) {
          console.error('Erro ao adicionar foto:', error)
          set({ error: error.message })
          return null
        }
      },

      deletePhoto: async (id) => {
        try {
          const photo = get().photos.find(p => p.id === id)

          if (photo?.photo_url) {
            const path = photo.photo_url.split('/').slice(-2).join('/')
            await supabase.storage.from('evolution-photos').remove([path])
          }

          const { error } = await supabase
            .from('evolution_photos')
            .delete()
            .eq('id', id)

          if (error) throw error

          set(state => ({
            photos: state.photos.filter(photo => photo.id !== id)
          }))

          return true
        } catch (error) {
          console.error('Erro ao deletar foto:', error)
          set({ error: error.message })
          return false
        }
      },

      // ==========================================
      // FOTO ATUAL E META (localStorage)
      // ==========================================

      setCurrentPhoto: (imageData) => {
        set({
          currentPhoto: {
            imageData,
            date: new Date().toISOString()
          }
        })
      },

      setGoalPhoto: (imageData) => {
        set({
          goalPhoto: {
            imageData,
            date: new Date().toISOString()
          }
        })
      },

      clearCurrentPhoto: () => set({ currentPhoto: null }),
      clearGoalPhoto: () => set({ goalPhoto: null }),

      // ==========================================
      // DIÁRIO SEMANAL (localStorage)
      // ==========================================

      addWeeklyEntry: (entry) => {
        const now = new Date()
        const newEntry = {
          id: Date.now().toString(),
          ...entry,
          date: now.toISOString(),
          week: getWeekNumber(now)
        }

        set(state => ({
          weeklyEntries: [newEntry, ...state.weeklyEntries]
        }))

        return newEntry
      },

      deleteWeeklyEntry: (id) => {
        set(state => ({
          weeklyEntries: state.weeklyEntries.filter(entry => entry.id !== id)
        }))
      },

      updateWeeklyEntry: (id, updates) => {
        set(state => ({
          weeklyEntries: state.weeklyEntries.map(entry =>
            entry.id === id ? { ...entry, ...updates } : entry
          )
        }))
      },

      // ==========================================
      // ESTATÍSTICAS
      // ==========================================

      getStats: () => {
        const { weeklyEntries, photos } = get()

        if (weeklyEntries.length === 0 && photos.length === 0) {
          return null
        }

        // Calcular stats baseado em weeklyEntries
        const entriesWithWeight = weeklyEntries.filter(e => e.weight)

        let initialWeight = null
        let currentWeight = null
        let weightChange = 0

        if (entriesWithWeight.length > 0) {
          // Ordenar por data
          const sorted = [...entriesWithWeight].sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )
          initialWeight = sorted[0]?.weight
          currentWeight = sorted[sorted.length - 1]?.weight

          if (initialWeight && currentWeight) {
            weightChange = currentWeight - initialWeight
          }
        }

        return {
          totalEntries: weeklyEntries.length,
          totalPhotos: photos.length,
          initialWeight,
          currentWeight,
          weightChange,
          firstEntry: weeklyEntries.length > 0
            ? weeklyEntries[weeklyEntries.length - 1]?.date
            : null,
          lastEntry: weeklyEntries.length > 0
            ? weeklyEntries[0]?.date
            : null,
          weeksTracked: weeklyEntries.length
        }
      },

      getPhotosByCategory: (category) => {
        return get().photos.filter(photo => photo.category === category)
      },

      getCurrentPhoto: () => {
        const photos = get().photos
        return photos.length > 0 ? photos[0] : null
      },

      // Limpar estado
      clearState: () => set({
        photos: [],
        weeklyEntries: [],
        currentPhoto: null,
        goalPhoto: null,
        loading: false,
        error: null
      })
    }),
    {
      name: 'maneger-26-evolution',
      partialize: (state) => ({
        weeklyEntries: state.weeklyEntries,
        currentPhoto: state.currentPhoto,
        goalPhoto: state.goalPhoto
      })
    }
  )
)
