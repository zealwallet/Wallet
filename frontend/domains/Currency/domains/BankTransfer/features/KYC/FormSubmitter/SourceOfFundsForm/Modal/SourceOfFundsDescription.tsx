import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Input } from '@zeal/uikit/Input'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { nonEmptyString, Result, shape } from '@zeal/toolkit/Result'

import { SourceOfFundsOther } from '@zeal/domains/Currency/domains/BankTransfer/api/submitUnblockKycApplication'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_source_of_funds_selected'; source: SourceOfFundsOther }
    | { type: 'close' }

type InitialForm = {
    description: string | null
}

type FormErrors = {
    submit?: { type: 'required' }
}

const validateOnSubmit = (
    form: InitialForm
): Result<FormErrors, SourceOfFundsOther> => {
    return shape({
        submit: nonEmptyString(form.description).mapError(() => ({
            type: 'required' as const,
        })),
    }).map(({ submit }) => ({ type: 'other', description: submit }))
}

export const SourceOfFundsDescription = ({ onMsg }: Props) => {
    const [form, setForm] = useState<InitialForm>({ description: null })
    const errors = validateOnSubmit(form).getFailureReason() || {}
    const { formatMessage } = useIntl()

    const onSubmit = () => {
        const result = validateOnSubmit(form)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_source_of_funds_selected',
                    source: result.data,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="bank_transfers.source_of_funds_description.title"
                        defaultMessage="Tell us more about your source of funds"
                    />
                }
            />
            <Popup.Content>
                <Input
                    keyboardType="default"
                    type="multiline"
                    variant="regular"
                    onSubmitEditing={onSubmit}
                    value={form.description ?? ''}
                    state="normal"
                    placeholder={formatMessage({
                        id: 'bank_transfers.source_of_funds_description.placeholder',
                        defaultMessage: 'Describe source of funds...',
                    })}
                    onChange={(e) => {
                        setForm({ description: e.nativeEvent.text })
                    }}
                />
            </Popup.Content>
            <Popup.Actions>
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
            </Popup.Actions>
        </Popup.Layout>
    )
}
