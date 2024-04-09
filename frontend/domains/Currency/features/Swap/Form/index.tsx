import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { LoadedReloadableData } from '@zeal/toolkit/LoadableData/LoadedReloadableData'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CryptoCurrency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    GasCurrencyPresetMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { CurrenciesMatrix } from '@zeal/domains/Currency/api/fetchCurrenciesMatrix'
import {
    SwapQuote,
    SwapQuoteRequest,
} from '@zeal/domains/Currency/domains/SwapQuote'
import { fetchSwapQuote } from '@zeal/domains/Currency/domains/SwapQuote/api/fetchSwapQuote'
import { DEFAULT_SWAP_SLIPPAGE_PERCENT } from '@zeal/domains/Currency/domains/SwapQuote/constants'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { DEFAULT_NETWORK } from '@zeal/domains/Network/constants'
import { getNativeTokenAddress } from '@zeal/domains/Network/helpers/getNativeTokenAddress'
import { Portfolio } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    currenciesMatrix: CurrenciesMatrix
    portfolio: Portfolio
    fromAccount: Account

    fromCurrencyId: CurrencyId | null

    sessionPassword: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    swapSlippagePercent: number | null

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'close' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'on_all_transaction_success'
                  | 'import_keys_button_clicked'
                  | 'on_predefined_fee_preset_selected'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_set_slippage_percent'
                  | 'on_rpc_change_confirmed'
                  | 'on_select_rpc_click'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_safe_transaction_completed_splash_animation_screen_competed'
                  | 'on_gas_currency_selected'
                  | 'transaction_request_replaced'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
                  | 'on_4337_gas_currency_selected'
          }
      >

const getCryptoCurrency = (
    id: CurrencyId,
    knownCurrencies: KnownCurrencies
): CryptoCurrency => {
    const currency = knownCurrencies[id] || null

    if (!currency) {
        throw new ImperativeError(
            `Failed to get CryptoCurrency from swap ${id}`
        )
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError(
                `Fiat currency can not be selected on swap ${id}`
            )
        case 'CryptoCurrency':
            return currency

        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}

const initSwapQuoteRequest = ({
    fromAccount,
    fromCurrencyId,
    portfolio,
    currenciesMatrix,
    swapSlippagePercent,
    networkMap,
}: {
    fromAccount: Account
    portfolio: Portfolio
    fromCurrencyId: CurrencyId | null
    currenciesMatrix: CurrenciesMatrix
    swapSlippagePercent: number | null
    networkMap: NetworkMap
}): LoadedReloadableData<SwapQuote, SwapQuoteRequest> => {
    const { knownCurrencies } = currenciesMatrix

    // Do not throw here because we can default later
    const selectedFromCurrency =
        (fromCurrencyId &&
            (knownCurrencies[fromCurrencyId] as CryptoCurrency)) ||
        null

    const fromCurrency =
        selectedFromCurrency ||
        values(knownCurrencies).find((currency): currency is CryptoCurrency => {
            switch (currency.type) {
                case 'FiatCurrency':
                    return false

                case 'CryptoCurrency':
                    return (
                        currency.address ===
                        getNativeTokenAddress(DEFAULT_NETWORK)
                    )

                /* istanbul ignore next */
                default:
                    return notReachable(currency)
            }
        }) ||
        null

    if (!fromCurrency) {
        throw new ImperativeError('Failed to default from currency in swap')
    }

    return {
        type: 'reloading',
        params: {
            swapSlippagePercent:
                swapSlippagePercent || DEFAULT_SWAP_SLIPPAGE_PERCENT,
            amount: null,
            fromAccount,
            fromCurrency,
            toCurrency: null,
            usedDexName: null,
            portfolio,
            knownCurrencies,
            networkMap,
        },
        data: {
            bestReturnRoute: null,
            knownCurrencies,
            routes: [],
        },
    }
}

const initSwapQuoteRequestByNetwork = ({
    fromAccount,
    network,
    portfolio,
    currenciesMatrix,
    networkMap,
}: {
    fromAccount: Account
    portfolio: Portfolio
    network: Network
    currenciesMatrix: CurrenciesMatrix
    networkMap: NetworkMap
}): SwapQuoteRequest => {
    const { knownCurrencies } = currenciesMatrix
    const fromCurrency = values(knownCurrencies)
        .filter((currency): currency is CryptoCurrency => {
            switch (currency.type) {
                case 'FiatCurrency':
                    return false
                case 'CryptoCurrency':
                    return true
                /* istanbul ignore next */
                default:
                    return notReachable(currency)
            }
        })
        .find(
            (cryptoCurrency) =>
                cryptoCurrency.address === getNativeTokenAddress(network) &&
                cryptoCurrency.networkHexChainId === network.hexChainId
        )

    if (!fromCurrency) {
        throw new ImperativeError(
            'Failed to default from currency in swap during netowrk change'
        )
    }

    return {
        amount: null,
        swapSlippagePercent: DEFAULT_SWAP_SLIPPAGE_PERCENT,
        fromAccount,
        fromCurrency,
        portfolio,
        toCurrency: null,
        usedDexName: null,
        knownCurrencies,
        networkMap,
    }
}

const POLL_INTERVAL_MS = 60_000

export const Form = ({
    portfolio,
    fromAccount,
    currenciesMatrix,
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
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    const [pollable, setPollable] = usePollableData(
        fetchSwapQuote,
        () =>
            initSwapQuoteRequest({
                portfolio,
                fromAccount,
                fromCurrencyId,
                currenciesMatrix,
                swapSlippagePercent,
                networkMap,
            }),
        { pollIntervalMilliseconds: POLL_INTERVAL_MS }
    )

    useEffect(() => {
        switch (pollable.type) {
            case 'subsequent_failed':
            case 'error':
                captureError(pollable.error)
                break

            case 'reloading':
            case 'loaded':
            case 'loading':
                break

            /* istanbul ignore next */
            default:
                notReachable(pollable)
        }
    }, [pollable])

    switch (pollable.type) {
        case 'error':
        case 'loading':
            throw new ImperativeError(
                `Pollable can not be in error or loading type in this flow`,
                { type: pollable.type }
            )

        case 'reloading':
        case 'loaded':
        case 'subsequent_failed':
            return (
                <>
                    <Layout
                        networkMap={networkMap}
                        pollable={pollable}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'on_swap_continue_clicked':
                                    setModalState({
                                        type: 'execute_swap',
                                        route: msg.route,
                                    })
                                    break

                                case 'on_select_network_click':
                                    setModalState({ type: 'select_network' })
                                    break

                                case 'on_to_currency_click':
                                    setModalState({
                                        type: 'select_to_currency',
                                    })
                                    break

                                case 'on_from_currency_click':
                                    setModalState({
                                        type: 'select_from_currency',
                                    })
                                    break

                                case 'on_amount_change':
                                    setPollable({
                                        type: 'reloading',
                                        params: {
                                            ...pollable.params,
                                            amount: msg.amount,
                                        },
                                        data: pollable.data,
                                    })
                                    break

                                case 'on_try_again_clicked':
                                    setPollable({
                                        type: 'reloading',
                                        params: pollable.params,
                                        data: pollable.data,
                                    })
                                    break

                                case 'on_route_click':
                                    setModalState({ type: 'select_route' })
                                    break

                                case 'on_slippage_clicked':
                                    setModalState({ type: 'set_slippage' })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />

                    <Modal
                        gasCurrencyPresetMap={gasCurrencyPresetMap}
                        portfolio={portfolio}
                        feePresetMap={feePresetMap}
                        currencyHiddenMap={currencyHiddenMap}
                        currencyPinMap={currencyPinMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        fromAccount={fromAccount}
                        accountsMap={accountsMap}
                        installationId={installationId}
                        keystoreMap={keystoreMap}
                        sessionPassword={sessionPassword}
                        state={modalState}
                        currenciesMatrix={currenciesMatrix}
                        pollable={pollable}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_all_transaction_success':
                                case 'import_keys_button_clicked':
                                case 'transaction_submited':
                                case 'cancel_submitted':
                                case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                case 'on_transaction_completed_splash_animation_screen_competed':
                                case 'on_predefined_fee_preset_selected':
                                case 'on_rpc_change_confirmed':
                                case 'on_select_rpc_click':
                                case 'on_4337_gas_currency_selected':
                                case 'transaction_request_replaced':
                                    onMsg(msg)
                                    break

                                case 'on_cancel_confirm_transaction_clicked':
                                case 'on_wrong_network_accepted':
                                case 'transaction_failure_accepted':
                                case 'on_safe_transaction_failure_accepted':
                                case 'on_sign_cancel_button_clicked':
                                case 'transaction_cancel_success':
                                case 'transaction_cancel_failure_accepted':
                                case 'close':
                                case 'on_close_transaction_status_not_found_modal':
                                    setModalState({ type: 'closed' })
                                    break

                                case 'on_network_item_click': {
                                    switch (msg.network.type) {
                                        case 'all_networks':
                                            throw new ImperativeError(
                                                'All networks cannot be selected on swap'
                                            )
                                        case 'specific_network':
                                            setModalState({ type: 'closed' })
                                            setPollable({
                                                type: 'reloading',
                                                params: initSwapQuoteRequestByNetwork(
                                                    {
                                                        portfolio,
                                                        fromAccount,
                                                        currenciesMatrix,
                                                        network:
                                                            msg.network.network,
                                                        networkMap,
                                                    }
                                                ),
                                                data: pollable.data,
                                            })
                                            break

                                        /* istanbul ignore next */
                                        default:
                                            notReachable(msg.network)
                                    }
                                    break
                                }

                                case 'on_from_currency_selected':
                                    setModalState({ type: 'closed' })
                                    setPollable({
                                        type: 'reloading',
                                        params: {
                                            ...pollable.params,
                                            fromCurrency: getCryptoCurrency(
                                                msg.currencyId,
                                                currenciesMatrix.knownCurrencies
                                            ),
                                        },
                                        data: pollable.data,
                                    })
                                    break

                                case 'on_to_currency_selected':
                                    setModalState({ type: 'closed' })
                                    setPollable({
                                        type: 'reloading',
                                        params: {
                                            ...pollable.params,
                                            toCurrency: getCryptoCurrency(
                                                msg.currencyId,
                                                currenciesMatrix.knownCurrencies
                                            ),
                                        },
                                        data: pollable.data,
                                    })
                                    break

                                case 'on_route_selected':
                                    setModalState({ type: 'closed' })
                                    setPollable({
                                        type: 'reloading',
                                        params: {
                                            ...pollable.params,
                                            usedDexName: msg.route.dexName,
                                        },
                                        data: pollable.data,
                                    })
                                    break

                                case 'on_set_slippage_percent':
                                    setPollable({
                                        type: 'reloading',
                                        params: {
                                            ...pollable.params,
                                            swapSlippagePercent:
                                                msg.slippagePercent,
                                        },
                                        data: pollable.data,
                                    })
                                    setModalState({ type: 'closed' })
                                    onMsg(msg)
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        default:
            return notReachable(pollable)
    }
}
