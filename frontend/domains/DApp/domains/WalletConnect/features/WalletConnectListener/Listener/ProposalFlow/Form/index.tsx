import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { ImperativeError } from '@zeal/toolkit/Error'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { WalletConnectConnectionRequest } from '@zeal/domains/DApp/domains/WalletConnect'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksUserConfirmation } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksUserConfirmation'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    proposal: WalletConnectConnectionRequest
    accountsMap: AccountsMap
    portflioMap: PortfolioMap
    selectedAccount: Account

    installationId: string
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<MsgOf<typeof Layout>, { type: 'on_reject' | 'on_approve' }>
    | Extract<
          MsgOf<typeof Modal>,
          {
              type:
                  | 'add_wallet_clicked'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_approve'
                  | 'safe_wallet_clicked'
                  | 'track_wallet_clicked'
          }
      >

export const Form = ({
    onMsg,
    accountsMap,
    portflioMap,
    safetyChecksLoadable,
    selectedAccount,
    currencyHiddenMap,
    customCurrencyMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    sessionPassword,
    installationId,
    proposal,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    const [account, setAccount] = useState(selectedAccount)

    const dAppSiteInfo = getDApInfo({
        proposal,
        safetyChecksLoadable,
    })

    return (
        <>
            <Layout
                installationId={installationId}
                keyStoreMap={keystoreMap}
                currencyHiddenMap={currencyHiddenMap}
                dAppSiteInfo={dAppSiteInfo}
                portfolioMap={portflioMap}
                safetyChecksLoadable={safetyChecksLoadable}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_safety_checks_click':
                            setModal({
                                type: 'safety_checks',
                                safetyChecks: msg.safetyChecks,
                            })
                            break

                        case 'on_account_selector_clicked':
                            setModal({ type: 'account_selector' })
                            break

                        case 'on_reject':
                            onMsg(msg)
                            break

                        case 'on_approve':
                            const userConfirmationResult =
                                calculateConnectionSafetyChecksUserConfirmation(
                                    {
                                        safetyChecksLoadable,
                                    }
                                )

                            switch (userConfirmationResult.type) {
                                case 'Failure':
                                    onMsg(msg)
                                    break
                                case 'Success':
                                    setModal({
                                        type: 'safety_checks_user_confirmation_required',
                                        safetyChecks:
                                            userConfirmationResult.data,
                                        account: msg.account,
                                    })
                                    break

                                default:
                                    notReachable(userConfirmationResult)
                            }
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                customCurrencyMap={customCurrencyMap}
                installationId={installationId}
                keystoreMap={keystoreMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                portfolioMap={portflioMap}
                sessionPassword={sessionPassword}
                currencyHiddenMap={currencyHiddenMap}
                account={account}
                dAppSiteInfo={dAppSiteInfo}
                accountsMap={accountsMap}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'other_provider_selected':
                            throw new ImperativeError(
                                `impossible msg: ${msg.type}`
                            )

                        case 'on_accounts_create_success_animation_finished':
                            setAccount(msg.accountsWithKeystores[0].account)
                            setModal({ type: 'closed' })
                            break

                        case 'on_account_create_request':
                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'safe_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'on_approve':
                            onMsg(msg)
                            break

                        case 'account_item_clicked':
                            setAccount(msg.account)
                            setModal({ type: 'closed' })
                            break

                        case 'on_user_confirmed_connection_with_safety_checks':
                            onMsg({ type: 'on_approve', account: msg.account })
                            break

                        case 'confirmation_modal_close_clicked':
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />
        </>
    )
}

const getDApInfo = ({
    safetyChecksLoadable,
    proposal,
}: {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    proposal: WalletConnectConnectionRequest
}) => {
    switch (safetyChecksLoadable.type) {
        case 'loading':
        case 'error':
            return proposal.dAppInfo
        case 'loaded':
            return safetyChecksLoadable.data.dAppInfo
        /* istanbul ignore next */
        default:
            return notReachable(safetyChecksLoadable)
    }
}
