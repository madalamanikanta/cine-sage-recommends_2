type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: any
  timestamp: string
  source?: string
}

class Logger {
  private isDevelopment = import.meta.env.DEV

  private formatMessage(level: LogLevel, message: string, data?: any, source?: string): LogEntry {
    return {
      level,
      message,
      data,
      timestamp: new Date().toISOString(),
      source
    }
  }

  private log(entry: LogEntry) {
    if (!this.isDevelopment && entry.level === 'debug') return

    const prefix = `[${entry.timestamp}] ${entry.level.toUpperCase()}`
    const sourcePrefix = entry.source ? ` [${entry.source}]` : ''
    const fullMessage = `${prefix}${sourcePrefix}: ${entry.message}`

    switch (entry.level) {
      case 'debug':
        console.debug(fullMessage, entry.data || '')
        break
      case 'info':
        console.info(fullMessage, entry.data || '')
        break
      case 'warn':
        console.warn(fullMessage, entry.data || '')
        break
      case 'error':
        console.error(fullMessage, entry.data || '')
        break
    }
  }

  debug(message: string, data?: any, source?: string) {
    this.log(this.formatMessage('debug', message, data, source))
  }

  info(message: string, data?: any, source?: string) {
    this.log(this.formatMessage('info', message, data, source))
  }

  warn(message: string, data?: any, source?: string) {
    this.log(this.formatMessage('warn', message, data, source))
  }

  error(message: string, data?: any, source?: string) {
    this.log(this.formatMessage('error', message, data, source))
  }

  // Supabase-specific logging
  supabaseCall(operation: string, table?: string, data?: any) {
    this.debug(`Supabase ${operation}${table ? ` on ${table}` : ''}`, data, 'SUPABASE')
  }

  supabaseSuccess(operation: string, table?: string, result?: any) {
    this.info(`Supabase ${operation}${table ? ` on ${table}` : ''} succeeded`, result, 'SUPABASE')
  }

  supabaseError(operation: string, error: any, table?: string) {
    this.error(`Supabase ${operation}${table ? ` on ${table}` : ''} failed`, error, 'SUPABASE')
  }
}

export const logger = new Logger()
