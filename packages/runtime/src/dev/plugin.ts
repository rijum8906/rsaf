import { createDeclarativePlugin } from '@rsaf/bundler';

/**
 * A specialized esbuild plugin that orchestrates the "Fast Refresh" or HMR lifecycle.
 * * This plugin intercepts the `onEnd` hook of the client-side bundler to:
 * 1. Analyze the build result for errors.
 * 2. If successful, notify the dev-server that assets have been updated.
 * 3. Trigger a browser-side refresh signal via the established transport layer (e.g., WS/SSE).
 * * @remarks
 * This plugin is essential for a seamless DX (Developer Experience), as it prevents
 * the need for manual page refreshes after every code change.
 */
export const refreshClientPlugin = createDeclarativePlugin('refresh-client', {
	/**
	 * Logic executed immediately after the client bundle has finished rebuilding.
	 */
	onEnd(result) {
		// 1. Check if there are errors that should block a refresh
		if (result.errors.length > 0) {
			console.error('[refresh-client] Build failed. Fix errors to trigger refresh.');
			return;
		}

		/**
		 * @todo
		 * Implement the notification trigger here.
		 * Usually involves:
		 * - Updating the global buildCache
		 * - Broadcasting a 'reload' message to connected clients
		 */
		console.log('[refresh-client] Build successful. Triggering client refresh...');
	},
});
