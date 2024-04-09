import React from 'react'

import { LoadingLayout } from '@zeal/uikit/LoadingLayout'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import {
    SendERC20Token as SendERC20Entrypoint,
    SendNFT as SendNFTEntrypoint,
} from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { SendERC20 } from './SendERC20'
import { SendNFT } from './SendNFT'

type Props = {
    entrypoint: SendNFTEntrypoint | SendERC20Entrypoint

    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    customCurrencies: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof SendERC20> | MsgOf<typeof SendNFT>

export const Send = ({
    entrypoint,
    accountsMap,
    customCurrencies,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    portfolioMap,
    sessionPassword,
    currencyHiddenMap,
    currencyPinMap,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const portfolio = getPortfolio({
        address: entrypoint.fromAddress,
        portfolioMap,
    })

    const params = {
        address: entrypoint.fromAddress,
        networkMap,
        networkRPCMap,
        customCurrencies,
        forceRefresh: false,
    }
    const [loadable, setLoadable] = useLoadableData(
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
            switch (entrypoint.type) {
                case 'send_nft':
                    return (
                        <SendNFT
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            portfolio={loadable.data}
                            currencyHiddenMap={currencyHiddenMap}
                            feePresetMap={feePresetMap}
                            accountsMap={accountsMap}
                            customCurrencyMap={customCurrencies}
                            entryPoint={entrypoint}
                            installationId={installationId}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            portfolioMap={portfolioMap}
                            sessionPassword={sessionPassword}
                            onMsg={onMsg}
                        />
                    )

                case 'send_erc20_token':
                    return (
                        <SendERC20
                            gasCurrencyPresetMap={gasCurrencyPresetMap}
                            portfolio={loadable.data}
                            feePresetMap={feePresetMap}
                            currencyHiddenMap={currencyHiddenMap}
                            currencyPinMap={currencyPinMap}
                            account={accountsMap[entrypoint.fromAddress]}
                            accountsMap={accountsMap}
                            currencyId={entrypoint.tokenCurrencyId}
                            customCurrencies={customCurrencies}
                            installationId={installationId}
                            keyStoreMap={keyStoreMap}
                            networkMap={networkMap}
                            networkRPCMap={networkRPCMap}
                            portfolioMap={portfolioMap}
                            sessionPassword={sessionPassword}
                            onMsg={onMsg}
                        />
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(entrypoint)
            }
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
                                    setLoadable({
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
