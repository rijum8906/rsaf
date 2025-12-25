// compiler.ts
import { AppError } from '@rsaf/core';
import esbuild from 'esbuild';
import type { BuildResult } from 'esbuild';

import type { ESBuildConfig } from '../types/config.js';

/**
 * A thin wrapper around the `esbuild` API designed to manage build lifecycles.
 * The `Bundler` class abstracts the complexity of esbuild's `context()` and `watch()`
 * APIs, providing a unified interface for initial builds, incremental rebuilds,
 * and persistent file watching.
 * @example
 * ```ts
 * const bundler = new Bundler(config);
 * await bundler.build();
 * ```
 */
export class Bundler {
	private options: ESBuildConfig;
	private context?: esbuild.BuildContext;
	private lastResult?: BuildResult;
	private isWatching = false;

	/**
	 * Creates an instance of the Bundler.
	 * @param options - Configuration options for the esbuild engine.
	 */
	constructor(options: ESBuildConfig) {
		this.options = options;
	}

	/**
	 * Injects an esbuild plugin into the current configuration.
	 * @param plugin - The esbuild plugin to add.
	 * @returns The current {@link Bundler} instance for method chaining.
	 */
	addPlugin(plugin: esbuild.Plugin): this {
		if (!this.options.plugins) {
			this.options.plugins = [];
		}
		this.options.plugins.push(plugin);
		return this;
	}

	/**
	 * Executes a build process.
	 * If the bundler is currently in watch mode, it performs an incremental
	 * rebuild using the existing context. Otherwise, it performs a fresh build.
	 * @returns A promise resolving to the {@link BuildResult}.
	 * @throws {@link AppError} with code `BUILD_FAILED` if the build process encounters errors.
	 */
	async build(): Promise<BuildResult> {
		try {
			if (this.isWatching && this.context) {
				this.lastResult = await this.context.rebuild();
			} else {
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
	 * Initializes and starts esbuild's internal watch mode.
	 * This method creates a persistent build context. While esbuild's native
	 * watcher is activated, this setup is often used in conjunction with
	 * external watchers (like Chokidar) by calling {@link rebuild}.
	 * @remarks
	 * If a context already exists, it will be disposed of before creating a new one.
	 * @throws {@link AppError} if the context cannot be initialized.
	 */
	async watch(): Promise<void> {
		if (this.isWatching) return;

		this.isWatching = true;

		if (this.context) {
			await this.dispose();
		}

		try {
			this.context = await esbuild.context(this.options as esbuild.BuildOptions);
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
	 * Manually triggers an incremental rebuild.
	 * This is typically invoked by an external file watcher when changes are detected.
	 * @returns A promise resolving to the {@link BuildResult} of the increment.
	 * @throws {@link AppError} if called before {@link watch} has initialized a context.
	 */
	async rebuild(): Promise<BuildResult> {
		if (!this.context) {
			throw new AppError('You must call "watch()" before using "rebuild()"', {
				code: 'BUILD_FAILED',
				category: 'build',
			});
		}

		try {
			this.lastResult = await this.context.rebuild();
			return this.lastResult;
		} catch (
			error: any // eslint-disable-line
		) {
			throw new AppError('Looks like there is some errors while rebuilding', {
				code: 'BUILD_FAILED',
				category: 'build',
				cause: error,
			});
		}
	}

	/**
	 * Gracefully shuts down the bundler and releases system resources.
	 * This disposes of the esbuild context, stops watchers, and clears internal cache.
	 * @throws {@link AppError} if the disposal process fails.
	 */
	async dispose(): Promise<void> {
		if (!this.context) return;

		try {
			await this.context.dispose();
		} catch (
			error: any // eslint-disable-line
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
	 * Retrieves the result of the most recent successful build or rebuild.
	 * @returns The {@link BuildResult} or `undefined` if no build has occurred yet.
	 */
	getLastResult(): BuildResult | undefined {
		return this.lastResult;
	}

	/**
	 * Indicates whether the bundler is currently in an active watch state.
	 * @returns `true` if watching, otherwise `false`.
	 */
	isInWatchMode(): boolean {
		return this.isWatching;
	}
}
