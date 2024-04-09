import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { CountryISOCode } from '@zeal/domains/Country'
import { CountrySelector } from '@zeal/domains/Country/components/CountrySelector'
import { FiatCurrency } from '@zeal/domains/Currency'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { UNBLOCK_SUPPORTED_COUNTRIES } from '@zeal/domains/Currency/domains/BankTransfer/constants'
import { getAllowedFiatCurrenciesForCountryCode } from '@zeal/domains/Currency/domains/BankTransfer/helpers/getAllowedFiatCurrenciesForCountryCode'

import { FiatCurrencySelector } from '../../FiatCurrencySelector'

type Props = {
    currencies: BankTransferCurrencies
    currentCountryCode: CountryISOCode | null
    currentCurrency: FiatCurrency | null
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof CountrySelector>
    | MsgOf<typeof FiatCurrencySelector>

export type State =
    | { type: 'closed' }
    | { type: 'select_country' }
    | { type: 'select_currency' }

export const Modal = ({
    currentCountryCode,
    currencies,
    currentCurrency,
    state,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'select_country':
            return (
                <UIModal>
                    <CountrySelector
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

        case 'select_currency':
            return (
                <UIModal>
                    <FiatCurrencySelector
                        fiatCurrencies={
                            currentCountryCode
                                ? getAllowedFiatCurrenciesForCountryCode(
                                      currencies.fiatCurrencies,
                                      currentCountryCode
                                  )
                                : values(currencies.fiatCurrencies)
                        }
                        selected={currentCurrency}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                    onMsg(msg)
                                    break

                                case 'on_currency_selected':
                                    onMsg(msg)
                                    onMsg({ type: 'close' })
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
