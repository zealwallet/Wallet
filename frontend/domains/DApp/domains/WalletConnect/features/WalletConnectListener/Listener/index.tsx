import { useEffect, useState } from 'react'

import { Web3WalletTypes } from '@walletconnect/web3wallet'
import * as Linking from 'expo-linking'

import { Modal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { ImperativeError } from '@zeal/toolkit/Error'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { groupByType, UnexpectedResultFailureError } from '@zeal/toolkit/Result'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import {
    WalletConnectConnectionRequest,
    WalletConnectInstance,
    WalletConnectRPCRequest,
} from '@zeal/domains/DApp/domains/WalletConnect'
import { parsePairingLink } from '@zeal/domains/DApp/domains/WalletConnect/parsers/parsePairingLink'
import { parseWalletConnectConnectionRequest } from '@zeal/domains/DApp/domains/WalletConnect/parsers/parseWalletConnectConnectionRequest'
import {
    parseAddressFromSession,
    parseWalletConnectRPCRequest,
} from '@zeal/domains/DApp/domains/WalletConnect/parsers/parseWalletConnectRPCRequest'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { ProposalFlow } from './ProposalFlow'
import { RequestFlow } from './RequestFlow'

type Props = {
    walletConnectInstance: WalletConnectInstance
    networkMap: NetworkMap

    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    keyStoreMap: KeyStoreMap
    networkRPCMap: NetworkRPCMap
    installationId: string
    selectedAccount: Account
    customCurrencyMap: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof RequestFlow>,
          {
              type:
                  | 'transaction_submited'
                  | 'cancel_submitted'
                  | 'on_4337_gas_currency_selected'
                  | 'on_predefined_fee_preset_selected'
                  | 'on_safe_4337_transaction_completed_splash_animation_screen_competed'
                  | 'on_transaction_completed_splash_animation_screen_competed'
                  | 'transaction_request_replaced'
                  | 'import_keys_button_clicked'
                  | 'transaction_cancel_failure_accepted'
                  | 'transaction_failure_accepted'
          }
      >
    | Extract<
          MsgOf<typeof ProposalFlow>,
          {
              type:
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
                  | 'safe_wallet_clicked'
                  | 'track_wallet_clicked'
          }
      >

type State = (WalletConnectConnectionRequest | WalletConnectRPCRequest)[]

const remove = (state: State, item: State[0]): State =>
    state.filter(
        (listItem) =>
            `${listItem.type}_${listItem.id}` !== `${item.type}_${item.id}`
    )

const add = (state: State, item: State[0]): State =>
    state.find(
        (listItem) =>
            `${listItem.type}_${listItem.id}` === `${item.type}_${item.id}`
    )
        ? state
        : [...state, item]

const initialState = ({
    walletConnectInstance,
}: {
    walletConnectInstance: WalletConnectInstance
}): State => {
    const pendingSessionProposals = values(
        walletConnectInstance.getPendingSessionProposals()
    )

    const [proposalErrors, parsedProposals] = groupByType(
        pendingSessionProposals.map((proposal) =>
            parseWalletConnectConnectionRequest(proposal)
        )
    )

    const pendingSessionRequests =
        walletConnectInstance.getPendingSessionRequests()

    const activeSessions = walletConnectInstance.getActiveSessions()

    const [requestErrors, parsedRequests] = groupByType(
        pendingSessionRequests.map((request) =>
            parseWalletConnectRPCRequest({
                activeSessions,
                wcRequest: request,
            })
        )
    )

    if (proposalErrors.length > 0) {
        captureError(
            new UnexpectedResultFailureError(
                'Failed to parse some of the proposals',
                proposalErrors
            )
        )
    }

    if (requestErrors.length > 0) {
        captureError(
            new UnexpectedResultFailureError(
                'Failed to parse some of the requests',
                requestErrors
            )
        )
    }

    return [...parsedProposals, ...parsedRequests]
}

const reject = ({
    request,
    walletConnectInstance,
}: {
    request: WalletConnectRPCRequest
    walletConnectInstance: WalletConnectInstance
}) => {
    walletConnectInstance.respondSessionRequest({
        topic: request.originalRequest.topic,
        response: {
            jsonrpc: '2.0',
            id: Number(request.rpcRequest.id),
            error: {
                code: -32000,
                message: 'User rejected request',
            },
        },
    })
}

export const Listener = ({
    networkMap,
    walletConnectInstance,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    selectedAccount,
    currencyHiddenMap,
    customCurrencyMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() =>
        initialState({ walletConnectInstance })
    )

    const url = Linking.useURL()

    useEffect(() => {
        const addresses = new Set<Address>(
            values(accountsMap).map((account) => account.address)
        )

        const sessionsToKill = values(
            walletConnectInstance.getActiveSessions()
        ).filter((session) => {
            const sessionAddress = parseAddressFromSession({ session })

            switch (sessionAddress.type) {
                case 'Failure':
                    return true
                case 'Success':
                    return !addresses.has(sessionAddress.data)

                default:
                    return notReachable(sessionAddress)
            }
        })

        sessionsToKill.forEach((session) =>
            walletConnectInstance
                .disconnectSession({
                    topic: session.topic,
                    reason: {
                        code: -32000,
                        message: 'Address is not available',
                    },
                })
                .catch(captureError)
        )
    }, [accountsMap, walletConnectInstance])

    useEffect(() => {
        ;(async () => {
            if (url) {
                const link = parsePairingLink(url)

                switch (link.type) {
                    case 'Failure':
                        break
                    case 'Success':
                        try {
                            await walletConnectInstance.pair({
                                uri: link.data.uri,
                            })
                        } catch (error) {
                            captureError(error)
                        }
                        Linking.openURL(Linking.createURL(''))
                        break

                    default:
                        return notReachable(link)
                }
            }
        })()
    }, [url, walletConnectInstance])

    useEffect(() => {
        const sessionRequestListener = (
            sessionRequest: Web3WalletTypes.SessionRequest
        ) => {
            try {
                const request = parseWalletConnectRPCRequest({
                    activeSessions: walletConnectInstance.getActiveSessions(),
                    wcRequest: sessionRequest,
                }).getSuccessResultOrThrow(
                    'failed to parse WalletConnectSessionRequest'
                )

                setState((prev) => add(prev, request))
            } catch (error) {
                captureError(error)
            }
        }

        const sessionProposalListener = (
            sessionProposal: Web3WalletTypes.SessionProposal
        ): void => {
            try {
                const proposal = parseWalletConnectConnectionRequest({
                    ...sessionProposal.params,
                }).getSuccessResultOrThrow(
                    'failed to parse WalletConnectSessionProposal'
                )

                setState((prev) => add(prev, proposal))
            } catch (error) {
                captureError(error)
            }
        }

        const sessionDeleteListener = (
            sessionDelete: Web3WalletTypes.SessionDelete
        ) => {
            setState((prev) =>
                prev.filter((item) => {
                    switch (item.type) {
                        case 'wallect_connect_session_proposal':
                            return true
                        case 'session_request':
                            return (
                                item.originalRequest.topic !==
                                sessionDelete.topic
                            )

                        default:
                            return notReachable(item)
                    }
                })
            )
            postUserEvent({
                type: 'AppDisconnectedEvent',
                location: 'wallet_connect',
                scope: 'single',
                installationId,
            })
        }

        walletConnectInstance.on('session_request', sessionRequestListener)
        walletConnectInstance.on('session_proposal', sessionProposalListener)
        walletConnectInstance.on('session_delete', sessionDeleteListener)

        return () => {
            walletConnectInstance.removeListener(
                'session_request',
                sessionRequestListener
            )
            walletConnectInstance.removeListener(
                'session_proposal',
                sessionProposalListener
            )
            walletConnectInstance.removeListener(
                'session_delete',
                sessionDeleteListener
            )
        }
    }, [walletConnectInstance, networkMap, installationId])

    const [current] = state

    if (!current) {
        return null
    }

    switch (current.type) {
        case 'wallect_connect_session_proposal':
            return (
                <Modal>
                    <ProposalFlow
                        key={current.id}
                        accountsMap={accountsMap}
                        currencyHiddenMap={currencyHiddenMap}
                        customCurrencyMap={customCurrencyMap}
                        selectedAccount={selectedAccount}
                        keystoreMap={keyStoreMap}
                        installationId={installationId}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        portflioMap={portfolioMap}
                        proposal={current}
                        sessionPassword={sessionPassword}
                        walletConnectInstance={walletConnectInstance}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'on_account_create_request':
                                case 'track_wallet_clicked':
                                case 'add_wallet_clicked':
                                case 'safe_wallet_clicked':
                                case 'hardware_wallet_clicked':
                                    onMsg(msg)
                                    break

                                case 'on_wallet_connect_connected':
                                case 'on_wallet_connect_rejected':
                                case 'on_wallet_connect_action_error_cancel_clicked':
                                    setState((prev) => remove(prev, current))
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </Modal>
            )

        case 'session_request':
            return (
                <Modal>
                    <RequestFlow
                        key={current.id}
                        accountsMap={accountsMap}
                        feePresetMap={feePresetMap}
                        gasCurrencyPresetMap={gasCurrencyPresetMap}
                        installationId={installationId}
                        keyStoreMap={keyStoreMap}
                        networkMap={networkMap}
                        networkRPCMap={networkRPCMap}
                        portfolioMap={portfolioMap}
                        sessionPassword={sessionPassword}
                        walletConnectSessionRequest={current}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'drag':
                                case 'on_expand_request':
                                    throw new ImperativeError(
                                        `${msg.type} is not available in wallet connect flow`
                                    )

                                case 'on_minimize_click':
                                    // FIXME @resetko-zeal check that minimize is fired only when request is already responded, and if it's same message when request is not repsonded we need to split them. When it's responded we just remove it from state, if not - reject.
                                    setState((prev) => remove(prev, current))
                                    break

                                case 'on_sign_cancel_button_clicked':
                                case 'on_cancel_confirm_transaction_clicked':
                                case 'on_safe_deployemnt_cancelled':
                                case 'on_wrong_network_accepted':
                                case 'cancel_button_click':
                                    reject({
                                        request: current,
                                        walletConnectInstance,
                                    })
                                    setState((prev) => remove(prev, current))
                                    break

                                case 'on_transaction_cancelled_successfully_close_clicked':
                                    reject({
                                        request: current,
                                        walletConnectInstance,
                                    })
                                    setState((prev) => remove(prev, current))
                                    break

                                case 'cancel_submitted':
                                case 'on_4337_gas_currency_selected':
                                case 'on_predefined_fee_preset_selected':
                                case 'on_safe_4337_transaction_completed_splash_animation_screen_competed':
                                case 'on_transaction_completed_splash_animation_screen_competed':
                                case 'transaction_request_replaced':
                                case 'import_keys_button_clicked':
                                    onMsg(msg)
                                    break

                                case 'transaction_cancel_failure_accepted':
                                case 'transaction_failure_accepted':
                                    setState((prev) => remove(prev, current))

                                    break

                                case 'on_close_transaction_status_not_found_modal':
                                case 'on_pre_sign_safe_deployment_error_popup_cancel_clicked':
                                case 'on_safe_transaction_failure_accepted':
                                case 'on_completed_safe_transaction_close_click':
                                case 'on_completed_transaction_close_click':
                                    setState((prev) => remove(prev, current))
                                    break

                                case 'transaction_submited':
                                    walletConnectInstance
                                        .respondSessionRequest({
                                            topic: current.originalRequest
                                                .topic,
                                            response: {
                                                jsonrpc: '2.0',
                                                id: Number(
                                                    current.rpcRequest.id
                                                ),
                                                result: msg.transactionRequest
                                                    .submitedTransaction.hash,
                                            },
                                        })
                                        .catch(captureError)
                                    onMsg(msg)
                                    break

                                case 'message_signed':
                                    walletConnectInstance
                                        .respondSessionRequest({
                                            topic: current.originalRequest
                                                .topic,
                                            response: {
                                                jsonrpc: '2.0',
                                                id: Number(
                                                    current.rpcRequest.id
                                                ),
                                                result: msg.signature,
                                            },
                                        })
                                        .catch(captureError)
                                    setState((prev) => remove(prev, current))
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </Modal>
            )

        default:
            return notReachable(current)
    }
}
