'use server';

import {NextResponse} from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import type {Game} from '@/lib/types';

const dataFilePath = path.join(process.cwd(), 'src/data/games.json');

async function getGames(): Promise<Game[]> {
  try {
    const data = await fs.readFile(dataFilePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error instanceof Error && 'code' in error && error.code === 'ENOENT') {
      await saveGames([]);
      return [];
    }
    console.error('Error reading games data:', error);
    throw error;
  }
}

async function saveGames(games: Game[]) {
  try {
    const data = JSON.stringify(games, null, 2);
    await fs.writeFile(dataFilePath, data, 'utf-8');
  } catch (error) {
    console.error('Error saving games data:', error);
    throw error;
  }
}

export async function GET() {
  try {
    const games = await getGames();
    return NextResponse.json(games);
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching games' }, { status: 500 });
  }
}

export async function POST(request: Request) {
    try {
        const newGameData: Omit<Game, 'id'> = await request.json();
        const games = await getGames();
        
        const newGame: Game = {
            id: new Date().toISOString(),
            ...newGameData,
            pcRequirements: newGameData.pcRequirements || { os: '', processor: '', memory: '', graphics: '', storage: '' },
        };

        const updatedGames = [newGame, ...games];
        await saveGames(updatedGames);
        
        return NextResponse.json(newGame, { status: 201 });
    } catch (error) {
        console.error('Error in POST /api/games:', error);
        return NextResponse.json({ message: 'Error adding game' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const updatedGame: Game = await request.json();
        let games = await getGames();
        
        const gameIndex = games.findIndex(g => g.id === updatedGame.id);

        if (gameIndex === -1) {
            return NextResponse.json({ message: 'Game not found' }, { status: 404 });
        }

        games[gameIndex] = {
          ...games[gameIndex],
          ...updatedGame,
          pcRequirements: updatedGame.pcRequirements || games[gameIndex].pcRequirements,
        };

        await saveGames(games);
        
        return NextResponse.json(updatedGame);
    } catch (error) {
       console.error('Error in PUT /api/games:', error);
        return NextResponse.json({ message: 'Error updating game' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        if (!id) {
            return NextResponse.json({ message: 'Game ID is required' }, { status: 400 });
        }

        let games = await getGames();
        const initialLength = games.length;
        const updatedGames = games.filter(g => g.id !== id);

        if (initialLength === updatedGames.length) {
            return NextResponse.json({ message: 'Game not found' }, { status: 404 });
        }

        await saveGames(updatedGames);
        
        return NextResponse.json({ message: 'Game deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error in DELETE /api/games:', error);
        return NextResponse.json({ message: 'Error deleting game' }, { status: 500 });
    }
}
