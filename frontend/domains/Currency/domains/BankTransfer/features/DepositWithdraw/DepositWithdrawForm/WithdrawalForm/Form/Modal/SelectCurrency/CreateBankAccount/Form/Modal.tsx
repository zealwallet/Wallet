import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { CountryISOCode } from '@zeal/domains/Country'
import {
    CountrySelector,
    PRIORITY_COUNTRIES,
    Title,
} from '@zeal/domains/Country/components/CountrySelector'
import { UNBLOCK_SUPPORTED_COUNTRIES } from '@zeal/domains/Currency/domains/BankTransfer/constants'

type Props = {
    currentCountryCode: CountryISOCode | null
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof CountrySelector>

export type State = { type: 'closed' } | { type: 'select_country' }

export const Modal = ({ currentCountryCode, state, onMsg }: Props) => {
    switch (state.type) {
        case 'select_country':
            return (
                <UIModal>
                    <CountrySelector
                        title={<Title />}
                        priorityCountries={PRIORITY_COUNTRIES}
                        selectedCountry={currentCountryCode}
                        countries={UNBLOCK_SUPPORTED_COUNTRIES}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'on_country_selected':
                                    onMsg(msg)
                                    break

                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )

        case 'closed':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
