import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { OutlineStatusEyeClosed } from '@zeal/uikit/Icon/OutlineStatusEyeClosed'
import { IconButton } from '@zeal/uikit/IconButton'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'
import { TextButton } from '@zeal/uikit/TextButton'

import { notReachable } from '@zeal/toolkit'
import { MinStringLengthError, Result, shape } from '@zeal/toolkit/Result'
import { openExternalURL } from '@zeal/toolkit/Window'

import { Address } from '@zeal/domains/Address'
import {
    ZEAL_PRIVACY_POLICY_URL,
    ZEAL_TERMS_OF_USE_URL,
} from '@zeal/domains/Main/constants'
import {
    includeLowerAndUppercase,
    includesNumberOrSpecialChar,
    ShouldContainLowerAndUpperCase,
    ShouldContainNumberOrSpecialChar,
    shouldContainsMinChars,
} from '@zeal/domains/Password'

import { Check } from './Check'

type Props = {
    initialPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'password_added'; password: string } | { type: 'close' }

type Form = {
    password: string
}

type FormError = {
    password?:
        | MinStringLengthError
        | ShouldContainNumberOrSpecialChar
        | ShouldContainLowerAndUpperCase
    minLength?: MinStringLengthError
    numsAndSpecialChars?: ShouldContainNumberOrSpecialChar
    upperAndLowCase?: ShouldContainLowerAndUpperCase
}

const validateOnSubmit = (
    form: Form
): Result<FormError, { password: Address }> => {
    return shape({
        password: shouldContainsMinChars(form.password)
            .andThen(includeLowerAndUppercase)
            .andThen(includesNumberOrSpecialChar),
        minLength: shouldContainsMinChars(form.password),
        numsAndSpecialChars: includesNumberOrSpecialChar(form.password),
        upperAndLowCase: includeLowerAndUppercase(form.password),
    })
}

export const AddForm = ({ initialPassword, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [form, setForm] = useState<Form>({ password: initialPassword })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')

    const error = validateOnSubmit(form).getFailureReason()

    const onSubmit = () => {
        const result = validateOnSubmit(form)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'password_added',
                    password: result.data.password,
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
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={16}>
                <Header
                    icon={({ size, color }) => (
                        <BoldLock size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="password.add.header"
                            defaultMessage="Create password"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="password.add.subheader"
                            defaultMessage="You’ll use your password to unlock Zeal"
                        />
                    }
                />

                <Input
                    keyboardType="default"
                    onSubmitEditing={onSubmit}
                    variant="regular"
                    type={inputType}
                    autoFocus={true}
                    value={form.password}
                    onChange={(e) => {
                        setForm({ password: e.nativeEvent.text })
                    }}
                    state="normal"
                    sideMessage={null}
                    placeholder={formatMessage({
                        id: 'password.add.inputPlaceholder',
                        defaultMessage: 'Create password',
                    })}
                    rightIcon={(() => {
                        switch (inputType) {
                            case 'text':
                                return (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => setInputType('password')}
                                    >
                                        {({ color }) => (
                                            <BoldEye color={color} size={24} />
                                        )}
                                    </IconButton>
                                )
                            case 'password':
                                return (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => setInputType('text')}
                                    >
                                        {({ color }) => (
                                            <OutlineStatusEyeClosed
                                                color={color}
                                                size={24}
                                            />
                                        )}
                                    </IconButton>
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(inputType)
                        }
                    })()}
                />

                <Column spacing={16}>
                    <Check
                        result={includeLowerAndUppercase(form.password)}
                        text={
                            <FormattedMessage
                                id="password.add.includeLowerAndUppercase"
                                defaultMessage="Lower and upper case letters"
                            />
                        }
                    />
                    <Check
                        result={includesNumberOrSpecialChar(form.password)}
                        text={
                            <FormattedMessage
                                id="password.add.includesNumberOrSpecialChar"
                                defaultMessage="One number or symbol"
                            />
                        }
                    />
                    <Check
                        result={shouldContainsMinChars(form.password)}
                        text={
                            <FormattedMessage
                                id="password.add.shouldContainsMinCharsCheck"
                                defaultMessage="10+ characters"
                            />
                        }
                    />
                </Column>
            </Column>

            <Spacer />

            <Column spacing={24}>
                <InfoCard
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="password.add.info.title"
                            defaultMessage="Your password stays in this device"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="password.add.info.subtitle"
                            defaultMessage="We don’t send your password to our servers or back it up for you"
                        />
                    }
                />

                <Button
                    onClick={onSubmit}
                    size="regular"
                    variant="primary"
                    disabled={!!error?.password}
                >
                    <FormattedMessage
                        id="action.continue"
                        defaultMessage="Continue"
                    />
                </Button>
                <Row spacing={0} alignX="center">
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="password.add.info.t_and_c"
                            defaultMessage="By using Zeal you accept our <Terms>Terms</Terms> and <PrivacyPolicy>Privacy Policy</PrivacyPolicy>"
                            values={{
                                Terms: (message) => (
                                    <TextButton
                                        onClick={() =>
                                            openExternalURL(
                                                ZEAL_TERMS_OF_USE_URL
                                            )
                                        }
                                    >
                                        {message}
                                    </TextButton>
                                ),
                                PrivacyPolicy: (message) => (
                                    <TextButton
                                        onClick={() => {
                                            openExternalURL(
                                                ZEAL_PRIVACY_POLICY_URL
                                            )
                                        }}
                                    >
                                        {message}
                                    </TextButton>
                                ),
                            }}
                        />
                    </Text>
                </Row>
            </Column>
        </Screen>
    )
}
