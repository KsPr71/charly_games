import { supabase } from '@/lib/supabase';
import type { TopRatedGame } from '@/lib/types';

export async function getTopRatedGames(limit = 5): Promise<TopRatedGame[]> {
  const { data, error } = await supabase.rpc('get_top_rated_games', {
    top_limit: limit,
  });

  if (error || !data) {
    console.error('Error:', error.message);
    return [];
  }

  return data;
}
