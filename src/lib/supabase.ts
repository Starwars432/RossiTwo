import { createClient } from '@supabase/supabase-js';
import { Database } from './database.types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing Supabase environment variables. Please ensure your .env file contains valid VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY values.'
  );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: window.localStorage
  },
  global: {
    headers: {
      'Content-Type': 'application/json'
    }
  },
  db: {
    schema: 'public'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Test connection and retry logic with improved error handling
const testConnection = async (retries = 3, delay = 1000): Promise<void> => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const { error } = await supabase.from('pages').select('count', { count: 'exact', head: true });
      
      if (error) throw error;
      console.log('Successfully connected to Supabase');
      return;
    } catch (error) {
      console.warn(`Supabase connection attempt ${attempt} failed:`, error);
      
      if (attempt === retries) {
        console.error('Failed to connect to Supabase after all attempts. Please check your environment variables and network connection.');
        return; // Don't throw, just log error
      }
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Initialize connection test without blocking
testConnection().catch(console.error);

export type { Database };