import { useState } from 'react'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AddLabel } from '@zeal/domains/Account/domains/Label/components/AddLabel'
import { Safe4337 } from '@zeal/domains/KeyStore'

type Props = {
    keyStore: Safe4337
    accountsMap: AccountsMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: Safe4337
          }[]
      }
    | {
          type: 'on_accounts_create_success_animation_finished'
          accountsWithKeystores: {
              account: Account
              keystore: Safe4337
          }[]
      }

type State =
    | { type: 'add_label' }
    | {
          type: 'success'
          accountsWithKeystores: {
              account: Account
              keystore: Safe4337
          }[]
      }

export const AddSafeLabel = ({ onMsg, keyStore, accountsMap }: Props) => {
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
                                    address: keyStore.address,
                                    label,
                                    avatarSrc: null,
                                },
                                keystore: keyStore,
                            },
                        ]
                        onMsg({
                            type: 'on_account_create_request',
                            accountsWithKeystores,
                        })
                        setState({ type: 'success', accountsWithKeystores })
                    }}
                    accounts={values(accountsMap)}
                />
            )

        case 'success':
            return (
                <SuccessLayout
                    title="Wallet recovered"
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
