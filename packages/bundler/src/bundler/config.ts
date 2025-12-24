import { join } from 'node:path';

import {
	ASSET_LOADERS,
	BASE_LOADERS,
	ESBUILD_BASE_CONFIG,
	NO_ASSET_LOADERS,
} from '../config/esbuild.js';
import type {
	ESBuildClientDevConfig,
	ESBuildClientProdConfig,
	ESBuildServerDevConfig,
	ESBuildServerProdConfig,
} from '../types/config.js';
import { CACHE_DIR } from '../utils/constants.js';

// Create compiler configuration
export function createClientConfig(
	env: 'dev' | 'prod',
	options: {
		absWorkingDir: string;
		entryPoints: string[] | Record<string, string>;
	}
): ESBuildClientDevConfig | ESBuildClientProdConfig {
	const isDev = env === 'dev';
	const cwd = process.cwd();

	// Base config with required properties
	const baseConfig = {
		...ESBUILD_BASE_CONFIG,
		absWorkingDir: options.absWorkingDir,
		entryPoints: options.entryPoints,
		outdir: join(cwd, CACHE_DIR, 'client'),
		plugins: [],
	};

	if (isDev) {
		// Dev configuration
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
		// Prod configuration
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
 * Return configuration to create server bundler
 */
export function createServerConfig(
	env: 'dev' | 'prod',
	options: {
		absWorkingDir: string;
		entryPoints: string[] | Record<string, string>;
	}
): ESBuildServerDevConfig | ESBuildServerProdConfig {
	const isDev = env === 'dev';
	const cwd = process.cwd();

	// Base config with required properties
	const baseConfig = {
		...ESBUILD_BASE_CONFIG,
		absWorkingDir: options.absWorkingDir,
		entryPoints: options.entryPoints,
		outdir: join(cwd, CACHE_DIR, 'server'),
		plugins: [],
	};

	if (isDev) {
		// Dev configuration
		return {
			...baseConfig,
			platform: 'node',
			target: ['node18'],
			loader: {
				...BASE_LOADERS,
				...NO_ASSET_LOADERS,
			},
			bundle: false,
			packages: 'external',
			minify: false,
			minifyWhitespace: false,
			minifyIdentifiers: false,
			minifySyntax: false,
			write: false,
			splitting: false,
			metafile: true,
			external: ['react', 'react-dom'],
		} as ESBuildServerDevConfig;
	} else {
		// Prod configuration
		return {
			...baseConfig,
			platform: 'node',
			target: ['node18'],
			loader: {
				...BASE_LOADERS,
				...NO_ASSET_LOADERS,
			},
			bundle: false,
			packages: 'external',
			minify: true,
			minifyWhitespace: true,
			minifyIdentifiers: true,
			minifySyntax: true,
			write: true,
			splitting: true,
			metafile: false,
			external: ['react', 'react-dom'],
		} as ESBuildServerProdConfig;
	}
}
