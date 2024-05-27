import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { SolidGlobe } from '@zeal/uikit/Icon/SolidGlobe'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GnosisPayLoginSignature } from '@zeal/domains/Card'
import {
    CARD_NETWORK,
    countriesSupportedByGnosisPay,
} from '@zeal/domains/Card/constants'
import { COUNTRIES_MAP, CountryISOCode } from '@zeal/domains/Country'
import { CountrySelector } from '@zeal/domains/Country/components/CountrySelector'
import { tryToGetUserCurrentCountry } from '@zeal/domains/Country/helpers/tryToGetUserCurrentCountry'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { FetchGnosisAccountStatus } from './FetchGnosisAccountStatus'

import { ChooseWallet } from '../../../ChooseWallet'
import { Sign } from '../../../Sign'

type Props = {
    userSelected: 'create' | 'import'
    installationId: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    keyStoreMap: KeyStoreMap
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof ChooseWallet>,
          { type: 'card_tab_choose_wallet_on_import_new_wallet_clicked' }
      >
    | Extract<
          MsgOf<typeof FetchGnosisAccountStatus>,
          {
              type:
                  | 'on_order_new_card_gnosis_pay_click'
                  | 'on_card_imported_success_animation_complete'
          }
      >

type State =
    | { type: 'choose_country' }
    | { type: 'country_not_supported'; countryCode: CountryISOCode }
    | { type: 'choose_wallet' }
    | {
          type: 'sign_login_message'
          account: Account
          keyStore: SigningKeyStore
      }
    | {
          type: 'fetch_gnosis_account_status'
          account: Account
          gnosisPayLoginSignature: GnosisPayLoginSignature
          userSelected: 'create' | 'import'
      }

export const OrderCardFlow = ({
    userSelected,
    accountsMap,
    keystoreMap,
    portfolioMap,
    currencyHiddenMap,
    installationId,
    networkMap,
    networkRPCMap,
    keyStoreMap,
    gasCurrencyPresetMap,
    feePresetMap,
    sessionPassword,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>(() => {
        switch (userSelected) {
            case 'create':
                return { type: 'choose_country' }
            case 'import':
                return { type: 'choose_wallet' }
            /* istanbul ignore next */
            default:
                return notReachable(userSelected)
        }
    })

    switch (state.type) {
        case 'choose_country':
            const country = tryToGetUserCurrentCountry().getSuccessResult()
            const priorityCountries = country
                ? new Set([country.code])
                : countriesSupportedByGnosisPay

            return (
                <CountrySelector
                    selectedCountry={null}
                    title={
                        <FormattedMessage
                            id="card.select_country.residence"
                            defaultMessage="What’s your country of residence?"
                        />
                    }
                    countries={values(COUNTRIES_MAP)}
                    priorityCountries={priorityCountries}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                                onMsg(msg)
                                break
                            case 'on_country_selected':
                                countriesSupportedByGnosisPay.has(
                                    msg.countryCode
                                )
                                    ? setState({ type: 'choose_wallet' })
                                    : setState({
                                          type: 'country_not_supported',
                                          countryCode: msg.countryCode,
                                      })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'country_not_supported':
            return (
                <Screen
                    padding="form"
                    background="default"
                    onNavigateBack={() => {
                        setState({ type: 'choose_country' })
                    }}
                >
                    <Header
                        icon={({ size }) => (
                            <SolidGlobe size={size} color="textPrimary" />
                        )}
                        title={
                            <FormattedMessage
                                id="card.country_not_supported"
                                defaultMessage="Gnosis Pay Cards are not available in {country} yet"
                                values={{
                                    country:
                                        COUNTRIES_MAP[state.countryCode].name,
                                }}
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="card.country_not_supported.subtitle"
                                defaultMessage="Join the waitlist to get notified when Gnosis Pay Cards becomes available in your country"
                            />
                        }
                    />
                    <Column spacing={0} alignY="end" fill>
                        <Actions>
                            <Button
                                variant="secondary"
                                size="regular"
                                onClick={() => {
                                    onMsg({ type: 'close' })
                                }}
                            >
                                <FormattedMessage
                                    id="actions.cancel"
                                    defaultMessage="Cancel"
                                />
                            </Button>
                            <Button
                                variant="primary"
                                size="regular"
                                onClick={() => {
                                    openExternalURL(
                                        'https://s75r5nlaile.typeform.com/to/hw10Xu6Z'
                                    )
                                }}
                            >
                                <FormattedMessage
                                    id="card.actions.join_waitlist"
                                    defaultMessage="Join Waitlist"
                                />
                            </Button>
                        </Actions>
                    </Column>
                </Screen>
            )

        case 'choose_wallet':
            return (
                <ChooseWallet
                    accountWithKeystore={null}
                    installationId={installationId}
                    accountsMap={accountsMap}
                    keystoreMap={keystoreMap}
                    portfolioMap={portfolioMap}
                    currencyHiddenMap={currencyHiddenMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'close':
                            case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                                onMsg(msg)
                                break
                            case 'on_continue_click':
                                setState({
                                    type: 'sign_login_message',
                                    account: msg.account,
                                    keyStore: msg.keystore,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(msg)
                        }
                    }}
                />
            )
        case 'sign_login_message':
            return (
                <Sign
                    network={CARD_NETWORK}
                    loadingVariant="spinner"
                    account={state.account}
                    accountsMap={accountsMap}
                    feePresetMap={feePresetMap}
                    gasCurrencyPresetMap={gasCurrencyPresetMap}
                    installationId={installationId}
                    keyStore={state.keyStore}
                    keyStoreMap={keyStoreMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    portfolioMap={portfolioMap}
                    sessionPassword={sessionPassword}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_gnosis_pay_message_signed':
                                setState({
                                    type: 'fetch_gnosis_account_status',
                                    gnosisPayLoginSignature:
                                        msg.gnosisPayLoginSignature,
                                    userSelected,
                                    account: state.account,
                                })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg.type)
                        }
                    }}
                />
            )
        case 'fetch_gnosis_account_status':
            return (
                <FetchGnosisAccountStatus
                    accountsMap={accountsMap}
                    keyStoreMap={keyStoreMap}
                    installationId={installationId}
                    account={state.account}
                    gnosisPayLoginSignature={state.gnosisPayLoginSignature}
                    userSelected={userSelected}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_order_new_card_gnosis_pay_click':
                            case 'on_card_imported_success_animation_complete':
                                onMsg(msg)
                                break
                            case 'on_no_card_detected_try_different_card_click':
                            case 'close':
                                setState({ type: 'choose_wallet' })
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
