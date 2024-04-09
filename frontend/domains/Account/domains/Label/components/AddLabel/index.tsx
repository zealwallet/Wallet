import React from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { Label } from '@zeal/domains/Account/domains/Label'
import { MAX_LENGTH } from '@zeal/domains/Account/domains/Label/constants'

import { validateAsYouType, validateOnSubmit } from '../../helpers/validator'
import { LabelErrorMessage } from '../LabelErrorMessage'

type Props = {
    initialLabel: string
    onBackClick: () => void
    onAddLabelSubmitted: (label: string) => void
    accounts: Account[]
}

type Form = {
    label: Label
}

export const AddLabel = ({
    accounts,
    initialLabel,
    onBackClick,
    onAddLabelSubmitted,
}: Props) => {
    const [form, setForm] = useState<Form>({ label: initialLabel })
    const [isSubmitted, setIsSubmitted] = useState<boolean>()

    const error = isSubmitted
        ? validateOnSubmit(form, accounts).getFailureReason()
        : validateAsYouType(form).getFailureReason()

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form, accounts)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onAddLabelSubmitted(form.label)
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <IconButton variant="on_light" onClick={onBackClick}>
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={16} shrink fill>
                <Header
                    title={
                        <FormattedMessage
                            id="account.addLabel.header"
                            defaultMessage="What would you like to call your wallet?"
                        />
                    }
                />

                <Input
                    keyboardType="default"
                    onSubmitEditing={onSubmit}
                    variant="large"
                    autoFocus
                    value={form.label}
                    onChange={(e) => {
                        setForm({
                            label: e.nativeEvent.text.substring(0, MAX_LENGTH),
                        })
                    }}
                    state={!!error?.label ? 'error' : 'normal'}
                    message={<LabelErrorMessage error={error?.label} />}
                    sideMessage={`${form.label.length}/${MAX_LENGTH}`}
                    placeholder="ex. DeFi Main"
                />
            </Column>

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
