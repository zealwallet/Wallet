import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'

import { BeforeYouBegin } from './BeforeYouBegin'
import { SecretPhraseReveal } from './SecretPhraseReveal'
import { SecretPhraseTest } from './SecretPhraseTest'

type Props = {
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string

    keystore: SecretPhrase
    account: Account
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'before_you_begin' }
    | { type: 'secret_phrase_reveal' }
    | { type: 'secret_phrase_test'; decryptedPhrase: string }

type Msg =
    | Extract<
          MsgOf<typeof BeforeYouBegin>,
          { type: 'on_before_you_begin_back_clicked' }
      >
    | Extract<
          MsgOf<typeof SecretPhraseReveal>,
          {
              type:
                  | 'on_skip_verification_click'
                  | 'on_secret_phrase_reveal_back_clicked'
          }
      >
    | Extract<
          MsgOf<typeof SecretPhraseTest>,
          { type: 'on_secret_phrase_verified_success' }
      >

export const Flow = ({
    account,
    keystore,
    sessionPassword,
    accounts,
    keystoreMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'before_you_begin' })

    switch (state.type) {
        case 'before_you_begin':
            return (
                <BeforeYouBegin
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_continue_clicked':
                                setState({ type: 'secret_phrase_reveal' })
                                break

                            case 'on_before_you_begin_back_clicked':
                                onMsg(msg)
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'secret_phrase_reveal':
            return (
                <SecretPhraseReveal
                    account={account}
                    keystore={keystore}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_skip_verification_click':
                            case 'on_secret_phrase_reveal_back_clicked':
                                onMsg(msg)
                                break

                            case 'on_continue_to_verificaiton_click':
                                setState({
                                    type: 'secret_phrase_test',
                                    decryptedPhrase: msg.decryptedPhrase,
                                })
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
                <SecretPhraseTest
                    accounts={accounts}
                    keystoreMap={keystoreMap}
                    sessionPassword={sessionPassword}
                    keystore={keystore}
                    account={account}
                    decryptedPhrase={state.decryptedPhrase}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_verification_explaination_close':
                            case 'on_step_back_button_click':
                            case 'on_wrong_answer_confirm_clicked':
                                setState({ type: 'secret_phrase_reveal' })
                                break

                            case 'on_secret_phrase_verified_success':
                                onMsg(msg)
                                break

                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
