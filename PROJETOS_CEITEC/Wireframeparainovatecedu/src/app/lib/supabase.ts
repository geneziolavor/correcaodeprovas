import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase credentials missing. Check your .env.local file and ensure variables start with VITE_');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
