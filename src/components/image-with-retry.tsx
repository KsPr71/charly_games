import { useState, useEffect } from 'react';
import Image from 'next/image';

interface ImageWithRetryProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  onError?: (e: any) => void;
  onLoad?: () => void;
}

export function ImageWithRetry({ 
  src, 
  alt, 
  className, 
  fill = true, 
  sizes, 
  onError, 
  onLoad 
}: ImageWithRetryProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);

  const maxRetries = 3;
  
  // URLs de fallback para imágenes que no cargan
  const fallbackImages = [
    '/logo.png', // Logo de la aplicación como fallback
    'https://via.placeholder.com/400x300/fuchsia/white?text=Imagen+No+Disponible',
    'https://via.placeholder.com/400x300/gray/white?text=Sin+Imagen'
  ];

  const handleError = (e: any) => {
    console.error('Image load error:', src, 'Retry:', retryCount);
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Agregar timestamp para evitar caché
      setCurrentSrc(`${src}?retry=${retryCount + 1}&t=${Date.now()}`);
    } else if (retryCount < maxRetries + fallbackImages.length) {
      // Usar imágenes de fallback
      const fallbackIndex = retryCount - maxRetries;
      if (fallbackIndex < fallbackImages.length) {
        setCurrentSrc(fallbackImages[fallbackIndex]);
        setRetryCount(prev => prev + 1);
      } else {
        setHasError(true);
        onError?.(e);
      }
    } else {
      setHasError(true);
      onError?.(e);
    }
  };

  const handleLoad = () => {
    setHasError(false);
    onLoad?.();
  };

  useEffect(() => {
    setCurrentSrc(src);
    setRetryCount(0);
    setHasError(false);
  }, [src]);

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}>
        <div className="text-center">
          <div className="text-gray-400 text-4xl mb-2">🖼️</div>
          <span className="text-gray-500 text-xs font-medium">Imagen no disponible</span>
        </div>
      </div>
    );
  }

  return (
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
  );
} 