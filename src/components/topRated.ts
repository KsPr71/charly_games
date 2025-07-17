import { supabase } from '@/lib/supabase';

export async function getTopRatedGames(limit = 5) {
  const { data, error } = await supabase
    .rpc('get_top_rated_games', { top_limit: limit }); // llamada a función definida en Supabase

  if (error) {
    console.error('Error al obtener los mejores juegos:', error.message);
    return [];
  }

  return data;
}
