'use client';

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react';
import type { Game } from '@/lib/types';

interface GameContextType {
  games: Game[];
  addGame: (game: Omit<Game, 'id'>) => Promise<void>;
  updateGame: (game: Game) => Promise<void>;
  deleteGame: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const GameContext = createContext<GameContextType>({
  games: [],
  addGame: async () => {},
  updateGame: async () => {},
  deleteGame: async () => {},
  isLoading: true,
});

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchGames = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games');
      if (!response.ok) {
        throw new Error('Failed to fetch games');
      }
      const data = await response.json();
      setGames(data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  const addGame = async (game: Omit<Game, 'id'>) => {
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(game),
      });
      if (!response.ok) {
        throw new Error('Failed to add game');
      }
      await fetchGames();
    } catch (error) {
      console.error(error);
    }
  };

  const updateGame = async (updatedGame: Game) => {
    try {
      const response = await fetch('/api/games', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedGame),
      });
      if (!response.ok) {
        throw new Error('Failed to update game');
      }
      await fetchGames();
    } catch (error) {
      console.error(error);
    }
  };

  const deleteGame = async (id: string) => {
    try {
        const response = await fetch('/api/games', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id }),
        });
        if (!response.ok) {
            throw new Error('Failed to delete game');
        }
        await fetchGames();
    } catch (error) {
        console.error(error);
    }
  };

  return (
    <GameContext.Provider value={{ games, addGame, updateGame, deleteGame, isLoading }}>
      {children}
    </GameContext.Provider>
  );
};
