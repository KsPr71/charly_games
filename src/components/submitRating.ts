import { supabase } from '@/lib/supabase';

export async function submitRating(gameId: string, rating: number) {
  await supabase.from('game_ratings').insert([{ game_id: gameId, rating }]);
}
