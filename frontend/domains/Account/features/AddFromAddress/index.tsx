import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AddLabel } from '@zeal/domains/Account/domains/Label/components/AddLabel'
import { Address } from '@zeal/domains/Address'
import { TrackOnly } from '@zeal/domains/KeyStore'
type Props = {
    address: Address
    accountMap: AccountsMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: TrackOnly
          }[]
      }
    | {
          type: 'on_accounts_create_success_animation_finished'
          accountsWithKeystores: {
              account: Account
              keystore: TrackOnly
          }[]
      }

type State =
    | { type: 'add_label' }
    | {
          type: 'success'
          accountsWithKeystores: {
              account: Account
              keystore: TrackOnly
          }[]
      }

export const AddFromAddress = ({ onMsg, address, accountMap }: Props) => {
    const [state, setState] = useState<State>({ type: 'add_label' })

    switch (state.type) {
        case 'add_label':
            return (
                <AddLabel
                    initialLabel=""
                    onBackClick={() => onMsg({ type: 'close' })}
                    onAddLabelSubmitted={(label) => {
                        const accountsWithKeystores = [
                            {
                                account: {
                                    address,
                                    label,
                                    avatarSrc: null,
                                },
                                keystore: {
                                    id: uuid(),
                                    type: 'track_only' as const,
                                },
                            },
                        ]
                        onMsg({
                            type: 'on_account_create_request',
                            accountsWithKeystores,
                        })
                        setState({ type: 'success', accountsWithKeystores })
                    }}
                    accounts={values(accountMap)}
                />
            )
        case 'success':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="AddFromAddress.success"
                            defaultMessage="Wallet Saved"
                        />
                    }
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                            accountsWithKeystores: state.accountsWithKeystores,
                        })
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
