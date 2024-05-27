import { notReachable } from '@zeal/toolkit'
import { ImperativeError } from '@zeal/toolkit/Error'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CardConfig } from '@zeal/domains/Card'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { CreateOrImportCard } from './CreateOrImportCard'
import { Flow } from './Flow'

type Props = {
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    cardConfig: CardConfig

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    portfolioMap: PortfolioMap
    sessionPassword: string
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Flow> | MsgOf<typeof CreateOrImportCard>

export const CardTab = ({
    onMsg,
    cardConfig,
    accountsMap,
    keyStoreMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    networkMap,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    encryptedPassword,
    currencyHiddenMap,
}: Props) => {
    switch (cardConfig.type) {
        case 'card_owner_address_is_not_selected':
            return (
                <CreateOrImportCard
                    installationId={installationId}
                    accountsMap={accountsMap}
                    portfolioMap={portfolioMap}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    keyStoreMap={keyStoreMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )
        case 'card_owner_address_is_selected':
            const account = accountsMap[cardConfig.owner]
            const keyStore = getKeyStore({
                keyStoreMap,
                address: cardConfig.owner,
            })

            switch (keyStore.type) {
                case 'track_only':
                    throw new ImperativeError(
                        'Got track-only wallet as card owner'
                    )
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                case 'safe_4337':
                    return (
                        <Flow
                            key={account.address}
                            currencyHiddenMap={currencyHiddenMap}
                            account={account}
                            keyStore={keyStore}
                            accountsMap={accountsMap}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            portfolioMap={portfolioMap}
                            sessionPassword={sessionPassword}
                            encryptedPassword={encryptedPassword}
                            onMsg={onMsg}
                        />
                    )
                /* istanbul ignore next */
                default:
                    return notReachable(keyStore)
            }
        /* istanbul ignore next */
        default:
            return notReachable(cardConfig)
    }
}
