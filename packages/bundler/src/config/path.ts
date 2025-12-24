/**
 * @param  path  - The path to normalize
 * @returns Normalized Path
 */
export const normalizePath = (path: string): string =>
	'/' + (path || '').replace(/\/+/g, '/').replace(/^\/+|\/+$/g, '');

/**
 * Generates the correct relative path to the static directory based on the current URL depth
 * @param currentPath - The current page URL path
 * @param staticDir - The static directory name (default: "static")
 * @returns The relative path to the static directory
 */
export function getStaticPath(currentPath: string, staticDir = 'static'): string {
	// Normalize path: remove leading/trailing slashes
	const segments = currentPath
		.replace(/^\/+|\/+$/g, '')
		.split('/')
		.filter(p => p);

	const depth = segments.length;

	// Build the relative path
	if (depth === 0) {
		// Root level
		return `./${staticDir}`;
	} else {
		// Go up one level for each directory segment
		const upLevels = '../'.repeat(depth);
		return `${upLevels}${staticDir}`;
	}
}

// Root runtime directories
export const DEV_RUNTIME_DIR = normalizePath('.nexus');
export const DEV_CLIENT_DIR = normalizePath('.nexus/client');
export const DEV_SERVER_DIR = normalizePath('.nexus/server');

// App Entry Paths
export const DEV_SERVER_ENTRY = normalizePath('.nexus/server/entry.tsx');
export const DEV_CLIENT_ENTRY = normalizePath('.nexus/client/entry.tsx');

// Client build outputs
export const DEV_CLIENT_STATIC_DIR = normalizePath('.nexus/client/static');
export const DEV_CLIENT_APP_ENTRY = normalizePath('.nexus/client/hydrate.js');
export const DEV_CLIENT_STYLES_ENTRY = normalizePath('.nexus/client/styles.css');
export const DEV_CLIENT_HYDRATE_ENTRY = normalizePath('.nexus/client/hydrate.tsx');
export const DEV_SERVER_RENDERER_ENTRY = normalizePath('.nexus/server/renderer.tsx');

// Server build outputs
export const DEV_SERVER_APP_ENTRY = normalizePath('.nexus/server/App.ssr.js');
export const DEV_SERVER_ROUTER_ENTRY = normalizePath('.nexus/server/router.js');

// Runtime + SSR state
export const DEV_SSR_CACHE_DIR = normalizePath('.nexus/cache');
export const DEV_SSR_TEMP_MODULE_DIR = normalizePath('.nexus/runtime/modules');

// Build result manifests
export const DEV_CLIENT_MANIFEST_PATH = normalizePath('.nexus/client/manifest.json');
export const DEV_SERVER_MANIFEST_PATH = normalizePath('.nexus/server/manifest.json');

// App Config paths
export const APP_CONFIG_FILE_PATH = normalizePath('nexus.config.ts');

// Server Paths
export const APP_STYLESHEET_PATH = normalizePath('static/styles.css');

// Constants for common path patterns
export const PATH_PATTERNS = {
	// Pattern matchers for routes
	STATIC_FILES: /^\/static\//,
	API_ROUTES: /^\/api\//,

	// File extensions
	JS_FILES: /\.(js|mjs|cjs|jsx|ts|tsx)$/,
	CSS_FILES: /\.(css|scss|sass|less)$/,
	ASSET_FILES: /\.(png|jpg|jpeg|gif|svg|ico|webp|avif|woff|woff2|ttf|eot)$/,

	// Configuration files
	CONFIG_FILES: /\.config\.(js|ts|json)$/,
};
