/**
 * this file contains the defineConfig function to configure an app
 * Created At: 22/12/2025
 */

import { existsSync } from 'node:fs';
import { join } from 'node:path';

import { AppError } from '../app-error/AppError.js';
import { serializeError } from '../app-error/serialize.js';

import { configSchema, type RsafConfig } from './schema.js';

/**
 * Return Type of defineConfig
 */
export interface DefineConfigResult {
	appModulePath: string;
	htmlTemplatePath: string;
}

/**
 * Declare the configuration for this app
 * @param config - The config object to configure this app
 * @throws AppError - If any error it throws AppError
 * @example
 * ```typescript
 * import { defineConfig } from '@rsaf/core/config';
 *
 * export default defineConfig({
 *      appModulePath: './src/app/App.tsx',
 *      htmlTemplatePath: './index.html',
 * })
 * ```
 */
export function defineConfig(config: RsafConfig): DefineConfigResult {
	try {
		// Define required variables/constants
		const cwd = process.cwd();

		// Validate the configuration also the file extension
		const { error } = configSchema.safeParse(config);
		if (error) {
			throw new AppError(error.issues[0]?.message || 'Error while validating config file', {
				code: 'INVALID_PROP',
				category: 'validation',
				cause: error.cause,
				details: error.issues,
			});
		}

		// Check file existence
		const isAppExist = existsSync(join(cwd, config.appModulePath));
		if (!isAppExist)
			throw new AppError(`${config.appModulePath} - file doesn't exist.`, {
				code: 'FILE_NOT_FOUND',
				category: 'filesystem',
			});
		const isHtmlExist = existsSync(join(cwd, config.htmlTemplatePath));
		if (!isHtmlExist)
			throw new AppError(`${config.htmlTemplatePath} - file doesn't exist.`, {
				code: 'FILE_NOT_FOUND',
				category: 'filesystem',
			});

		// Return
		return {
			htmlTemplatePath: config.htmlTemplatePath,
			appModulePath: config.appModulePath,
		};
	} catch (
		error: any // eslint-disable-line
	) {
		const catchedErr = serializeError(error);
		console.log(catchedErr);

		process.exit(1);
	}
}
