import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Step } from './Step'
import {
    generateSecretPhraseTestSteps,
    SecretPhraseTestStep,
} from './Step/Layout'

type Props = {
    decryptedPhrase: string
    secretPhraseTestStepsCount: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | Extract<
          MsgOf<typeof Step>,
          {
              type:
                  | 'on_step_back_button_click'
                  | 'on_wrong_answer_confirm_clicked'
          }
      >
    | { type: 'on_secrept_phrase_test_passed' }

export const Test = ({
    secretPhraseTestStepsCount,
    decryptedPhrase,
    onMsg,
}: Props) => {
    const secretPhraseArray = decryptedPhrase.split(' ')

    const [[currentStep, ...remainingSteps], setState] = useState<
        SecretPhraseTestStep[]
    >(() =>
        generateSecretPhraseTestSteps(
            [],
            new Array(secretPhraseArray.length)
                .fill(undefined)
                .map((_, index) => index),
            secretPhraseArray,
            secretPhraseTestStepsCount
        )
    )

    return (
        <Step
            step={currentStep}
            remainingSteps={remainingSteps.length}
            secretPhraseArray={secretPhraseArray}
            totalSteps={secretPhraseTestStepsCount}
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'on_correct_answer_click':
                        if (remainingSteps.length) {
                            setState(remainingSteps)
                        } else {
                            onMsg({ type: 'on_secrept_phrase_test_passed' })
                        }
                        break

                    case 'on_step_back_button_click':
                    case 'on_wrong_answer_confirm_clicked':
                        onMsg(msg)
                        break

                    /* istanbul ignore next */
                    default:
                        notReachable(msg)
                }
            }}
        />
    )
}
