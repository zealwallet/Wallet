import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldLock } from '@zeal/uikit/Icon/BoldLock'
import { EyeCrossed } from '@zeal/uikit/Icon/EyeCrossed'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    nonEmptyString,
    Result,
    shape,
} from '@zeal/toolkit/Result'

type Props = {
    error: { type: 'password_incorrect' } | null
    subtitle: React.ReactNode
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

const validateOnSubmit = (form: Form): Result<FormError, { submit: string }> =>
    shape({
        submit: nonEmptyString(form.userPassword),
    })

export const Layout = ({ error: submitError, subtitle, onMsg }: Props) => {
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
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="password-check-popup-label"
            aria-describedby="password-check-popup-description"
        >
            <Header
                icon={({ size, color }) => (
                    <BoldLock size={size} color={color} />
                )}
                titleId="password-check-popup-label"
                title={
                    <FormattedMessage
                        id="PasswordCheck.title"
                        defaultMessage="Enter password"
                    />
                }
                subtitle={subtitle}
                subtitleId="password-check-popup-description"
            />

            <Popup.Content>
                <Input
                    keyboardType="default"
                    onSubmitEditing={onSubmit}
                    variant="regular"
                    type={inputType}
                    autoFocus={true}
                    value={form.userPassword}
                    onChange={(e) => {
                        setForm({ userPassword: e.nativeEvent.text })
                    }}
                    state={inputState}
                    placeholder=""
                    message={<Message error={submitError} />}
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
            </Popup.Content>

            <Popup.Actions>
                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="actions.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    onClick={onSubmit}
                    size="regular"
                    variant="primary"
                    disabled={!!error?.submit}
                >
                    <FormattedMessage
                        id="actions.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
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
