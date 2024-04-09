import { useCallback, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    UnblockUser,
    WithdrawalRequest,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from '@zeal/domains/RPCRequest/features/SendTransaction'
import { createERC20EthSendTransaction } from '@zeal/domains/RPCRequest/helpers/createERC20EthSendTransaction'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import {
    fetchSimulationByRequest,
    SimulationResult,
} from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { Monitor } from './Monitor'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    bankTransferInfo: BankTransferUnblockUserCreated
    bankTransferCurrencies: BankTransferCurrencies
    unblockLoginInfo: UnblockLoginInfo
    installationId: string
    sessionPassword: string
    account: Account
    withdrawalRequest: WithdrawalRequest
    network: Network
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    feePresetMap: FeePresetMap
    portfolio: Portfolio
    toAddress: Address
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'crypto_transaction_submitted' }
    | MsgOf<typeof Monitor>
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'on_minimize_click'
                  | 'import_keys_button_clicked'
                  | 'on_cancel_confirm_transaction_clicked'
                  | 'on_wrong_network_accepted'
                  | 'transaction_cancelled_accepted'
                  | 'transaction_failure_accepted'
                  | 'on_safe_transaction_failure_accepted'
                  | 'on_sign_cancel_button_clicked'
                  | 'transaction_cancel_success'
                  | 'transaction_cancel_failure_accepted'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_gas_currency_selected'
                  | 'on_4337_gas_currency_selected'
                  | 'transaction_request_replaced'
                  | 'on_close_transaction_status_not_found_modal'
          }
      >

type State =
    | { type: 'send_crypto_transaction'; rpcRequest: EthSendTransaction }
    | { type: 'monitor_fiat_transaction'; transactionHash: string }

export const Flow = ({
    accountsMap,
    keystoreMap,
    installationId,
    withdrawalRequest,
    network,
    networkMap,
    networkRPCMap,
    account,
    toAddress,
    sessionPassword,
    onMsg,
    bankTransferInfo,
    feePresetMap,
    unblockLoginInfo,
    bankTransferCurrencies,
    gasCurrencyPresetMap,
    portfolio,
    unblockUser,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'send_crypto_transaction',
        rpcRequest: createERC20EthSendTransaction({
            fromAccount: account,
            knownCurrencies: withdrawalRequest.knownCurrencies,
            toAddress,
            network,
            networkRPCMap,
            amount: withdrawalRequest.fromAmount,
        }),
    })

    const fetchWithdrawalSimulation = useCallback(
        async ({
            network,
            rpcRequest,
        }: {
            network: Network
            rpcRequest: EthSendTransaction
        }): Promise<SimulationResult> => {
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
                                ...withdrawalRequest.knownCurrencies,
                            },
                            transaction: {
                                type: 'WithdrawalTrx' as const,
                                withdrawalRequest,
                            },
                        },
                    }
                /* istanbul ignore next */
                default:
                    return notReachable(resp)
            }
        },
        [withdrawalRequest]
    )

    switch (state.type) {
        case 'send_crypto_transaction':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    fetchSimulationByRequest={fetchWithdrawalSimulation}
                    key={state.rpcRequest.id}
                    source="offramp"
                    sendTransactionRequest={state.rpcRequest}
                    sessionPassword={sessionPassword}
                    account={account}
                    network={network}
                    dApp={null}
                    accounts={accountsMap}
                    keystores={keystoreMap}
                    installationId={installationId}
                    state={{ type: 'maximised' }}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'drag':
                            case 'on_expand_request':
                                captureError(
                                    new ImperativeError(
                                        `impossible messages during sending transactions in off-ramp $${msg.type}`
                                    )
                                )
                                break

                            case 'on_minimize_click':
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
                            case 'transaction_request_replaced':
                            case 'on_close_transaction_status_not_found_modal':
                                onMsg(msg)
                                break

                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                setState({
                                    type: 'monitor_fiat_transaction',
                                    transactionHash:
                                        msg.userOperation.bundleTransactionHash,
                                })
                                break

                            case 'on_completed_safe_transaction_close_click':
                                setState({
                                    type: 'monitor_fiat_transaction',
                                    transactionHash:
                                        msg.completedTransaction
                                            .bundleTransactionHash,
                                })
                                break

                            case 'on_transaction_completed_splash_animation_screen_competed':
                                setState({
                                    type: 'monitor_fiat_transaction',
                                    transactionHash: msg.transaction.hash,
                                })
                                break
                            case 'on_completed_transaction_close_click':
                                setState({
                                    type: 'monitor_fiat_transaction',
                                    transactionHash:
                                        msg.completedTransaction.hash,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'monitor_fiat_transaction':
            return (
                <Monitor
                    unblockUser={unblockUser}
                    bankTransferCurrencies={bankTransferCurrencies}
                    network={network}
                    networkMap={networkMap}
                    account={account}
                    keyStoreMap={keystoreMap}
                    bankTransferInfo={bankTransferInfo}
                    loginInfo={unblockLoginInfo}
                    transactionHash={state.transactionHash}
                    withdrawalRequest={withdrawalRequest}
                    onMsg={onMsg}
                />
            )

        default:
            return notReachable(state)
    }
}
