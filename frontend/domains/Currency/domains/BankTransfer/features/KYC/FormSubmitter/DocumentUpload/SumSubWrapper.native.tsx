import { useCallback, useEffect } from 'react'

import MobileSDK from '@sumsub/react-native-mobilesdk-module'

import { notReachable, useLiveRef } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'
import { SumSubAccessToken } from '@zeal/domains/Storage'

import { ContinueWithPartner } from './ContinueWithPartner'

import { LoadingLayout } from '../../LoadingLayout'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    sumSubAccessToken: SumSubAccessToken
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'application_submitted' } | { type: 'close' }

export const SumSubWrapper = ({
    sumSubAccessToken,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    const liveMsg = useLiveRef(onMsg)

    const launchSDK = useCallback(() => {
        const sdk = MobileSDK.init(sumSubAccessToken, () => {
            // TODO: Refresh token if this becomes a problem
            captureError(
                new ImperativeError('SumSub access token expired [mobile SDK]')
            )
            return sumSubAccessToken
        })
            .withHandlers({
                onStatusChanged: (event) => {
                    switch (event.newStatus) {
                        case 'Pending':
                            liveMsg.current({ type: 'application_submitted' })
                            sdk.dismiss()
                            break
                        case 'Ready':
                        case 'Failed':
                        case 'Initial':
                        case 'Incomplete':
                        case 'TemporarilyDeclined':
                        case 'FinallyRejected':
                        case 'Approved':
                        case 'ActionCompleted':
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(event.newStatus)
                    }
                },
            })
            .build()

        try {
            sdk.launch()
        } catch (e) {
            captureError(e)
        }
    }, [liveMsg, sumSubAccessToken])

    useEffect(() => {
        launchSDK()
    }, [launchSDK])

    return (
        <>
            <LoadingLayout
                account={account}
                network={network}
                keyStoreMap={keyStoreMap}
                onMsg={onMsg}
            />
            <ContinueWithPartner
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_continue_clicked': // SDK is shown as a modal which the user can close. In that case we allow the user to re-launch the SDK by clicking on "Continuer with partner" again
                            launchSDK()
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg.type)
                    }
                }}
            />
        </>
    )
}
