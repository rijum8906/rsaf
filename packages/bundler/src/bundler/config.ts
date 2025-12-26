import { join } from 'node:path';

import {
	ASSET_LOADERS,
	BASE_LOADERS,
	ESBUILD_BASE_CONFIG,
	NO_ASSET_LOADERS,
} from '../config/esbuild.js';
import type {
	BuildEnv,
	ESBuildClientDevConfig,
	ESBuildClientProdConfig,
	ESBuildServerDevConfig,
	ESBuildServerProdConfig,
} from '../types/config.js';
import { CACHE_DIR } from '../utils/constants.js';

/**
 * Generates an esbuild configuration specifically for the Client (browser) environment.
 * * @remarks
 * The client configuration differs from the server in several key ways:
 * - **Platform**: Targeted for the `browser`.
 * - **Asset Loaders**: Includes loaders for images/styles (`ASSET_LOADERS`).
 * - **Bundling**: `bundle: true` is used to resolve all dependencies for the browser.
 * - **Write Mode**: In `dev`, `write` is set to `false` to support in-memory serving.
 * * @param env - The build environment: `'dev'` for development or `'prod'` for production.
 * @param options - Configuration details.
 * @param options.absWorkingDir - The absolute path to the project root.
 * @param options.entryPoints - File paths or a mapping for the entry points to be bundled.
 * * @returns A configuration object typed for either {@link ESBuildClientDevConfig} or {@link ESBuildClientProdConfig}.
 */
export function createClientConfig(
	env: BuildEnv,
	options: {
		absWorkingDir: string;
		entryPoints: string[] | Record<string, string>;
	}
): ESBuildClientDevConfig | ESBuildClientProdConfig {
	const isDev = env === 'dev';
	const cwd = process.cwd();

	const baseConfig = {
		...ESBUILD_BASE_CONFIG,
		absWorkingDir: options.absWorkingDir,
		entryPoints: options.entryPoints,
		outdir: join(cwd, CACHE_DIR, 'client'),
		plugins: [],
	};

	if (isDev) {
		return {
			...baseConfig,
			platform: 'browser',
			target: ['es2022'],
			loader: {
				...BASE_LOADERS,
				...ASSET_LOADERS,
			},
			bundle: true,
			packages: 'bundle',
			minify: false,
			minifyWhitespace: false,
			minifyIdentifiers: false,
			minifySyntax: false,
			write: false,
			splitting: false,
			metafile: true,
		} as ESBuildClientDevConfig;
	} else {
		return {
			...baseConfig,
			platform: 'browser',
			target: ['es2022'],
			loader: {
				...BASE_LOADERS,
				...ASSET_LOADERS,
			},
			bundle: true,
			packages: 'bundle',
			minify: true,
			minifyWhitespace: true,
			minifyIdentifiers: true,
			minifySyntax: true,
			write: true,
			splitting: true,
			metafile: false,
		} as ESBuildClientProdConfig;
	}
}

/**
 * Generates an esbuild configuration specifically for the Server (Node.js) environment.
 * * @remarks
 * The server configuration is optimized for SSR and runtime execution:
 * - **Platform**: Targeted for `node`.
 * - **Asset Loaders**: Uses `NO_ASSET_LOADERS` as assets are typically handled by the client build.
 * - **Externalization**: Automatically marks `react` and `react-dom` as external to avoid
 * duplicate instances during server-side rendering.
 * - **Bundling**: `bundle: false` and `packages: 'external'` are used to leverage Node's native module resolution.
 * * @param env - The build environment: `'dev'` for development or `'prod'` for production.
 * @param options - Configuration details.
 * @param options.absWorkingDir - The absolute path to the project root.
 * @param options.entryPoints - File paths or a mapping for the entry points (e.g., the SSR entry).
 * * @returns A configuration object typed for either {@link ESBuildServerDevConfig} or {@link ESBuildServerProdConfig}.
 */
export function createServerConfig(
	env: BuildEnv,
	options: {
		absWorkingDir: string;
		entryPoints: string[] | Record<string, string>;
	}
): ESBuildServerDevConfig | ESBuildServerProdConfig {
	const isDev = env === 'dev';
	const cwd = process.cwd();

	const baseConfig = {
		...ESBUILD_BASE_CONFIG,
		absWorkingDir: options.absWorkingDir,
		entryPoints: options.entryPoints,
		outdir: join(cwd, CACHE_DIR, 'server'),
		plugins: [],
	};

	if (isDev) {
		return {
			...baseConfig,
			platform: 'node',
			target: ['node18'],
			loader: {
				...BASE_LOADERS,
				...NO_ASSET_LOADERS,
			},
			bundle: false,
			minify: false,
			minifyWhitespace: false,
			minifyIdentifiers: false,
			minifySyntax: false,
			write: false,
			splitting: false,
			metafile: true,
		} as ESBuildServerDevConfig;
	} else {
		return {
			...baseConfig,
			platform: 'node',
			target: ['node18'],
			loader: {
				...BASE_LOADERS,
				...NO_ASSET_LOADERS,
			},
			bundle: false,
			minify: true,
			minifyWhitespace: true,
			minifyIdentifiers: true,
			minifySyntax: true,
			write: true,
			splitting: true,
			metafile: false,
		} as ESBuildServerProdConfig;
	}
}
