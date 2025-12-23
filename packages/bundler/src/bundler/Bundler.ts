// compiler.ts
import { AppError } from '@rsaf/core';
import esbuild from 'esbuild';
import type { BuildResult } from 'esbuild';

import type { ESBuildConfig } from '../types/config.js';

/**
 * EsbuildCompiler
 *
 * Thin wrapper around esbuild that provides:
 * - build
 * - watch
 * - rebuild
 * - close
 *
 * It uses esbuild's `context()` + `watch()` APIs under the hood.
 */
export class Bundler {
	private options: ESBuildConfig;
	private context?: esbuild.BuildContext;
	private lastResult?: BuildResult;
	private isWatching = false;

	constructor(options: ESBuildConfig) {
		this.options = options;
	}

	/**
	 * Adds an esbuild plugin to the compiler configuration.
	 */
	addPlugin(plugin: esbuild.Plugin): this {
		if (!this.options.plugins) {
			this.options.plugins = [];
		}
		this.options.plugins.push(plugin);
		return this;
	}

	/**
	 * Performs an initial build or rebuild depending on mode.
	 */
	async build(): Promise<BuildResult> {
		try {
			if (this.isWatching && this.context) {
				// In watch mode, we can use rebuild
				this.lastResult = await this.context.rebuild();
			} else {
				// Initial build
				this.lastResult = await esbuild.build(this.options as esbuild.BuildOptions);
			}

			return this.lastResult;
		} catch (
			error: any // eslint-disable-line
		) {
			throw new AppError('Looks like there is some errors while building', {
				code: 'BUILD_FAILED',
				category: 'build',
				cause: error,
			});
		}
	}

	/**
	 * Enables esbuild's internal watch mode.
	 *
	 * Note:
	 * If you're using chokidar for file watching,
	 * esbuild's onRebuild callback is NOT used anymore.
	 *
	 * Esbuild will still keep its rebuild context alive,
	 * but file watching is controlled externally.
	 */
	async watch(): Promise<void> {
		if (this.isWatching) return;

		this.isWatching = true;

		// If an old context exists, dispose it
		if (this.context) {
			await this.dispose();
		}

		try {
			// Create a new esbuild build context
			this.context = await esbuild.context(this.options as esbuild.BuildOptions);

			// Start esbuild's watch mode with no onRebuild handlers
			await this.context.watch();
		} catch (
			error: any // eslint-disable-line
		) {
			throw new AppError('Looks like there is some errors while building', {
				code: 'BUILD_FAILED',
				category: 'build',
				cause: error,
			});
		}
	}

	/**
	 * Manually trigger a rebuild.
	 *
	 * This is what chokidar will call when a file changes.
	 */
	async rebuild(): Promise<BuildResult> {
		if (!this.context) {
			throw new AppError('You must call "watch()" before usinf "rebuild()', {
				code: 'BUILD_FAILED',
				category: 'build',
			});
		}

		try {
			this.lastResult = await this.context.rebuild();
			return this.lastResult;
		} catch (
			error: any //eslint-disable-line
		) {
			throw new AppError('Looks like there is some errors while rebuilding', {
				code: 'BUILD_FAILED',
				category: 'build',
				cause: error,
			});
		}
	}

	/**
	 * Dispose of resources.
	 *
	 * Releases esbuild’s internal rebuild/watcher context.
	 */
	async dispose(): Promise<void> {
		if (!this.context) return;

		try {
			await this.context.dispose();
		} catch (
			error: any //eslint-disable-line
		) {
			throw new AppError('Failed to stop. Try again', {
				code: 'BUILD_FAILED',
				category: 'build',
				cause: error,
			});
		}

		this.context = undefined;
		this.lastResult = undefined;
		this.isWatching = false;
	}

	/**
	 * Get last esbuild result.
	 */
	getLastResult(): BuildResult | undefined {
		return this.lastResult;
	}

	/**
	 * Whether the compiler is currently in watch mode.
	 */
	isInWatchMode(): boolean {
		return this.isWatching;
	}
}
