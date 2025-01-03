import { useRef } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { TextInput } from 'react-native'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { ArrowDown } from '@zeal/uikit/Icon/ArrowDown'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { InputButton } from '@zeal/uikit/InputButton'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'
import { nonEmptyString, nonNull, Result, shape } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { COUNTRIES_MAP, CountryISOCode } from '@zeal/domains/Country'
import { Avatar as CountryIcon } from '@zeal/domains/Country/components/Avatar'
import { ResidenceDetails } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'

export type InitialResidenceDetails = {
    country: CountryISOCode | null
    address: string | null
    postCode: string | null
    city: string | null
}

type FormErrors = {
    submit?:
        | { type: 'country_required' }
        | { type: 'address_required' }
        | { type: 'post_code_required' }
        | { type: 'city_required' }
}

type Props = {
    form: InitialResidenceDetails
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_form_submitted'; completedForm: ResidenceDetails }
    | { type: 'on_select_country_click' }
    | { type: 'on_form_change'; form: InitialResidenceDetails }
    | {
          type: 'close'
      }

const validateOnSubmit = (
    form: InitialResidenceDetails
): Result<FormErrors, ResidenceDetails> => {
    return shape({
        country: nonNull(form.country).mapError(() => ({
            type: 'country_required' as const,
        })),
        address: nonEmptyString(form.address).mapError(() => ({
            type: 'address_required' as const,
        })),
        postCode: nonEmptyString(form.postCode).mapError(() => ({
            type: 'post_code_required' as const,
        })),
        city: nonEmptyString(form.city).mapError(() => ({
            type: 'city_required' as const,
        })),
    }).mapError(({ country, address, postCode, city }) => ({
        submit: country || address || postCode || city,
    }))
}

export const Layout = ({
    form,
    onMsg,
    account,
    network,
    keyStoreMap,
}: Props) => {
    const errors = validateOnSubmit(form).getFailureReason() || {}

    const postalCodeInput = useRef<TextInput>(null)
    const cityInput = useRef<TextInput>(null)

    const { formatMessage } = useIntl()

    const onSubmit = () => {
        const validation = validateOnSubmit(form)

        switch (validation.type) {
            case 'Failure':
                break

            case 'Success': {
                onMsg({
                    type: 'on_form_submitted',
                    completedForm: validation.data,
                })
                break
            }

            default:
                notReachable(validation)
        }
    }

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={8} fill alignY="stretch">
                <Column spacing={24} fill>
                    <Header
                        title={
                            <FormattedMessage
                                id="bank_transfer.residence_details.title"
                                defaultMessage="Your residence"
                            />
                        }
                    />
                    <ScrollContainer>
                        <Column spacing={8}>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="bank_transfer.residence_details.title"
                                        defaultMessage="Country of residence"
                                    />
                                </Text>

                                <InputButton
                                    leftIcon={
                                        form.country ? (
                                            <CountryIcon
                                                countryCode={form.country}
                                                size={28}
                                            />
                                        ) : (
                                            <QuestionCircle
                                                size={28}
                                                color="iconDefault"
                                            />
                                        )
                                    }
                                    rightIcon={
                                        <ArrowDown
                                            color="iconDisabled"
                                            size={24}
                                        />
                                    }
                                    onClick={() => {
                                        onMsg({
                                            type: 'on_select_country_click',
                                        })
                                    }}
                                >
                                    {form.country ? (
                                        COUNTRIES_MAP[form.country].name
                                    ) : (
                                        <FormattedMessage
                                            id="bank_transfer.residence_details.country_placeholder"
                                            defaultMessage="Country"
                                        />
                                    )}
                                </InputButton>
                            </Column>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="bank_transfer.residence_details.address"
                                        defaultMessage="Your address"
                                    />
                                </Text>

                                <Input
                                    keyboardType="default"
                                    returnKeyType="next"
                                    autoComplete="street-address"
                                    blurOnSubmit={false} // prevent keyboard flashing when pressing "next"
                                    onSubmitEditing={() => {
                                        switch (ZealPlatform.OS) {
                                            case 'ios':
                                            case 'android':
                                                postalCodeInput.current?.focus()
                                                break
                                            case 'web':
                                                onSubmit()
                                                break
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(
                                                    ZealPlatform.OS
                                                )
                                        }
                                    }}
                                    onChange={(e) =>
                                        onMsg({
                                            type: 'on_form_change',
                                            form: {
                                                ...form,
                                                address: e.nativeEvent.text,
                                            },
                                        })
                                    }
                                    state="normal"
                                    placeholder={formatMessage({
                                        id: 'bank_transfer.residence_details.street',
                                        defaultMessage: 'Street',
                                    })}
                                    variant="regular"
                                    value={form.address ?? ''}
                                />
                            </Column>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="bank_transfer.residence_details.postcode"
                                        defaultMessage="Postcode"
                                    />
                                </Text>

                                <Input
                                    ref={postalCodeInput}
                                    keyboardType="default"
                                    returnKeyType="next"
                                    autoComplete="postal-code"
                                    blurOnSubmit={false} // prevent keyboard flashing when pressing "next"
                                    onSubmitEditing={() => {
                                        switch (ZealPlatform.OS) {
                                            case 'ios':
                                            case 'android':
                                                cityInput.current?.focus()
                                                break
                                            case 'web':
                                                onSubmit()
                                                break
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(
                                                    ZealPlatform.OS
                                                )
                                        }
                                    }}
                                    onChange={(e) =>
                                        onMsg({
                                            type: 'on_form_change',
                                            form: {
                                                ...form,
                                                postCode: e.nativeEvent.text,
                                            },
                                        })
                                    }
                                    state="normal"
                                    placeholder="..."
                                    variant="regular"
                                    value={form.postCode ?? ''}
                                />
                            </Column>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="bank_transfer.residence_details.city"
                                        defaultMessage="City"
                                    />
                                </Text>

                                <Input
                                    ref={cityInput}
                                    keyboardType="default"
                                    onSubmitEditing={onSubmit}
                                    onChange={(e) =>
                                        onMsg({
                                            type: 'on_form_change',
                                            form: {
                                                ...form,
                                                city: e.nativeEvent.text,
                                            },
                                        })
                                    }
                                    state="normal"
                                    placeholder="London"
                                    variant="regular"
                                    value={form.city ?? ''}
                                />
                            </Column>
                        </Column>
                    </ScrollContainer>
                </Column>
                <Actions>
                    <Button
                        variant="primary"
                        size="regular"
                        disabled={!!errors.submit}
                        onClick={onSubmit}
                    >
                        <FormattedMessage
                            id="actions.continue"
                            defaultMessage="Continue"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
