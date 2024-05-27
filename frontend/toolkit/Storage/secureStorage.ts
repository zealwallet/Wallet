import {
    AuthenticationType,
    isEnrolledAsync,
    supportedAuthenticationTypesAsync,
} from 'expo-local-authentication'
import * as SecureStore from 'expo-secure-store'

import { notReachable } from '@zeal/toolkit/notReachable'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { ImperativeError } from '@zeal/domains/Error'

import * as localStorage from './localStorage'

import { ZealPlatform } from '../OS/ZealPlatform'

export type BiometricType = 'face' | 'fingerprint' | 'iris'

type FetchPrimaryBiometricTypeResult =
    | {
          type: 'available'
          biometricType: BiometricType
      }
    | { type: 'not_available' }

const parseBiometricType = (
    input: AuthenticationType
): Result<unknown, BiometricType> => {
    switch (input) {
        case AuthenticationType.FINGERPRINT:
            return success('fingerprint')
        case AuthenticationType.FACIAL_RECOGNITION:
            return success('face')
        case AuthenticationType.IRIS:
            return success('iris')
        /* istanbul ignore next */
        default:
            return failure({ type: 'unknown_biometric_type', value: input })
    }
}

export const fetchPrimaryBiometricType =
    async (): Promise<FetchPrimaryBiometricTypeResult> => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'android': {
                const biometricTypes = await supportedAuthenticationTypesAsync()
                const isEnrolled = await isEnrolledAsync()

                if (!biometricTypes.length || !isEnrolled) {
                    return { type: 'not_available' }
                }

                // We assume that the first biometric type is the primary one. We can investigate if there is a more sophisticated solution to this
                const primaryBiometricType = parseBiometricType(
                    biometricTypes[0]
                ).getSuccessResultOrThrow('Failed to parse biometric type')

                const secureStoreAvailable =
                    await SecureStore.isAvailableAsync()

                return secureStoreAvailable
                    ? {
                          type: 'available',
                          biometricType: primaryBiometricType,
                      }
                    : { type: 'not_available' }
            }
            case 'web':
                throw new ImperativeError(
                    'Secure storage is not supported on web'
                )

            default:
                return notReachable(ZealPlatform.OS)
        }
    }

export const get = async ({ key }: { key: string }): Promise<string | null> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return SecureStore.getItemAsync(key)

        case 'web':
            return localStorage.get(key)
        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const set = async ({
    key,
    value,
}: {
    key: string
    value: string
}): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return SecureStore.setItemAsync(key, value, {
                requireAuthentication: true,
            })

        case 'web':
            return localStorage.set(key, value)

        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const remove = async ({ key }: { key: string }): Promise<void> => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return SecureStore.deleteItemAsync(key)

        case 'web':
            return localStorage.remove(key)

        default:
            return notReachable(ZealPlatform.OS)
    }
}
