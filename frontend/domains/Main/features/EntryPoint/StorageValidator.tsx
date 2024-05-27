import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Add as AddAccount } from '@zeal/domains/Account/features/Add'
import { AddFromHardwareWallet } from '@zeal/domains/Account/features/AddFromHardwareWallet'
import { CreateNewSafe4337WithStories } from '@zeal/domains/Account/features/CreateNewSafe4337WithStories'
import { TrackWallet } from '@zeal/domains/Account/features/TrackWallet'
import { BANK_TRANSFER_NETWORK } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { DepositWithdraw } from '@zeal/domains/Currency/domains/BankTransfer/features/DepositWithdraw'
import { Bridge } from '@zeal/domains/Currency/domains/Bridge/features/Bridge'
import { Swap } from '@zeal/domains/Currency/features/Swap'
import { ImperativeError } from '@zeal/domains/Error'
import { SetupRecoveryKit } from '@zeal/domains/KeyStore/features/SetupRecoveryKit'
import { OnboardedEntrypoint } from '@zeal/domains/Main'
import { DISCORD_URL } from '@zeal/domains/Main/constants'
import { KycProcess } from '@zeal/domains/Main/features/KycProcess'
import { NetworkMap } from '@zeal/domains/Network'
import { updateNetworkRPC } from '@zeal/domains/Network/helpers/updateNetworkRPC'
import { LockScreen } from '@zeal/domains/Password/features/LockScreen'
import { Send } from '@zeal/domains/RPCRequest/features/Send'
import { Storage } from '@zeal/domains/Storage'
import { addAccountsWithKeystores } from '@zeal/domains/Storage/helpers/addAccountsWithKeystores'
import { calculateStorageState } from '@zeal/domains/Storage/helpers/calculateStorageState'
import { saveFeePreset } from '@zeal/domains/Storage/helpers/saveFeePreset'
import { saveGasCurrencyPreset } from '@zeal/domains/Storage/helpers/saveGasCurrencyPreset'
import { saveSessionPassword } from '@zeal/domains/Storage/helpers/saveSessionPassword'
import { toLocalStorage } from '@zeal/domains/Storage/helpers/toLocalStorage'
import { removeTransactionRequest } from '@zeal/domains/TransactionRequest/helpers/removeTransactionRequest'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    entryPoint: OnboardedEntrypoint

    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof LockScreen>,
          {
              type: 'lock_screen_close_click'
          }
      >
    | Extract<
          MsgOf<typeof Send>,
          {
              type:
                  | 'close'
                  | 'add_wallet_clicked'
                  | 'track_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'import_keys_button_clicked'
          }
      >
    | MsgOf<typeof SetupRecoveryKit>
    | Extract<
          MsgOf<typeof TrackWallet>,
          {
              type:
                  | 'close'
                  | 'on_accounts_create_success_animation_finished'
                  | 'safe_wallet_clicked'
          }
      >
    | Extract<
          MsgOf<typeof AddAccount>,
          {
              type: 'close' | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof AddFromHardwareWallet>,
          {
              type: 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof Swap>,
          {
              type:
                  | 'close'
                  | 'import_keys_button_clicked'
                  | 'on_all_transaction_success'
          }
      >
    | Extract<
          MsgOf<typeof Bridge>,
          {
              type: 'bridge_completed'
          }
      >
    | Extract<
          MsgOf<typeof KycProcess>,
          {
              type: 'on_do_bank_transfer_clicked'
          }
      >
    | Extract<
          MsgOf<typeof DepositWithdraw>,
          { type: 'on_on_ramp_transfer_success_close_click' }
      >

export const StorageValidator = ({
    storage,
    sessionPassword,
    installationId,
    networkMap,
    entryPoint,
    onMsg,
}: Props) => {
    const state = calculateStorageState({ storage, sessionPassword })
    switch (state.type) {
        case 'locked':
            return (
                <LockScreen
                    encryptedPassword={state.storage.encryptedPassword}
                    onMsg={async (msg) => {
                        switch (msg.type) {
                            case 'lock_screen_close_click':
                                onMsg(msg)
                                break

                            case 'session_password_decrypted':
                                await saveSessionPassword(msg.sessionPassword)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'unlocked': {
            switch (entryPoint.type) {
                case 'kyc_process':
                    return (
                        <KycProcess
                            customCurrencies={state.storage.customCurrencies}
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            portfolioMap={state.storage.portfolios}
                            feePresetMap={state.storage.feePresetMap}
                            gasCurrencyPresetMap={
                                state.storage.gasCurrencyPresetMap
                            }
                            installationId={installationId}
                            networkRPCMap={state.storage.networkRPCMap}
                            bankTransferInfo={state.storage.bankTransferInfo}
                            keyStoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            accountsMap={state.storage.accounts}
                            networkMap={networkMap}
                            network={BANK_TRANSFER_NETWORK}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                    case 'on_do_bank_transfer_clicked':
                                        onMsg(msg)
                                        break
                                    case 'kyc_applicant_created':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                ...msg.bankTransferInfo,
                                                sumSubAccessToken:
                                                    msg.sumSubAccessToken,
                                            },
                                        })
                                        break
                                    case 'on_4337_gas_currency_selected':
                                        await toLocalStorage(
                                            saveGasCurrencyPreset({
                                                currencyId:
                                                    msg.selectedGasCurrency.id,
                                                networkHexId:
                                                    msg.network.hexChainId,
                                                storage: state.storage,
                                            })
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )
                case 'bank_transfer':
                    return (
                        <DepositWithdraw
                            gasCurrencyPresetMap={
                                state.storage.gasCurrencyPresetMap
                            }
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            accountsMap={state.storage.accounts}
                            bankTransfer={state.storage.bankTransferInfo}
                            customCurrencies={state.storage.customCurrencies}
                            installationId={installationId}
                            keystoreMap={state.storage.keystoreMap}
                            network={BANK_TRANSFER_NETWORK}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            feePresetMap={state.storage.feePresetMap}
                            portfolioMap={state.storage.portfolios}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'kyc_applicant_created':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo: {
                                                ...msg.bankTransferInfo,
                                                sumSubAccessToken:
                                                    msg.sumSubAccessToken,
                                            },
                                        })
                                        break
                                    case 'on_withdrawal_monitor_fiat_transaction_start':
                                        const { submittedOffRampTransactions } =
                                            state.storage

                                        await toLocalStorage({
                                            ...state.storage,
                                            submittedOffRampTransactions: [
                                                ...submittedOffRampTransactions,
                                                msg.submittedTransaction,
                                            ],
                                        })

                                        break
                                    case 'on_withdrawal_monitor_fiat_transaction_success':
                                        const removed =
                                            state.storage.submittedOffRampTransactions.filter(
                                                (submitted) =>
                                                    submitted.transactionHash !==
                                                    msg.event.transactionHash
                                            )

                                        await toLocalStorage({
                                            ...state.storage,
                                            submittedOffRampTransactions:
                                                removed,
                                        })
                                        break
                                    case 'close':
                                    case 'import_keys_button_clicked':
                                    case 'on_on_ramp_transfer_success_close_click':
                                        onMsg(msg)
                                        break

                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'on_user_login_to_unblock_success':
                                        await toLocalStorage({
                                            ...state.storage,
                                            bankTransferInfo:
                                                msg.bankTransferInfo,
                                        })
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    case 'on_4337_gas_currency_selected':
                                        await toLocalStorage(
                                            saveGasCurrencyPreset({
                                                currencyId:
                                                    msg.selectedGasCurrency.id,
                                                networkHexId:
                                                    msg.network.hexChainId,
                                                storage: state.storage,
                                            })
                                        )
                                        break

                                    case 'on_contact_support_clicked':
                                        openExternalURL(DISCORD_URL)
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'bridge':
                    return (
                        <Bridge
                            gasCurrencyPresetMap={
                                state.storage.gasCurrencyPresetMap
                            }
                            customCurrencies={state.storage.customCurrencies}
                            feePresetMap={state.storage.feePresetMap}
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            currencyPinMap={state.storage.currencyPinMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            swapSlippagePercent={
                                state.storage.swapSlippagePercent
                            }
                            accountMap={state.storage.accounts}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            installationId={installationId}
                            portfolioMap={state.storage.portfolios}
                            fromCurrencyId={entryPoint.fromCurrencyId}
                            account={
                                state.storage.accounts[entryPoint.fromAddress]
                            }
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'bridge_completed': {
                                        const fromAddress =
                                            msg.bridgeSubmitted.fromAddress

                                        const currentSubmitedBridges =
                                            state.storage.submitedBridges[
                                                fromAddress
                                            ] || []

                                        await toLocalStorage({
                                            ...state.storage,
                                            submitedBridges: {
                                                ...state.storage
                                                    .submitedBridges,
                                                [fromAddress]:
                                                    currentSubmitedBridges.filter(
                                                        (bridge) =>
                                                            bridge.sourceTransactionHash !==
                                                            msg.bridgeSubmitted
                                                                .sourceTransactionHash
                                                    ),
                                            },
                                        })
                                        onMsg(msg)
                                        break
                                    }

                                    case 'source_transaction_submitted': {
                                        const fromAddress =
                                            msg.request.fromAddress

                                        const currentSubmitedBridges =
                                            state.storage.submitedBridges[
                                                fromAddress
                                            ] || []

                                        await toLocalStorage({
                                            ...state.storage,
                                            submitedBridges: {
                                                ...state.storage
                                                    .submitedBridges,
                                                [fromAddress]: [
                                                    msg.request,
                                                    ...currentSubmitedBridges,
                                                ],
                                            },
                                        })
                                        break
                                    }

                                    case 'on_set_slippage_percent':
                                        await toLocalStorage({
                                            ...state.storage,
                                            swapSlippagePercent:
                                                msg.slippagePercent,
                                        })
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    case 'on_rpc_change_confirmed':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    updateNetworkRPC({
                                                        network: msg.network,
                                                        initialRPCUrl:
                                                            msg.initialRPCUrl,
                                                        networkRPCMap:
                                                            state.storage
                                                                .networkRPCMap,
                                                        rpcUrl: msg.rpcUrl,
                                                    }),
                                            },
                                        })
                                        break

                                    case 'on_select_rpc_click':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    msg.networkRPC,
                                            },
                                        })
                                        break

                                    case 'import_keys_button_clicked':
                                    case 'close':
                                        onMsg(msg)
                                        break

                                    case 'on_4337_gas_currency_selected':
                                        await toLocalStorage(
                                            saveGasCurrencyPreset({
                                                currencyId:
                                                    msg.selectedGasCurrency.id,
                                                networkHexId:
                                                    msg.network.hexChainId,
                                                storage: state.storage,
                                            })
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg)
                                }
                            }}
                        />
                    )
                case 'add_account':
                    return (
                        <AddAccount
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            customCurrencies={state.storage.customCurrencies}
                            accountsMap={state.storage.accounts}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                    case 'on_accounts_create_success_animation_finished':
                                        onMsg(msg)
                                        break

                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'create_contact':
                    return (
                        <TrackWallet
                            installationId={installationId}
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            customCurrencies={state.storage.customCurrencies}
                            keyStoreMap={state.storage.keystoreMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            sessionPassword={state.sessionPassword}
                            variant="track"
                            accountsMap={state.storage.accounts}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                    case 'on_accounts_create_success_animation_finished':
                                        onMsg(msg)
                                        break

                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'send_erc20_token':
                case 'send_nft':
                    return (
                        <Send
                            gasCurrencyPresetMap={
                                state.storage.gasCurrencyPresetMap
                            }
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            currencyPinMap={state.storage.currencyPinMap}
                            entrypoint={entryPoint}
                            customCurrencies={state.storage.customCurrencies}
                            accountsMap={state.storage.accounts}
                            keyStoreMap={state.storage.keystoreMap}
                            portfolioMap={state.storage.portfolios}
                            sessionPassword={state.sessionPassword}
                            installationId={installationId}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            feePresetMap={state.storage.feePresetMap}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                        // We don't change storage for safe transaction completeion because we don't store transaction requests for safe transactions
                                        break

                                    case 'on_transaction_completed_splash_animation_screen_competed':
                                    case 'transaction_request_replaced':
                                    case 'cancel_submitted': {
                                        const from =
                                            msg.transactionRequest.account
                                                .address

                                        const removed = state.storage
                                            .transactionRequests[from]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      from
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [from]: removed,
                                            },
                                        })
                                        break
                                    }

                                    case 'transaction_submited':
                                        const fromAddress =
                                            msg.transactionRequest.account
                                                .address

                                        const existingRequests = state.storage
                                            .transactionRequests[fromAddress]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      fromAddress
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [fromAddress]: [
                                                    msg.transactionRequest,
                                                    ...existingRequests,
                                                ],
                                            },
                                        })
                                        break

                                    case 'import_keys_button_clicked':
                                    case 'close':
                                    case 'on_accounts_create_success_animation_finished':
                                    case 'track_wallet_clicked':
                                    case 'add_wallet_clicked':
                                    case 'hardware_wallet_clicked':
                                        onMsg(msg)
                                        break
                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    case 'on_4337_gas_currency_selected':
                                        await toLocalStorage(
                                            saveGasCurrencyPreset({
                                                storage: state.storage,
                                                currencyId:
                                                    msg.selectedGasCurrency.id,
                                                networkHexId:
                                                    msg.network.hexChainId,
                                            })
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'setup_recovery_kit':
                    return (
                        <SetupRecoveryKit
                            installationId={installationId}
                            accountsMap={state.storage.accounts}
                            encryptedPassword={state.storage.encryptedPassword}
                            keystoreMap={state.storage.keystoreMap}
                            address={entryPoint.address}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        onMsg(msg)
                                        break

                                    case 'on_secret_phrase_verified_success':
                                    case 'on_google_drive_backup_success':
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        onMsg(msg)
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'swap':
                    return (
                        <Swap
                            gasCurrencyPresetMap={
                                state.storage.gasCurrencyPresetMap
                            }
                            customCurrencies={state.storage.customCurrencies}
                            feePresetMap={state.storage.feePresetMap}
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            currencyPinMap={state.storage.currencyPinMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            swapSlippagePercent={
                                state.storage.swapSlippagePercent
                            }
                            accountsMap={state.storage.accounts}
                            entrypoint={entryPoint}
                            portfolioMap={state.storage.portfolios}
                            installationId={installationId}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                        // We don't change storage for safe transaction completeion because we don't store transaction requests for safe transactions
                                        break

                                    case 'on_transaction_completed_splash_animation_screen_competed':
                                    case 'transaction_request_replaced':
                                    case 'cancel_submitted': {
                                        const from =
                                            msg.transactionRequest.account
                                                .address

                                        const removed = state.storage
                                            .transactionRequests[from]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      from
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [from]: removed,
                                            },
                                        })
                                        break
                                    }
                                    case 'transaction_submited':
                                        const fromAddress =
                                            msg.transactionRequest.account
                                                .address

                                        const existingRequests = state.storage
                                            .transactionRequests[fromAddress]
                                            ? removeTransactionRequest(
                                                  state.storage
                                                      .transactionRequests[
                                                      fromAddress
                                                  ],
                                                  msg.transactionRequest
                                              )
                                            : []

                                        await toLocalStorage({
                                            ...state.storage,
                                            transactionRequests: {
                                                ...state.storage
                                                    .transactionRequests,
                                                [fromAddress]: [
                                                    msg.transactionRequest,
                                                    ...existingRequests,
                                                ],
                                            },
                                        })
                                        break
                                    case 'close':
                                    case 'import_keys_button_clicked':
                                    case 'on_all_transaction_success':
                                        onMsg(msg)
                                        break

                                    case 'on_set_slippage_percent':
                                        await toLocalStorage({
                                            ...state.storage,
                                            swapSlippagePercent:
                                                msg.slippagePercent,
                                        })
                                        break

                                    case 'on_predefined_fee_preset_selected':
                                        await toLocalStorage(
                                            saveFeePreset({
                                                storage: state.storage,
                                                feePreset: msg.preset,
                                                networkHexId: msg.networkHexId,
                                            })
                                        )
                                        break

                                    case 'on_rpc_change_confirmed':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    updateNetworkRPC({
                                                        network: msg.network,
                                                        initialRPCUrl:
                                                            msg.initialRPCUrl,
                                                        networkRPCMap:
                                                            state.storage
                                                                .networkRPCMap,
                                                        rpcUrl: msg.rpcUrl,
                                                    }),
                                            },
                                        })
                                        break

                                    case 'on_select_rpc_click':
                                        await toLocalStorage({
                                            ...state.storage,
                                            networkRPCMap: {
                                                ...state.storage.networkRPCMap,
                                                [msg.network.hexChainId]:
                                                    msg.networkRPC,
                                            },
                                        })
                                        break

                                    case 'on_4337_gas_currency_selected':
                                        await toLocalStorage(
                                            saveGasCurrencyPreset({
                                                currencyId:
                                                    msg.selectedGasCurrency.id,
                                                networkHexId:
                                                    msg.network.hexChainId,
                                                storage: state.storage,
                                            })
                                        )
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'add_from_hardware_wallet':
                    return (
                        <AddFromHardwareWallet
                            currencyHiddenMap={state.storage.currencyHiddenMap}
                            networkMap={networkMap}
                            networkRPCMap={state.storage.networkRPCMap}
                            closable={false}
                            accounts={state.storage.accounts}
                            customCurrencies={state.storage.customCurrencies}
                            keystoreMap={state.storage.keystoreMap}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'close':
                                        throw new ImperativeError(
                                            'Close event is not possible for HW flow on entrypoint'
                                        )

                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break

                                    case 'on_accounts_create_success_animation_finished':
                                        onMsg(msg)
                                        break

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(msg)
                                }
                            }}
                        />
                    )

                case 'create_safe':
                    return (
                        <CreateNewSafe4337WithStories
                            installationId={installationId}
                            networkRPCMap={state.storage.networkRPCMap}
                            accountsMap={state.storage.accounts}
                            sessionPassword={state.sessionPassword}
                            onMsg={async (msg) => {
                                switch (msg.type) {
                                    case 'on_account_create_request':
                                        msg.accountsWithKeystores.forEach(
                                            ({ keystore }) => {
                                                postUserEvent({
                                                    type: 'WalletAddedEvent',
                                                    keystoreType:
                                                        keystoreToUserEventType(
                                                            keystore
                                                        ),
                                                    keystoreId: keystore.id,
                                                    installationId,
                                                })
                                            }
                                        )
                                        await toLocalStorage(
                                            addAccountsWithKeystores(
                                                state.storage,
                                                msg.accountsWithKeystores
                                            )
                                        )
                                        break
                                    case 'on_accounts_create_success_animation_finished':
                                    case 'close':
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
                    return notReachable(entryPoint)
            }
        }

        case 'no_storage':
            throw new ImperativeError(
                `Impossible state. No storage for onboarded entry points`
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
