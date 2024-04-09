import React, { useEffect } from 'react'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { ConnectedToMetaMask as ConnectedToMetaMaskConnectionState } from '@zeal/domains/DApp/domains/ConnectionState'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { InteractionRequest } from '@zeal/domains/RPCRequest'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'

import { MinizedExpanded } from './MinizedExpanded'

type Props = {
    interactionRequest: InteractionRequest | null
    encryptedPassword: string
    sessionPassword: string | null
    connectionState: ConnectedToMetaMaskConnectionState
    requestedNetwork: Network
    networkRPCMap: NetworkRPCMap
    initialAccount: Account
    alternativeProvider: AlternativeProvider
    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    accounts: AccountsMap
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    currencyHiddenMap: CurrencyHiddenMap
    dApps: Record<string, DAppConnectionState>
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof MinizedExpanded>

export const ConnectedToMetaMask = ({
    interactionRequest,
    connectionState,
    requestedNetwork,
    alternativeProvider,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    customCurrencyMap,
    encryptedPassword,
    sessionPassword,
    initialAccount,
    accounts,
    portfolioMap,
    keystores,
    dApps,
    installationId,
    onMsg,
}: Props) => {
    useEffect(() => {
        if (interactionRequest) {
            captureError(
                new ImperativeError(
                    `got interaction request ${interactionRequest.method} in ConnectedToMetaMask `
                )
            )
        }
    }, [interactionRequest])

    return (
        <MinizedExpanded
            installationId={installationId}
            alternativeProvider={alternativeProvider}
            currencyHiddenMap={currencyHiddenMap}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            customCurrencyMap={customCurrencyMap}
            sessionPassword={sessionPassword}
            accounts={accounts}
            encryptedPassword={encryptedPassword}
            requestedNetwork={requestedNetwork}
            initialAccount={initialAccount}
            connectionState={connectionState}
            keystores={keystores}
            portfolioMap={portfolioMap}
            dApps={dApps}
            onMsg={onMsg}
        />
    )
}
