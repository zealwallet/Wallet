import { useEffect } from 'react'
import { useIntl } from 'react-intl'

import { Color } from '@zeal/uikit/colors'
import { FaceIdLogo } from '@zeal/uikit/Icon/FaceIdLogo'
import { Fingerprint } from '@zeal/uikit/Icon/Fingerprint'
import { Iris } from '@zeal/uikit/Icon/Iris'
import { KeyPad } from '@zeal/uikit/Keypad'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import {
    BiometricType,
    fetchPrimaryBiometricType,
    get,
} from '@zeal/toolkit/Storage/secureStorage'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { PIN_KEY } from '@zeal/domains/Storage/constants'

type FetchPinResult =
    | { type: 'biometrics_not_available' }
    | {
          type: 'biometrics_available_pin_found'
          pin: string
          primaryBiometricType: BiometricType
      }
    | {
          type: 'biometrics_available_pin_not_found'
          primaryBiometricType: BiometricType
      }
    | {
          type: 'biometrics_available_user_cancelled_read'
          primaryBiometricType: BiometricType
      }

export const fetchSavedPinFromSecureStorage =
    async (): Promise<FetchPinResult> => {
        const primaryBiometricType = await fetchPrimaryBiometricType()

        switch (primaryBiometricType.type) {
            case 'not_available':
                return { type: 'biometrics_not_available' }
            case 'available': {
                try {
                    const pin = await get({ key: PIN_KEY })

                    if (!pin) {
                        return {
                            type: 'biometrics_available_pin_not_found',
                            primaryBiometricType:
                                primaryBiometricType.biometricType,
                        }
                    }

                    return {
                        type: 'biometrics_available_pin_found',
                        primaryBiometricType:
                            primaryBiometricType.biometricType,
                        pin,
                    }
                } catch (error) {
                    const parsedError = parseAppError(error)

                    switch (parsedError.type) {
                        case 'biometric_prompt_cancelled':
                            return {
                                type: 'biometrics_available_user_cancelled_read',
                                primaryBiometricType:
                                    primaryBiometricType.biometricType,
                            }
                        /* istanbul ignore next */
                        default:
                            captureError(parsedError)
                            return {
                                type: 'biometrics_available_pin_not_found',
                                primaryBiometricType:
                                    primaryBiometricType.biometricType,
                            }
                    }
                }
            }
            /* istanbul ignore next */
            default:
                return notReachable(primaryBiometricType)
        }
    }

const Icon = ({
    biometricType,
    color,
    size,
}: {
    biometricType: BiometricType
    color: Color
    size: number
}) => {
    switch (biometricType) {
        case 'face':
            return <FaceIdLogo size={size} color={color} />
        case 'fingerprint':
            return <Fingerprint size={size} color={color} />
        case 'iris':
            return <Iris size={size} color={color} />
        /* istanbul ignore next */
        default:
            return notReachable(biometricType)
    }
}

type Msg = { type: 'on_pin_retrieved'; savedPin: string }

export const BiometricButton = ({ onMsg }: { onMsg: (msg: Msg) => void }) => {
    const { formatMessage } = useIntl()
    const [loadable, setLoadable] = useLoadableData(
        fetchSavedPinFromSecureStorage,
        {
            type: 'loading',
            params: undefined,
        }
    )

    const liveMsg = useLiveRef(onMsg)

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                switch (loadable.data.type) {
                    case 'biometrics_not_available':
                    case 'biometrics_available_pin_not_found':
                    case 'biometrics_available_user_cancelled_read':
                        break
                    case 'biometrics_available_pin_found':
                        liveMsg.current({
                            type: 'on_pin_retrieved',
                            savedPin: loadable.data.pin,
                        })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(loadable.data)
                }
                break
            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable, liveMsg])

    switch (loadable.type) {
        case 'loading':
            return null
        case 'loaded':
            switch (loadable.data.type) {
                case 'biometrics_not_available':
                    return null
                case 'biometrics_available_pin_found':
                case 'biometrics_available_user_cancelled_read': {
                    const bioType = loadable.data.primaryBiometricType
                    return (
                        <KeyPad.Button
                            onPress={() =>
                                setLoadable({
                                    type: 'loading',
                                    params: loadable.params,
                                })
                            }
                            disabled={false}
                            aria-label={formatMessage({
                                id: 'keypad.biometric-button',
                                defaultMessage: 'Keypad biometric button',
                            })}
                        >
                            {({ color, size }) => (
                                <Icon
                                    biometricType={bioType}
                                    color={color}
                                    size={size}
                                />
                            )}
                        </KeyPad.Button>
                    )
                }
                case 'biometrics_available_pin_not_found': {
                    const bioType = loadable.data.primaryBiometricType
                    return (
                        <KeyPad.Button
                            disabled
                            aria-label={formatMessage({
                                id: 'keypad.biometric-button',
                                defaultMessage: 'Keypad biometric button',
                            })}
                        >
                            {({ color, size }) => (
                                <Icon
                                    biometricType={bioType}
                                    color={color}
                                    size={size}
                                />
                            )}
                        </KeyPad.Button>
                    )
                }
                /* istanbul ignore next */
                default:
                    return notReachable(loadable.data)
            }
        case 'error':
            return null // Failed to fetch biometric types - user can still enter pin
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
