import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// For server-side operations (API routes)
// Only create admin client if service role key is available (server-side only)
const serviceRoleKey = typeof window === 'undefined' ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined

// Clean the service role key by removing any newlines or extra whitespace
const cleanedServiceRoleKey = serviceRoleKey?.replace(/[\r\n\s]+/g, '')

if (typeof window === 'undefined') {
  console.log('[Supabase Init] Service role key length:', serviceRoleKey?.length)
  console.log('[Supabase Init] Service role key has newlines:', serviceRoleKey?.includes('\n'))
  console.log('[Supabase Init] Cleaned service role key length:', cleanedServiceRoleKey?.length)
}

export const supabaseAdmin = typeof window === 'undefined' && cleanedServiceRoleKey
  ? createClient(supabaseUrl, cleanedServiceRoleKey)
  : supabase // Fallback to regular client on client-side (though it shouldn't be used there)
