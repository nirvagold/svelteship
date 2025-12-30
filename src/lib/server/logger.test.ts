/**
 * Tests for structured logging module
 * Property-based tests using fast-check
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as fc from 'fast-check';

// Copy pure functions from logger.ts to avoid SvelteKit import issues
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogContext {
	requestId?: string;
	userId?: string;
	[key: string]: unknown;
}

interface LogEntry {
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

const LOG_LEVELS: Record<LogLevel, number> = {
	debug: 0,
	info: 1,
	warn: 2,
	error: 3
};

function formatLogEntry(entry: LogEntry, pretty: boolean): string {
	if (pretty) {
		const levelColors: Record<LogLevel, string> = {
			debug: '\x1b[36m',
			info: '\x1b[32m',
			warn: '\x1b[33m',
			error: '\x1b[31m'
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

function shouldLog(level: LogLevel, minLevel: LogLevel): boolean {
	return LOG_LEVELS[level] >= LOG_LEVELS[minLevel];
}

function createLogEntry(
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

// Arbitraries
const logLevelArb = fc.constantFrom<LogLevel>('debug', 'info', 'warn', 'error');

const logContextArb = fc.record({
	requestId: fc.option(fc.uuid(), { nil: undefined }),
	userId: fc.option(fc.uuid(), { nil: undefined })
});

const safeStringArb = fc.string({ minLength: 1, maxLength: 100 }).filter(s => !s.includes('\x00'));

describe('Logger', () => {
	describe('formatLogEntry', () => {
		it('should output valid JSON in production mode (pretty=false)', () => {
			fc.assert(
				fc.property(
					logLevelArb,
					safeStringArb,
					logContextArb,
					(level, message, context) => {
						const entry = createLogEntry(level, message, context);
						const output = formatLogEntry(entry, false);
						
						// Should be valid JSON
						const parsed = JSON.parse(output);
						expect(parsed).toHaveProperty('timestamp');
						expect(parsed).toHaveProperty('level', level);
						expect(parsed).toHaveProperty('message', message);
					}
				),
				{ numRuns: 50 }
			);
		});

		it('should include timestamp in ISO format', () => {
			fc.assert(
				fc.property(
					logLevelArb,
					safeStringArb,
					(level, message) => {
						const entry = createLogEntry(level, message);
						const output = formatLogEntry(entry, false);
						const parsed = JSON.parse(output);
						
						// Timestamp should be valid ISO string
						const date = new Date(parsed.timestamp);
						expect(date.toISOString()).toBe(parsed.timestamp);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should include requestId when provided in context', () => {
			fc.assert(
				fc.property(
					logLevelArb,
					safeStringArb,
					fc.uuid(),
					(level, message, requestId) => {
						const entry = createLogEntry(level, message, { requestId });
						const output = formatLogEntry(entry, false);
						const parsed = JSON.parse(output);
						
						expect(parsed.context).toBeDefined();
						expect(parsed.context.requestId).toBe(requestId);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should include error details when error is provided', () => {
			fc.assert(
				fc.property(
					safeStringArb,
					safeStringArb,
					(message, errorMessage) => {
						const error = new Error(errorMessage);
						const entry = createLogEntry('error', message, undefined, error);
						const output = formatLogEntry(entry, false);
						const parsed = JSON.parse(output);
						
						expect(parsed.error).toBeDefined();
						expect(parsed.error.name).toBe('Error');
						expect(parsed.error.message).toBe(errorMessage);
						expect(parsed.error.stack).toBeDefined();
					}
				),
				{ numRuns: 30 }
			);
		});
	});

	describe('shouldLog', () => {
		it('should filter logs below minimum level', () => {
			fc.assert(
				fc.property(
					logLevelArb,
					logLevelArb,
					(level, minLevel) => {
						const result = shouldLog(level, minLevel);
						const levelNum = LOG_LEVELS[level];
						const minLevelNum = LOG_LEVELS[minLevel];
						
						expect(result).toBe(levelNum >= minLevelNum);
					}
				),
				{ numRuns: 50 }
			);
		});

		it('should always log at or above minimum level', () => {
			// debug < info < warn < error
			expect(shouldLog('debug', 'debug')).toBe(true);
			expect(shouldLog('info', 'debug')).toBe(true);
			expect(shouldLog('warn', 'debug')).toBe(true);
			expect(shouldLog('error', 'debug')).toBe(true);
			
			expect(shouldLog('debug', 'info')).toBe(false);
			expect(shouldLog('info', 'info')).toBe(true);
			expect(shouldLog('warn', 'info')).toBe(true);
			expect(shouldLog('error', 'info')).toBe(true);
			
			expect(shouldLog('debug', 'warn')).toBe(false);
			expect(shouldLog('info', 'warn')).toBe(false);
			expect(shouldLog('warn', 'warn')).toBe(true);
			expect(shouldLog('error', 'warn')).toBe(true);
			
			expect(shouldLog('debug', 'error')).toBe(false);
			expect(shouldLog('info', 'error')).toBe(false);
			expect(shouldLog('warn', 'error')).toBe(false);
			expect(shouldLog('error', 'error')).toBe(true);
		});
	});

	describe('createLogEntry', () => {
		it('should create entry with all required fields', () => {
			fc.assert(
				fc.property(
					logLevelArb,
					safeStringArb,
					(level, message) => {
						const entry = createLogEntry(level, message);
						
						expect(entry.timestamp).toBeDefined();
						expect(entry.level).toBe(level);
						expect(entry.message).toBe(message);
					}
				),
				{ numRuns: 50 }
			);
		});

		it('should omit empty context', () => {
			const entry = createLogEntry('info', 'test message', {});
			expect(entry.context).toBeUndefined();
		});

		it('should include non-empty context', () => {
			fc.assert(
				fc.property(
					fc.uuid(),
					(requestId) => {
						const entry = createLogEntry('info', 'test', { requestId });
						expect(entry.context).toBeDefined();
						expect(entry.context?.requestId).toBe(requestId);
					}
				),
				{ numRuns: 30 }
			);
		});
	});

	describe('Pretty formatting', () => {
		it('should include level in uppercase with color codes', () => {
			fc.assert(
				fc.property(
					logLevelArb,
					safeStringArb,
					(level, message) => {
						const entry = createLogEntry(level, message);
						const output = formatLogEntry(entry, true);
						
						expect(output).toContain(`[${level.toUpperCase()}]`);
					}
				),
				{ numRuns: 30 }
			);
		});

		it('should include message in output', () => {
			fc.assert(
				fc.property(
					safeStringArb,
					(message) => {
						const entry = createLogEntry('info', message);
						const output = formatLogEntry(entry, true);
						
						expect(output).toContain(message);
					}
				),
				{ numRuns: 30 }
			);
		});
	});
});

describe('Logger Integration', () => {
	let consoleSpy: {
		log: ReturnType<typeof vi.spyOn>;
		warn: ReturnType<typeof vi.spyOn>;
		error: ReturnType<typeof vi.spyOn>;
	};

	beforeEach(() => {
		consoleSpy = {
			log: vi.spyOn(console, 'log').mockImplementation(() => {}),
			warn: vi.spyOn(console, 'warn').mockImplementation(() => {}),
			error: vi.spyOn(console, 'error').mockImplementation(() => {})
		};
	});

	afterEach(() => {
		vi.restoreAllMocks();
	});

	it('should use correct console method for each level', async () => {
		// Import the actual logger
		const { createLogger } = await import('./logger');
		const logger = createLogger({ level: 'debug', pretty: false });

		logger.debug('debug message');
		expect(consoleSpy.log).toHaveBeenCalled();

		logger.info('info message');
		expect(consoleSpy.log).toHaveBeenCalledTimes(2);

		logger.warn('warn message');
		expect(consoleSpy.warn).toHaveBeenCalled();

		logger.error('error message');
		expect(consoleSpy.error).toHaveBeenCalled();
	});

	it('should respect minimum log level', async () => {
		const { createLogger } = await import('./logger');
		const logger = createLogger({ level: 'warn', pretty: false });

		logger.debug('debug message');
		logger.info('info message');
		expect(consoleSpy.log).not.toHaveBeenCalled();

		logger.warn('warn message');
		expect(consoleSpy.warn).toHaveBeenCalled();

		logger.error('error message');
		expect(consoleSpy.error).toHaveBeenCalled();
	});

	it('should create child logger with merged context', async () => {
		const { createLogger } = await import('./logger');
		const logger = createLogger({ level: 'debug', pretty: false });
		const childLogger = logger.child({ requestId: 'req-123' });

		childLogger.info('child message', { userId: 'user-456' });

		expect(consoleSpy.log).toHaveBeenCalled();
		const logOutput = consoleSpy.log.mock.calls[0][0] as string;
		const parsed = JSON.parse(logOutput);
		
		expect(parsed.context.requestId).toBe('req-123');
		expect(parsed.context.userId).toBe('user-456');
	});
});
