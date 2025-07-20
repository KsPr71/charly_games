'use client'

import { useEffect, useState, useRef } from 'react'

interface ProgressBarProps {
  isLoading: boolean
  progress?: number
  duration?: number
  loadingText?: string
  completeText?: string
  className?: string
}

export function ProgressBar({
  isLoading = true, // Valor por defecto
  progress = 0,     // Valor por defecto
  duration = 3000,
  loadingText = 'Cargando...',
  completeText = '¡Listo!',
  className = ''
}: ProgressBarProps) {
  const [internalProgress, setInternalProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const animationRef = useRef<number>(0)
  const timeoutRef = useRef<NodeJS.Timeout>()

  // Limpieza de efectos
  useEffect(() => {
    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // Manejo de estados de carga
  useEffect(() => {
    if (isLoading) {
      setIsVisible(true)
      setInternalProgress(progress ?? 0)
    } else {
      setInternalProgress(100)
      timeoutRef.current = setTimeout(() => setIsVisible(false), 500)
    }
  }, [isLoading, progress])

  // Animación suave
  useEffect(() => {
    if (progress !== undefined) {
      const animate = (start: number, target: number) => {
        const startTime = performance.now()
        const durationMs = 300
        
        const updateProgress = (currentTime: number) => {
          const elapsed = currentTime - startTime
          const progress = Math.min(elapsed / durationMs, 1)
          const value = start + (target - start) * progress
          setInternalProgress(Math.floor(value))
          
          if (progress < 1) {
            animationRef.current = requestAnimationFrame(updateProgress)
          }
        }
        
        animationRef.current = requestAnimationFrame(updateProgress)
      }
      
      animate(internalProgress, progress)
    }
  }, [progress])

  if (!isVisible) return null

  return (
    <div className={`fixed top-0 left-0 w-full z-50 ${className}`}>
      <div className="h-1 w-full bg-gray-200 dark:bg-gray-800">
        <div
          className="h-full bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300 ease-out"
          style={{ width: `${internalProgress}%` }}
        />
      </div>
      <div className="text-xs text-center text-fuchsia-600 dark:text-fuchsia-300 bg-fuchsia-50/90 dark:bg-gray-900/80 py-1 px-2">
        {isLoading ? loadingText : completeText}
      </div>
    </div>
  )
}