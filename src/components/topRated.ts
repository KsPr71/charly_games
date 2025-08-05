import { supabase } from '@/lib/supabase';

export async function getTopRatedGames(limit = 5) {
  try {
    // Intentar primero con la función RPC
    const { data: rpcData, error: rpcError } = await supabase
      .rpc('get_top_rated_games', { top_limit: limit });

    if (rpcError) {
      console.error('❌ Error con RPC, intentando consulta directa:', rpcError.message);
      
      // Fallback: consulta directa
      const { data: directData, error: directError } = await supabase
        .from('games')
        .select('id, title, imageUrl, image_url, average_rating')
        .order('average_rating', { ascending: false })
        .limit(limit);

      if (directError) {
        console.error('❌ Error con consulta directa:', directError.message);
        return [];
      }

      return directData || [];
    }

    return rpcData || [];
  } catch (error) {
    console.error('❌ Exception in getTopRatedGames:', error);
    return [];
  }
}
