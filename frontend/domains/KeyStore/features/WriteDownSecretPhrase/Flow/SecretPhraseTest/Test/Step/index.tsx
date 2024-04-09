import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Layout, SecretPhraseTestStep } from './Layout'
import { Modal, State as ModalState } from './Modal'

type Props = {
    secretPhraseArray: string[]
    step: SecretPhraseTestStep
    totalSteps: number
    remainingSteps: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof Modal>
    | Extract<
          MsgOf<typeof Layout>,
          { type: 'on_correct_answer_click' | 'on_step_back_button_click' }
      >

export const Step = ({
    remainingSteps,
    secretPhraseArray,
    step,
    totalSteps,
    onMsg,
}: Props) => {
    const [modal, setModal] = useState<ModalState>({ type: 'closed' })

    return (
        <>
            <Layout
                remainingSteps={remainingSteps}
                secretPhraseArray={secretPhraseArray}
                step={step}
                totalSteps={totalSteps}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'on_step_back_button_click':
                        case 'on_correct_answer_click':
                            onMsg(msg)
                            break

                        case 'on_wrong_answer_click':
                            setModal({ type: 'wrong_answer' })
                            break

                        /* istanbul ignore next */
                        default:
                            notReachable(msg)
                    }
                }}
            />

            <Modal state={modal} onMsg={onMsg} />
        </>
    )
}
