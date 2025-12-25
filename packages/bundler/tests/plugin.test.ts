import { describe, expect, it } from 'vitest';

import { createDeclarativePlugin } from '../src/index.js';

describe('Create Plugin function test', () => {
	it('should have all properties', () => {
		const plugin = createDeclarativePlugin('plugin', {
			onStart() {},
			onEnd() {},
		});

		expect(plugin.name).toBe('plugin');
	});
});
