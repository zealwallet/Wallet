import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import {
    NetworkMap,
    NetworkRPCMap,
    PredefinedNetwork,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { SignMessageWithUserInteraction } from './SignMessageWithUserInteraction'
import { SignSafeMessage } from './SignSafeMessage'
import { SilentlySignMessage } from './SilentlySignMessage'

type Props = {
    network: PredefinedNetwork
    account: Account
    keyStore: SigningKeyStore
    loadingVariant: 'card' | 'spinner'
    networkMap: NetworkMap
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
    | MsgOf<typeof SignMessageWithUserInteraction>
    | MsgOf<typeof SilentlySignMessage>

export const Sign = ({
    account,
    keyStore,
    onMsg,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    loadingVariant,
    portfolioMap,
    sessionPassword,
    network,
}: Props) => {
    switch (keyStore.type) {
        case 'ledger':
        case 'trezor':
            return (
                <SignMessageWithUserInteraction
                    network={network}
                    account={account}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStore={keyStore}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )
        case 'safe_4337':
            return (
                <SignSafeMessage
                    account={account}
                    keyStore={keyStore}
                    loadingVariant={loadingVariant}
                    networkMap={networkMap}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStoreMap={keyStoreMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )
        case 'private_key_store':
        case 'secret_phrase_key':
            return (
                <SilentlySignMessage
                    loadingVariant={loadingVariant}
                    account={account}
                    keyStore={keyStore}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(keyStore)
    }
}
