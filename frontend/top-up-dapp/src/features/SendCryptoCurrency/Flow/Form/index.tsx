import { useEffect, useState } from 'react'

import { GetAccountReturnType } from '@wagmi/core'
import { useAccount, useSwitchChain } from 'wagmi'

import { notReachable } from '@zeal/toolkit'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { FXRate } from '@zeal/domains/FXRate'
import { fetchRate } from '@zeal/domains/FXRate/api/fetchRate'
import { PREDEFINED_NETWORKS } from '@zeal/domains/Network/constants'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'

import { Connected } from './Connected'
import { ConnectionState } from './ConnectionState'
import { Disconnected } from './Disconnected'
import { Form as IncompleteForm } from './validation'

import { POLYGON_MATIC } from '../../api/fetchSupportedTopUpCurrencies'

type Props = {
    zealAccount: Account
    topUpCurrencies: CryptoCurrency[]
    onMsg: (msg: Msg) => void
}

type Msg = Extract<MsgOf<typeof Connected>, { type: 'on_form_submitted' }>

const calculateConnectionState = (
    account: GetAccountReturnType
): ConnectionState => {
    switch (account.status) {
        case 'connected':
            return account.chain // account.chain is undefined if you switch to a network in wallet that is not defined in wagmi config.
                ? {
                      type: 'connected',
                      networkHexId: parseNetworkHexId(
                          account.chainId.toString(10)
                      ).getSuccessResultOrThrow('cannot parse wagmi chainId'),
                      account: {
                          address: account.address,
                          label: account.connector.name,
                          avatarSrc: account.connector.icon ?? null,
                      },
                  }
                : {
                      type: 'connected_to_unsupported_network',
                      account: {
                          address: account.address,
                          label: account.connector.name,
                          avatarSrc: account.connector.icon ?? null,
                      },
                  }
        case 'reconnecting':
            return { type: 'reconnecting' }
        case 'connecting':
            return { type: 'connecting' }
        case 'disconnected':
            return { type: 'disconnected' }
        /* istanbul ignore next */
        default:
            return notReachable(account)
    }
}

const calculateForm = ({
    connectionState,
    topUpCurrencies,
}: {
    connectionState: ConnectionState
    topUpCurrencies: CryptoCurrency[]
}): IncompleteForm => {
    switch (connectionState.type) {
        case 'disconnected':
        case 'connecting':
        case 'reconnecting':
        case 'connected_to_unsupported_network':
            const defaultCurrency = topUpCurrencies.find(
                (currency) => currency.id === POLYGON_MATIC.id
            )
            return {
                currency: defaultCurrency ?? topUpCurrencies[0],
                amount: null,
            }
        case 'connected':
            const nativeCurrency = topUpCurrencies.find(
                (currency) =>
                    currency.networkHexChainId === connectionState.networkHexId
            )

            if (!nativeCurrency) {
                throw new ImperativeError(
                    `Native currency not found for network with id ${connectionState.networkHexId}`
                )
            }

            return {
                currency: nativeCurrency,
                amount: null,
            }

        /* istanbul ignore next */
        default:
            return notReachable(connectionState)
    }
}

const fetchCurrencyRate = async (
    form: IncompleteForm
): Promise<{ rate: FXRate; currencies: KnownCurrencies }> => {
    const network = PREDEFINED_NETWORKS.find(
        (network) => network.hexChainId === form.currency.networkHexChainId
    )

    if (!network) {
        throw new ImperativeError(
            `Network with id ${form.currency.networkHexChainId} not found in SendCrypto rate polling`
        )
    }

    return fetchRate({
        network,
        tokenAddress: form.currency.address,
    })
}

const RATE_POLL_INTERVAL_MILLISECONDS = 2000

export const Form = ({ zealAccount, topUpCurrencies, onMsg }: Props) => {
    const account = useAccount()
    const { switchChain } = useSwitchChain()

    const [connectionState, setConnectionState] = useState<ConnectionState>(
        calculateConnectionState(account)
    )

    const [pollable, setPollable] = usePollableData(
        fetchCurrencyRate,
        {
            type: 'loading',
            params: calculateForm({ connectionState, topUpCurrencies }),
        },
        {
            pollIntervalMilliseconds: RATE_POLL_INTERVAL_MILLISECONDS,
            stopIf: () => false,
        }
    )

    // Adding the account object as a dependency to the useEffect below causes an infinite re-render since useAccount returns an un-memoized object.
    useEffect(() => {
        setConnectionState(calculateConnectionState(account))
    }, [account.status, account.address, account.chainId]) // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        setPollable({
            type: 'loading',
            params: calculateForm({ connectionState, topUpCurrencies }),
        })
    }, [connectionState, setPollable, topUpCurrencies])

    switch (connectionState.type) {
        case 'disconnected':
        case 'reconnecting':
        case 'connecting':
            return (
                <Disconnected
                    connectionState={connectionState}
                    pollable={pollable}
                    zealAccount={zealAccount}
                    topUpCurrencies={topUpCurrencies}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_crypto_currency_selected':
                                setPollable({
                                    type: 'loading',
                                    params: {
                                        ...pollable.params,
                                        currency: msg.currency,
                                    },
                                })
                                break
                            case 'on_form_change':
                                setPollable({
                                    type: 'loading',
                                    params: msg.form,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'connected':
        case 'connected_to_unsupported_network':
            return (
                <Connected
                    connectionState={connectionState}
                    zealAccount={zealAccount}
                    topUpCurrencies={topUpCurrencies}
                    ratePollable={pollable}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_form_change':
                                setPollable({
                                    type: 'loading',
                                    params: msg.form,
                                })
                                break
                            case 'on_form_submitted':
                                onMsg(msg)
                                break

                            case 'on_connect_to_correct_network_clicked':
                                switchChain({
                                    chainId: Number(msg.networkHexId),
                                })
                                break
                            case 'on_crypto_currency_selected':
                                switchChain({
                                    chainId: Number(
                                        msg.currency.networkHexChainId
                                    ),
                                })
                                setPollable({
                                    type: 'loading',
                                    params: {
                                        ...pollable.params,
                                        currency: msg.currency,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(connectionState)
    }
}
