import { useEffect, useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GnosisPayLoginSignature } from '@zeal/domains/Card'
import { CARD_NETWORK } from '@zeal/domains/Card/constants'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { GnosisCardStatus } from './GnosisCardStatus'

import { Sign } from '../Sign'

type Props = {
    account: Account
    keyStore: SigningKeyStore

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    currencyHiddenMap: CurrencyHiddenMap
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof GnosisCardStatus>,
    {
        type:
            | 'on_card_owner_address_selected'
            | 'on_card_onboarded_account_state_received'
            | 'card_tab_choose_wallet_on_import_new_wallet_clicked'
    }
>

type State =
    | { type: 'sign_login_message' }
    | {
          type: 'gnosis_card_status'
          gnosisPayLoginSignature: GnosisPayLoginSignature
      }

export const Flow = ({
    onMsg,
    account,
    keyStore,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    sessionPassword,
    encryptedPassword,
    currencyHiddenMap,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'sign_login_message' })

    useEffect(() => {
        setState({ type: 'sign_login_message' })
    }, [account.address])

    switch (state.type) {
        case 'sign_login_message':
            return (
                <Sign
                    network={CARD_NETWORK}
                    loadingVariant="card"
                    account={account}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStore={keyStore}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_gnosis_pay_message_signed':
                                setState({
                                    type: 'gnosis_card_status',
                                    gnosisPayLoginSignature:
                                        msg.gnosisPayLoginSignature,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )

        case 'gnosis_card_status':
            return (
                <GnosisCardStatus
                    encryptedPassword={encryptedPassword}
                    keyStore={keyStore}
                    currencyHiddenMap={currencyHiddenMap}
                    keyStoreMap={keyStoreMap}
                    installationId={installationId}
                    portfolioMap={portfolioMap}
                    account={account}
                    accountsMap={accountsMap}
                    gnosisPayLoginSignature={state.gnosisPayLoginSignature}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_login_failure_retry_button_clicked':
                                setState({ type: 'sign_login_message' })
                                break

                            case 'on_card_owner_address_selected':
                            case 'on_card_onboarded_account_state_received':
                            case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        default:
            return notReachable(state)
    }
}
