import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GnosisPayAccountNotOnboardedState } from '@zeal/domains/Card'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    onboardingState: Extract<
        GnosisPayAccountNotOnboardedState['state'],
        'kyc_not_started'
    >
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    keyStore: SigningKeyStore
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Modal>,
    | { type: 'on_card_owner_address_selected' }
    | { type: 'card_tab_choose_wallet_on_import_new_wallet_clicked' }
>

export const KycNotStarted = ({
    onMsg,
    account,
    keyStore,
    installationId,
    portfolioMap,
    currencyHiddenMap,
    keyStoreMap,
    onboardingState,
    accountsMap,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                onboardingState={onboardingState}
                account={account}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_account_selector_clicked':
                            setModal({ type: 'account_selector' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg.type)
                    }
                }}
            />

            <Modal
                keyStore={keyStore}
                portfolioMap={portfolioMap}
                installationId={installationId}
                currencyHiddenMap={currencyHiddenMap}
                keyStoreMap={keyStoreMap}
                account={account}
                accountsMap={accountsMap}
                state={modal}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break

                        case 'on_card_owner_address_selected':
                        case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                            setModal({ type: 'closed' })
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
}
