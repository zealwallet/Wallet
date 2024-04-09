import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { CheckBox } from '@zeal/uikit/CheckBox'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ShieldEmpty } from '@zeal/uikit/Icon/ShieldEmpty'
import { IconButton } from '@zeal/uikit/IconButton'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { failure, Result, success } from '@zeal/toolkit/Result'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'on_continue_clicked' } | { type: 'close' }

type Form = {
    pointOneConfirmed: boolean
    pointTwoConfirmed: boolean
    pointThreeConfirmed: boolean
}

type ValidationError = {
    pointTwoConfirmed?: 'previous_points_not_confirmed'
    pointThreeConfirmed?: 'previous_points_not_confirmed'

    submit?: 'not_all_points_confirmed'
}

const validate = (form: Form): Result<ValidationError, void> => {
    if (!form.pointOneConfirmed) {
        return failure({
            pointTwoConfirmed: 'previous_points_not_confirmed',
            pointThreeConfirmed: 'previous_points_not_confirmed',
            submit: 'not_all_points_confirmed',
        })
    }

    if (!form.pointTwoConfirmed) {
        return failure({
            pointThreeConfirmed: 'previous_points_not_confirmed',
            submit: 'not_all_points_confirmed',
        })
    }

    if (!form.pointThreeConfirmed) {
        return failure({
            submit: 'not_all_points_confirmed',
        })
    }
    return success(undefined)
}

export const BeforeYouBegin = ({ onMsg }: Props) => {
    const [form, setForm] = useState<Form>({
        pointOneConfirmed: false,
        pointThreeConfirmed: false,
        pointTwoConfirmed: false,
    })

    const validationError = validate(form).getFailureReason() || {}

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
            <Column spacing={24}>
                <Header
                    icon={({ size, color }) => (
                        <ShieldEmpty size={size} color={color} />
                    )}
                    title={
                        <FormattedMessage
                            id="GoogleDriveBackup.BeforeYouBegin.title"
                            defaultMessage="Before you begin"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="GoogleDriveBackup.BeforeYouBegin.subtitle"
                            defaultMessage="Please understand and accept the following point on self-custody:"
                        />
                    }
                />
                <Column spacing={8}>
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="GoogleDriveBackup.BeforeYouBegin.first_point"
                                defaultMessage="If I forget my Zeal password, I’ll lose my assets forever"
                            />
                        }
                        checked={form.pointOneConfirmed}
                        onClick={() =>
                            setForm({ ...form, pointOneConfirmed: true })
                        }
                    />
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="GoogleDriveBackup.BeforeYouBegin.second_point"
                                defaultMessage="If I lose access to my Google Drive or modify my Recovery File, I’ll lose my assets forever"
                            />
                        }
                        disabled={!!validationError.pointTwoConfirmed}
                        checked={form.pointTwoConfirmed}
                        onClick={() => {
                            setForm({
                                ...form,
                                pointTwoConfirmed: true,
                            })
                        }}
                    />
                    <CheckBox
                        title={
                            <FormattedMessage
                                id="GoogleDriveBackup.BeforeYouBegin.third_point"
                                defaultMessage="Zeal can’t help me recover my Zeal password or my access to Google Drive"
                            />
                        }
                        disabled={!!validationError.pointThreeConfirmed}
                        checked={form.pointThreeConfirmed}
                        onClick={() =>
                            setForm({ ...form, pointThreeConfirmed: true })
                        }
                    />
                </Column>
            </Column>
            <Spacer />
            <Actions>
                <Button
                    disabled={!!validationError.submit}
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'on_continue_clicked' })
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
