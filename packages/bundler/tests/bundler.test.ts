import { join, resolve } from 'node:path';

import { describe, expect, it, beforeEach } from 'vitest';

import { createClientConfig, createServerConfig } from '../src/bundler/config.js';
import type {
	ESBuildClientDevConfig,
	ESBuildClientProdConfig,
	ESBuildServerDevConfig,
	ESBuildServerProdConfig,
} from '../src/types/config.js';

describe('Bundler Config Test', () => {
	const mockWorkingDir = process.cwd();
	const mockEntryPoints = [join(mockWorkingDir, 'src/app/App.tsx')];
	const mockEntryPointsObject = {
		app: join(mockWorkingDir, 'src/app/App.tsx'),
		admin: join(mockWorkingDir, 'src/admin/Admin.tsx'),
	};

	describe('createClientConfig', () => {
		describe('Development mode', () => {
			let config: ESBuildClientDevConfig;

			beforeEach(() => {
				config = createClientConfig('dev', {
					absWorkingDir: mockWorkingDir,
					entryPoints: mockEntryPoints,
				}) as ESBuildClientDevConfig;
			});

			it('should return ESBuildClientDevConfig type for dev mode', () => {
				expect(config).toBeDefined();
				expect(config).toHaveProperty('platform', 'browser');
				expect(config).toHaveProperty('minify', false);
				expect(config).toHaveProperty('write', false);
			});

			it('should have correct required properties', () => {
				expect(config).toHaveProperty('absWorkingDir', mockWorkingDir);
				expect(config).toHaveProperty('entryPoints', mockEntryPoints);
				expect(config).toHaveProperty('platform', 'browser');
				expect(config).toHaveProperty('target', ['es2022']);
				expect(config).toHaveProperty('bundle', true);
				expect(config).toHaveProperty('plugins');
				expect(Array.isArray(config.plugins)).toBe(true);
			});

			it('should have correct dev-specific properties', () => {
				expect(config).toHaveProperty('minify', false);
				expect(config).toHaveProperty('minifyWhitespace', false);
				expect(config).toHaveProperty('minifyIdentifiers', false);
				expect(config).toHaveProperty('minifySyntax', false);
				expect(config).toHaveProperty('write', false);
				expect(config).toHaveProperty('splitting', false);
				expect(config).toHaveProperty('metafile', true);
			});

			it('should have correct loader configuration', () => {
				expect(config).toHaveProperty('loader');
				expect(typeof config.loader).toBe('object');
				// Check that loader object has expected structure
				expect(Object.keys(config.loader).length).toBeGreaterThan(0);
			});

			it('should work with entryPoints as Record<string, string>', () => {
				const configWithObject = createClientConfig('dev', {
					absWorkingDir: mockWorkingDir,
					entryPoints: mockEntryPointsObject,
				}) as ESBuildClientDevConfig;

				expect(configWithObject).toHaveProperty('entryPoints', mockEntryPointsObject);
				expect(configWithObject.entryPoints).toHaveProperty('app');
				expect(configWithObject.entryPoints).toHaveProperty('admin');
			});

			it('should have correct platform and target for browser', () => {
				expect(config).toHaveProperty('platform', 'browser');
				expect(config).toHaveProperty('target', ['es2022']);
			});

			it('should have correct packages setting', () => {
				expect(config).toHaveProperty('packages', 'bundle');
			});

			it('should have base config properties', () => {
				expect(config).toHaveProperty('color', true);
				expect(config).toHaveProperty('logLevel', 'silent');
				expect(config).toHaveProperty('treeShaking', true);
				expect(config).toHaveProperty('format', 'esm');
			});
		});

		describe('Production mode', () => {
			let config: ESBuildClientProdConfig;

			beforeEach(() => {
				config = createClientConfig('prod', {
					absWorkingDir: mockWorkingDir,
					entryPoints: mockEntryPoints,
				}) as ESBuildClientProdConfig;
			});

			it('should return ESBuildClientProdConfig type for prod mode', () => {
				expect(config).toBeDefined();
				expect(config).toHaveProperty('platform', 'browser');
				expect(config).toHaveProperty('minify', true);
				expect(config).toHaveProperty('write', true);
			});

			it('should have correct prod-specific properties', () => {
				expect(config).toHaveProperty('minify', true);
				expect(config).toHaveProperty('minifyWhitespace', true);
				expect(config).toHaveProperty('minifyIdentifiers', true);
				expect(config).toHaveProperty('minifySyntax', true);
				expect(config).toHaveProperty('write', true);
				expect(config).toHaveProperty('splitting', true);
				expect(config).toHaveProperty('metafile', false);
			});

			it('should have same base properties as dev config', () => {
				expect(config).toHaveProperty('absWorkingDir', mockWorkingDir);
				expect(config).toHaveProperty('entryPoints', mockEntryPoints);
				expect(config).toHaveProperty('platform', 'browser');
				expect(config).toHaveProperty('target', ['es2022']);
				expect(config).toHaveProperty('bundle', true);
				expect(config).toHaveProperty('packages', 'bundle');
			});

			it('should have loader configuration', () => {
				expect(config).toHaveProperty('loader');
				expect(typeof config.loader).toBe('object');
			});
		});

		it('should return different configs for dev and prod modes', () => {
			const devConfig = createClientConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: mockEntryPoints,
			}) as ESBuildClientDevConfig;

			const prodConfig = createClientConfig('prod', {
				absWorkingDir: mockWorkingDir,
				entryPoints: mockEntryPoints,
			}) as ESBuildClientProdConfig;

			// Should differ in minification settings
			expect(devConfig.minify).toBe(false);
			expect(prodConfig.minify).toBe(true);

			// Should differ in write settings
			expect(devConfig.write).toBe(false);
			expect(prodConfig.write).toBe(true);

			// Should differ in splitting settings
			expect(devConfig.splitting).toBe(false);
			expect(prodConfig.splitting).toBe(true);

			// Should differ in metafile settings
			expect(devConfig.metafile).toBe(true);
			expect(prodConfig.metafile).toBe(false);

			// Should have same base properties
			expect(devConfig.absWorkingDir).toBe(prodConfig.absWorkingDir);
			expect(devConfig.platform).toBe(prodConfig.platform);
			expect(devConfig.bundle).toBe(prodConfig.bundle);
		});
	});

	describe('createServerConfig', () => {
		describe('Development mode', () => {
			let config: ESBuildServerDevConfig;

			beforeEach(() => {
				config = createServerConfig('dev', {
					absWorkingDir: mockWorkingDir,
					entryPoints: mockEntryPoints,
				}) as ESBuildServerDevConfig;
			});

			it('should return ESBuildServerDevConfig type for dev mode', () => {
				expect(config).toBeDefined();
				expect(config).toHaveProperty('platform', 'node');
				expect(config).toHaveProperty('bundle', false);
				expect(config).toHaveProperty('minify', false);
			});

			it('should have correct required properties', () => {
				expect(config).toHaveProperty('absWorkingDir', mockWorkingDir);
				expect(config).toHaveProperty('entryPoints', mockEntryPoints);
				expect(config).toHaveProperty('platform', 'node');
				expect(config).toHaveProperty('target', ['node18']);
				expect(config).toHaveProperty('bundle', false);
			});

			it('should have correct dev-specific properties', () => {
				expect(config).toHaveProperty('minify', false);
				expect(config).toHaveProperty('minifyWhitespace', false);
				expect(config).toHaveProperty('minifyIdentifiers', false);
				expect(config).toHaveProperty('minifySyntax', false);
				expect(config).toHaveProperty('write', false);
				expect(config).toHaveProperty('splitting', false);
				expect(config).toHaveProperty('metafile', true);
			});

			it('should have correct packages setting for server', () => {
				expect(config).toHaveProperty('packages', 'external');
			});

			it('should have external dependencies configured', () => {
				expect(config).toHaveProperty('external');
				expect(Array.isArray(config.external)).toBe(true);
				expect(config.external).toContain('react');
				expect(config.external).toContain('react-dom');
			});

			it('should have correct loader configuration without assets', () => {
				expect(config).toHaveProperty('loader');
				expect(typeof config.loader).toBe('object');
			});

			it('should work with entryPoints as Record<string, string>', () => {
				const configWithObject = createServerConfig('dev', {
					absWorkingDir: mockWorkingDir,
					entryPoints: mockEntryPointsObject,
				}) as ESBuildServerDevConfig;

				expect(configWithObject).toHaveProperty('entryPoints', mockEntryPointsObject);
			});
		});

		describe('Production mode', () => {
			let config: ESBuildServerProdConfig;

			beforeEach(() => {
				config = createServerConfig('prod', {
					absWorkingDir: mockWorkingDir,
					entryPoints: mockEntryPoints,
				}) as ESBuildServerProdConfig;
			});

			it('should return ESBuildServerProdConfig type for prod mode', () => {
				expect(config).toBeDefined();
				expect(config).toHaveProperty('platform', 'node');
				expect(config).toHaveProperty('bundle', false);
				expect(config).toHaveProperty('minify', true);
			});

			it('should have correct prod-specific properties', () => {
				expect(config).toHaveProperty('minify', true);
				expect(config).toHaveProperty('minifyWhitespace', true);
				expect(config).toHaveProperty('minifyIdentifiers', true);
				expect(config).toHaveProperty('minifySyntax', true);
				expect(config).toHaveProperty('write', true);
				expect(config).toHaveProperty('splitting', true);
				expect(config).toHaveProperty('metafile', false);
			});

			it('should have same base properties as dev config', () => {
				expect(config).toHaveProperty('absWorkingDir', mockWorkingDir);
				expect(config).toHaveProperty('entryPoints', mockEntryPoints);
				expect(config).toHaveProperty('platform', 'node');
				expect(config).toHaveProperty('target', ['node18']);
				expect(config).toHaveProperty('bundle', false);
				expect(config).toHaveProperty('packages', 'external');
				expect(config.external).toContain('react');
				expect(config.external).toContain('react-dom');
			});
		});

		it('should return different configs for server dev and prod modes', () => {
			const devConfig = createServerConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: mockEntryPoints,
			}) as ESBuildServerDevConfig;

			const prodConfig = createServerConfig('prod', {
				absWorkingDir: mockWorkingDir,
				entryPoints: mockEntryPoints,
			}) as ESBuildServerProdConfig;

			// Should differ in minification settings
			expect(devConfig.minify).toBe(false);
			expect(prodConfig.minify).toBe(true);

			// Should differ in write settings
			expect(devConfig.write).toBe(false);
			expect(prodConfig.write).toBe(true);

			// Should differ in splitting settings
			expect(devConfig.splitting).toBe(false);
			expect(prodConfig.splitting).toBe(true);

			// Should differ in metafile settings
			expect(devConfig.metafile).toBe(true);
			expect(prodConfig.metafile).toBe(false);

			// Should have same server-specific properties
			expect(devConfig.platform).toBe(prodConfig.platform);
			expect(devConfig.bundle).toBe(prodConfig.bundle);
			expect(devConfig.packages).toBe(prodConfig.packages);
		});

		it('should have different configs for client vs server builds', () => {
			const clientConfig = createClientConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: mockEntryPoints,
			}) as ESBuildClientDevConfig;

			const serverConfig = createServerConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: mockEntryPoints,
			}) as ESBuildServerDevConfig;

			// Different platforms
			expect(clientConfig.platform).toBe('browser');
			expect(serverConfig.platform).toBe('node');

			// Different targets
			expect(clientConfig.target).toEqual(['es2022']);
			expect(serverConfig.target).toEqual(['node18']);

			// Different bundle settings
			expect(clientConfig.bundle).toBe(true);
			expect(serverConfig.bundle).toBe(false);

			// Different packages settings
			expect(clientConfig.packages).toBe('bundle');
			expect(serverConfig.packages).toBe('external');

			// Server has external dependencies, client doesn't (or has different ones)
			expect(serverConfig).toHaveProperty('external');
			expect(clientConfig).not.toHaveProperty('external');
		});
	});

	describe('Edge Cases', () => {
		it('should handle absolute paths in entryPoints', () => {
			const absolutePath = resolve(mockWorkingDir, 'src/index.ts');
			const config = createClientConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: [absolutePath],
			}) as ESBuildClientDevConfig;

			expect(config.entryPoints).toEqual([absolutePath]);
		});

		it('should handle relative paths in entryPoints', () => {
			const relativePath = './src/index.ts';
			const config = createClientConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: [relativePath],
			}) as ESBuildClientDevConfig;

			expect(config.entryPoints).toEqual([relativePath]);
		});

		it('should handle empty entryPoints array', () => {
			const config = createClientConfig('dev', {
				absWorkingDir: mockWorkingDir,
				entryPoints: [],
			}) as ESBuildClientDevConfig;

			expect(Array.isArray(config.entryPoints)).toBe(true);
			expect(config.entryPoints).toHaveLength(0);
		});

		it('should handle complex working directory paths', () => {
			const complexPath = '/var/www/projects/my-app/src';
			const config = createClientConfig('dev', {
				absWorkingDir: complexPath,
				entryPoints: ['index.ts'],
			}) as ESBuildClientDevConfig;

			expect(config.absWorkingDir).toBe(complexPath);
		});
	});
});
