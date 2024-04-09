import React from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AddLabel } from '@zeal/domains/Account/domains/Label/components/AddLabel'
import { Address } from '@zeal/domains/Address'
import { TrackOnly } from '@zeal/domains/KeyStore'
import { NetworkRPCMap } from '@zeal/domains/Network'

import { Add as AddAddress } from './Add'
type Props = {
    accountsMap: AccountsMap
    networkRPCMap: NetworkRPCMap
    variant: 'track' | 'track_or_create'
    onMsg: (msg: Msg) => void
}

export type Msg =
    | Extract<
          MsgOf<typeof AddAddress>,
          { type: 'close' | 'on_create_wallet_instead_clicked' }
      >
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: TrackOnly
          }[]
      }
    | {
          type: 'on_accounts_create_success_animation_finished'
          account: Account
      }

type State =
    | { type: 'add_address'; initialAddress: Address }
    | { type: 'add_label'; address: Address; initialLabel: string }
    | { type: 'success'; account: Account }

export const Track = ({
    accountsMap,
    variant,
    networkRPCMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'add_address',
        initialAddress: '',
    })

    switch (state.type) {
        case 'add_address':
            return (
                <AddAddress
                    variant={variant}
                    accounts={accountsMap}
                    initialAddress={state.initialAddress}
                    networkRPCMap={networkRPCMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_create_wallet_instead_clicked':
                                onMsg(msg)
                                break

                            case 'on_address_added':
                                setState({
                                    type: 'add_label',
                                    address: msg.address,
                                    initialLabel: '',
                                })
                                break

                            case 'on_ens_address_added':
                                setState({
                                    type: 'add_label',
                                    address: msg.address,
                                    initialLabel: msg.domain,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )
        case 'add_label':
            return (
                <AddLabel
                    initialLabel={state.initialLabel}
                    onBackClick={() => {
                        setState({
                            type: 'add_address',
                            initialAddress: state.address,
                        })
                    }}
                    onAddLabelSubmitted={(label) => {
                        const account = {
                            label,
                            address: state.address,
                            avatarSrc: null,
                        }
                        onMsg({
                            type: 'on_account_create_request',
                            accountsWithKeystores: [
                                {
                                    account,
                                    keystore: {
                                        id: uuid(),
                                        type: 'track_only',
                                    },
                                },
                            ],
                        })
                        setState({ type: 'success', account })
                    }}
                    accounts={values(accountsMap)}
                />
            )

        case 'success':
            return (
                <SuccessLayout
                    title={
                        <FormattedMessage
                            id="account.add_tracked.success"
                            defaultMessage="Wallet added to Zeal"
                        />
                    }
                    onAnimationComplete={() =>
                        onMsg({
                            type: 'on_accounts_create_success_animation_finished',
                            account: state.account,
                        })
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
