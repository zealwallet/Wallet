import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import {
    CurrenciesMatrix,
    fetchCurrenciesMatrix,
} from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import { Skeleton } from '@zeal/domains/Currency/domains/Bridge/components/Skeleton'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Flow } from './Flow'

type Props = {
    account: Account
    customCurrencies: CustomCurrencyMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    fromCurrencyId: CurrencyId | null
    sessionPassword: string
    accountMap: AccountsMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    swapSlippagePercent: number | null
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | MsgOf<typeof Flow>

const fetch = async ({
    account,
    signal,
    portfolio,
    networkMap,
    customCurrencies,
    networkRPCMap,
}: {
    account: Account
    portfolio: Portfolio | null
    signal?: AbortSignal
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    customCurrencies: CustomCurrencyMap
}): Promise<{
    currenciesMatrix: CurrenciesMatrix
    portfolio: Portfolio
}> => {
    const [currenciesMatrix, fetchedPortfolio] = await Promise.all([
        fetchCurrenciesMatrix({ signal }),

        portfolio ||
            fetchPortfolio({
                signal,
                address: account.address,
                networkMap,
                networkRPCMap,
                customCurrencies,
                forceRefresh: false,
            }),
    ])

    return {
        currenciesMatrix,
        portfolio: fetchedPortfolio,
    }
}

export const DataLoader = ({
    fromCurrencyId,
    accountMap,
    installationId,
    sessionPassword,
    portfolioMap,
    account,
    keystoreMap,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    customCurrencies,
    gasCurrencyPresetMap,
    onMsg,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            account,
            portfolio: getPortfolio({
                address: account.address,
                portfolioMap,
            }),
            networkMap,
            customCurrencies,
            networkRPCMap,
        },
    })
    switch (loadable.type) {
        case 'loading':
            return (
                <Skeleton
                    account={account}
                    keystoreMap={keystoreMap}
                    onClose={() => onMsg({ type: 'close' })}
                />
            )

        case 'error':
            return (
                <>
                    <Skeleton
                        account={account}
                        keystoreMap={keystoreMap}
                        onClose={() => onMsg({ type: 'close' })}
                    />

                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        case 'loaded':
            return (
                <Flow
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={loadable.data.portfolio}
                    feePresetMap={feePresetMap}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    swapSlippagePercent={swapSlippagePercent}
                    account={account}
                    currenciesMatrix={loadable.data.currenciesMatrix}
                    keystoreMap={keystoreMap}
                    fromCurrencyId={fromCurrencyId}
                    installationId={installationId}
                    accountMap={accountMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
