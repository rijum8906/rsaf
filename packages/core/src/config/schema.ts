/**
 * This file conatains schema for validation for config
 * Created At: 22/12/2015
 */

import z from 'zod';

import { AppError } from '../app-error/AppError.js';
import type { ErrorCategory } from '../app-error/categories.js';
import type { ErrorCode } from '../app-error/codes.js';

export const configSchema = z
	.object({
		htmlTemplatePath: z.string().endsWith('.html').nonempty('htmlTemplatePath is required'),
		serverEntryPoint: z.string().endsWith('.tsx').nonempty('serverEndpoint is required'),
		clientEntryPoint: z.string().endsWith('.tsx').nonempty('clientEndpoint is required'),
	})
	.catch(ctx => {
		// Create custom erorr code, category, message to match the centralize error format
		const code: ErrorCode =
			ctx.issues[0]?.code === 'invalid_format' ? 'INVALID_TYPE' : 'UNKNOWN_ERROR';
		const category: ErrorCategory = 'filesystem';
		const message = `"${ctx.issues[0]?.input}" is not a valid file type"`;

		// Throw AppError to centralize error
		throw new AppError(message, {
			code,
			category,
			details: ctx.issues,
		});
	});

// export type
export type RsafConfig = z.infer<typeof configSchema>;
