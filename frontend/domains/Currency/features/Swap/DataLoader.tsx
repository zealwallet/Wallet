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
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Skeleton } from './components/Skeleton'
import { Form } from './Form'

type Props = {
    fromCurrencyId: CurrencyId | null
    fromAccount: Account
    portfolio: Portfolio | null

    sessionPassword: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    customCurrencies: CustomCurrencyMap

    swapSlippagePercent: number | null

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Form>

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
    fromAccount,
    portfolio,
    fromCurrencyId,
    accountsMap,
    installationId,
    keystoreMap,
    sessionPassword,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    customCurrencies,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetch, {
        type: 'loading',
        params: {
            customCurrencies,
            networkMap,
            networkRPCMap,
            portfolio,
            account: fromAccount,
        },
    })

    switch (loadable.type) {
        case 'loading':
            return (
                <Skeleton
                    account={fromAccount}
                    keystoreMap={keystoreMap}
                    onClose={() => onMsg({ type: 'close' })}
                />
            )

        case 'error':
            return (
                <>
                    <Skeleton
                        account={fromAccount}
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
                <Form
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    feePresetMap={feePresetMap}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyPinMap={currencyPinMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    swapSlippagePercent={swapSlippagePercent}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    installationId={installationId}
                    fromCurrencyId={fromCurrencyId}
                    fromAccount={fromAccount}
                    currenciesMatrix={loadable.data.currenciesMatrix}
                    portfolio={loadable.data.portfolio}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}
