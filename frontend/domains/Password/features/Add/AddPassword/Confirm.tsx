import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { EyeCrossed } from '@zeal/uikit/Icon/EyeCrossed'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { failure, Result, shape, success } from '@zeal/toolkit/Result'

import { Check } from './Check'

type Props = {
    password: string
    isPending: boolean
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'password_confirmed'; password: string }

type Form = {
    password: string
}

type PasswordDidNotMatch = {
    type: 'password_did_not_match'
}

type FormError = {
    password?: PasswordDidNotMatch
}

const passwordDidNotMatch = (
    form: Form,
    password: string
): Result<PasswordDidNotMatch, string> => {
    return password === form.password
        ? success(password)
        : failure({
              type: 'password_did_not_match' as const,
          })
}

const validateOnSubmit = (
    form: Form,
    password: string
): Result<FormError, { password: string }> => {
    return shape({
        password: passwordDidNotMatch(form, password),
    })
}

export const Confirm = ({ password, isPending, onMsg }: Props) => {
    const [form, setForm] = useState<Form>({ password: '' })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')

    const error = validateOnSubmit(form, password).getFailureReason()

    const onSubmit = () => {
        const result = validateOnSubmit(form, password)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'password_confirmed',
                    password,
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
                            id="password.confirm.header"
                            defaultMessage="Confirm password"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="password.confirm.subheader"
                            defaultMessage="Enter your password one more time"
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
                    placeholder="Re-enter password"
                >
                    {(() => {
                        switch (inputType) {
                            case 'text':
                                return (
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            setInputType('password')
                                        }}
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
                                        onClick={() => {
                                            setInputType('text')
                                        }}
                                    >
                                        {({ color }) => (
                                            <EyeCrossed
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
                </Input>

                <Column spacing={16}>
                    <Check
                        result={passwordDidNotMatch(form, password)}
                        text={
                            <FormattedMessage
                                id="password.confirm.passwordDidNotMatch"
                                defaultMessage="Passwords must match"
                            />
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
                    disabled={!!error?.password}
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
