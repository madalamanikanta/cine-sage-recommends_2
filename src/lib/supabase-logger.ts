import { logger } from './logger'

// Simple logging wrapper for Supabase operations
export const logSupabaseOperation = {
  start: (operation: string, table?: string, data?: any) => {
    logger.supabaseCall(operation, table, data)
  },
  
  success: (operation: string, table?: string, result?: any) => {
    logger.supabaseSuccess(operation, table, result)
  },
  
  error: (operation: string, error: any, table?: string) => {
    logger.supabaseError(operation, error, table)
  }
}
