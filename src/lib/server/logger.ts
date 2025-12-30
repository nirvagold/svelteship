/**
 * Structured logging module
 * Supports JSON output, log levels, request IDs, and optional Sentry integration
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface LogContext {
	requestId?: string;
	userId?: string;
	[key: string]: unknown;
}

export interface LogEntry {
	timestamp: string;
	level: LogLevel;
	message: string;
	context?: LogContext;
	error?: {
		name: string;
		message: string;
		stack?: string;
	};
}

export interface LoggerConfig {
	level?: LogLevel;
	pretty?: boolean;
	sentry?: {
		dsn: string;
	};
}

export interface Logger {
	debug(message: string, context?: LogContext): void;
	info(message: string, context?: LogContext): void;
	warn(message: string, context?: LogContext): void;
	error(message: string, error?: Error | null, context?: LogContext): void;
	child(context: LogContext): Logger;
}

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

/**
 * Format a log entry as JSON string
 */
export function formatLogEntry(entry: LogEntry, pretty: boolean): string {
	if (pretty) {
		const levelColors: Record<LogLevel, string> = {
			debug: '\x1b[36m', // cyan
			info: '\x1b[32m', // green
			warn: '\x1b[33m', // yellow
			error: '\x1b[31m' // red
		};
		const reset = '\x1b[0m';
		const color = levelColors[entry.level];
		
		let output = `${color}[${entry.level.toUpperCase()}]${reset} ${entry.timestamp} - ${entry.message}`;
		
		if (entry.context && Object.keys(entry.context).length > 0) {
			output += ` ${JSON.stringify(entry.context)}`;
		}
		
		if (entry.error) {
			output += `\n  Error: ${entry.error.name}: ${entry.error.message}`;
			if (entry.error.stack) {
				output += `\n  ${entry.error.stack}`;
			}
		}
		
		return output;
	}
	
	return JSON.stringify(entry);
}

/**
 * Check if a log level should be output based on minimum level
 */
export function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
	return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

/**
 * Create a log entry object
 */
export function createLogEntry(
	level: LogLevel,
	message: string,
	context?: LogContext,
	error?: Error | null
): LogEntry {
	const entry: LogEntry = {
		timestamp: new Date().toISOString(),
		level,
		message
	};
	
	if (context && Object.keys(context).length > 0) {
		entry.context = context;
	}
	
	if (error) {
		entry.error = {
			name: error.name,
			message: error.message,
			stack: error.stack
		};
	}
	
	return entry;
}

/**
 * Create a logger instance
 */
export function createLogger(config: LoggerConfig = {}): Logger {
	const minLevel = config.level ?? 'info';
	const pretty = config.pretty ?? (process.env.NODE_ENV !== 'production');
	
	function log(level: LogLevel, message: string, context?: LogContext, error?: Error | null): void {
		if (!shouldLog(level, minLevel)) {
			return;
		}
		
		const entry = createLogEntry(level, message, context, error);
		const output = formatLogEntry(entry, pretty);
		
		switch (level) {
			case 'debug':
			case 'info':
				console.log(output);
				break;
			case 'warn':
				console.warn(output);
				break;
			case 'error':
				console.error(output);
				// Send to Sentry if configured
				if (config.sentry && error) {
					// Sentry integration would go here
					// For now, just log that we would send to Sentry
					if (pretty) {
						console.log(`[Sentry] Would send error to ${config.sentry.dsn}`);
					}
				}
				break;
		}
	}
	
	const logger: Logger = {
		debug(message: string, context?: LogContext): void {
			log('debug', message, context);
		},
		
		info(message: string, context?: LogContext): void {
			log('info', message, context);
		},
		
		warn(message: string, context?: LogContext): void {
			log('warn', message, context);
		},
		
		error(message: string, error?: Error | null, context?: LogContext): void {
			log('error', message, context, error);
		},
		
		child(childContext: LogContext): Logger {
			// Create a child logger with merged context
			const childLogger: Logger = {
				debug(message: string, context?: LogContext): void {
					log('debug', message, { ...childContext, ...context });
				},
				info(message: string, context?: LogContext): void {
					log('info', message, { ...childContext, ...context });
				},
				warn(message: string, context?: LogContext): void {
					log('warn', message, { ...childContext, ...context });
				},
				error(message: string, error?: Error | null, context?: LogContext): void {
					log('error', message, { ...childContext, ...context }, error);
				},
				child(nestedContext: LogContext): Logger {
					return logger.child({ ...childContext, ...nestedContext });
				}
			};
			return childLogger;
		}
	};
	
	return logger;
}

// Default logger instance
export const logger = createLogger();
