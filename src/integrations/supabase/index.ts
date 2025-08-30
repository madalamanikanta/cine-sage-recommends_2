import { createClient } from '@supabase/supabase-js';
import { config } from '@/lib/env';
import { logger } from '@/lib/logger';

const supabaseUrl = config.supabase.url;
const supabaseKey = config.supabase.publishableKey;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Debug logging setup
if (config.app.enableDebug) {
  supabase.auth.onAuthStateChange((event, session) => {
    logger.debug('Supabase Auth State Change:', { event, session });
  });
}
