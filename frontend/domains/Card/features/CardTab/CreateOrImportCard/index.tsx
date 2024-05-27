import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    installationId: string
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    keyStoreMap: KeyStoreMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Modal>,
    {
        type:
            | 'on_order_new_card_gnosis_pay_click'
            | 'on_card_imported_success_animation_complete'
            | 'card_tab_choose_wallet_on_import_new_wallet_clicked'
    }
>

export const CreateOrImportCard = ({
    onMsg,
    sessionPassword,
    currencyHiddenMap,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    gasCurrencyPresetMap,
    installationId,
    feePresetMap,
    accountsMap,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })
    return (
        <>
            <Layout
                installationId={installationId}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_order_new_card_clicked':
                            setModal({
                                type: 'order_card_flow',
                                userSelected: 'create',
                            })
                            break
                        case 'on_order_import_card_clicked':
                            setModal({
                                type: 'order_card_flow',
                                userSelected: 'import',
                            })
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
            <Modal
                state={modal}
                installationId={installationId}
                accountsMap={accountsMap}
                keystoreMap={keyStoreMap}
                portfolioMap={portfolioMap}
                currencyHiddenMap={currencyHiddenMap}
                networkMap={networkMap}
                networkRPCMap={networkRPCMap}
                feePresetMap={feePresetMap}
                gasCurrencyPresetMap={gasCurrencyPresetMap}
                keyStoreMap={keyStoreMap}
                sessionPassword={sessionPassword}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModal({ type: 'closed' })
                            break
                        case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                        case 'on_card_imported_success_animation_complete':
                        case 'on_order_new_card_gnosis_pay_click':
                            onMsg(msg)
                            break
                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}
