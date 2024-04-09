import { useLayoutEffect } from 'react'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { withDelay } from '@zeal/toolkit/delay'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    NetworkMap,
    PredefinedNetwork,
    TestNetwork,
} from '@zeal/domains/Network'
import { SubmittedUserOperationCompleted } from '@zeal/domains/TransactionRequest/domains/SubmittedUserOperation'
import { SimulatedTransactionInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionInfo'
import { fetchUserOperationResult } from '@zeal/domains/UserOperation/api/fetchUserOperationResult'

import { SuccessLayout } from './SuccessLayout'

type Props = {
    network: PredefinedNetwork | TestNetwork
    accounts: AccountsMap
    installationId: string
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    submittedUserOperation: SubmittedUserOperationCompleted
    onMsg: (msg: Msg) => void
}

const SUCCESS_ANIMATION_TIME_MS = 1000

type Msg = {
    type: 'on_completed_splash_animation_screen_competed'
}

export const FinalSimulation = ({
    accounts,
    dApp,
    keystores,
    network,
    installationId,
    submittedUserOperation,
    networkMap,
    onMsg,
}: Props) => {
    const [loadable] = useLoadableData(
        withDelay(fetchUserOperationResult, SUCCESS_ANIMATION_TIME_MS),
        {
            type: 'loading',
            params: {
                network,
                submittedUserOperation,
            },
        }
    )

    const liveOnMsg = useLiveRef(onMsg)

    useLayoutEffect(() => {
        switch (loadable.type) {
            case 'loading':
                break
            case 'loaded':
                liveOnMsg.current({
                    type: 'on_completed_splash_animation_screen_competed',
                })
                break

            case 'error':
                captureError(loadable.error)
                break
            /* istanbul ignore next */
            default:
                notReachable(loadable)
        }
    }, [liveOnMsg, loadable, submittedUserOperation])

    switch (loadable.type) {
        case 'loaded':
            return (
                <SimulatedTransactionInfo
                    installationId={installationId}
                    networkMap={networkMap}
                    accounts={accounts}
                    dApp={dApp}
                    keystores={keystores}
                    simulation={{
                        transaction: loadable.data.transaction,
                        checks: [],
                        currencies: loadable.data.currencies,
                    }}
                />
            )

        case 'loading':
        case 'error':
            return <SuccessLayout onAnimationComplete={null} />

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
