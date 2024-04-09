import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { SendTransaction } from '@zeal/domains/RPCRequest/features/SendTransaction'
import { createNFTEthSendTransaction } from '@zeal/domains/RPCRequest/helpers/createNFTEthSendTransaction'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { fetchSimulationByRequest } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { SelectToAddress } from '../SelectToAddress'

type Props = {
    nft: PortfolioNFT
    collection: PortfolioNFTCollection

    fromAccount: Account
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    accountsMap: AccountsMap
    portfolio: Portfolio
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keyStoreMap: KeyStoreMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    installationId: string

    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof SelectToAddress>,
          {
              type:
                  | 'close'
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'track_wallet_clicked'
                  | 'safe_wallet_clicked'
          }
      >
    | Extract<
          MsgOf<typeof SendTransaction>,
          {
              type:
                  | 'import_keys_button_clicked'
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'on_safe_transaction_completed_splash_animation_screen_competed'
                  | 'on_gas_currency_selected'
                  | 'transaction_request_replaced'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
                  | 'on_4337_gas_currency_selected'
          }
      >

type State =
    | {
          type: 'select_to_address'
      }
    | {
          type: 'send_token'
          ethTransaction: EthSendTransaction
          network: Network
      }

export const Flow = ({
    collection,
    nft,
    fromAccount,
    onMsg,
    portfolio,
    portfolioMap,
    accountsMap,
    keyStoreMap,
    sessionPassword,
    installationId,
    customCurrencyMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    gasCurrencyPresetMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_to_address' })

    const network = findNetworkByHexChainId(collection.networkHexId, networkMap)

    switch (state.type) {
        case 'select_to_address':
            return (
                <SelectToAddress
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    accountsMap={accountsMap}
                    customCurrencies={customCurrencyMap}
                    keyStoreMap={keyStoreMap}
                    portfolioMap={portfolioMap}
                    toAddress={null}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'track_wallet_clicked':
                            case 'add_wallet_clicked':
                            case 'hardware_wallet_clicked':
                                onMsg(msg)
                                break

                            case 'on_accounts_create_success_animation_finished':
                                // we don't do redirect on send flow
                                break

                            case 'on_add_label_skipped':
                                setState({
                                    type: 'send_token',
                                    network,
                                    ethTransaction: createNFTEthSendTransaction(
                                        {
                                            fromAccount,
                                            toAddress: msg.address,
                                            collection,
                                            nft,
                                            network,
                                            networkRPCMap,
                                        }
                                    ),
                                })
                                break

                            case 'on_account_create_request':
                                onMsg(msg)
                                setState({
                                    type: 'send_token',
                                    network,
                                    ethTransaction: createNFTEthSendTransaction(
                                        {
                                            fromAccount,
                                            toAddress:
                                                msg.accountsWithKeystores[0]
                                                    .account.address,
                                            collection,
                                            nft,
                                            network,
                                            networkRPCMap,
                                        }
                                    ),
                                })
                                break

                            case 'account_item_clicked':
                                setState({
                                    type: 'send_token',
                                    network,
                                    ethTransaction: createNFTEthSendTransaction(
                                        {
                                            fromAccount,
                                            toAddress: msg.account.address,
                                            collection,
                                            nft,
                                            network,
                                            networkRPCMap,
                                        }
                                    ),
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'send_token':
            return (
                <SendTransaction
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    portfolio={portfolio}
                    feePresetMap={feePresetMap}
                    networkMap={networkMap}
                    source="send"
                    fetchSimulationByRequest={fetchSimulationByRequest}
                    installationId={installationId}
                    accounts={accountsMap}
                    keystores={keyStoreMap}
                    state={{ type: 'maximised' }}
                    dApp={null}
                    network={state.network}
                    networkRPCMap={networkRPCMap}
                    account={fromAccount}
                    sendTransactionRequest={state.ethTransaction}
                    sessionPassword={sessionPassword}
                    actionSource="extension"
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_sign_cancel_button_clicked':
                            case 'on_cancel_confirm_transaction_clicked':
                            case 'on_wrong_network_accepted':
                            case 'on_minimize_click':
                            case 'on_completed_transaction_close_click':
                            case 'on_completed_safe_transaction_close_click':
                            case 'transaction_cancel_success':
                            case 'transaction_cancel_failure_accepted':
                            case 'transaction_failure_accepted':
                            case 'on_safe_transaction_failure_accepted':
                            case 'on_close_transaction_status_not_found_modal':
                                onMsg({ type: 'close' })
                                break
                            case 'on_expand_request':
                            case 'drag':
                                break

                            case 'import_keys_button_clicked':
                            case 'transaction_submited':
                            case 'cancel_submitted':
                            case 'on_predefined_fee_preset_selected':
                            case 'on_transaction_completed_splash_animation_screen_competed':
                            case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                            case 'on_4337_gas_currency_selected':
                            case 'transaction_request_replaced':
                                onMsg(msg)
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
            return notReachable(state)
    }
}
