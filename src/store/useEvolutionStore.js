import { create } from 'zustand'
import { supabase } from '../lib/supabase'

// Helper para obter numero da semana
function getWeekNumber(date) {
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const diff = date - startOfYear
  const oneWeek = 1000 * 60 * 60 * 24 * 7
  return Math.ceil(diff / oneWeek)
}

export const useEvolutionStore = create((set, get) => ({
  photos: [],
  loading: false,
  error: null,

  // Carregar fotos do usuario
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

  // Adicionar foto
  addPhoto: async (photoData) => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    try {
      // Se tiver arquivo de imagem, fazer upload primeiro
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

  // Atualizar foto
  updatePhoto: async (id, updates) => {
    try {
      const { data, error } = await supabase
        .from('evolution_photos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      set(state => ({
        photos: state.photos.map(photo =>
          photo.id === id ? data : photo
        )
      }))

      return data
    } catch (error) {
      console.error('Erro ao atualizar foto:', error)
      set({ error: error.message })
      return null
    }
  },

  // Deletar foto
  deletePhoto: async (id) => {
    try {
      const photo = get().photos.find(p => p.id === id)

      // Deletar arquivo do storage se existir
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

  // Obter fotos por categoria
  getPhotosByCategory: (category) => {
    return get().photos.filter(photo => photo.category === category)
  },

  // Obter foto atual (mais recente)
  getCurrentPhoto: () => {
    const photos = get().photos
    return photos.length > 0 ? photos[0] : null
  },

  // Obter estatisticas
  getStats: () => {
    const photos = get().photos
    if (photos.length === 0) return null

    return {
      totalPhotos: photos.length,
      firstPhoto: photos[photos.length - 1]?.date,
      lastPhoto: photos[0]?.date,
      weeksTracked: Math.ceil(photos.length / 1)
    }
  },

  // Limpar estado
  clearState: () => set({ photos: [], loading: false, error: null })
}))
