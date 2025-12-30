import js from '@eslint/js';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		rules: {
			// Relax some rules for boilerplate flexibility
			'@typescript-eslint/no-unused-vars': ['error', { 
				argsIgnorePattern: '^_',
				varsIgnorePattern: '^_'
			}],
			'svelte/no-navigation-without-resolve': 'off',
			'svelte/prefer-writable-derived': 'warn'
		}
	},
	{
		ignores: ['build/', '.svelte-kit/', 'dist/', 'node_modules/']
	}
);
