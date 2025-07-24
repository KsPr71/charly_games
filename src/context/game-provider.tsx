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
  progress: number
}

export const GameContext = createContext<GameContextType>({
  games: [],
  addGame: async () => {},
  updateGame: async () => {},
  deleteGame: async () => {},
  isLoading: true,
  progress: 0,
})

export const GameProvider = ({ children }: { children: ReactNode }) => {
  const [games, setGames] = useState<Game[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState(0)

  // Función para animar el progreso suavemente
  const animateProgress = (target: number) => {
    const step = (current: number) => {
      if (current < target) {
        setProgress(Math.min(current + 5, target))
        requestAnimationFrame(() => step(current + 5))
      }
    }
    step(progress)
  }

  const fetchGames = useCallback(async () => {
    setIsLoading(true)
    animateProgress(30)
    try {
      const { data, error } = await supabase.from('games').select('*')
      animateProgress(80)
      if (error) throw error
      setGames(data || [])
      animateProgress(100)
    } catch (error) {
      console.error('Error al cargar juegos:', error)
      animateProgress(100)
    } finally {
      setIsLoading(false)
      setTimeout(() => animateProgress(0), 500)
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
        fetchGames
      )
      .subscribe()

    return () => {
      supabase.removeChannel(subscription)
    }
  }, [fetchGames])

  const addGame = async (game: Omit<Game, 'id' | 'created_at'>) => {
    setIsLoading(true)
    animateProgress(30)
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
          weight: game.weight,
          gotty: game.gotty,
        })
        .select()
      
      animateProgress(80)
      if (error) throw error
      setGames(prev => [...prev, ...data])
      animateProgress(100)
    } catch (error) {
      console.error('Error al agregar juego:', error)
      animateProgress(100)
    } finally {
      setIsLoading(false)
      setTimeout(() => animateProgress(0), 500)
    }
  }

  const updateGame = async (game: Game) => {
    setIsLoading(true)
    animateProgress(30)
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
          weight: game.weight,
          gotty: game.gotty,
        })
        .eq('id', game.id)
      
      animateProgress(80)
      if (error) throw error
      animateProgress(100)
    } catch (error) {
      console.error('Error al actualizar juego:', error)
      animateProgress(100)
    } finally {
      setIsLoading(false)
      setTimeout(() => animateProgress(0), 500)
    }
  }

  const deleteGame = async (id: string) => {
    setIsLoading(true)
    animateProgress(30)
    try {
      const { error } = await supabase.from('games').delete().eq('id', id)
      animateProgress(80)
      if (error) throw error
      animateProgress(100)
    } catch (error) {
      console.error('Error al eliminar juego:', error)
      animateProgress(100)
    } finally {
      setIsLoading(false)
      setTimeout(() => animateProgress(0), 500)
    }
  }

  return (
    <GameContext.Provider 
      value={{ 
        games, 
        addGame, 
        updateGame, 
        deleteGame, 
        isLoading, 
        progress 
      }}
    >
      {children}
    </GameContext.Provider>
  )
}