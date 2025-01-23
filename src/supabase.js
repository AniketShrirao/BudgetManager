import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://YOUR_SUPABASE_URL.supabase.co'; // Replace with your Supabase URL
const supabaseKey = 'YOUR_ANON_KEY'; // Replace with your anon key
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
