import { normalize } from 'node:path';

// RUNTIME PATHS
/**
 * Path of the config file (rsaf.config.ts)
 */
export const CONFIG_FILE_PATH = normalize('rsaf.config.ts');

// BUILD OUTPUT PATHS
/**
 * In this directory the client outputs will be saved
 */
export const DEV_SERVER_DIR = normalize('.rsaf/server');

/**
 * In this directory the client outputs will be saved
 */
export const DEV_CLIENT_DIR = normalize('.rsaf/client');
