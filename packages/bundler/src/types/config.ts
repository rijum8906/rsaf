import type { Loader, Plugin } from 'esbuild';

/**
 * The foundational configuration shared by all build targets (Client, Server, Dev, Prod).
 * * Defines the environment-agnostic settings such as project paths,
 * tree-shaking logic, and the default JSX transformation.
 */
export interface ESBuildBaseConfig {
	/** Enables terminal colors for errors and warnings. */
	color: true;
	/** Disables esbuild's default logging to favor custom application error handling. */
	logLevel: 'silent';

	/** Removes unreachable code to reduce bundle size across all platforms. */
	treeShaking: true;

	/** Standardizes on ECMAScript Modules (ESM) for modern runtime support. */
	format: 'esm';

	/** The absolute path to the project root directory. */
	absWorkingDir: string;
	/** The output directory for the build artifacts. Optional if `write` is false. */
	outdir?: string;
	/** The specific output file path. Alternative to `outdir`. */
	outfile?: string;
	/** The entry file(s) where esbuild starts the bundling process. */
	entryPoints: string[];

	/** An array of {@link Plugin} instances to extend esbuild functionality. */
	plugins: Plugin[];

	/** Configures the React transformation to use the modern 'automatic' runtime. */
	jsx: 'automatic';
}

/**
 * A dictionary mapping file extensions (e.g., `.png`) to their respective esbuild {@link Loader}.
 */
export type LoaderFiles = Record<string, Loader>;

/**
 * Configuration specific to Browser-targeted builds.
 * * Sets the platform to `browser` and ensures all packages are bundled
 * to be compatible with client-side execution.
 */
export interface ESBuildClientConfig {
	/** Targets the browser environment. */
	platform: 'browser';
	/** Specifies the ECMAScript version for the output. */
	target: ['es2022'];
	/** Loaders for client-side assets (CSS, Images, etc.). */
	loader: LoaderFiles;
	/** Ensures dependencies are bundled into the final output. */
	bundle: true;
	/** Aggressively bundles all node_modules into the browser chunks. */
	packages: 'bundle';
}

/**
 * Configuration specific to Node.js-targeted builds.
 * * Optimized for Server-Side Rendering (SSR) where `node_modules` should
 * remain external for faster execution and compatibility.
 */
export interface ESBuildServerConfig {
	/** Targets the Node.js environment. */
	platform: 'node';
	/** Specifies the minimum supported Node version. */
	target: ['node18'];
	/** Loaders for server-side assets (often uses 'empty' for styles). */
	loader: LoaderFiles;
	/** Prevents node_modules from being bundled into the server file. */
	packages: 'external';
	/** Specific package names to explicitly exclude from the bundle. */
	external: string[];
	/** Disabled for server to leverage native Node module resolution. */
	bundle: false;
}

/**
 * Settings applied during local development.
 * * Focuses on build speed and debuggability rather than file size.
 */
export interface ESBuildDevConfig {
	/** Disables minification for readable source code. */
	minify: false;
	minifyWhitespace: false;
	minifyIdentifiers: false;
	minifySyntax: false;
	/** Keeps output in memory to speed up hot-reloading/serving. */
	write: false;
	/** Code splitting is disabled in dev to simplify module resolution. */
	splitting: false;
	/** Generates a metafile for real-time dependency analysis. */
	metafile: true;
}

/**
 * Settings applied during production builds.
 * * Focuses on aggressive optimization, minification, and disk-ready output.
 */
export interface ESBuildProdConfig {
	/** Enables full minification suite for smallest possible file size. */
	minify: true;
	minifyWhitespace: true;
	minifyIdentifiers: true;
	minifySyntax: true;
	/** Writes files to the `outdir` for deployment. */
	write: true;
	/** Enables ESM-based code splitting for lazy loading. */
	splitting: true;
	/** Metafile is typically disabled in production to save build time. */
	metafile: false;
}

/** Intersection type for a Client-side Development build. */
export type ESBuildClientDevConfig = ESBuildBaseConfig & ESBuildClientConfig & ESBuildDevConfig;

/** Intersection type for a Client-side Production build. */
export type ESBuildClientProdConfig = ESBuildBaseConfig & ESBuildClientConfig & ESBuildProdConfig;

/** Intersection type for a Server-side Development build. */
export type ESBuildServerDevConfig = ESBuildBaseConfig & ESBuildServerConfig & ESBuildDevConfig;

/** Intersection type for a Server-side Production build. */
export type ESBuildServerProdConfig = ESBuildBaseConfig & ESBuildServerConfig & ESBuildProdConfig;

/**
 * A exhaustive union of all valid configuration states for the Bundler.
 * * Using this type ensures that a configuration cannot have invalid
 * property combinations (e.g., a Server build cannot accidentally have 'bundle: true').
 */
export type ESBuildConfig =
	| ESBuildClientDevConfig
	| ESBuildClientProdConfig
	| ESBuildServerDevConfig
	| ESBuildServerProdConfig;

/**
 * Type alias for a map of file extensions to esbuild Loaders.
 */
export type Loaders = Record<string, Loader>;

/**
 * Build Enviroment
 */
export type BuildEnv = 'dev' | 'prod';
