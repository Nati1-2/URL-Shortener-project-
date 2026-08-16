export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogContext {
  service?: string;
  requestId?: string;
  correlationId?: string;
  userId?: string;
  workspaceId?: string;
  route?: string;
  method?: string;
  statusCode?: number;
  durationMs?: number;
  [key: string]: any;
}

export class Logger {
  private serviceName: string;

  constructor(serviceName: string = "linkpulse-service") {
    this.serviceName = serviceName;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): string {
    const entry = {
      timestamp: new Date().toISOString(),
      level: level.toUpperCase(),
      service: context?.service || this.serviceName,
      message,
      ...(context || {}),
      ...(error ? { error: { name: error.name, message: error.message, stack: error.stack } } : {}),
    };
    return JSON.stringify(entry);
  }

  public info(message: string, context?: LogContext): void {
    console.log(this.formatMessage("info", message, context));
  }

  public warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage("warn", message, context));
  }

  public error(message: string, error?: Error, context?: LogContext): void {
    console.error(this.formatMessage("error", message, context, error));
  }

  public debug(message: string, context?: LogContext): void {
    if (process.env.LOG_LEVEL === "debug" || process.env.NODE_ENV === "development") {
      console.debug(this.formatMessage("debug", message, context));
    }
  }

  public child(subContext: LogContext): Logger {
    const childLogger = new Logger(subContext.service || this.serviceName);
    return childLogger;
  }
}

export const createLogger = (serviceName: string): Logger => new Logger(serviceName);
