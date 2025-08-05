// utils/supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)


export async function fetchGames({ limit = 50, offset = 0, category = null, searchTerm = "" }: { limit?: number; offset?: number; category?: string | null; searchTerm?: string } = {}) {
  let query = supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (category && category !== 'Todos') {
    query = query.eq('category', category);
  }

  if (searchTerm && searchTerm.trim() !== '') {
    query = query.ilike('title', `%${searchTerm}%`);
  }
  
  console.log('Fetching games with params:', { limit, offset, category, searchTerm });
  
  const { data, error } = await query.range(offset, offset + limit - 1);
  if (error) {
    console.error('Supabase error:', error);
    throw error;
  }
  
  console.log('Fetched games count:', data?.length || 0);
  return data;
}

export async function addGame(game: any) {
  const { data, error } = await supabase.from('games').insert(game).select().single()
  if (error) throw error
  return data
}

export async function updateGame(id: number, updates: any) {
  const { data, error } = await supabase.from('games').update(updates).eq('id', id).select().single()
  if (error) throw error
  return data
}

export async function deleteGame(id: number) {
  const { error } = await supabase.from('games').delete().eq('id', id)
  if (error) throw error
}

export default supabase
