import type {
	BuildResult,
	OnLoadArgs,
	OnLoadOptions,
	OnResolveArgs,
	OnResolveOptions,
	Plugin,
	OnLoadResult,
	OnResolveResult,
	PluginBuild,
} from 'esbuild';

/**
 * Defines the execution logic for various stages of the esbuild bundling process.
 * * This interface provides a structured, declarative way to tap into the
 * {@link https://esbuild.github.io/plugins/#build-callbacks | esbuild plugin lifecycle}.
 */
interface PluginLifecycleHooks {
	/**
	 * Invoked at the very beginning of every build or rebuild.
	 * * @remarks
	 * Use this for setup logic, initializing build-specific state, or clear/prepare output directories.
	 * If this function returns a `Promise`, esbuild will wait for it to resolve before starting the build.
	 */
	onStart?: () => void | Promise<void>;

	/**
	 * Invoked at the end of every build or rebuild.
	 * @param result - The outcome of the build, including errors, warnings, and the metafile (if enabled).
	 * @remarks
	 * Ideal for post-processing tasks, such as generating manifest files,
	 * triggering notifications, or cleaning up temporary files.
	 */
	onEnd?: (result: BuildResult) => void | Promise<void>;

	/**
	 * Invoked when the plugin is disposed of, usually when the {@link Bundler.dispose} is called.
	 * @remarks
	 * Use this to close file watchers, database connections, or long-lived child processes
	 * created within the plugin.
	 */
	onDispose?: () => void;

	/**
	 * Intercepts the loading of files that match specific criteria.
	 */
	onLoad?: {
		/** Configuration object defining the `filter` regex and `namespace`. */
		options: OnLoadOptions;
		/** * Executed when a file matches the filter.
		 * @returns The content and loader type for the file.
		 */
		callback: (args: OnLoadArgs) => OnLoadResult | Promise<OnLoadResult>;
	};

	/**
	 * Intercepts the resolution of import paths.
	 */
	onResolve?: {
		/** Configuration object defining the `filter` regex and `namespace`. */
		options: OnResolveOptions;
		/** * Executed when an import matches the filter.
		 * @returns The resolved path or instructions to externalize the module.
		 */
		callback: (args: OnResolveArgs) => OnResolveResult | Promise<OnResolveResult>;
	};
}

/**
 * A factory function that creates a declarative esbuild plugin.
 * * This utility abstracts the imperative nature of the `setup(build)` function,
 * making plugin code more readable and easier to maintain.
 * * @example
 * **Basic Usage (Logging)**
 * ```ts
 * const loggerPlugin = createDeclarativePlugin('rsaf-logger', {
 * onStart: () => console.log('Building...'),
 * onEnd: (res) => console.log(`Done with ${res.errors.length} errors.`),
 * });
 * ```
 * * @example
 * **Advanced Usage (Virtual Modules)**
 * ```ts
 * const virtualModule = createDeclarativePlugin('virtual-config', {
 * onResolve: {
 * options: { filter: /^virtual:config$/ },
 * callback: () => ({ path: 'config', namespace: 'v-space' })
 * },
 * onLoad: {
 * options: { filter: /*.ts., namespace: 'v-space' },
 * callback: () => ({ contents: 'export const val = 42;', loader: 'js' })
 * }
 * });
 * ```
 * @param pluginName - A unique name for the plugin (used for error reporting and debugging).
 * @param lifecycleHooks - An object containing the hooks to be registered.
 * @returns A standard esbuild {@link Plugin} object.
 * @throws {TypeError} If `pluginName` is empty or not a string.
 */
export function createDeclarativePlugin(
	pluginName: string,
	lifecycleHooks: PluginLifecycleHooks
): Plugin {
	if (typeof pluginName !== 'string' || pluginName.trim().length === 0) {
		throw new TypeError('[createDeclarativePlugin]: Plugin name must be a non-empty string');
	}

	return {
		name: pluginName,
		setup(build: PluginBuild) {
			if (lifecycleHooks.onStart) {
				build.onStart(lifecycleHooks.onStart);
			}

			if (lifecycleHooks.onEnd) {
				build.onEnd(lifecycleHooks.onEnd);
			}

			if (lifecycleHooks.onDispose) {
				build.onDispose(lifecycleHooks.onDispose);
			}

			if (lifecycleHooks.onLoad) {
				build.onLoad(lifecycleHooks.onLoad.options, lifecycleHooks.onLoad.callback);
			}

			if (lifecycleHooks.onResolve) {
				build.onResolve(
					lifecycleHooks.onResolve.options,
					lifecycleHooks.onResolve.callback
				);
			}
		},
	};
}
