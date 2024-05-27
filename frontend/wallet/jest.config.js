const config = {
    roots: ['<rootDir>/src'],
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.(stories|spec).{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/tests/**/*',
        '!src/polyfills.ts',
        '!src/index.tsx',
    ],
    testMatch: [
        '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
        '<rootDir>/src/**/*.{spec,test}.{ts,tsx}',
    ],
    testEnvironment: 'jsdom',
    transform: {
        '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': '<rootDir>/jest.babel.transform.js',
        // TODO Check if it render correctly with jest-scss-transform instead of this
        // '^.+\\.css$': ['jest-transform-css', { modules: true }],
        '^.+\\.(css|scss)$': ['jest-scss-transform'],
        '\\.(png|webp)$': ['jest-transform-stub'],
    },
    transformIgnorePatterns: [
        '[/\\\\]node_modules[/\\\\](?!(expo-linking|expo-haptics|expo-application|expo-blur|expo-clipboard|expo-constants|expo-crypto|expo-linear-gradient|expo-modules-core|expo-status-bar|expo-secure-store|react-native-reanimated|react-native-shadow-2|expo-local-authentication)[/\\\\]).+\\.(js|jsx|mjs|cjs|ts|tsx)$',
    ],
    modulePaths: [],
    moduleNameMapper: {
        '^react-native$': require.resolve('react-native-web'),

        '^src/(.*)$': '<rootDir>/src/$1',
        '^@zeal/(toolkit|uikit|domains|passkeys)$': '<rootDir>/../$1',

        '^@zeal/assets.*': '@zeal/toolkit/noop',
        'expo-image': '@zeal/toolkit/noop',
        '@react-native-firebase/app': '@zeal/toolkit/noop',
        '@react-native-firebase/messaging': '@zeal/toolkit/noop',
    },
    moduleFileExtensions: [
        'web.tsx',
        'web.ts',
        'web.jsx',
        'web.js',
        'tsx',
        'ts',
        'jsx',
        'js',
        'json',
        'node',
    ],
    resetMocks: true,
    coverageReporters: ['text-summary', 'lcov'],
    setupFilesAfterEnv: ['./src/tests/mocks/global.ts'], // We need to make sure our dependency mocks are loadead before any other test or app file
    setupFiles: [
        './src/tests/setup.ts',
        '../../node_modules/react-native-gesture-handler/jestSetup.js',
    ],
    globalSetup: './src/tests/global.ts',
    globals: {
        // TODO: remove after we upgrade rn-reanimated and it no longer needs this
        __DEV__: true,
    },
}

module.exports = config
