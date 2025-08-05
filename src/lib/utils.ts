import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Función para limpiar y verificar URLs de Supabase
export function cleanSupabaseUrl(url: string | null | undefined): string {
  if (!url) {
    console.warn('❌ URL is null or undefined');
    return '';
  }
  
  // Eliminar espacios en blanco
  let cleanUrl = url.trim();
  
  if (cleanUrl === '') {
    console.warn('❌ URL is empty after trimming');
    return '';
  }
  
  // Verificar que no sea solo espacios o caracteres especiales
  if (cleanUrl.replace(/[\s\-_]/g, '') === '') {
    console.warn('❌ URL contains only whitespace or special characters');
    return '';
  }
  
  // Si la URL no tiene protocolo, agregar https
  if (!cleanUrl.startsWith('http://') && !cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }
  
  // Verificar que sea una URL válida de Supabase
  if (cleanUrl.includes('supabase.co')) {
    // Asegurar que tenga los parámetros correctos para Supabase Storage
    if (!cleanUrl.includes('/storage/v1/object/public/')) {
      console.warn('⚠️ URL de Supabase no válida:', cleanUrl);
      return '';
    }
  }
  
  // Verificar que la URL tenga un formato básico válido
  try {
    new URL(cleanUrl);
  } catch (error) {
    console.warn('❌ Invalid URL format:', cleanUrl);
    return '';
  }
  
  console.log('✅ Cleaned URL:', cleanUrl);
  return cleanUrl;
}

// Función para verificar si una imagen existe
export async function checkImageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch (error) {
    console.error('Error checking image:', url, error);
    return false;
  }
}
