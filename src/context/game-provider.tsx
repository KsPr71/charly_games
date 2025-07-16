'use client'

import { createContext, useState, useEffect, ReactNode, useCallback } from 'react'
import type { Game } from '@/lib/types'
import { supabase } from '@/lib/supabase'

interface GameContextType {
  games: Game[]
  addGame: (game: Omit<Game, 'id'>) => Promise<void>
  updateGame: (game: Game) => Promise<void>
  deleteGame: (id: string) => Promise<void>
  isLoading: boolean
}

export const GameContext = createContext<GameContextType>({
  games: [],
  addGame: async () => {},
  updateGame: async () => {},
  deleteGame: async () => {},
  isLoading: true,
})

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchGames = useCallback(async () => {
    setIsLoading(true)
    try {
      const { data, error } = await supabase.from('games').select('*')
      if (error) throw error
      setGames(data || [])
    } catch (error) {
      console.error('Error al cargar juegos:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchGames()
  }, [fetchGames])

  useEffect(() => {
    const subscription = supabase
      .channel('games-listener')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'games' },
        () => {
          fetchGames()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [fetchGames])

const addGame = async (game: Omit<Game, 'id' | 'created_at'>) => {
  console.log('Datos que se envían a Supabase:', game)

  try {
    const { data, error } = await supabase
      .from('games')
      .insert({
        title: game.title,
        description: game.description,
        category: game.category,
        price: game.price,
        imageUrl: game.imageUrl,
        os: game.os,  
        processor: game.processor,
        memory: game.memory,
        graphics: game.graphics,
        storage: game.storage,
        weight: game.weight, // Asegúrate de que 'weight' esté definido en tu tipo Game
      
      })
      .select()
    if (error) throw error
    console.log('Juego agregado:', data)
    setGames((prev) => [...prev, ...data]) // actualiza el estado local
  } catch (error) {
    console.error('Error al agregar juego:', error)
  }
}


  const updateGame = async (game: Game) => {
    try {
      const { error } = await supabase
        .from('games')
        .update({
        title: game.title,
        description: game.description,
        category: game.category,
        price: game.price,
        imageUrl: game.imageUrl,
        os: game.os,  
        processor: game.processor,
        memory: game.memory,
        graphics: game.graphics,
        storage: game.storage,
        weight: game.weight, // Asegúrate de que 'weight' esté definido en tu tipo Game
        })
        .eq('id', game.id)
      if (error) throw error
    } catch (error) {
      console.error('Error al actualizar juego:', error)
    }
  }

  const deleteGame = async (id: string) => {
    try {
      const { error } = await supabase.from('games').delete().eq('id', id)
      if (error) throw error
    } catch (error) {
      console.error('Error al eliminar juego:', error)
    }
  }

  return (
    <GameContext.Provider value={{ games, addGame, updateGame, deleteGame, isLoading }}>
      {children}
    </GameContext.Provider>
  )
}
