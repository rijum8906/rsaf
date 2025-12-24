import type { ESBuildConfig, Loaders } from '../types/config.js';

// Base loader configurations
export const BASE_LOADERS = {
	'.js': 'js',
	'.jsx': 'jsx',
	'.ts': 'ts',
	'.tsx': 'tsx',
	'.json': 'json',
} as const satisfies Loaders;

export const ASSET_LOADERS = {
	'.css': 'css',
	'.png': 'file',
	'.svg': 'file',
	'.jpg': 'file',
	'.jpeg': 'file',
	'.gif': 'file',
	'.webp': 'file',
	'.woff': 'file',
	'.woff2': 'file',
} as const satisfies Loaders;

export const NO_ASSET_LOADERS = {
	'.css': 'empty',
	'.png': 'empty',
	'.svg': 'empty',
	'.jpg': 'empty',
	'.jpeg': 'empty',
	'.gif': 'empty',
	'.webp': 'empty',
	'.woff': 'empty',
	'.woff2': 'empty',
} as const satisfies Loaders;

// Base configuration
export const ESBUILD_BASE_CONFIG: Partial<ESBuildConfig> = {
	// Build optimizations
	metafile: true,
	color: true,
	logLevel: 'silent',

	// Performance
	treeShaking: true,

	// Code splitting
	splitting: false,

	// Format
	format: 'esm',
};
