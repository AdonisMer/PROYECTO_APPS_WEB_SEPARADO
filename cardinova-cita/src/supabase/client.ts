import { createClient } from '@supabase/supabase-js';

// URL CORRECTA (verifica la diferencia: "hupvsaxcjrhfkjjixrwm")
const supabaseUrl = 'https://hupvsaxcjrhfkjjixrwm.supabase.co';
const supabaseAnonKey = 'sb_publishable_SnOOZc8cx0m5aEtsWODE8A_Yy0NpA5Z';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);