import React, { useCallback, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    BridgeRequest,
    BridgeSubmitted,
} from '@zeal/domains/Currency/domains/Bridge'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from '@zeal/domains/RPCRequest/features/SendTransaction'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { getCryptoCurrency } from '../helpers/getCryptoCurrency'

type Props = {
    request: BridgeRequest
    sessionPassword: string
    account: Account
    accountMap: AccountsMap
    portfolio: Portfolio
    keystoreMap: KeyStoreMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    installationId: string
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'source_transaction_submitted'; request: BridgeSubmitted }
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_wrong_network_accepted'
                  | 'transaction_cancelled_accepted'
                  | 'transaction_failure_accepted'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_submited'
                  | 'on_safe_transaction_failure_accepted'
                  | 'cancel_submitted'
                  | 'transaction_cancel_success'
                  | 'transaction_cancel_failure_accepted'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'on_close_transaction_status_not_found_modal'
                  | 'transaction_request_replaced'
          }
      >

type State =
    | {
          type: 'submit_approval'
          approveTransaction: EthSendTransaction
      }
    | {
          type: 'submit_source_trx'
      }

export const SubmitSourceTransactions = ({
    request,
    sessionPassword,
    account,
    accountMap,
    keystoreMap,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    portfolio,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        request.route.approvalTransaction
            ? {
                  type: 'submit_approval',
                  approveTransaction: request.route.approvalTransaction,
              }
            : { type: 'submit_source_trx' }
    )

    const fetchBridgeSimulation = useCallback(
        async ({
            network,
            rpcRequest,
        }: {
            network: Network
            rpcRequest: EthSendTransaction
        }) => {
            const resp = await fetchSimulationByRequest({
                network,
                rpcRequest,
                dApp: null,
            })
            switch (resp.type) {
                case 'failed':
                case 'not_supported':
                    return resp
                case 'simulated':
                    return {
                        ...resp,
                        simulation: {
                            ...resp.simulation,
                            currencies: {
                                ...resp.simulation.currencies,
                                ...request.knownCurrencies,
                            },
                            transaction: {
                                type: 'BridgeTrx' as const,
                                bridgeRoute: request.route,
                            },
                        },
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(resp)
            }
        },
        [request.knownCurrencies, request.route]
    )

    switch (state.type) {
        case 'submit_source_trx':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    fetchSimulationByRequest={fetchBridgeSimulation}
                    key={request.route.sourceTransaction.id}
                    source="bridge"
                    sendTransactionRequest={request.route.sourceTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={findNetworkByHexChainId(
                        getCryptoCurrency({
                            cryptoCurrencyId: request.route.from.currencyId,
                            knownCurrencies: request.knownCurrencies,
                        }).networkHexChainId,
                        networkMap
                    )}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: request.route.displayName,
                        avatar: request.route.icon,
                        hostname: '',
                    }}
                    accounts={accountMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in bridge $${msg.type}`
                                    )
                                )
                                break

                            case 'import_keys_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'transaction_failure_accepted':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_4337_gas_currency_selected':
                            case 'on_close_transaction_status_not_found_modal':
                            case 'transaction_request_replaced':
                                onMsg(msg)
                                break

                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.userOperation
                                                .bundleTransactionHash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
                                break

                            case 'on_completed_safe_transaction_close_click':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.completedTransaction
                                                .bundleTransactionHash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
                                break

                            case 'on_transaction_completed_splash_animation_screen_competed':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.transaction.hash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
                                break
                            case 'on_completed_transaction_close_click':
                                onMsg({
                                    type: 'source_transaction_submitted',
                                    request: {
                                        type: 'bridge_submitted',
                                        sourceTransactionHash:
                                            msg.completedTransaction.hash,
                                        route: request.route,
                                        knownCurrencies:
                                            request.knownCurrencies,
                                        submittedAtMS: Date.now(),
                                        fromAddress: account.address,
                                    },
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'submit_approval':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="bridgeApprove"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    key={state.approveTransaction.id}
                    sendTransactionRequest={state.approveTransaction}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={findNetworkByHexChainId(
                        getCryptoCurrency({
                            cryptoCurrencyId: request.route.from.currencyId,
                            knownCurrencies: request.knownCurrencies,
                        }).networkHexChainId,
                        networkMap
                    )}
                    networkRPCMap={networkRPCMap}
                    dApp={{
                        title: request.route.displayName,
                        avatar: request.route.icon,
                        hostname: '',
                    }}
                    accounts={accountMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_minimize_click':
                                onMsg({ type: 'close' })
                                break
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in bridge $${msg.type}`
                                    )
                                )
                                break

                            case 'import_keys_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'transaction_failure_accepted':
                            case 'on_sign_cancel_button_clicked':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_4337_gas_currency_selected':
                            case 'transaction_request_replaced':
                            case 'on_close_transaction_status_not_found_modal':
                                onMsg(msg)
                                break

                            case 'on_completed_safe_transaction_close_click':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                            case 'on_completed_transaction_close_click':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                                setState({ type: 'submit_source_trx' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
