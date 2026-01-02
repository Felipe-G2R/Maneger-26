import { create } from 'zustand'
import { supabase, uploadFile } from '../lib/supabase'

export const useMuralStore = create((set, get) => ({
    items: [],
    currentPhoto: null,
    goalPhoto: null,
    loading: false,
    error: null,

    fetchItems: async () => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return

        set({ loading: true, error: null })

        try {
            const { data, error } = await supabase
                .from('vision_board_items')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false })

            if (error) throw error

            // Separar itens por tipo
            const current = data.find(item => item.item_type === 'current')
            const goal = data.find(item => item.item_type === 'goal')
            const progress = data.filter(item => item.item_type === 'progress' || !item.item_type)

            set({
                items: progress,
                currentPhoto: current,
                goalPhoto: goal,
                loading: false
            })
        } catch (error) {
            console.error('Erro ao carregar mural:', error)
            set({ error: error.message, loading: false })
        }
    },

    addItem: async (file, caption, type = 'progress') => {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        set({ loading: true })

        try {
            // 1. Upload da imagem
            const fileExt = file.name.split('.').pop()
            const fileName = `mural/${user.id}/${type}_${Date.now()}.${fileExt}`

            await uploadFile('attachments', fileName, file)

            const { data: { publicUrl } } = supabase.storage
                .from('attachments')
                .getPublicUrl(fileName)

            // 2. Se for 'current' ou 'goal', remover anterior se existir
            if (type === 'current' && get().currentPhoto) {
                await get().deleteItem(get().currentPhoto.id, get().currentPhoto.image_url)
            }
            if (type === 'goal' && get().goalPhoto) {
                await get().deleteItem(get().goalPhoto.id, get().goalPhoto.image_url)
            }

            // 3. Salvar no banco
            const { data, error } = await supabase
                .from('vision_board_items')
                .insert([{
                    user_id: user.id,
                    image_url: publicUrl,
                    caption,
                    item_type: type,
                    position_index: 0
                }])
                .select()
                .single()

            if (error) throw error

            // Atualizar estado
            if (type === 'current') {
                set({ currentPhoto: data, loading: false })
            } else if (type === 'goal') {
                set({ goalPhoto: data, loading: false })
            } else {
                set(state => ({
                    items: [data, ...state.items],
                    loading: false
                }))
            }

            return data
        } catch (error) {
            console.error('Erro ao adicionar item ao mural:', error)
            set({ error: error.message, loading: false })
            return null
        }
    },

    deleteItem: async (id, imageUrl) => {
        try {
            const { error } = await supabase
                .from('vision_board_items')
                .delete()
                .eq('id', id)

            if (error) throw error

            if (imageUrl && imageUrl.includes('attachments')) {
                const path = imageUrl.split('attachments/')[1]
                if (path) {
                    await supabase.storage.from('attachments').remove([path])
                }
            }

            set(state => ({
                items: state.items.filter(item => item.id !== id),
                currentPhoto: state.currentPhoto?.id === id ? null : state.currentPhoto,
                goalPhoto: state.goalPhoto?.id === id ? null : state.goalPhoto
            }))

            return true
        } catch (error) {
            console.error('Erro ao deletar item do mural:', error)
            set({ error: error.message })
            return false
        }
    }
}))
