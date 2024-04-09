import SumSubWebSdk from '@sumsub/websdk-react'

import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { SumSubAccessToken } from '@zeal/domains/Storage'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    sumSubAccessToken: SumSubAccessToken
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'application_submitted' } | { type: 'close' }

type SumSubEvent =
    | 'idCheck.onReady'
    | 'idCheck.onInitialized'
    | 'idCheck.onStepInitiated'
    | 'idCheck.stepCompleted'
    | 'idCheck.onStepCompleted'
    | 'idCheck.onApplicantLoaded'
    | 'idCheck.onApplicantSubmitted'
    | 'idCheck.applicantStatus'
    | 'idCheck.onApplicantStatusChanged'
    | 'idCheck.onApplicantResubmitted'
    | 'idCheck.onActionSubmitted'
    | 'idCheck.actionCompleted'
    | 'idCheck.moduleResultPresented'
    | 'idCheck.onResize'
    | 'idCheck.onVideoIdentCallStarted'
    | 'idCheck.onVideoIdentModeratorJoined'
    | 'idCheck.onVideoIdentCompleted'
    | 'idCheck.onUploadError'
    | 'idCheck.onUploadWarning'
    | 'idCheck.livenessCompleted'

export const SumSubWrapper = ({
    sumSubAccessToken,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                network={network}
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Spacer />

            <Column alignX="center" spacing={0}>
                <SumSubWebSdk
                    accessToken={sumSubAccessToken}
                    onMessage={(msg: SumSubEvent) => {
                        switch (msg) {
                            case 'idCheck.onApplicantSubmitted':
                            case 'idCheck.onApplicantResubmitted':
                                onMsg({ type: 'application_submitted' })
                                break
                            case 'idCheck.applicantStatus':
                            case 'idCheck.onApplicantStatusChanged':
                            case 'idCheck.onReady':
                            case 'idCheck.onInitialized':
                            case 'idCheck.onStepInitiated':
                            case 'idCheck.stepCompleted':
                            case 'idCheck.onStepCompleted':
                            case 'idCheck.onApplicantLoaded':
                            case 'idCheck.onActionSubmitted':
                            case 'idCheck.actionCompleted':
                            case 'idCheck.moduleResultPresented':
                            case 'idCheck.onResize':
                            case 'idCheck.onVideoIdentCallStarted':
                            case 'idCheck.onVideoIdentModeratorJoined':
                            case 'idCheck.onVideoIdentCompleted':
                            case 'idCheck.onUploadError':
                            case 'idCheck.onUploadWarning':
                            case 'idCheck.livenessCompleted':
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                    expirationHandler={() => {
                        // TODO: Refresh token if this becomes a problem
                        captureError(
                            new ImperativeError('SumSub access token expired')
                        )
                        return sumSubAccessToken
                    }}
                />
            </Column>

            <Spacer />
        </Screen>
    )
}
