import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

export async function getContactData() {
  const { data, error } = await supabase
    .from('contacto')
    .select('nombre, telefono, facebook, insta')
    .single() // Si solo hay un registro de contacto
  
  if (error) {
    console.error('Error fetching contact data:', error)
    return null
  }
  
  return data
}