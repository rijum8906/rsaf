import { join } from 'node:path';

import { Bundler, createClientConfig, createServerConfig } from '@rsaf/bundler';
import { AppError } from '@rsaf/core';
import type { DefineConfigResult } from '@rsaf/core/config';

import { CONFIG_FILE_PATH } from './constants.js';

/**
 * Initializes the dual-target bundling system by creating specialized bundlers
 * for both Client and Server environments.
 * * * @remarks
 * This function is the primary bridge between raw user configuration and the
 * active {@link Bundler} instances. It ensures that both targets use the same
 * `absWorkingDir` and entry point, maintaining architectural symmetry.
 * * @param cfg - The resolved configuration result from the user's config file.
 * @param env - The current environment mode (development or production).
 * * @returns An object containing:
 * - `clientBundler`: Configured for browser execution with asset handling.
 * - `serverBundler`: Configured for Node.js execution with externalized dependencies.
 */
export function createBundlers(
	cfg: DefineConfigResult,
	env: 'dev' | 'prod'
): {
	clientBundler: Bundler;
	serverBundler: Bundler;
} {
	// Generate specialized esbuild configurations based on the environment
	const clientBundlerConfig = createClientConfig(env, {
		absWorkingDir: process.cwd(),
		entryPoints: [join(process.cwd(), cfg.appModulePath)],
	});

	const serverBundlerConfig = createServerConfig(env, {
		absWorkingDir: process.cwd(),
		entryPoints: [join(process.cwd(), cfg.appModulePath)],
	});

	// Instantiate the Bundler wrappers
	const clientBundler = new Bundler(clientBundlerConfig);
	const serverBundler = new Bundler(serverBundlerConfig);

	return {
		clientBundler,
		serverBundler,
	};
}

/**
 * Dynamically imports and resolves the project's configuration file.
 * * * @remarks
 * This function looks for the file defined by {@link CONFIG_FILE_PATH} (usually `rsaf.config.ts`)
 * at the process root. It expects the configuration to be the `default` export.
 * * @returns A promise resolving to the user-defined {@link DefineConfigResult}.
 * @throws {Error} If the config file cannot be found or the default export is missing.
 */
export async function callConfigFile(): Promise<DefineConfigResult> {
	// Dynamically import the config file from the user's working directory
	const cfgModule = await import(join(process.cwd(), CONFIG_FILE_PATH));
	const res = cfgModule.default;

	if (!res) {
		throw new AppError(
			`[rsaf] Configuration file at ${CONFIG_FILE_PATH} must have a default export.`,
			{
				code: 'COMPILATION_ERROR',
				category: 'validation',
			}
		);
	}

	return res;
}
