// src/lib/supabaseClient.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl: string =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  'https://ljxupnduvitekisiihom.supabase.co';

const supabaseAnonKey: string =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
  'sb_publishable_gBBojLk92s0N1W9JeMQ-bQ_sZTZ7cMN';

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Example function to log a user in via Supabase Auth
 * @param email User's email address
 * @param password User's password
 * @returns JWT access_token string to send to backend API
 */
export const loginUser = async (email: string, password: string): Promise<string | undefined> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  // This access_token is the JWT token you will send to your backend API
  const token = data.session?.access_token;
  return token;
};
