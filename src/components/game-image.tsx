import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cleanSupabaseUrl } from '@/lib/utils';

interface GameImageProps {
  src: string | null | undefined;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  gameTitle?: string;
}

export function GameImage({ 
  src, 
  alt, 
  className, 
  fill = true, 
  sizes,
  gameTitle = "Juego"
}: GameImageProps) {
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const maxRetries = 2;
  
  // URLs de fallback específicas para juegos
  const fallbackImages = [
    '/logo.png',
    '/logo1.png',
    'https://via.placeholder.com/400x300/fuchsia/white?text=Charly+Games',
    'https://via.placeholder.com/400x300/gray/white?text=Sin+Imagen'
  ];

  const handleError = (e: any) => {
    console.error('🚨 Game image load error:', {
      originalSrc: src,
      currentSrc: currentSrc,
      retryCount,
      gameTitle,
      error: e
    });
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Intentar con diferentes parámetros
      const timestamp = Date.now();
      const cleanSrc = cleanSupabaseUrl(src);
      const newSrc = cleanSrc.includes('?') 
        ? `${cleanSrc}&t=${timestamp}` 
        : `${cleanSrc}?t=${timestamp}`;
      setCurrentSrc(newSrc);
    } else if (retryCount < maxRetries + fallbackImages.length) {
      // Usar imágenes de fallback
      const fallbackIndex = retryCount - maxRetries;
      if (fallbackIndex < fallbackImages.length) {
        setCurrentSrc(fallbackImages[fallbackIndex]);
        setRetryCount(prev => prev + 1);
      } else {
        setHasError(true);
        setIsLoading(false);
      }
    } else {
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleLoad = () => {
    setHasError(false);
    setIsLoading(false);
    console.log('✅ Game image loaded successfully:', currentSrc);
  };

  useEffect(() => {
    console.log('🖼️ GameImage received src:', src, 'for game:', gameTitle);
    
    // Validar que src no sea null, undefined, o una cadena vacía
    if (!src || (typeof src === 'string' && src.trim() === '')) {
      console.warn('⚠️ Empty or invalid image URL for game:', gameTitle);
      setHasError(true);
      setIsLoading(false);
      setCurrentSrc('');
      return;
    }
    
    const cleanSrc = cleanSupabaseUrl(src);
    console.log('🧹 Cleaned game URL:', cleanSrc);
    
    if (!cleanSrc || cleanSrc.trim() === '') {
      console.warn('⚠️ Cleaned URL is empty for game:', gameTitle);
      setHasError(true);
      setIsLoading(false);
      setCurrentSrc('');
      return;
    }
    
    setCurrentSrc(cleanSrc);
    setRetryCount(0);
    setHasError(false);
    setIsLoading(true);
  }, [src, gameTitle]);

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative`}>
        <div className="text-center">
          <div className="text-gray-400 text-3xl mb-2">🎮</div>
          <span className="text-gray-500 text-xs font-medium">Sin imagen</span>
          {gameTitle && (
            <div className="text-gray-400 text-xs mt-1">{gameTitle}</div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center absolute inset-0 z-10`}>
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      )}
      {currentSrc && currentSrc.trim() !== '' ? (
        <Image
          src={currentSrc}
          alt={alt}
          fill={fill}
          className={className}
          sizes={sizes}
          onError={handleError}
          onLoad={handleLoad}
          loading="lazy"
          unoptimized
        />
      ) : (
        <div className={`${className} bg-gray-200 animate-pulse flex items-center justify-center`}>
          <div className="text-gray-400 text-sm">Cargando...</div>
        </div>
      )}
    </div>
  );
} 