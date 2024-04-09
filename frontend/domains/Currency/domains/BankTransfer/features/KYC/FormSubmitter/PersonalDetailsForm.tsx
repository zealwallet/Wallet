import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { DateInput } from '@zeal/uikit/Input/DateInput'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import {
    failure,
    nonEmptyString,
    parseDate,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { PersonalDetails } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'

export type InitialPersonalDetails = {
    firstName: string | null
    lastName: string | null
    dateOfBirth: string | null
}

type FormErrors = {
    dateOfBirth?:
        | { type: 'dob_required' }
        | { type: 'invalid_format' }
        | { type: 'must_be_past_date' }
    submit?:
        | { type: 'first_name_required' }
        | { type: 'last_name_required' }
        | { type: 'dob_required' }
        | { type: 'invalid_format' }
        | { type: 'must_be_past_date' }
}

type Msg =
    | { type: 'on_form_submitted'; completedForm: PersonalDetails }
    | { type: 'on_back_button_clicked' }
    | {
          type: 'close'
      }

type Props = {
    initialPersonalDetails: InitialPersonalDetails
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

const validateAsUserTypes = (
    form: InitialPersonalDetails
): Result<FormErrors, unknown> => {
    return shape({
        firstName: nonEmptyString(form.firstName).mapError(() => ({
            type: 'first_name_required' as const,
        })),
        lastName: nonEmptyString(form.lastName).mapError(() => ({
            type: 'last_name_required' as const,
        })),
        dateOfBirth: nonEmptyString(form.dateOfBirth).mapError(() => ({
            type: 'dob_required' as const,
        })),
    }).mapError(({ firstName, lastName, dateOfBirth }) => {
        return {
            submit: firstName || lastName || dateOfBirth,
        }
    })
}

const DATE_REG_EXP = /^\d\d\d\d-\d\d-\d\d$/

const validateDate = (
    input: string
): Result<
    { type: 'invalid_format' } | { type: 'must_be_past_date' },
    string
> => {
    if (!input.match(DATE_REG_EXP)) {
        return failure({ type: 'invalid_format' as const })
    }

    return parseDate(input)
        .mapError(() => ({
            type: 'invalid_format' as const,
        }))
        .andThen((date) => {
            if (date.valueOf() >= Date.now()) {
                return failure({ type: 'must_be_past_date' as const })
            }
            return success(input)
        })
}

const validateOnSubmit = (
    form: InitialPersonalDetails
): Result<FormErrors, PersonalDetails> => {
    return shape({
        firstName: nonEmptyString(form.firstName).mapError(() => ({
            type: 'first_name_required' as const,
        })),
        lastName: nonEmptyString(form.lastName).mapError(() => ({
            type: 'last_name_required' as const,
        })),
        dateOfBirth: nonEmptyString(form.dateOfBirth)
            .mapError(() => ({
                type: 'dob_required' as const,
            }))
            .andThen((date) => validateDate(date)),
    }).mapError(({ firstName, lastName, dateOfBirth }) => {
        return {
            dateOfBirth,
            submit: firstName || lastName || dateOfBirth,
        }
    })
}

export const PersonalDetailsForm = ({
    initialPersonalDetails,
    account,
    network,
    keyStoreMap,
    onMsg,
}: Props) => {
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const [form, setForm] = useState<InitialPersonalDetails>(
        initialPersonalDetails
    )

    const errors = isSubmitted
        ? validateOnSubmit(form).getFailureReason() || {}
        : validateAsUserTypes(form).getFailureReason() || {}

    const onSubmit = () => {
        setIsSubmitted(true)

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
        <Screen padding="form" background="light">
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
                        onClick={() =>
                            onMsg({ type: 'on_back_button_clicked' })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="bank_transfer.personal_details.title"
                            defaultMessage="Your details"
                        />
                    }
                />

                <Column spacing={8}>
                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="bank_transfer.personal_details.first_name"
                                defaultMessage="First name"
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
                            state="normal"
                            placeholder="Vitalik"
                            variant="regular"
                            value={form.firstName ?? ''}
                        />
                    </Column>
                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="bank_transfer.personal_details.last_name"
                                defaultMessage="Last name"
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
                            state="normal"
                            placeholder="Buterin"
                            variant="regular"
                            value={form.lastName ?? ''}
                        />
                    </Column>
                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="bank_transfer.personal_details.date_of_birth"
                                defaultMessage="Date of birth"
                            />
                        </Text>

                        <DateInput
                            value={form.dateOfBirth}
                            onChange={(value) => {
                                setForm({
                                    ...form,
                                    dateOfBirth: value,
                                })
                            }}
                        >
                            {({ value, onChange }) => (
                                <Input
                                    keyboardType="number-pad"
                                    onSubmitEditing={onSubmit}
                                    onChange={onChange}
                                    placeholder="YYYY-MM-DD"
                                    variant="regular"
                                    state={
                                        !!errors?.dateOfBirth
                                            ? 'error'
                                            : 'normal'
                                    }
                                    message={
                                        errors?.dateOfBirth && (
                                            <DateMessage
                                                error={errors.dateOfBirth}
                                            />
                                        )
                                    }
                                    value={value}
                                />
                            )}
                        </DateInput>
                    </Column>
                </Column>
            </Column>

            <Spacer />

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
        </Screen>
    )
}

const DateMessage = ({
    error,
}: {
    error: NonNullable<FormErrors['dateOfBirth']>
}) => {
    switch (error.type) {
        case 'dob_required':
            return null
        case 'invalid_format':
            // TODO:: intentionally same will wait for feedback
            return (
                <FormattedMessage
                    id="bank_transfer.personal_details.date_of_birth.invalid_format"
                    defaultMessage="Date is invalid"
                />
            )
        case 'must_be_past_date':
            return (
                <FormattedMessage
                    id="bank_transfer.personal_details.date_of_birth.invalid_format"
                    defaultMessage="Date is invalid"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
