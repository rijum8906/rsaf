/**
 * This file contains the ApoError Class
 * A centralize Error
 * Created At: 22/12/2025
 */

import type { ErrorCategory } from './categories.js';
import { ERROR_CATEGORIES } from './categories.js';
import type { ErrorCode } from './codes.js';

export interface AppErrorOptions {
	code?: ErrorCode;
	category?: ErrorCategory;
	cause?: unknown;
	details?: any; //eslint-disable-line
}

export class AppError extends Error {
	readonly code: ErrorCode;
	readonly category: ErrorCategory;
	override readonly cause?: unknown;
	readonly details?: any; // eslint-disable-line

	constructor(message: string, options: AppErrorOptions = {}) {
		super(message);
		this.name = 'AppError';

		this.code = options.code ?? 'UNKNOWN_ERROR';
		this.category = options.category ?? ERROR_CATEGORIES.UNKNOWN;
		this.cause = options.cause;
		this.details = options.details;
	}
}
