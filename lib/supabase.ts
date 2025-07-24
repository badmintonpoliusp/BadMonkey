// lib/supabase.ts
import 'react-native-url-polyfill/auto'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!

const isWeb = typeof window !== 'undefined'

let supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isWeb ? window.localStorage : undefined,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: isWeb,
  },
})

// ⏳ Adicionar suporte a AppState apenas no mobile
if (!isWeb) {
  const { AppState } = require('react-native')
  AppState.addEventListener('change', (state: string) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh()
    } else {
      supabase.auth.stopAutoRefresh()
    }
  })

  // Substituir storage por AsyncStorage apenas em mobile
  const AsyncStorage = require('@react-native-async-storage/async-storage').default
  supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      storage: AsyncStorage,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  })
}

export { supabase }
