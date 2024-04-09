import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'

import { SecretPhraseVerified } from './SecretPhraseVerified'
import { Test } from './Test'
import { VerificationExplaination } from './VerificationExplaination'

type Props = {
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string

    decryptedPhrase: string
    keystore: SecretPhrase
    account: Account
    onMsg: (msg: Msg) => void
}

const SECRET_PHRASE_TEST_STEPS_COUNT = 3

type State =
    | { type: 'verification_explanation' }
    | { type: 'secret_phrase_test' }
    | { type: 'secret_phrase_verified' }

type Msg =
    | Extract<
          MsgOf<typeof VerificationExplaination>,
          { type: 'on_verification_explaination_close' }
      >
    | Extract<
          MsgOf<typeof Test>,
          {
              type:
                  | 'on_step_back_button_click'
                  | 'on_wrong_answer_confirm_clicked'
          }
      >
    | MsgOf<typeof SecretPhraseVerified>

export const SecretPhraseTest = ({
    decryptedPhrase,
    keystore,
    account,
    accounts,
    keystoreMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'verification_explanation',
    })

    switch (state.type) {
        case 'verification_explanation':
            return (
                <VerificationExplaination
                    secretPhraseTestStepsCount={SECRET_PHRASE_TEST_STEPS_COUNT}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_verification_explaination_close':
                                onMsg(msg)
                                break

                            case 'on_continue_click':
                                setState({ type: 'secret_phrase_test' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'secret_phrase_test':
            return (
                <Test
                    decryptedPhrase={decryptedPhrase}
                    secretPhraseTestStepsCount={SECRET_PHRASE_TEST_STEPS_COUNT}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_step_back_button_click':
                            case 'on_wrong_answer_confirm_clicked':
                                onMsg(msg)
                                break

                            case 'on_secrept_phrase_test_passed':
                                setState({ type: 'secret_phrase_verified' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'secret_phrase_verified':
            return (
                <SecretPhraseVerified
                    accounts={accounts}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    keystore={keystore}
                    account={account}
                    onMsg={onMsg}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
