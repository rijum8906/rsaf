/**
 * Stable error catagories used across RSAF.
 * These are machine-readable and safe to rely on programmatically.
 */

export const ERROR_CATEGORIES = {
	VALIDATION: 'validation',
	BUILD: 'build',
	RUNTIME: 'runtime',
	FS: 'filesystem',
	UNKNOWN: 'unknown',
} as const;

export type ErrorCategory = (typeof ERROR_CATEGORIES)[keyof typeof ERROR_CATEGORIES];
