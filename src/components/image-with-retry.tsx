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

  const handleError = (e: any) => {
    console.error('Image load error:', src, 'Retry:', retryCount);
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Agregar timestamp para evitar caché
      setCurrentSrc(`${src}?retry=${retryCount + 1}&t=${Date.now()}`);
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
      <div className={`${className} bg-gray-200 flex items-center justify-center`}>
        <span className="text-gray-500 text-sm">Imagen no disponible</span>
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