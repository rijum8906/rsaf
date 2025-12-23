import type { Loader, Plugin } from 'esbuild';

// ########################################
//                ESBuild Config
// ########################################
// Base configuration
export interface ESBuildBaseConfig {
	// Build optimizations
	minify: boolean;
	metafile: true;
	color: true;
	logLevel: 'silent';

	// Performance
	treeShaking: true;
	minifyWhitespace: boolean;
	minifyIdentifiers: boolean;
	minifySyntax: boolean;

	// Code splitting
	splitting: false;

	// Format
	format: 'esm';

	// Source maps for debugging
	sourcemap: boolean | 'inline' | 'linked';

	// Paths
	absWorkingDir: string;
	outdir?: string; // Optional in dev mode (memory)
	outfile?: string; // Alternative to outdir
	entryPoints: string[] | Record<string, string>;

	// Write to disk or memory
	write?: boolean; // false = keep in memory (dev mode)

	// Plugins
	plugins: Plugin[];
}

export type LoaderFiles = Record<string, Loader>;

// Client-specific configuration
export interface ESBuildClientConfig {
	platform: 'browser';
	target: ['es2022'];
	loader: LoaderFiles;
	bundle: true;
	splitting: true;
}

// Server-specific configuration
export interface ESBuildServerConfig {
	platform: 'node';
	target: ['node18'];
	loader: LoaderFiles;
	packages: 'external';
	external: string[];
	bundle: true;
	splitting: false; // Server doesn't need splitting
}

// Dev Mode configuration
export interface ESBuildDevConfig {
	minify: false;
	minifyWhitespace: false;
	minifyIdentifiers: false;
	minifySyntax: false;
	sourcemap: 'inline' | true;
	write: false; // Keep in memory for dev
}

// Prod Mode configuration
export interface ESBuildProdConfig {
	minify: true;
	minifyWhitespace: true;
	minifyIdentifiers: true;
	minifySyntax: true;
	sourcemap: 'linked' | false;
	write: true; // Write to disk for prod
}

// Combined configuration types
export type ESBuildClientDevConfig = ESBuildBaseConfig & ESBuildClientConfig & ESBuildDevConfig;
export type ESBuildClientProdConfig = ESBuildBaseConfig & ESBuildClientConfig & ESBuildProdConfig;
export type ESBuildServerDevConfig = ESBuildBaseConfig & ESBuildServerConfig & ESBuildDevConfig;
export type ESBuildServerProdConfig = ESBuildBaseConfig & ESBuildServerConfig & ESBuildProdConfig;

// Union type for all possible configs
export type ESBuildConfig =
	| ESBuildClientDevConfig
	| ESBuildClientProdConfig
	| ESBuildServerDevConfig
	| ESBuildServerProdConfig;
