import React, { useState } from 'react'
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

import { notReachable } from '@zeal/toolkit'
import { nonEmptyString, Result, shape, success } from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { CheckOTPRequest } from '@zeal/domains/Currency/domains/BankTransfer/api/submitOTP'
import { Safe4337 } from '@zeal/domains/KeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    account: Account
    keyStore: Safe4337
    network: Network
    unblockUserId: string
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_otp_submitted'; request: CheckOTPRequest }

type Form = {
    otp?: string
    unblockUserId: string
}

type FormError = {
    otp?: { type: 'string_is_empty' | 'value_is_not_a_string' }
    submit?: { type: 'string_is_empty' | 'value_is_not_a_string' }
}

const validateAsYouType = ({ otp }: Form): Result<FormError, unknown> =>
    shape({
        submit: nonEmptyString(otp),
    })

const validateOnSubmit = ({
    unblockUserId,
    otp,
}: Form): Result<FormError, CheckOTPRequest> => {
    return shape({
        unblockUserId: success(unblockUserId),
        otp: nonEmptyString(otp),
        submit: nonEmptyString(otp),
    })
}

export const OtpForm = ({
    unblockUserId,
    onMsg,
    account,
    keyStore,
    network,
}: Props) => {
    const [form, setForm] = useState<Form>({
        unblockUserId,
    })
    const [isSubmitted, setIsSubmitted] = useState<boolean>()

    const error = isSubmitted
        ? validateOnSubmit(form).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form)

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_otp_submitted',
                    request: result.data,
                })

                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                account={account}
                keystore={keyStore}
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
            <Header
                title={
                    <FormattedMessage
                        id="bank_transfer.otp.header"
                        defaultMessage="Check your email for a one-time code"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="bank_transfer.otp.subtitle"
                        defaultMessage="We've sent a one-time verification code to your registered email"
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
                        id="currency.bank_transfer.otp.otp_input"
                        defaultMessage="OTP"
                    />
                </Text>

                <Input
                    keyboardType="number-pad"
                    onSubmitEditing={onSubmit}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            otp: e.nativeEvent.text,
                        })
                    }
                    state={error.otp ? 'error' : 'normal'}
                    placeholder="xxx-xxx"
                    variant="regular"
                    value={form.otp || ''}
                />
            </Column>
            <Spacer />
            <Actions>
                <Button
                    disabled={!!error.submit}
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onSubmit()
                    }}
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
