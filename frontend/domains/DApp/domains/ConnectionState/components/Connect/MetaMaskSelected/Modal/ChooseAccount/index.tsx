import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ChangeAccount } from '@zeal/domains/Account/features/ChangeAccount'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network, NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { calculateConnectionSafetyChecksUserConfirmation } from '@zeal/domains/SafetyCheck/helpers/calculateConnectionSafetyChecksUserConfirmation'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Modal, State as ModalState } from './Modal'

type Props = {
    accounts: AccountsMap
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    requestedNetwork: Network
    alternativeProvider: 'metamask'
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencyMap: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof ChangeAccount>,
          {
              type:
                  | 'add_wallet_clicked'
                  | 'close'
                  | 'hardware_wallet_clicked'
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
                  | 'other_provider_selected'
                  | 'safe_wallet_clicked'
                  | 'track_wallet_clicked'
          }
      >
    | {
          type: 'on_zeal_account_connection_request'
          network: Network
          account: Account
      }

export const ChooseAccount = ({
    accounts,
    alternativeProvider,
    currencyHiddenMap,
    customCurrencyMap,
    keystoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    safetyChecksLoadable,
    requestedNetwork,
    installationId,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <ChangeAccount
                installationId={installationId}
                alternativeProvider={alternativeProvider}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                customCurrencyMap={customCurrencyMap}
                sessionPassword={sessionPassword}
                accounts={accounts}
                portfolioMap={portfolioMap}
                keystoreMap={keystoreMap}
                selectedProvider={{ type: 'metamask' }}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'track_wallet_clicked':
                        case 'add_wallet_clicked':
                        case 'safe_wallet_clicked':
                        case 'hardware_wallet_clicked':
                        case 'close':
                        case 'other_provider_selected': // TODO @resetko-zeal it's close
                        case 'on_account_create_request':
                        case 'on_accounts_create_success_animation_finished':
                            onMsg(msg)
                            break
                        case 'account_item_clicked':
                            {
                                const safetyCheckConfirmationResult =
                                    calculateConnectionSafetyChecksUserConfirmation(
                                        { safetyChecksLoadable }
                                    )

                                switch (safetyCheckConfirmationResult.type) {
                                    case 'Failure':
                                        onMsg({
                                            type: 'on_zeal_account_connection_request',
                                            account: msg.account,
                                            network: requestedNetwork,
                                        })
                                        break

                                    case 'Success':
                                        setModal({
                                            type: 'confirm_safety_checks_modal',
                                            account: msg.account,
                                            safetyChecks:
                                                safetyCheckConfirmationResult.data,
                                        })
                                        break

                                    default:
                                        return notReachable(
                                            safetyCheckConfirmationResult
                                        )
                                }
                            }
                            break

                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal
                installationId={installationId}
                keyStoreMap={keystoreMap}
                network={requestedNetwork}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_zeal_account_connection_request':
                            onMsg(msg)
                            break

                        case 'confirmation_modal_close_clicked':
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
