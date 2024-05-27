import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { generateRandomNumber } from '@zeal/toolkit/Number'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { getLoginMessage } from '@zeal/domains/Card/helpers/getLoginMessage'
import { GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap, LEDGER, Safe4337, Trezor } from '@zeal/domains/KeyStore'
import {
    NetworkMap,
    NetworkRPCMap,
    PredefinedNetwork,
} from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { PersonalSign } from '@zeal/domains/RPCRequest'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Layout } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    account: Account
    keyStore: LEDGER | Trezor | Safe4337
    sessionPassword: string

    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    accountsMap: AccountsMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    installationId: string
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    network: PredefinedNetwork
    onMsg: (msg: Msg) => void
}

type Msg = Extract<
    MsgOf<typeof Modal>,
    { type: 'on_gnosis_pay_message_signed' }
>

export const SignMessageWithUserInteraction = ({
    keyStore,
    sessionPassword,
    account,
    accountsMap,
    feePresetMap,
    gasCurrencyPresetMap,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    portfolioMap,
    network,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                onMsg={async (msg) => {
                    switch (msg.type) {
                        case 'on_sign_login_message_button_clicked': {
                            try {
                                const message = await getLoginMessage({
                                    address: account.address,
                                })

                                const request: PersonalSign = {
                                    id: generateRandomNumber(),
                                    jsonrpc: '2.0',
                                    method: 'personal_sign',
                                    params: [message],
                                }
                                setModal({ type: 'sign_message', request })
                            } catch {
                                // FIXME @max-tern we need a proper handling of this
                            }
                            break
                        }

                        /* istanbul ignore next */
                        default:
                            notReachable(msg.type)
                    }
                }}
            />

            <Modal
                network={network}
                state={modal}
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
                            onMsg(msg)
                            break

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
