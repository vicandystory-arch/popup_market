import { createClient } from '@supabase/supabase-js'

// 환경 변수 확인
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://oaypyevjwtfoualfmjwq.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// 환경 변수 검증
if (!supabaseUrl) {
  throw new Error('Missing VITE_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  console.error('Missing VITE_SUPABASE_ANON_KEY environment variable')
  throw new Error(
    'Supabase Anonymous Key is required. ' +
    'Please set VITE_SUPABASE_ANON_KEY environment variable in your Vercel project settings.'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
