'use server';

import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import type { Game } from '@/lib/types';

// GET all games
export async function GET() {
  const { data: games, error } = await supabase
    .from('games')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching games:', error);
    return NextResponse.json({ message: 'Error fetching games', error: error.message }, { status: 500 });
  }

  return NextResponse.json(games);
}

// POST a new game
export async function POST(request: Request) {
  try {
    const newGameData: Omit<Game, 'id'> = await request.json();
    
    // Supabase handles ID generation if the column is configured as such (e.g., UUID)
    // We just insert the data sent from the client.
    const { data: newGame, error } = await supabase
      .from('games')
      .insert([newGameData])
      .select()
      .single();

    if (error) {
      console.error('Error creating game:', error);
      return NextResponse.json({ message: 'Error adding game', error: error.message }, { status: 500 });
    }
    
    return NextResponse.json(newGame, { status: 201 });
  } catch (error) {
    console.error('Error in POST /api/games:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error adding game', error: errorMessage }, { status: 500 });
  }
}

// PUT (update) a game
export async function PUT(request: Request) {
  try {
    const updatedGame: Game = await request.json();
    const { id, ...gameData } = updatedGame;

    if (!id) {
        return NextResponse.json({ message: 'Game ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('games')
      .update(gameData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
       console.error('Error updating game:', error);
       if (error.code === 'PGRST116') { // PostgREST error for "Not a single row was returned"
            return NextResponse.json({ message: 'Game not found' }, { status: 404 });
       }
       return NextResponse.json({ message: 'Error updating game', error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in PUT /api/games:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error updating game', error: errorMessage }, { status: 500 });
  }
}

// DELETE a game
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: 'Game ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('games')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting game:', error);
      return NextResponse.json({ message: 'Error deleting game', error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'Game deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error in DELETE /api/games:', error);
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json({ message: 'Error deleting game', error: errorMessage }, { status: 500 });
  }
}
