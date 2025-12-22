/**
 * This file contain the helper function to serialize or format error
 * Created At: 22/12/2025
 */

import { AppError } from './AppError.js';
import type { ErrorCategory } from './categories.js';
import type { ErrorCode } from './codes.js';

// Return Type
interface ReturnType {
	name: string;
	message: string;
	code?: ErrorCode;
	category?: ErrorCategory;
	details?: unknown;
}

export function serializeError(error: unknown): ReturnType {
	if (error instanceof AppError) {
		return {
			name: error.name,
			message: error.message,
			code: error.code,
			category: error.category,
			details: error.details,
		};
	}

	if (error instanceof Error) {
		return {
			name: error.name,
			message: error.message,
		};
	}

	return {
		name: 'UnknownError',
		message: String(error),
	};
}
