/**
 * this file contains the defineConfig function to configure an app
 * Created At: 22/12/2025
 */

import { AppError } from '../app-error/AppError.js';

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
	// Validate the configuration
	const { error } = configSchema.safeParse(config);
	if (error) {
		throw new AppError(error.issues[0]?.message || 'Error while validating config file', {
			code: 'INVALID_PROP',
			category: 'validation',
			cause: error.cause,
			details: error.issues,
		});
	}

	// Return
	return {
		htmlTemplatePath: config.htmlTemplatePath,
		appModulePath: config.appModulePath,
	};
}
