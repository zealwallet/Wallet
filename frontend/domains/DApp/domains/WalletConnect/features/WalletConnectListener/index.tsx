import { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Listener } from './Listener'

type Props = {
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    networkMap: NetworkMap

    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    keyStoreMap: KeyStoreMap
    networkRPCMap: NetworkRPCMap
    installationId: string
    selectedAccount: Account
    customCurrencyMap: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Listener>

export const WalletConnectListener = ({
    walletConnectInstanceLoadable,
    networkMap,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    currencyHiddenMap,
    customCurrencyMap,
    selectedAccount,
    onMsg,
}: Props) => {
    useEffect(() => {
        switch (walletConnectInstanceLoadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(walletConnectInstanceLoadable.error)
                break
            default:
                notReachable(walletConnectInstanceLoadable)
        }
    }, [walletConnectInstanceLoadable])

    switch (walletConnectInstanceLoadable.type) {
        case 'loaded': {
            switch (walletConnectInstanceLoadable.data.type) {
                case 'available':
                    return (
                        <Listener
                            currencyHiddenMap={currencyHiddenMap}
                            customCurrencyMap={customCurrencyMap}
                            selectedAccount={selectedAccount}
                            accountsMap={accountsMap}
                            feePresetMap={feePresetMap}
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            installationId={installationId}
                            keyStoreMap={keyStoreMap}
                            networkRPCMap={networkRPCMap}
                            portfolioMap={portfolioMap}
                            sessionPassword={sessionPassword}
                            networkMap={networkMap}
                            walletConnectInstance={
                                walletConnectInstanceLoadable.data
                                    .walletConnectInstance
                            }
                            onMsg={onMsg}
                        />
                    )

                case 'not_available':
                    return null

                default:
                    return notReachable(walletConnectInstanceLoadable.data)
            }
        }
        case 'loading':
        case 'error':
            return null
        default:
            return notReachable(walletConnectInstanceLoadable)
    }
}
