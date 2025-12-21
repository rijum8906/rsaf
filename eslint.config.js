import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintPluginImport from 'eslint-plugin-import';

/**
 * ESLint Flat Config for a TypeScript project
 * - Uses typescript-eslint recommended + strict rules
 * - Delegates ALL formatting to Prettier
 * - Avoids deprecated configs and helpers
 * - Monorepo-safe and future-proof
 */
export default [
	/**
	 * Global ignores
	 * These paths are completely skipped by ESLint
	 */
	{
		ignores: [
			'**/dist', // Build output
			'**/node_modules', // Dependencies
			'**/coverage', // Test coverage reports
			'**/.turbo', // Turborepo cache
			'**/*.d.ts', // Type declaration files
			'**/test-output', // Custom test artifacts
			'**/templates', // Code templates / generators
			'**/.nexus', // Cache
		],
	},

	/**
	 * Base TypeScript ESLint rules
	 * - recommended: safe defaults
	 * - strict: stronger type-safety rules
	 *
	 * NOTE:
	 * These are spread directly because Flat Config
	 * DOES NOT support `extends`.
	 */
	...tseslint.configs.recommended,
	...tseslint.configs.strict,

	/**
	 * Project-specific TypeScript configuration
	 */
	{
		files: ['**/*.{ts,tsx}'],

		languageOptions: {
			/**
			 * Global variables available in the project
			 */
			globals: {
				...globals.browser, // window, document, etc.
				...globals.node, // process, __dirname, etc.
				...globals.es2022, // ES2022 globals
			},

			/**
			 * Type-aware linting configuration
			 */
			parserOptions: {
				project: './tsconfig.base.json',
				tsconfigRootDir: import.meta.dirname,
				warnOnUnsupportedTypeScriptVersion: false,
			},
		},

		/**
		 * Additional ESLint plugins
		 */
		plugins: {
			import: eslintPluginImport,
		},

		/**
		 * Plugin-specific settings
		 */
		settings: {
			'import/resolver': {
				typescript: {
					project: './tsconfig.base.json',
				},
			},
		},

		/**
		 * Custom rule overrides
		 */
		rules: {
			/**
			 * Ignore unused variables that start with `_`
			 * Common for intentionally unused params
			 */
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
				},
			],

			/**
			 * Enforce consistent `import type` usage
			 */
			'@typescript-eslint/consistent-type-imports': 'error',

			/**
			 * Allow `any`, but shame the developer a little
			 */
			'@typescript-eslint/no-explicit-any': 'warn',

			/**
			 * Encourage explicit return types,
			 * but don’t be annoying with inline expressions
			 */
			'@typescript-eslint/explicit-function-return-type': [
				'warn',
				{ allowExpressions: true },
			],

			/**
			 * Enforce clean and predictable import order
			 */
			'import/order': [
				'error',
				{
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
					'newlines-between': 'always',
					alphabetize: { order: 'asc' },
				},
			],

			/**
			 * Prevent duplicate imports
			 */
			'import/no-duplicates': 'error',
		},
	},

	/**
	 * Prettier integration (MUST be last)
	 * - Disables conflicting ESLint rules
	 * - Enforces formatting via Prettier
	 * - Automatically reads `.prettierrc`
	 */
	{
		plugins: {
			prettier: prettierPlugin,
		},
		rules: {
			...prettierConfig.rules, // Disable conflicting ESLint rules
			'prettier/prettier': 'error', // Treat Prettier issues as ESLint errors
		},
	},
];
