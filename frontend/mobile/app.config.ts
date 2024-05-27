import { ConfigContext, ExpoConfig } from 'expo/config'

import { version } from '../wallet/manifest.json'

const ZEAL_ENV = process.env.ZEAL_ENV || 'local'

const VERSION_CODE_FACTOR = 1000

const verisonToVersionCode = (version: string): number =>
    version
        .split('.')
        .toReversed()
        .map(
            (item, index) => Number(item) * Math.pow(VERSION_CODE_FACTOR, index)
        )
        .reduce((acc, item) => item + acc, 0)

const getName = () => {
    switch (ZEAL_ENV) {
        case 'local':
            return `Zeal [local]`
        case 'development':
            return `Zeal [development]`
        case 'production':
            return `Zeal`
        default:
            throw new Error(`Unknown environment: ${ZEAL_ENV}`)
    }
}

const getIdentifier = () => {
    switch (ZEAL_ENV) {
        case 'local':
            return 'app.zeal.wallet.local'
        case 'development':
            return 'app.zeal.wallet.development'
        case 'production':
            return `app.zeal.wallet`

        default:
            throw new Error(`Unknown environment: ${ZEAL_ENV}`)
    }
}

const getIcon = () => {
    switch (ZEAL_ENV) {
        case 'local':
        case 'development':
            return './assets/app_icon_new_dev.png'
        case 'production':
            return './assets/app_icon_new.png'

        default:
            throw new Error(`Unknown environment: ${ZEAL_ENV}`)
    }
}

const config = ({ config }: ConfigContext): ExpoConfig => ({
    ...config,
    name: getName(),
    slug: 'zeal-wallet',
    version,
    description: 'Zeal Wallet',
    owner: 'zeal-app',
    orientation: 'portrait',
    scheme: ['zeal', 'wc'],
    icon: getIcon(),
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    plugins: [
        './plugins/android-storage-next.js',
        './plugins/ios-network-caching-config.js',
        'expo-localization',
        '@react-native-firebase/app',
        [
            'expo-camera',
            {
                cameraPermission:
                    'Zeal requires camera access for ID verification and to scan QR codes.',
            },
        ],
        [
            'expo-font',
            {
                fonts: [
                    './assets/fonts/Lexend-Bold.ttf',
                    './assets/fonts/Lexend-Medium.ttf',
                    './assets/fonts/Lexend-Regular.ttf',
                    './assets/fonts/Lexend-SemiBold.ttf',
                ],
            },
        ],
        [
            'expo-secure-store',
            {
                faceIDPermission:
                    'Zeal uses Biometrics to protect access to your wallet.', // TODO: @Nicvaniek localization https://docs.expo.dev/guides/localization/#translating-app-metadata
            },
        ],
        [
            'expo-build-properties',
            {
                android: {
                    compileSdkVersion: 34,
                    targetSdkVersion: 34,
                    minSdkVersion: 28,
                    buildToolsVersion: '34.0.0',
                    kotlinVersion: '1.8.0',
                    extraMavenRepos: [
                        'https://maven.sumsub.com/repository/maven-public/',
                    ],
                },
                ios: {
                    deploymentTarget: '16.0',
                    extraPods: [
                        {
                            name: 'IdensicMobileSDK',
                            version: '1.29.0',
                            source: 'https://github.com/SumSubstance/Specs.git',
                        },
                    ],
                    useFrameworks: 'static',
                },
            },
        ],
        ...(ZEAL_ENV !== 'local' ? ['@sentry/react-native/expo'] : []),
    ],
    platforms: ['ios', 'android', 'web'],
    splash: {
        image: './assets/splash.png',
        backgroundColor: '#0FF',
    },
    ios: {
        supportsTablet: false,
        bundleIdentifier: getIdentifier(),
        associatedDomains: ['webcredentials:passkey.zealwallet.com'],
        buildNumber: verisonToVersionCode(version).toString(10),
        infoPlist: {
            NSCameraUsageDescription:
                'Zeal requires camera access for ID verification and to scan QR codes.',
            NSMicrophoneUsageDescription:
                'Zeal requires microphone access for ID verification.',
            NSPhotoLibraryUsageDescription:
                'Zeal requires access to your photo library for ID verification.',
            NSLocationWhenInUseUsageDescription:
                'Zeal requires geolocation data to prove your location for ID verification.',
        },
        googleServicesFile: `./google-services/GoogleService-Info-${ZEAL_ENV}.plist`,
    },
    android: {
        package: getIdentifier(),
        versionCode: verisonToVersionCode(version),
        intentFilters: [
            {
                action: 'VIEW',
                autoVerify: true,
                data: [
                    {
                        scheme: 'https',
                        host: 'passkey.zealwallet.com',
                    },
                ],
                category: ['BROWSABLE', 'DEFAULT'],
            },
        ],
        googleServicesFile: './google-services/google-services.json',
    },
    web: {
        favicon: './assets/icon-48.png',
    },
    extra: {
        ZEAL_ENV,
        eas: {
            projectId: '2df7d5cd-437b-43d3-bed9-cb337adba382',
        },
    },
})

export default config
