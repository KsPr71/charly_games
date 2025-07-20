"use client";

import { useEffect, useState } from "react";
import { Progress } from "@/components/ui/progress";

interface ProgressBarProps {
  isLoading: boolean;
  progress?: number; // Opcional: si quieres controlar el progreso manualmente
  duration?: number; // Duración de la animación en ms
}

export function ProgressBar({ isLoading, progress, duration = 2000 }: ProgressBarProps) {
  const [internalProgress, setInternalProgress] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setInternalProgress(100);
      const timer = setTimeout(() => setInternalProgress(0), 500);
      return () => clearTimeout(timer);
    }

    // Si no se proporciona progress, usamos una animación simulada
    if (progress === undefined) {
      const interval = setInterval(() => {
        setInternalProgress((prev) => {
          // Incremento no lineal para mejor experiencia de usuario
          if (prev >= 90) return prev + 0.5;
          if (prev >= 70) return prev + 1;
          return prev + 2;
        });
      }, duration / 100);

      return () => clearInterval(interval);
    } else {
      setInternalProgress(progress);
    }
  }, [isLoading, progress, duration]);

  if (!isLoading && internalProgress === 0) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <Progress 
        value={internalProgress} 
        className="h-1.5 rounded-none bg-gradient-to-r from-fuchsia-500 to-purple-600 transition-all duration-300 ease-out"
      />
      {isLoading && (
        <div className="text-xs text-center text-fuchsia-600 bg-fuchsia-100 py-1 animate-pulse">
          Cargando juegos...
        </div>
      )}
    </div>
  );
}