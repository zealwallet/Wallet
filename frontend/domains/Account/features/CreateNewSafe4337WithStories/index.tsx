import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import { CreateNewSafe4337 } from '@zeal/domains/Account/features/CreateNewSafe4337'
import { NetworkRPCMap } from '@zeal/domains/Network'

import { Stories } from './Stories'

type Props = {
    accountsMap: AccountsMap
    networkRPCMap: NetworkRPCMap
    sessionPassword: string
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof CreateNewSafe4337>

type State = { type: 'smart_wallet_stories' } | { type: 'create_smart_wallet' }

export const CreateNewSafe4337WithStories = ({
    accountsMap,
    networkRPCMap,
    sessionPassword,
    installationId,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'smart_wallet_stories' })

    switch (state.type) {
        case 'smart_wallet_stories':
            return (
                <Stories
                    installationId={installationId}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_stories_completed':
                                setState({ type: 'create_smart_wallet' })
                                break
                            case 'on_stories_dismissed':
                                onMsg({ type: 'close' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'create_smart_wallet':
            return (
                <CreateNewSafe4337
                    accountsMap={accountsMap}
                    networkRPCMap={networkRPCMap}
                    sessionPassword={sessionPassword}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
