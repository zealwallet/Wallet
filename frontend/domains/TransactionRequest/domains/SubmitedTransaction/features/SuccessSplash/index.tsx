import { notReachable } from '@zeal/toolkit'

import { AccountsMap } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap } from '@zeal/domains/Network'
import {
    SubmitedTransactionCompleted,
    SubmittedSafeTransactionCompleted,
} from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

import { FinalSimulation } from './FinalSimulation'
import { SuccessLayout } from './SuccessLayout'

type Props = {
    installationId: string
    network: Network
    accounts: AccountsMap
    keystores: KeyStoreMap
    dApp: DAppSiteInfo | null
    networkMap: NetworkMap
    submitedTransaction:
        | SubmitedTransactionCompleted
        | SubmittedSafeTransactionCompleted
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_completed_splash_animation_screen_competed'
}

export const SuccessSplash = ({
    accounts,
    dApp,
    keystores,
    network,
    installationId,
    submitedTransaction,
    networkMap,
    onMsg,
}: Props) => {
    switch (network.type) {
        case 'custom':
            return (
                <SuccessLayout
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_completed_splash_animation_screen_competed',
                        })
                    }
                />
            )

        case 'predefined':
        case 'testnet':
            return (
                <FinalSimulation
                    installationId={installationId}
                    accounts={accounts}
                    dApp={dApp}
                    keystores={keystores}
                    network={network}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    submitedTransaction={submitedTransaction}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(network)
    }
}
