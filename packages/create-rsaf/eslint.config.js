import baseConfig from '../../eslint.config.js';

export default [
	...baseConfig,
	{
		// Project-specific overrides
		files: ['**/*.ts'],
		rules: {
			// Add these common useful rules
			semi: ['error', 'always'],
			'prefer-const': 'error',
			eqeqeq: ['error', 'always'],

			// TypeScript specific
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase', 'UPPER_CASE', 'PascalCase'],
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
			],
		},
	},
	{
		// Test-specific configuration
		files: ['**/*.test.ts', '**/*.spec.ts'],
		rules: {
			'no-console': 'off',
			'@typescript-eslint/no-explicit-any': 'off',
		},
	},
];
