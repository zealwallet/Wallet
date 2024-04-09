import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { EyeCrossed } from '@zeal/uikit/Icon/EyeCrossed'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    nonEmptyString,
    Result,
    shape,
} from '@zeal/toolkit/Result'

type Props = {
    error: { type: 'password_incorrect' } | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'user_password_submitted'; userPassword: string }
    | { type: 'close' }

type Form = {
    userPassword: string
}

type FormError = {
    submit?: EmptyStringError
}

const validateOnSubmit = (
    form: Form
): Result<FormError, { submit: string }> => {
    return shape({
        submit: nonEmptyString(form.userPassword),
    })
}

export const Layout = ({ error: submitError, onMsg }: Props) => {
    const [form, setForm] = useState<Form>({ userPassword: '' })
    const [inputType, setInputType] = useState<'text' | 'password'>('password')
    const error = validateOnSubmit(form).getFailureReason()
    const inputState = submitError ? 'error' : 'normal'

    const onSubmit = () => {
        const result = validateOnSubmit(form)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'user_password_submitted',
                    userPassword: result.data.submit,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }
    return (
        <Screen background="default" padding="form">
            <ActionBar
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={16}>
                <Header
                    title={
                        <FormattedMessage
                            id="lockScreen.unlock.header"
                            defaultMessage="Unlock"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="lockScreen.unlock.subheader"
                            defaultMessage="Use your password to unlock Zeal"
                        />
                    }
                />
                <Input
                    keyboardType="default"
                    onSubmitEditing={onSubmit}
                    variant="large"
                    type={inputType}
                    autoFocus={true}
                    value={form.userPassword}
                    onChange={(e) => {
                        setForm({ userPassword: e.nativeEvent.text })
                    }}
                    state={inputState}
                    placeholder="Enter password"
                    message={<Message error={submitError} />}
                    rightIcon={(() => {
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
                />
            </Column>
            <Spacer />
            <Actions>
                <Button
                    size="regular"
                    variant="primary"
                    disabled={!!error?.submit}
                    onClick={onSubmit}
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

const Message = ({ error }: { error: Props['error'] }) => {
    if (!error) {
        return null
    }
    switch (error.type) {
        case 'password_incorrect':
            return (
                <FormattedMessage
                    id="lockScreen.passwordIncorrectMessage"
                    defaultMessage="Password is incorrect"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
}
