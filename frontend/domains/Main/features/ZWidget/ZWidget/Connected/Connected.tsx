import { useEffect } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { Connected as ConnectedState } from '@zeal/domains/DApp/domains/ConnectionState'
import {
    Connected as ConnectedComponent,
    Msg as ConnectedComponentMsg,
} from '@zeal/domains/DApp/domains/ConnectionState/components/Connected'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Msg as VisualStateMsg, VisualState } from './VisualState'

type Props = {
    interactionRequest: InteractionRequest | null
    ethNetworkChange: Network
    networkRPCMap: NetworkRPCMap

    encryptedPassword: string

    installationId: string
    account: Account

    connectionState: ConnectedState
    alternativeProvider: AlternativeProvider
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keystores: KeyStoreMap
    sessionPassword: string | null
    networkMap: NetworkMap
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    onMsg: (msg: Msg) => void
}

export type Msg = ConnectedComponentMsg | VisualStateMsg

export const Connected = ({
    account,
    interactionRequest,
    connectionState,
    accounts,
    keystores,
    portfolioMap,
    ethNetworkChange,
    networkRPCMap,
    alternativeProvider,
    sessionPassword,
    encryptedPassword,
    installationId,
    customCurrencyMap,
    networkMap,
    feePresetMap,
    currencyHiddenMap,
    gasCurrencyPresetMap,
    onMsg,
}: Props) => {
    useEffect(() => {
        if (interactionRequest) {
            switch (interactionRequest.method) {
                case 'eth_requestAccounts':
                    captureError(
                        new ImperativeError(
                            'Got eth_requestAccounts in connected state'
                        )
                    )
                    break
                case 'wallet_requestPermissions':
                case 'eth_sendTransaction':
                case 'eth_signTypedData_v4':
                case 'eth_signTypedData_v3':
                case 'eth_signTypedData':
                case 'personal_sign':
                case 'wallet_addEthereumChain':
                    break
                /* istanbul ignore next */
                default:
                    return notReachable(interactionRequest)
            }
        }
    }, [interactionRequest])

    if (interactionRequest) {
        return (
            <VisualState
                gasCurrencyPresetMap={gasCurrencyPresetMap}
                customCurrencies={customCurrencyMap}
                portfolioMap={portfolioMap}
                feePresetMap={feePresetMap}
                networkMap={networkMap}
                installationId={installationId}
                accounts={accounts}
                keystores={keystores}
                key={interactionRequest.id}
                encryptedPassword={encryptedPassword}
                sessionPassword={sessionPassword}
                account={account}
                network={ethNetworkChange}
                networkRPCMap={networkRPCMap}
                keyStore={getKeyStore({
                    keyStoreMap: keystores,
                    address: account.address,
                })}
                interactionRequest={interactionRequest}
                connectionState={connectionState}
                onMsg={onMsg}
            />
        )
    } else {
        return (
            <ConnectedComponent
                installationId={installationId}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                customCurrencyMap={customCurrencyMap}
                selectedNetwork={ethNetworkChange}
                networkRPCMap={networkRPCMap}
                selectedAccount={account}
                sessionPassword={sessionPassword}
                encryptedPassword={encryptedPassword}
                connectionState={connectionState}
                keystores={keystores}
                accounts={accounts}
                portfolioMap={portfolioMap}
                onMsg={onMsg}
            />
        )
    }
}
