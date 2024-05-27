import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Onboarding as OnboardingEntrypoint } from '@zeal/domains/Main'
import {
    ANDROID_ASSET_LINKS_FILE_URL,
    APPLE_APP_SITE_ASSOCIATION_FILE_URL,
} from '@zeal/domains/Main/constants'
import { NetworkMap } from '@zeal/domains/Network'
import { Storage } from '@zeal/domains/Storage'

import { AppSplashScreen } from './AppSplashScreen'
import { StorageValidator } from './StorageValidator'
import { NextAction, WalletStories } from './WalletStories'

type Props = {
    entryPoint: OnboardingEntrypoint

    storage: Storage | null
    sessionPassword: string | null
    networkMap: NetworkMap

    installationId: string

    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'app_splash_screen' }
    | { type: 'story' }
    | { type: 'onboarding_flow'; nextAction: NextAction }

type Msg = Extract<
    MsgOf<typeof StorageValidator>,
    {
        type:
            | 'on_account_create_request'
            | 'on_accounts_create_success_animation_finished'
            | 'on_user_skipped_add_assets'
            | 'bank_transfer_click'
            | 'from_any_wallet_click'
            | 'safe_wallet_clicked'
            | 'hardware_wallet_clicked'
            | 'add_wallet_clicked'
            | 'track_wallet_clicked'
    }
>

export const Onboarding = ({
    entryPoint: _,
    sessionPassword,
    storage,
    installationId,
    networkMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(
        (() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return { type: 'story' }

                case 'web':
                    return { type: 'app_splash_screen' }
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })()
    )

    useEffect(() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'android':
                // Pre-fetch these files to ensure they are cached before the user creates their first passkey
                Promise.all([
                    fetch(APPLE_APP_SITE_ASSOCIATION_FILE_URL),
                    fetch(ANDROID_ASSET_LINKS_FILE_URL),
                ]).catch(() =>
                    captureError(
                        new ImperativeError(
                            'Failed to prefetch app association files'
                        )
                    )
                )
                break
            case 'web':
                break
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    }, [])

    switch (state.type) {
        case 'app_splash_screen':
            return (
                <AppSplashScreen
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_get_started':
                                setState({ type: 'story' })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'story':
            return (
                <WalletStories
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'story_completed':
                                setState({
                                    type: 'onboarding_flow',
                                    nextAction: msg.nextAction,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'onboarding_flow':
            return (
                <StorageValidator
                    nextAction={state.nextAction}
                    networkMap={networkMap}
                    installationId={installationId}
                    sessionPassword={sessionPassword}
                    storage={storage}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'lock_screen_close_click':
                                setState({ type: 'story' })
                                break

                            case 'on_accounts_create_success_animation_finished':
                            case 'on_user_skipped_add_assets':
                            case 'bank_transfer_click':
                            case 'from_any_wallet_click':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
