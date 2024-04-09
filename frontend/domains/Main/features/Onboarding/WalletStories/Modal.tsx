import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { SelectTypeOfAccountToAdd } from '@zeal/domains/Account/components/SelectTypeOfAccountToAdd'

import { HowExperiencedYouAreQuiz } from '../HowExperiencedYouAreQuiz'

type Props = {
    state: State
    installationId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof SelectTypeOfAccountToAdd>
    | MsgOf<typeof HowExperiencedYouAreQuiz>

export type State =
    | { type: 'closed' }
    | { type: 'choose_wallet_to_add' }
    | { type: 'how_experienced_you_are' }

export const Modal = ({ state, installationId, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'choose_wallet_to_add':
            return <SelectTypeOfAccountToAdd onMsg={onMsg} />
        case 'how_experienced_you_are':
            return (
                <UIModal>
                    <HowExperiencedYouAreQuiz
                        installationId={installationId}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
