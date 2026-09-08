// supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ljxupnduvitekisiihom.supabase.co';
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_gBBojLk92s0N1W9JeMQ-bQ_sZTZ7cMN';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Example function to log a user in
export const loginUser = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email,
    password: password,
  });

  if (error) throw error;

  // This access_token is the JWT token you will send to your backend API
  const token = data.session?.access_token;
  return token;
};
