import React from 'react'

import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import {
    CountrySelector,
    PRIORITY_COUNTRIES,
    Title,
} from '@zeal/domains/Country/components/CountrySelector'
import { UNBLOCK_SUPPORTED_COUNTRIES } from '@zeal/domains/Currency/domains/BankTransfer/constants'

import { InitialResidenceDetails } from './Layout'

type Props = {
    form: InitialResidenceDetails
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof CountrySelector>

export type State = { type: 'closed' } | { type: 'select_country' }

export const Modal = ({ state, form, onMsg }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'select_country':
            return (
                <UIModal>
                    <CountrySelector
                        title={<Title />}
                        priorityCountries={PRIORITY_COUNTRIES}
                        selectedCountry={form.country}
                        countries={UNBLOCK_SUPPORTED_COUNTRIES}
                        onMsg={onMsg}
                    />
                </UIModal>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
