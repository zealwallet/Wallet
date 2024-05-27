const restrictedGlobals = [
    'addEventListener',
    'blur',
    'close',
    'closed',
    'confirm',
    'defaultStatus',
    'defaultstatus',
    'event',
    'external',
    'find',
    'focus',
    'frameElement',
    'frames',
    'history',
    'innerHeight',
    'innerWidth',
    'length',
    'location',
    'locationbar',
    'menubar',
    'moveBy',
    'moveTo',
    'name',
    'onblur',
    'onerror',
    'onfocus',
    'onload',
    'onresize',
    'onunload',
    'open',
    'opener',
    'opera',
    'outerHeight',
    'outerWidth',
    'pageXOffset',
    'pageYOffset',
    'parent',
    'print',
    'removeEventListener',
    'resizeBy',
    'resizeTo',
    'screen',
    'screenLeft',
    'screenTop',
    'screenX',
    'screenY',
    'scroll',
    'scrollbars',
    'scrollBy',
    'scrollTo',
    'scrollX',
    'scrollY',
    'self',
    'status',
    'statusbar',
    'stop',
    'toolbar',
    'top',
    'crypto',
]

module.exports = {
    parserOptions: {
        ecmaVersion: 'latest',
    },
    env: {
        browser: true,
        node: true,
    },
    settings: {
        jest: {
            version: require('jest/package.json').version,
        },
        react: {
            version: 'detect',
        },
        'eslint-plugin-zeal-domains': {
            domainsPackage: {
                name: '@zeal/domains',
            },
            toolkitPackage: {
                name: '@zeal/toolkit',
            },
            uikitPackage: {
                name: '@zeal/uikit',
            },
        },
    },
    plugins: ['eslint-plugin-zeal-domains', 'import', 'simple-import-sort'],
    extends: [
        'plugin:react/recommended',
        'plugin:react-hooks/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:prettier/recommended',
    ],
    rules: {
        // Base rules
        'no-console': 'error',
        'no-debugger': 'error',
        'default-case': 'error',
        'no-unused-vars': 'error',
        'array-callback-return': 'warn',
        'dot-location': ['warn', 'property'],
        eqeqeq: ['warn', 'smart'],
        'new-parens': 'warn',
        'no-array-constructor': 'warn',
        'no-caller': 'warn',
        'no-cond-assign': ['warn', 'except-parens'],
        'no-const-assign': 'warn',
        'no-control-regex': 'warn',
        'no-delete-var': 'warn',
        'no-dupe-args': 'warn',
        'no-dupe-class-members': 'warn',
        'no-dupe-keys': 'warn',
        'no-duplicate-case': 'warn',
        'no-empty-character-class': 'warn',
        'no-empty-pattern': 'warn',
        'no-eval': 'warn',
        'no-ex-assign': 'warn',
        'no-extend-native': 'warn',
        'no-extra-bind': 'warn',
        'no-extra-label': 'warn',
        'no-fallthrough': 'warn',
        'no-func-assign': 'warn',
        'no-implied-eval': 'warn',
        'no-invalid-regexp': 'warn',
        'no-iterator': 'warn',
        'no-label-var': 'warn',
        'no-labels': ['warn', { allowLoop: true, allowSwitch: false }],
        'no-loop-func': 'warn',
        'no-mixed-operators': [
            'warn',
            {
                groups: [
                    ['&', '|', '^', '~', '<<', '>>', '>>>'],
                    ['==', '!=', '===', '!==', '>', '>=', '<', '<='],
                    ['&&', '||'],
                    ['in', 'instanceof'],
                ],
                allowSamePrecedence: false,
            },
        ],
        'no-multi-str': 'warn',
        'no-global-assign': 'warn',
        'no-unsafe-negation': 'warn',
        'no-new-func': 'warn',
        'no-new-object': 'warn',
        'no-new-symbol': 'warn',
        'no-new-wrappers': 'warn',
        'no-obj-calls': 'warn',
        'no-octal': 'warn',
        'no-octal-escape': 'warn',
        'no-redeclare': 'warn',
        'no-regex-spaces': 'warn',
        'no-script-url': 'warn',
        'no-self-assign': 'warn',
        'no-self-compare': 'warn',
        'no-sequences': 'warn',
        'no-shadow-restricted-names': 'warn',
        'no-sparse-arrays': 'warn',
        'no-template-curly-in-string': 'warn',
        'no-this-before-super': 'warn',
        'no-throw-literal': 'warn',
        'no-undef': 'error',
        'no-restricted-globals': ['error'].concat(restrictedGlobals),
        'no-unreachable': 'warn',
        'no-unused-expressions': [
            'error',
            {
                allowShortCircuit: true,
                allowTernary: true,
                allowTaggedTemplates: true,
            },
        ],
        'no-unused-labels': 'warn',
        'no-useless-computed-key': 'warn',
        'no-useless-concat': 'warn',
        'no-useless-constructor': 'warn',
        'no-useless-escape': 'warn',
        'no-useless-rename': [
            'warn',
            {
                ignoreDestructuring: false,
                ignoreImport: false,
                ignoreExport: false,
            },
        ],
        'no-with': 'warn',
        'no-whitespace-before-property': 'warn',
        'require-yield': 'warn',
        'rest-spread-spacing': ['warn', 'never'],
        strict: ['warn', 'never'],
        'unicode-bom': ['warn', 'never'],
        'use-isnan': 'warn',
        'valid-typeof': 'warn',
        'getter-return': 'warn',
        'react-hooks/exhaustive-deps': [
            'warn',
            {
                additionalHooks:
                    '(useAnimatedStyle|useDerivedValue|useAnimatedProps)',
            },
        ],

        // Custom syntax restrictions
        'no-restricted-syntax': [
            'error',
            {
                selector:
                    "CallExpression[callee.object.name='Object'][callee.property.name='keys']",
                message:
                    'Please avoid using native Object.keys, use typesafe alternative from toolkit',
            },
            {
                selector:
                    "CallExpression[callee.object.name='window'][callee.property.name='open']",
                message:
                    'Please avoid using window.open, use Window from toolkit/Window',
            },
            {
                selector:
                    "CallExpression[callee.object.name='Object'][callee.property.name='values']",
                message:
                    'Please avoid using native Object.values, use typesafe alternative from toolkit',
            },
            'WithStatement',
        ],

        // Domains
        'zeal-domains/no-restricted-internals': 'error',
        'zeal-domains/no-feature-deep-import': 'error',
        'zeal-domains/secure-uikit-folder': 'error',
        'zeal-domains/no-invalid-import-types': 'error',

        // Imports
        'import/first': 'error',
        'import/no-anonymous-default-export': 'error',
        'simple-import-sort/imports': [
            'error',
            {
                groups: [
                    ['^react'],
                    ['^'],
                    ['^@zeal\\/uikit'],
                    ['^@zeal\\/toolkit'],
                    ['^@zeal\\/domains'],
                    ['^src'],
                    ['^\\.'],
                    ['^\\.\\.'],
                ],
            },
        ],
        'no-restricted-imports': [
            'error',
            {
                paths: [
                    {
                        name: 'react-native',
                        importNames: ['Platform'],
                        message:
                            "Please use 'ZealPlatform' from '@zeal/toolkit/OS' instead of 'Platform' from 'react-native'.",
                    },
                    {
                        name: 'expo-crypto',
                        message:
                            "Please use '@zeal/Crypto' instead of global crypto.",
                    },
                    {
                        name: 'uuid',
                        message: "Please use '@zeal/Crypto' instead of uuid.",
                    },
                ],
            },
        ],

        // A11y
        'jsx-a11y/aria-role': [
            'error',
            {
                allowedInvalidRoles: ['associationlist'],
                ignoreNonDOM: true,
            },
        ],
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/interactive-supports-focus': 'off',
        'jsx-a11y/no-autofocus': 'off',
        'jsx-a11y/tabindex-no-positive': 'off', // TODO Should be on
        'jsx-a11y/no-static-element-interactions': 'off', // TODO Should be on

        // React
        'react/react-in-jsx-scope': 'off',
        'react/display-name': 'off',
        'react/prop-types': 'off',
        'react/jsx-curly-brace-presence': 'error',
    },
    overrides: [
        {
            files: ['**/*.ts?(x)'],
            extends: ['plugin:@typescript-eslint/recommended'],
            rules: {
                'no-unused-vars': 'off',
                '@typescript-eslint/ban-ts-comment': 'off', // We stil have it in some places
                '@typescript-eslint/no-explicit-any': 'off', // We also have a lot of explicit eny unfortunately
                '@typescript-eslint/no-unused-vars': [
                    'error',
                    {
                        args: 'none',
                        ignoreRestSiblings: true,
                    },
                ],
            },
        },
        {
            files: ['**/*fixtures*/**/*'],
            rules: { '@typescript-eslint/no-loss-of-precision': 'off' }, // TODO Fix fixtures and enable this rule
        },
        {
            files: ['**/*.stories.*'],
            rules: {
                'import/no-anonymous-default-export': 'off',
                'react/jsx-key': 'off',
            },
        },
        {
            plugins: ['jest', 'testing-library'],
            files: ['**/*.spec.*'],
            env: { 'jest/globals': true },
            extends: [
                'plugin:jest/recommended',
                'plugin:testing-library/react',
            ],
            rules: {
                '@typescript-eslint/await-thenable': 'off',
            },
        },
        {
            files: ['@zeal/api/portfolio.ts'],
            rules: {
                '@typescript-eslint/ban-types': 'off',
            },
        },
        {
            files: ['webpack.config.js'],
            rules: {
                'no-restricted-syntax': 'off',
                'no-console': 'off',
            },
        },
        {
            files: ['ZealPlatform.ts'],
            rules: {
                'no-restricted-imports': 'off',
            },
        },
    ],
}
