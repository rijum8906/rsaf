import { basename, extname } from 'node:path';

import type { OutputFile } from '@rsaf/bundler';

import { buildCache, type BuildCache } from '../dev/cache.js';

/**
 * Iterates through a collection of esbuild output files and persists them to the global cache.
 * * This is typically called after a successful build or rebuild in development mode to
 * ensure that the dev-server has access to the most recent version of the code and assets.
 * * @param outputFile - An array of {@link OutputFile} objects provided by the esbuild result.
 */
export function saveOutputToCache(outputFile: OutputFile[]): void {
	for (const file of outputFile) {
		saveBuildCache(file.path, file.text);
	}
}

/**
 * Categorizes and stores an individual file in the {@link buildCache}.
 * * @param filename - The full path or name of the file provided by the bundler.
 * @param contents - The raw string content of the file.
 * * @remarks
 * This function uses the file extension to determine the {@link BuildCache['type']}:
 * - **Bundle**: Assigned to `.js` and `.css` files (executable/style code).
 * - **Asset**: Assigned to all other extensions (images, fonts, etc.).
 * * The key used in the store is the **basename** of the file (e.g., `dist/main.js` becomes `main.js`).
 */
function saveBuildCache(filename: string, contents: string): void {
	const key = basename(filename);

	// Determine if the file is a primary source bundle or a static asset
	const type: BuildCache['type'] = ['.js', '.css'].includes(extname(key)) ? 'bundle' : 'asset';

	buildCache.set(key, {
		contents,
		type,
	});
}
