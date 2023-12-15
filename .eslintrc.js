module.exports = {
	ignorePatterns: ['**/*.test.js'],
	extends: ['airbnb-base', 'prettier'],
	parser: 'babel-eslint',
	plugins: ['prettier'],
	rules: {
		'linebreak-style': ['error', 'win32'],
		'prettier/prettier': 'error',
		'no-underscore-dangle': 0,
		'max-len': ['error', { code: 120 }],
		radix: ['error', 'as-needed'],
	},
	globals: {
		module: 'writable',
	},
};
