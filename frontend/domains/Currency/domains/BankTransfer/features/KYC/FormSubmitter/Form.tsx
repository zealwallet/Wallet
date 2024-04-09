import { useState } from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { UnblockUser } from '@zeal/domains/Currency/domains/BankTransfer'
import {
    KycApplication,
    PersonalDetails,
    ResidenceDetails,
} from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import {
    InitialPersonalDetails,
    PersonalDetailsForm,
} from './PersonalDetailsForm'
import {
    InitialResidenceDetails,
    ResidenceDetailsForm,
} from './ResidenceDetailsForm'
import { SourceOfFundsForm } from './SourceOfFundsForm'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'form_submitted'; form: KycApplication }
    | Extract<
          MsgOf<typeof PersonalDetailsForm>,
          {
              type: 'close' | 'on_back_button_clicked'
          }
      >

type State =
    | { type: 'personal_details'; initialForm: InitialPersonalDetails }
    | {
          type: 'residence_details'
          initialForm: InitialResidenceDetails
          personalDetails: PersonalDetails
      }
    | {
          type: 'source_of_funds'
          personalDetails: PersonalDetails
          residenceDetails: ResidenceDetails
      }

export const Form = ({
    onMsg,
    unblockUser,
    account,
    network,
    keyStoreMap,
}: Props) => {
    const [state, setState] = useState<State>({
        type: 'personal_details',
        initialForm: {
            firstName: unblockUser.firstName,
            lastName: unblockUser.lastName,
            dateOfBirth: null,
        },
    })

    switch (state.type) {
        case 'personal_details':
            return (
                <PersonalDetailsForm
                    initialPersonalDetails={state.initialForm}
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_back_button_clicked':
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_form_submitted':
                                setState({
                                    type: 'residence_details',
                                    personalDetails: msg.completedForm,
                                    initialForm: {
                                        city: null,
                                        address: null,
                                        country: null,
                                        postCode: null,
                                    },
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'residence_details':
            return (
                <ResidenceDetailsForm
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    initialResidenceDetails={state.initialForm}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_back_button_clicked':
                                setState({
                                    type: 'personal_details',
                                    initialForm: state.personalDetails,
                                })
                                break
                            case 'on_form_submitted':
                                setState({
                                    type: 'source_of_funds',
                                    personalDetails: state.personalDetails,
                                    residenceDetails: msg.completedForm,
                                })
                                break
                            case 'close':
                                onMsg(msg)
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'source_of_funds':
            return (
                <SourceOfFundsForm
                    account={account}
                    network={network}
                    keyStoreMap={keyStoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_source_of_funds_selected':
                                onMsg({
                                    type: 'form_submitted',
                                    form: {
                                        personalDetails: state.personalDetails,
                                        residenceDetails:
                                            state.residenceDetails,
                                        sourceOfFunds: msg.source,
                                    },
                                })
                                break
                            case 'on_back_button_clicked':
                                setState({
                                    type: 'residence_details',
                                    personalDetails: state.personalDetails,
                                    initialForm: state.residenceDetails,
                                })
                                break
                            case 'close':
                                onMsg(msg)
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
