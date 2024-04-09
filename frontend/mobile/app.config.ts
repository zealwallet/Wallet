import { ConfigContext, ExpoConfig } from 'expo/config'

import { version } from '../wallet/manifest.json'

const ZEAL_ENV = process.env.ZEAL_ENV || 'local'

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
    icon: getIcon(),
    userInterfaceStyle: 'light',
    assetBundlePatterns: ['**/*'],
    plugins: [
        'expo-localization',
        [
            'expo-secure-store',
            {
                faceIDPermission:
                    'Zeal uses Biometrics to restrict unauthorized users from accessing the application.', // TODO: @Nicvaniek see if we can localize this
            },
        ],
        [
            'expo-build-properties',
            {
                android: {
                    AsyncStorage_useNextStorage: true,
                    compileSdkVersion: 34,
                    targetSdkVersion: 34,
                    minSdkVersion: 28,
                    buildToolsVersion: '34.0.0',
                    kotlinVersion: '1.8.0',
                },
                ios: {
                    deploymentTarget: '16.0',
                },
            },
        ],
        ['@sentry/react-native/expo'],
    ],
    platforms: ['ios', 'android', 'web'],
    splash: {
        image: './assets/splash.png',
        backgroundColor: '#0FF',
    },
    ios: {
        supportsTablet: true,
        bundleIdentifier: getIdentifier(),
        associatedDomains: ['webcredentials:sample-associated-domain.web.app'], // FIXME :: @Nicvaniek replace with microsite domain
        buildNumber: '5',
    },
    android: {
        package: getIdentifier(),
        versionCode: 5,
        intentFilters: [
            {
                action: 'VIEW',
                autoVerify: true,
                data: [
                    {
                        scheme: 'https',
                        host: 'sample-associated-domain.web.app', // FIXME :: @Nicvaniek replace with microsite domain
                    },
                ],
                category: ['BROWSABLE', 'DEFAULT'],
            },
        ],
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
