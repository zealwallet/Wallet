import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit/notReachable'
import {
    EmptyStringError,
    failure,
    nonEmptyString,
    required,
    RequiredError,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_form_submitted'; bankVerificationNumber: string }

type Form = {
    bankVerificationNumber?: string
}

type FormError = {
    bankVerificationNumber?: BankVerificationNumberError
    submit?: RequiredError
}

const validateAsYouType = (form: Form): Result<FormError, unknown> =>
    shape({
        submit: required(form.bankVerificationNumber),
    })

const validateOnSubmit = (form: Form): Result<FormError, string> =>
    shape({
        bankVerificationNumber: required(form.bankVerificationNumber).andThen(
            (value) => validateBankVerificationNumber(value)
        ),
        submit: required(form.bankVerificationNumber),
    }).map((validForm) => validForm.bankVerificationNumber)

const validateBankVerificationNumber = (
    value: unknown
): Result<BankVerificationNumberError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{11}$/)
            ? success(str)
            : failure({
                  type: 'invalid_bank_verification_number',
                  value: str,
              })
    )

type BankVerificationNumberError =
    | RequiredError
    | EmptyStringError
    | { type: 'invalid_bank_verification_number' }

export const Form = ({ onMsg, account, network, keyStoreMap }: Props) => {
    const [form, setForm] = useState<Form>({})
    const [submitted, setSubmitted] = useState<boolean>(false)

    const errors = submitted
        ? validateOnSubmit(form).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    const onSubmit = () => {
        setSubmitted(true)

        const result = validateOnSubmit(form)

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_form_submitted',
                    bankVerificationNumber: result.data,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Screen padding="form" background="light">
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                network={network}
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="currency.bank_transfer.add_user_bvn.title"
                            defaultMessage="Add bank verification number"
                        />
                    }
                />
                <Column spacing={8}>
                    <Text
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="currency.bank_transfer.add_user_bvn.bvn_label"
                            defaultMessage="Bank verification number (BVN)"
                        />
                    </Text>

                    <Input
                        keyboardType="number-pad"
                        onSubmitEditing={onSubmit}
                        onChange={(e) =>
                            setForm({
                                bankVerificationNumber: e.nativeEvent.text,
                            })
                        }
                        state={
                            errors.bankVerificationNumber ? 'error' : 'normal'
                        }
                        placeholder="98765432345"
                        variant="regular"
                        value={form.bankVerificationNumber || ''}
                        message={
                            errors.bankVerificationNumber && (
                                <BankVerificationNumberErrorMessage
                                    error={errors.bankVerificationNumber}
                                />
                            )
                        }
                    />
                </Column>
            </Column>

            <Spacer />

            <Actions>
                <Button
                    onClick={onSubmit}
                    size="regular"
                    variant="primary"
                    disabled={!!errors.submit}
                >
                    <FormattedMessage
                        id="action.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}

const BankVerificationNumberErrorMessage = ({
    error,
}: {
    error: BankVerificationNumberError
}) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.add_user_bvn.bank_verification_number_required"
                    defaultMessage="Required"
                />
            )

        case 'invalid_bank_verification_number':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.add_user_bvn.invalid_bank_verification_number"
                    defaultMessage="Invalid bank verification number"
                />
            )

        default:
            return notReachable(error)
    }
}
