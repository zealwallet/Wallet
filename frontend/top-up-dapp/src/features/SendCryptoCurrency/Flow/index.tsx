import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { SubmitedTransactionQueued } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

import { Form } from './Form'
import { MonitorTransaction } from './MonitorTransaction'
import { SubmitTransaction } from './SubmitTransaction'
import { TopUpRequest } from './TopUpRequest'

type Props = {
    topUpCurrencies: CryptoCurrency[]
    zealAccount: Account
}

type State =
    | { type: 'form' }
    | {
          type: 'submit_transaction'
          topUpRequest: TopUpRequest
          knownCurrencies: KnownCurrencies | null
      }
    | {
          type: 'monitor_transaction'
          topUpRequest: TopUpRequest
          submittedTransaction: SubmitedTransactionQueued
          knownCurrencies: KnownCurrencies | null
      }

export const Flow = ({ topUpCurrencies, zealAccount }: Props) => {
    const [state, setState] = useState<State>({ type: 'form' })

    switch (state.type) {
        case 'form':
            return (
                <Form
                    zealAccount={zealAccount}
                    topUpCurrencies={topUpCurrencies}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_form_submitted':
                                setState({
                                    type: 'submit_transaction',
                                    topUpRequest: msg.topUpRequest,
                                    knownCurrencies: msg.knownCurrencies,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'submit_transaction':
            return (
                <SubmitTransaction
                    topUpRequest={state.topUpRequest}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'on_transaction_rejected':
                                setState({ type: 'form' })
                                break
                            case 'on_transaction_submitted':
                                setState({
                                    type: 'monitor_transaction',
                                    submittedTransaction:
                                        msg.submittedTransaction,
                                    topUpRequest: state.topUpRequest,
                                    knownCurrencies: state.knownCurrencies,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'monitor_transaction':
            return (
                <MonitorTransaction
                    knownCurrencies={state.knownCurrencies}
                    topUpCurrencies={topUpCurrencies}
                    topUpRequest={state.topUpRequest}
                    submittedTransaction={state.submittedTransaction}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_transaction_failed_try_again_clicked':
                            case 'on_transaction_complete_close':
                                setState({ type: 'form' })
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
