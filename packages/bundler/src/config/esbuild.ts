import type { ESBuildConfig, Loaders } from '../types/config.js';

/**
 * Standard loaders for source code files.
 * * Maps common ECMAScript and TypeScript extensions to their respective esbuild parsers.
 */
export const BASE_LOADERS = {
	'.js': 'js',
	'.jsx': 'jsx',
	'.ts': 'ts',
	'.tsx': 'tsx',
	'.json': 'json',
} as const satisfies Loaders;

/**
 * Loaders for static assets and styling.
 * * Used primarily in Client builds to ensure that CSS and media files are
 * processed and emitted to the output directory.
 * - **CSS**: Processed as standard stylesheets.
 * - **Images/Fonts**: Handled using the `file` loader (emits a file and returns a URL).
 */
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

/**
 * "Null" loaders used to ignore static assets during specific build phases.
 * * @remarks
 * This is primarily used in **Server (SSR)** builds. On the server, we want to
 * resolve imports for assets (so the code doesn't throw) but we don't want to
 * actually process or emit those files, as the Client build handles them.
 */
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

/**
 * The default base configuration shared across all build targets.
 * * This configuration prioritizes modern standards (ESM) and silent execution
 * to allow the parent CLI or framework to manage logging.
 * * @see {@link createClientConfig} and {@link createServerConfig} for how this is extended.
 */
export const ESBUILD_BASE_CONFIG: Partial<ESBuildConfig> = {
	/** Generates a JSON file for bundle analysis and size tracking. */
	metafile: true,
	/** Enables terminal colors for errors and warnings. */
	color: true,
	/** Disables esbuild's default logging to favor custom application error handling. */
	logLevel: 'silent',

	/** Removes unreachable code to reduce bundle size. */
	treeShaking: true,

	/** * Disabled by default. Only enabled for Client Production builds
	 * where browser-native ESM loading is required.
	 */
	splitting: false,

	/** Standardizes on ECMAScript Modules for modern Node.js and Browser environments. */
	format: 'esm',
};
