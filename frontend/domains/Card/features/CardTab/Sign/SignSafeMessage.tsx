import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CardLoadingScreen } from '@zeal/domains/Card/components/CardLoadingScreen'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap, Safe4337 } from '@zeal/domains/KeyStore'
import { fetchSafeOwners } from '@zeal/domains/KeyStore/api/fetchSafeOwners'
import {
    NetworkMap,
    NetworkRPCMap,
    PredefinedNetwork,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { SignMessageWithUserInteraction } from './SignMessageWithUserInteraction'
import { SilentlySignMessage } from './SilentlySignMessage'

type Props = {
    account: Account
    keyStore: Safe4337
    loadingVariant: 'card' | 'spinner'
    networkMap: NetworkMap
    network: PredefinedNetwork
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string

    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof SilentlySignMessage>
    | MsgOf<typeof SignMessageWithUserInteraction>

export const SignSafeMessage = ({
    onMsg,
    account,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStore,
    keyStoreMap,
    loadingVariant,
    networkMap,
    network,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
}: Props) => {
    const [loadable] = useLoadableData(fetchSafeOwners, {
        type: 'loading',
        params: {
            network,
            networkRPCMap,
            safeAddress: keyStore.address,
        },
    })

    switch (loadable.type) {
        case 'error':
        case 'loading': {
            switch (loadingVariant) {
                case 'card':
                    return <CardLoadingScreen account={account} />
                case 'spinner':
                    return <LoadingLayout actionBar={null} onClose={null} />
                /* istanbul ignore next */
                default:
                    return notReachable(loadingVariant)
            }
        }
        case 'loaded':
            return loadable.data.includes(
                keyStore.localSignerKeyStore.address
            ) ? (
                <SilentlySignMessage
                    account={account}
                    keyStore={keyStore}
                    loadingVariant={loadingVariant}
                    onMsg={onMsg}
                    sessionPassword={sessionPassword}
                />
            ) : (
                <SignMessageWithUserInteraction
                    account={account}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStore={keyStore}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(loadable)
    }
}
