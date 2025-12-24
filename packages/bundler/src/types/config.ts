import type { Loader, Plugin } from 'esbuild';

// ########################################
//                ESBuild Config
// ########################################
// Base configuration
export interface ESBuildBaseConfig {
	// Build optimizations
	color: true;
	logLevel: 'silent';

	// Performance
	treeShaking: true;

	// Format
	format: 'esm';

	// Paths
	absWorkingDir: string;
	outdir?: string; // Optional in dev mode (memory)
	outfile?: string; // Alternative to outdir
	entryPoints: string[];

	// Plugins
	plugins: Plugin[];

	// Jsx
	jsx: 'automatic';
}

export type LoaderFiles = Record<string, Loader>;

// Client-specific configuration
export interface ESBuildClientConfig {
	platform: 'browser';
	target: ['es2022'];
	loader: LoaderFiles;
	bundle: true;
	packages: 'bundle';
}

// Server-specific configuration
export interface ESBuildServerConfig {
	platform: 'node';
	target: ['node18'];
	loader: LoaderFiles;
	packages: 'external';
	external: string[];
	bundle: false;
}

// Dev Mode configuration
export interface ESBuildDevConfig {
	minify: false;
	minifyWhitespace: false;
	minifyIdentifiers: false;
	minifySyntax: false;
	write: false; // Keep in memory for dev
	splitting: false;
	metafile: true;
}

// Prod Mode configuration
export interface ESBuildProdConfig {
	minify: true;
	minifyWhitespace: true;
	minifyIdentifiers: true;
	minifySyntax: true;
	write: true; // Write to disk for prod
	splitting: true;
	metafile: false;
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

// Asset Type
export type Loaders = Record<string, Loader>;
