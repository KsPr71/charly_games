// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export async function fetchGames() {
  const { data, error } = await supabase.from('games').select('*')
  if (error) throw error
  return data
}

export async function addGame(game) {
  const { data, error } = await supabase.from('games').insert(game).select().single()
  if (error) throw error
  return data
}

export async function updateGame(id, updates) {
  const { data, error } = await supabase.from('games').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGame(id) {
  const { error } = await supabase.from('games').delete().eq('id', id)
  if (error) throw error
}

export default supabase
