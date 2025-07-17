import { supabase } from '@/lib/supabase';

export async function getAverageRating(gameId: string): Promise<number> {
  const { data, error } = await supabase
    .from('game_ratings')
    .select('rating')
    .eq('game_id', gameId);

  if (error || !data) return 0;

  const ratings = data.map((r) => r.rating);
  const avg = ratings.length
    ? ratings.reduce((sum, r) => sum + r, 0) / ratings.length
    : 0;

  return Math.round(avg * 10) / 10;
}
