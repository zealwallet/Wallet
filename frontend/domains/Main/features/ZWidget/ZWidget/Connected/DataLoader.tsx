import React from 'react'

import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { Connected as ConnectedState } from '@zeal/domains/DApp/domains/ConnectionState'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import {
    SendTransaction,
    State,
} from '@zeal/domains/RPCRequest/features/SendTransaction'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

type Props = {
    sessionPassword: string

    account: Account
    network: Network

    accounts: AccountsMap
    keystores: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    portfolioMap: PortfolioMap

    sendTransactionRequest: EthSendTransaction

    connectionState: ConnectedState
    customCurrencies: CustomCurrencyMap
    state: State

    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof SendTransaction> | { type: 'close' }

export const DataLoader = ({
    account,
    networkMap,
    networkRPCMap,
    customCurrencies,
    portfolioMap,
    sendTransactionRequest,
    installationId,
    connectionState,
    feePresetMap,
    state,
    sessionPassword,
    network,
    keystores,
    accounts,
    gasCurrencyPresetMap,
    onMsg,
}: Props) => {
    const portfolio = getPortfolio({
        address: account.address,
        portfolioMap,
    })
    const params = {
        address: account.address,
        networkMap,
        networkRPCMap,
        customCurrencies,
        forceRefresh: false,
    }

    const [loadable, setLoadble] = useLoadableData(
        fetchPortfolio,
        portfolio
            ? {
                  type: 'loaded',
                  params,
                  data: portfolio,
              }
            : {
                  type: 'loading',
                  params,
              }
    )
    switch (loadable.type) {
        case 'loading':
            return <LoadingLayout actionBar={null} />
        case 'loaded':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={loadable.data}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    source="zwidget"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    installationId={installationId}
                    accounts={accounts}
                    keystores={keystores}
                    state={state}
                    account={account}
                    dApp={connectionState.dApp}
                    network={network}
                    sendTransactionRequest={sendTransactionRequest}
                    sessionPassword={sessionPassword}
                    actionSource="zwidget"
                    onMsg={onMsg}
                />
            )
        case 'error':
            return (
                <>
                    <LoadingLayout actionBar={null} />
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg({
                                        type: 'close',
                                    })
                                    break
                                case 'try_again_clicked':
                                    setLoadble({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
