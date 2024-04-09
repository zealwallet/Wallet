import React from 'react'
import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Input } from '@zeal/uikit/Input'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Avatar as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { Label } from '@zeal/domains/Account/domains/Label'
import { LabelErrorMessage } from '@zeal/domains/Account/domains/Label/components/LabelErrorMessage'
import { MAX_LENGTH } from '@zeal/domains/Account/domains/Label/constants'
import {
    validateAsYouType,
    validateOnSubmit,
} from '@zeal/domains/Account/domains/Label/helpers/validator'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    accounts: AccountsMap
    account: Account
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

type Form = {
    label: Label
}

export type Msg =
    | { type: 'on_edit_label_close' }
    | { type: 'on_account_label_change_submit'; label: Label; account: Account }

export const EditLabel = ({ accounts, account, keystore, onMsg }: Props) => {
    const [form, setForm] = useState<Form>({ label: account.label })
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)
    const filteredAccounts = values(accounts).filter(
        (acc) => acc.address !== account.address
    )

    const error = isSubmitted
        ? validateOnSubmit(form, filteredAccounts).getFailureReason()
        : validateAsYouType(form).getFailureReason()

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form, filteredAccounts)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_account_label_change_submit',
                    label: result.data.label,
                    account,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Popup.Layout
            onMsg={(msg) => {
                switch (msg.type) {
                    case 'close':
                        onMsg({ type: 'on_edit_label_close' })
                        break
                    /* istanbul ignore next */
                    default:
                        return notReachable(msg.type)
                }
            }}
        >
            <Header
                icon={() => (
                    <AccountAvatar
                        account={account}
                        size={48}
                        keystore={keystore}
                    />
                )}
                title={
                    <FormattedMessage
                        id="account.label.edit.title"
                        defaultMessage="Edit wallet label"
                    />
                }
            />
            <Popup.Content>
                <Input
                    keyboardType="default"
                    variant="regular"
                    autoFocus
                    value={form.label}
                    onSubmitEditing={onSubmit}
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
            </Popup.Content>
            <Popup.Actions>
                <Button
                    variant="primary"
                    disabled={!!error?.submit}
                    size="regular"
                    onClick={onSubmit}
                >
                    <FormattedMessage id="action.save" defaultMessage="Save" />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
