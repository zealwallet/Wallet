import Constants from 'expo-constants'

import { notReachable } from '../notReachable'
import { ZealPlatform } from '../OS/ZealPlatform'

const getPlatformEnvVariable = (): string | null => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return Constants.expoConfig?.extra?.ZEAL_ENV || null

        case 'web':
            return (
                process.env.ZEAL_ENV || process.env.REACT_APP_ZEAL_ENV || null
            )

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const getEnvironment = (): 'local' | 'production' | 'development' => {
    const env = getPlatformEnvVariable()

    if (env === 'local') {
        return 'local'
    }

    if (env === 'development') {
        return 'development'
    }

    return 'production'
}
