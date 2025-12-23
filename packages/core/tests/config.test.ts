import { describe, expect, it } from 'vitest';

import { defineConfig } from '../src/config/index.js';

describe('Test for defineConfig function', () => {
	// Test with proper config
	it(`it should give errror on file doesn't exist`, () => {
		try {
			const result = defineConfig({
				appModulePath: './src/app/App.tsx',
				htmlTemplatePath: './index.htm',
			});

			expect(result).toBeUndefined();
		} catch (
			error: any // eslint-disable
		) {
			expect(error.message).toContain('process.exit unexpectedly called with "1"');
		}
	});
});
