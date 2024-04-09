module.exports = {
    extends: ['@zeal/eslint-config'],
    ignorePatterns: ['build/'],
    overrides: [
        {
            files: ['portfolio.ts'],
            rules: {
                '@typescript-eslint/ban-types': 'off',
            },
        },
    ],
}
