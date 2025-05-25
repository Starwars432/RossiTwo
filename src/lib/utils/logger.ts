type LogLevel = 'info' | 'warn' | 'error';

interface LogOptions {
  context?: string;
  data?: unknown;
}

class Logger {
  private static instance: Logger;
  private isDevelopment = import.meta.env.DEV;

  private constructor() {}

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  private formatMessage(level: LogLevel, message: string, options?: LogOptions): string {
    const timestamp = new Date().toISOString();
    const context = options?.context ? `[${options.context}]` : '';
    return `${timestamp} ${level.toUpperCase()} ${context} ${message}`;
  }

  public info(message: string, options?: LogOptions): void {
    if (this.isDevelopment) {
      console.info(
        this.formatMessage('info', message, options),
        options?.data || ''
      );
    }
  }

  public warn(message: string, options?: LogOptions): void {
    console.warn(
      this.formatMessage('warn', message, options),
      options?.data || ''
    );
  }

  public error(message: string, error?: Error, options?: LogOptions): void {
    console.error(
      this.formatMessage('error', message, options),
      error || '',
      options?.data || ''
    );
  }
}

export const logger = Logger.getInstance();