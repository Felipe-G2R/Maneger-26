import { createClient } from '@supabase/supabase-js'

// Credenciais do Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =====================================================
// AUTENTICACAO
// =====================================================

export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName }
    }
  })
  if (error) throw error
  return data
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  if (error) throw error
  return data
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// =====================================================
// PERFIL DO USUARIO
// =====================================================

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) throw error
  return data
}

export async function updateProfile(userId, updates) {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// =====================================================
// METAS (GOALS)
// =====================================================

export async function getGoals(userId) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function getGoalsByCategory(userId, category) {
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .eq('category', category)
    .order('priority', { ascending: false })
  if (error) throw error
  return data
}

export async function createGoal(goal) {
  const { data, error } = await supabase
    .from('goals')
    .insert([goal])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateGoal(id, updates) {
  const { data, error } = await supabase
    .from('goals')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteGoal(id) {
  const { error } = await supabase
    .from('goals')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// =====================================================
// PROGRESSO DAS METAS
// =====================================================

export async function logProgress(goalId, userId, value, notes = '') {
  const { data, error } = await supabase
    .from('progress_logs')
    .insert([{
      goal_id: goalId,
      user_id: userId,
      value,
      notes,
      logged_at: new Date().toISOString()
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getProgressLogs(goalId) {
  const { data, error } = await supabase
    .from('progress_logs')
    .select('*')
    .eq('goal_id', goalId)
    .order('logged_at', { ascending: false })
  if (error) throw error
  return data
}

// =====================================================
// DIARIO
// =====================================================

export async function getDiaryEntries(userId) {
  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function createDiaryEntry(entry) {
  const { data, error } = await supabase
    .from('diary_entries')
    .insert([entry])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateDiaryEntry(id, updates) {
  const { data, error } = await supabase
    .from('diary_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteDiaryEntry(id) {
  const { error } = await supabase
    .from('diary_entries')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// =====================================================
// ALMATICO (DIARIO ESPIRITUAL)
// =====================================================

export async function getAlmaticoEntries(userId) {
  const { data, error } = await supabase
    .from('almatico_entries')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createAlmaticoEntry(entry) {
  const { data, error } = await supabase
    .from('almatico_entries')
    .insert([entry])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteAlmaticoEntry(id) {
  const { error } = await supabase
    .from('almatico_entries')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getAlmaticoStats(userId) {
  const { data, error } = await supabase
    .from('almatico_stats')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

// =====================================================
// FINANCEIRO
// =====================================================

export async function getFinancialTransactions(userId, month = null) {
  let query = supabase
    .from('financial_transactions')
    .select('*, financial_categories(*)')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (month) {
    const startDate = new Date(month.getFullYear(), month.getMonth(), 1)
    const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0)
    query = query
      .gte('date', startDate.toISOString().split('T')[0])
      .lte('date', endDate.toISOString().split('T')[0])
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createTransaction(transaction) {
  const { data, error } = await supabase
    .from('financial_transactions')
    .insert([transaction])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteTransaction(id) {
  const { error } = await supabase
    .from('financial_transactions')
    .delete()
    .eq('id', id)
  if (error) throw error
}

export async function getFinancialGoals(userId) {
  const { data, error } = await supabase
    .from('financial_goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) throw error
  return data
}

export async function createFinancialGoal(goal) {
  const { data, error } = await supabase
    .from('financial_goals')
    .insert([goal])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function updateFinancialGoal(id, updates) {
  const { data, error } = await supabase
    .from('financial_goals')
    .update(updates)
    .eq('id', id)
    .select()
    .single()
  if (error) throw error
  return data
}

export async function contributeToGoal(goalId, userId, value, notes = '') {
  const { data, error } = await supabase
    .from('financial_goal_contributions')
    .insert([{
      financial_goal_id: goalId,
      user_id: userId,
      value,
      notes
    }])
    .select()
    .single()
  if (error) throw error
  return data
}

// =====================================================
// FOTOS DE EVOLUCAO
// =====================================================

export async function getEvolutionPhotos(userId, category = null) {
  let query = supabase
    .from('evolution_photos')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (category) {
    query = query.eq('category', category)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createEvolutionPhoto(photo) {
  const { data, error } = await supabase
    .from('evolution_photos')
    .insert([photo])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function deleteEvolutionPhoto(id) {
  const { error } = await supabase
    .from('evolution_photos')
    .delete()
    .eq('id', id)
  if (error) throw error
}

// =====================================================
// TREINO E DIETA
// =====================================================

export async function getWorkoutLogs(userId, startDate = null, endDate = null) {
  let query = supabase
    .from('workout_logs')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (startDate) query = query.gte('date', startDate)
  if (endDate) query = query.lte('date', endDate)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function createWorkoutLog(log) {
  const { data, error } = await supabase
    .from('workout_logs')
    .insert([log])
    .select()
    .single()
  if (error) throw error
  return data
}

export async function getBodyMeasurements(userId) {
  const { data, error } = await supabase
    .from('body_measurements')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
  if (error) throw error
  return data
}

export async function createBodyMeasurement(measurement) {
  const { data, error } = await supabase
    .from('body_measurements')
    .insert([measurement])
    .select()
    .single()
  if (error) throw error
  return data
}

// =====================================================
// STORAGE - UPLOAD DE ARQUIVOS
// =====================================================

export async function uploadFile(bucket, path, file, options = {}) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
      ...options
    })
  if (error) throw error
  return data
}

export async function uploadEvolutionPhoto(userId, file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/${Date.now()}.${fileExt}`

  await uploadFile('evolution-photos', fileName, file)

  const { data } = supabase.storage
    .from('evolution-photos')
    .getPublicUrl(fileName)

  return { path: fileName, url: data.publicUrl }
}

export async function uploadAudio(userId, audioBlob, type = 'diary') {
  const fileName = `${userId}/${type}_${Date.now()}.webm`

  await uploadFile('audio-recordings', fileName, audioBlob, {
    contentType: 'audio/webm'
  })

  const { data } = supabase.storage
    .from('audio-recordings')
    .getPublicUrl(fileName)

  return { path: fileName, url: data.publicUrl }
}

export async function uploadAvatar(userId, file) {
  const fileExt = file.name.split('.').pop()
  const fileName = `${userId}/avatar.${fileExt}`

  await uploadFile('avatars', fileName, file, { upsert: true })

  const { data } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName)

  return data.publicUrl
}

export async function deleteFile(bucket, path) {
  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])
  if (error) throw error
}

export function getFileUrl(bucket, path) {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)
  return data.publicUrl
}

export async function getSignedUrl(bucket, path, expiresIn = 3600) {
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)
  if (error) throw error
  return data.signedUrl
}

// =====================================================
// CATEGORIAS
// =====================================================

export async function getGoalCategories() {
  const { data, error } = await supabase
    .from('goal_categories')
    .select('*')
    .order('display_order')
  if (error) throw error
  return data
}

export async function getFinancialCategories() {
  const { data, error } = await supabase
    .from('financial_categories')
    .select('*')
    .order('display_order')
  if (error) throw error
  return data
}

// =====================================================
// VIEWS E RELATORIOS
// =====================================================

export async function getGoalsSummary(userId) {
  const { data, error } = await supabase
    .from('goals_summary')
    .select('*')
    .eq('user_id', userId)
  if (error) throw error
  return data
}

export async function getFinancialMonthlySummary(userId) {
  const { data, error } = await supabase
    .from('financial_monthly_summary')
    .select('*')
    .eq('user_id', userId)
    .order('month', { ascending: false })
    .limit(12)
  if (error) throw error
  return data
}

export async function getExpensesByCategory(userId, month = null) {
  let query = supabase
    .from('expenses_by_category')
    .select('*')
    .eq('user_id', userId)

  if (month) {
    const monthStr = month.toISOString().slice(0, 7) + '-01'
    query = query.eq('month', monthStr)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

// =====================================================
// NOTIFICACOES
// =====================================================

export async function getNotifications(userId, unreadOnly = false) {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (unreadOnly) {
    query = query.eq('read', false)
  }

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function markNotificationAsRead(id) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('id', id)
  if (error) throw error
}

export async function markAllNotificationsAsRead(userId) {
  const { error } = await supabase
    .from('notifications')
    .update({ read: true })
    .eq('user_id', userId)
    .eq('read', false)
  if (error) throw error
}

// =====================================================
// PREFERENCIAS DO USUARIO
// =====================================================

export async function getUserPreferences(userId) {
  const { data, error } = await supabase
    .from('user_preferences')
    .select('*')
    .eq('user_id', userId)
    .single()
  if (error && error.code !== 'PGRST116') throw error
  return data
}

export async function updateUserPreferences(userId, preferences) {
  const { data, error } = await supabase
    .from('user_preferences')
    .upsert({
      user_id: userId,
      ...preferences
    })
    .select()
    .single()
  if (error) throw error
  return data
}

// =====================================================
// REALTIME SUBSCRIPTIONS
// =====================================================

export function subscribeToGoals(userId, callback) {
  return supabase
    .channel('goals_changes')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'goals',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export function subscribeToNotifications(userId, callback) {
  return supabase
    .channel('notifications_changes')
    .on(
      'postgres_changes',
      {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${userId}`
      },
      callback
    )
    .subscribe()
}

export function unsubscribe(subscription) {
  supabase.removeChannel(subscription)
}
