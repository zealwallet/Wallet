import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { AccountsMap } from '@zeal/domains/Account'
import { AddLabel } from '@zeal/domains/Account/domains/Label/components/AddLabel'
import { DeployReferenceSafe } from '@zeal/domains/Account/features/CreateNewSafe4337/DeployReferenceSafe'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { NetworkRPCMap } from '@zeal/domains/Network'
import { SMART_WALLET_REFERENCE_NETWORK } from '@zeal/domains/Network/constants'

import { CreatePasskey } from './CreatePasskey'
import { Stories } from './Stories'

type Props = {
    accountsMap: AccountsMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof DeployReferenceSafe>,
          {
              type:
                  | 'on_accounts_create_success_animation_finished'
                  | 'on_account_create_request'
          }
      >
    | { type: 'close' }

type State =
    | { type: 'smart_wallet_stories' }
    | { type: 'label_safe' }
    | { type: 'create_passkey'; label: string }
    | {
          type: 'deploy_reference_safe'
          passkey: Safe4337['safeDeplymentConfig']['passkeyOwner']
          label: string
      }

const calculateState = (): State => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return { type: 'label_safe' }
        case 'web':
            return { type: 'smart_wallet_stories' }
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}

export const CreateNewSafe4337 = ({
    accountsMap,
    networkRPCMap,
    sessionPassword,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(calculateState())

    const network = SMART_WALLET_REFERENCE_NETWORK

    switch (state.type) {
        case 'smart_wallet_stories':
            return (
                <Stories
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                            case 'on_stories_dismissed':
                                setState({ type: 'label_safe' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'label_safe':
            return (
                <AddLabel
                    initialLabel=""
                    onBackClick={() => onMsg({ type: 'close' })}
                    onAddLabelSubmitted={(label) => {
                        setState({ type: 'create_passkey', label })
                    }}
                    accounts={values(accountsMap)}
                />
            )
        case 'create_passkey':
            return (
                <CreatePasskey
                    safeLabel={state.label}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                setState({ type: 'label_safe' })
                                break
                            case 'on_passkey_created':
                                setState({
                                    type: 'deploy_reference_safe',
                                    passkey: msg.passkeyOwner,
                                    label: state.label,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'deploy_reference_safe':
            return (
                <DeployReferenceSafe
                    passkey={state.passkey}
                    label={state.label}
                    network={network}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_accounts_create_success_animation_finished':
                            case 'on_account_create_request':
                                onMsg(msg)
                                break
                            case 'on_passkey_modal_close':
                            case 'close':
                                setState({ type: 'label_safe' })
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
