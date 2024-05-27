import '@testing-library/jest-dom'
import 'jest-canvas-mock'
import './lottie'
import './chrome'
import './crypto'

jest.mock('@ledgerhq/hw-transport-webhid', () => ({}))
jest.mock('@walletconnect/core', () => ({}))
jest.mock('@walletconnect/web3wallet', () => ({}))
jest.mock('expo-camera/next', () => ({}))

const mockStyleSheet = {
    create: (sheet: Record<string, object>) => {
        const sheetKeys = Object.keys(sheet) // eslint-disable-line no-restricted-syntax
        const mockSheet = sheetKeys.reduce((acc, key) => {
            acc[key] = {}
            return acc
        }, {} as Record<string, object>)

        return mockSheet
    },
    flatten: (style: Record<string, object> | Record<string, object>[]) => {
        if (Array.isArray(style)) {
            return style.reduce((acc, s) => ({ ...acc, ...s }), {})
        }
        return style
    },
}

const mockAnimated = {
    rotation: jest.fn(),
    Value: class Value {
        interpolate() {}
        setValue() {}
        stopAnimation() {}
    },
    View: () => '',
    timing: () => ({
        start: () => {},
    }),
    createAnimatedComponent: (component: unknown) => component,
}

jest.mock('react-native', () => {
    const original = jest.requireActual('react-native')
    return {
        ...original,
        StyleSheet: mockStyleSheet,
        Animated: mockAnimated,
    }
})

jest.mock('react-native-web', () => {
    const original = jest.requireActual('react-native-web')
    return {
        ...original,
        StyleSheet: mockStyleSheet,
        Animated: mockAnimated,
    }
})

jest.mock('@sentry/react', () => {
    const { error } = console
    return {
        captureException: jest.fn(error),
        captureMessage: jest.fn(error),
    }
})

jest.mock('@sentry/react-native', () => {
    const { error } = console
    return {
        captureException: jest.fn(error),
        captureMessage: jest.fn(error),
    }
})

// TODO Remove this mock, Web3 signing should work same as in browser
jest.mock('@zeal/domains/RPCRequest/helpers/signEthSendTransaction.ts', () => ({
    signEthSendTransaction: () => ({
        id: 123,
        jsonrpc: '2.0',
        method: 'eth_sendRawTransaction',
        params: ['0x0'],
    }),
}))

Object.defineProperty(globalThis, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
})

jest.mock('react-native-reanimated', () =>
    jest.requireActual('react-native-reanimated/mock')
)
