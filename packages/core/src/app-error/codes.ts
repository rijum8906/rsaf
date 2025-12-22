/**
 * Stable error codes used across RSAF.
 * These are machine-readable and safe to rely on programmatically.
 * Created At: 22/12/2025
 */
export const ERROR_CODES = {
	// Validation
	INVALID_PROP: 'INVALID_PROP',
	INVALID_TYPE: 'INVALID_TYPE',
	MISSING_REQUIRED_FIELD: 'MISSING_REQUIRED_FIELD',

	// Build / Compiler
	BUILD_FAILED: 'BUILD_FAILED',
	COMPILATION_ERROR: 'COMPILATION_ERROR',

	// Runtime
	RENDER_FAILED: 'RENDER_FAILED',
	HYDRATION_FAILED: 'HYDRATION_FAILED',

	// File system
	FILE_NOT_FOUND: 'FILE_NOT_FOUND',
	PERMISSION_DENIED: 'PERMISSION_DENIED',

	// UNKNOWN
	UNKNOWN_ERROR: 'UNKNOWN_ERROR',
} as const;

export type ErrorCode = (typeof ERROR_CODES)[keyof typeof ERROR_CODES];
