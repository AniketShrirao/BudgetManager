// src/supabase.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL; // Supabase URL from .env
const supabaseKey = process.env.REACT_APP_SUPABASE_KEY; // Supabase API key from .env

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;