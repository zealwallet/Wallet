import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AddFunds } from '@zeal/domains/Account/components/AddFunds'
import { AddLabel } from '@zeal/domains/Account/domains/Label/components/AddLabel'
import { CreateNewAccount } from '@zeal/domains/Account/features/CreateNewAccount'

type Props = {
    accountsMap: AccountsMap
    sessionPassword: string
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_user_skipped_add_assets' }
    | Extract<
          MsgOf<typeof CreateNewAccount>,
          { type: 'on_account_create_request' }
      >
    | Extract<
          MsgOf<typeof AddFunds>,
          { type: 'bank_transfer_click' | 'from_any_wallet_click' }
      >

type State =
    | { type: 'label_wallet' }
    | { type: 'create_wallet'; label: string }
    | { type: 'add_assets'; account: Account }

export const NewToWeb3 = ({
    onMsg,
    accountsMap,
    sessionPassword,
    installationId,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'label_wallet' })

    switch (state.type) {
        case 'label_wallet':
            return (
                <AddLabel
                    initialLabel=""
                    onBackClick={() => {
                        onMsg({ type: 'close' })
                    }}
                    onAddLabelSubmitted={(label) => {
                        setState({ type: 'create_wallet', label })
                    }}
                    accounts={values(accountsMap)}
                />
            )

        case 'create_wallet':
            return (
                <CreateNewAccount
                    label={state.label}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                                onMsg(msg)
                                break
                            case 'on_accounts_create_success_animation_finished':
                                setState({
                                    type: 'add_assets',
                                    account:
                                        msg.accountsWithKeystores[0].account,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )

        case 'add_assets':
            return (
                <AddFunds
                    account={state.account}
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg({ type: 'on_user_skipped_add_assets' })
                                break
                            case 'from_any_wallet_click':
                            case 'bank_transfer_click':
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
