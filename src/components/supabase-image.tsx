import { useState, useEffect } from 'react';
import Image from 'next/image';
import { cleanSupabaseUrl } from '@/lib/utils';

interface SupabaseImageProps {
  src: string;
  alt: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  onError?: (e: any) => void;
  onLoad?: () => void;
}

export function SupabaseImage({ 
  src, 
  alt, 
  className, 
  fill = true, 
  sizes, 
  onError, 
  onLoad 
}: SupabaseImageProps) {
  const [currentSrc, setCurrentSrc] = useState(src);
  const [retryCount, setRetryCount] = useState(0);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const maxRetries = 2;
  
  // URLs de fallback específicas para Supabase
  const fallbackImages = [
    '/logo.png',
    '/logo1.png',
    'https://via.placeholder.com/400x300/fuchsia/white?text=Charly+Games',
    'https://via.placeholder.com/400x300/gray/white?text=Sin+Imagen'
  ];

  const handleError = (e: any) => {
    console.error('🚨 Supabase image load error:', {
      originalSrc: src,
      currentSrc: currentSrc,
      retryCount,
      error: e
    });
    
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      // Intentar con diferentes parámetros de Supabase
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
        onError?.(e);
      }
    } else {
      setHasError(true);
      setIsLoading(false);
      onError?.(e);
    }
  };

  const handleLoad = () => {
    setHasError(false);
    setIsLoading(false);
    console.log('✅ Image loaded successfully:', currentSrc);
    onLoad?.();
  };

  useEffect(() => {
    console.log('🖼️ SupabaseImage received src:', src);
    
    if (!src || src.trim() === '') {
      console.warn('⚠️ Empty or invalid image URL:', src);
      setHasError(true);
      setIsLoading(false);
      return;
    }
    
    const cleanSrc = cleanSupabaseUrl(src);
    console.log('🧹 Cleaned URL:', cleanSrc);
    
    setCurrentSrc(cleanSrc);
    setRetryCount(0);
    setHasError(false);
    setIsLoading(true);
  }, [src]);

  if (hasError) {
    return (
      <div className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center relative`}>
        <div className="text-center">
          <div className="text-gray-400 text-3xl mb-2">🎮</div>
          <span className="text-gray-500 text-xs font-medium">Imagen no disponible</span>
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
    </div>
  );
} 