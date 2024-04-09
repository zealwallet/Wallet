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
import { SubmitedTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { SubmittedSafeTransactionCompleted } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'
import { fetchSimulationSubmittedSimulation } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSubmitedTransactionSimulation'
import { SimulatedTransactionInfo } from '@zeal/domains/Transactions/domains/SimulatedTransaction/components/SimulatedTransactionInfo'

import { SuccessLayout } from './SuccessLayout'

type Props = {
    installationId: string
    network: PredefinedNetwork | TestNetwork
    accounts: AccountsMap
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    submitedTransaction:
        | SubmitedTransactionCompleted
        | SubmittedSafeTransactionCompleted
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
    installationId,
    network,
    submitedTransaction,
    networkMap,
    onMsg,
}: Props) => {
    const [loadable] = useLoadableData(
        withDelay(
            fetchSimulationSubmittedSimulation,
            SUCCESS_ANIMATION_TIME_MS
        ),
        {
            type: 'loading',
            params: { hash: submitedTransaction.hash, network },
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
    }, [liveOnMsg, loadable, submitedTransaction])

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
