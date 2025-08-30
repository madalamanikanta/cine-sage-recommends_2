import { supabase } from './index';
import { logger } from '@/lib/logger';

export async function testSupabaseConnection() {
  try {
    // Test the connection by trying to fetch public data
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is OK
      logger.error('Supabase connection test failed:', error.message);
      return false;
    }
    
    logger.info('Supabase connection test successful');
    return true;
  } catch (error) {
    logger.error('Supabase connection test failed:', error);
    return false;
  }
}
