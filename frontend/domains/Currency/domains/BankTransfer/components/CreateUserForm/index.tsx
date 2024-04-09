import { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { KeyboardAvoidingView } from 'react-native'

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
import { Text } from '@zeal/uikit/Text'
import { TextButton } from '@zeal/uikit/TextButton'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { COUNTRIES_MAP } from '@zeal/domains/Country'
import { Avatar as CurrencyIcon } from '@zeal/domains/Country/components/Avatar'
import { CreateUnblockUserParams } from '@zeal/domains/Currency/domains/BankTransfer/api/createUnblockUser'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

import { Modal, State as ModalState } from './Modal'
import {
    EmailError,
    EmptyForm,
    FirstNameError,
    LastNameError,
    validateAsYouType,
    validateOnSubmit,
} from './validation'

type Props = {
    account: Account
    network: Network
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_create_user_form_submit'
          form: CreateUnblockUserParams
      }

export const CreateUserForm = ({
    account,
    keystore,
    network,
    onMsg,
}: Props) => {
    const [form, setForm] = useState<EmptyForm>({
        firstName: '',
        email: '',
        lastName: '',
        countryCode: null,
    })

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const error = isSubmitted
        ? validateOnSubmit(form, account).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form, account)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_create_user_form_submit',
                    form: result.data,
                })

                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }
    return (
        <>
            <Screen background="light" padding="form">
                {/*FIXME @fred check how we can deal with nested absolute position modals and avoid KeyboardAvoidingView in domains*/}
                <KeyboardAvoidingView
                    style={{ flexGrow: 1 }}
                    contentContainerStyle={{ flexGrow: 1 }}
                    behavior="position"
                >
                    <ActionBar
                        account={account}
                        keystore={keystore}
                        network={network}
                        left={
                            <IconButton
                                variant="on_light"
                                onClick={() => onMsg({ type: 'close' })}
                            >
                                {({ color }) => (
                                    <BackIcon size={24} color={color} />
                                )}
                            </IconButton>
                        }
                    />

                    <Column spacing={24} fill>
                        <Header
                            title={
                                <FormattedMessage
                                    id="currency.bank_transfer.create_unblock_user.title"
                                    defaultMessage="Link your bank account"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="currency.bank_transfer.create_unblock_user.subtitle"
                                    defaultMessage="Add your name and email exactly as they appear in your bank account statements"
                                />
                            }
                        />

                        <Column spacing={8} fill>
                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_user.first_name"
                                        defaultMessage="Beneficiary first name"
                                    />
                                </Text>

                                <Input
                                    keyboardType="default"
                                    onSubmitEditing={onSubmit}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            firstName: e.nativeEvent.text,
                                        })
                                    }
                                    state={error.firstName ? 'error' : 'normal'}
                                    placeholder="Vitalik"
                                    variant="regular"
                                    value={form.firstName}
                                    message={
                                        error.firstName && (
                                            <FirstNameErrorMessage
                                                error={error.firstName}
                                            />
                                        )
                                    }
                                />
                            </Column>

                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_user.last_name"
                                        defaultMessage="Beneficiary last name"
                                    />
                                </Text>

                                <Input
                                    keyboardType="default"
                                    onSubmitEditing={onSubmit}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            lastName: e.nativeEvent.text,
                                        })
                                    }
                                    state={error.lastName ? 'error' : 'normal'}
                                    placeholder="Buterin"
                                    variant="regular"
                                    value={form.lastName}
                                    message={
                                        error.lastName && (
                                            <LastNameErrorMessage
                                                error={error.lastName}
                                            />
                                        )
                                    }
                                />
                            </Column>

                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_user.email"
                                        defaultMessage="Email address"
                                    />
                                </Text>

                                <Input
                                    keyboardType="email-address"
                                    onSubmitEditing={onSubmit}
                                    onChange={(e) =>
                                        setForm({
                                            ...form,
                                            email: e.nativeEvent.text,
                                        })
                                    }
                                    state={error.email ? 'error' : 'normal'}
                                    message={
                                        error.email && (
                                            <EmailErrorMessage
                                                error={error.email}
                                            />
                                        )
                                    }
                                    placeholder="@email.com"
                                    variant="regular"
                                    value={form.email}
                                />
                            </Column>

                            <Column spacing={8}>
                                <Text
                                    variant="paragraph"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="currency.bank_transfer.create_unblock_withdraw_account.bank_country"
                                        defaultMessage="Bank country"
                                    />
                                </Text>

                                <InputButton
                                    leftIcon={
                                        form.countryCode ? (
                                            <CurrencyIcon
                                                countryCode={form.countryCode}
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
                                        setModalState({
                                            type: 'select_country',
                                        })
                                    }}
                                >
                                    {form.countryCode
                                        ? COUNTRIES_MAP[form.countryCode].name
                                        : 'Country'}
                                </InputButton>
                            </Column>
                        </Column>
                    </Column>

                    <Column spacing={24}>
                        <Text
                            variant="footnote"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.bank_transfer.create_unblock_user.note"
                                defaultMessage="By continuing you accept Unblock’s (our banking partner) <terms>Terms</terms> and <policy>Privacy Policy</policy>"
                                values={{
                                    terms: (msg) => (
                                        <TextButton
                                            onClick={() => {
                                                openExternalURL(
                                                    'https://www.getunblock.com/policies/policies'
                                                )
                                            }}
                                        >
                                            {msg}
                                        </TextButton>
                                    ),
                                    policy: (msg) => (
                                        <TextButton
                                            onClick={() => {
                                                openExternalURL(
                                                    'https://www.getunblock.com/policies/privacy-policy'
                                                )
                                            }}
                                        >
                                            {msg}
                                        </TextButton>
                                    ),
                                }}
                            />
                        </Text>

                        <Actions>
                            <Button
                                size="regular"
                                variant="primary"
                                disabled={!!error.submit}
                                onClick={onSubmit}
                            >
                                <FormattedMessage
                                    id="action.continue"
                                    defaultMessage="Continue"
                                />
                            </Button>
                        </Actions>
                    </Column>
                </KeyboardAvoidingView>
            </Screen>

            <Modal
                currentCountryCode={form.countryCode || null}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_country_selected':
                            setModalState({ type: 'closed' })
                            setForm((form) => ({
                                ...form,
                                countryCode: msg.countryCode,
                            }))
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}

const FirstNameErrorMessage = ({ error }: { error: FirstNameError }) => {
    switch (error.type) {
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.first_name_missing"
                    defaultMessage="Required"
                />
            )

        default:
            return notReachable(error)
    }
}

const LastNameErrorMessage = ({ error }: { error: LastNameError }) => {
    switch (error.type) {
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.last_name_missing"
                    defaultMessage="Required"
                />
            )

        default:
            return notReachable(error)
    }
}

const EmailErrorMessage = ({ error }: { error: EmailError }) => {
    switch (error.type) {
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.email_missing"
                    defaultMessage="Required"
                />
            )

        case 'value_is_not_an_email':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.email_invalid"
                    defaultMessage="Invalid email"
                />
            )

        default:
            return notReachable(error)
    }
}
