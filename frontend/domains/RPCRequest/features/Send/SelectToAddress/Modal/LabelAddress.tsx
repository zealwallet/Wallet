import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldSave } from '@zeal/uikit/Icon/BoldSave'
import { Input } from '@zeal/uikit/Input'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { LabelErrorMessage } from '@zeal/domains/Account/domains/Label/components/LabelErrorMessage'
import { MAX_LENGTH } from '@zeal/domains/Account/domains/Label/constants'
import {
    Form,
    validateAsYouType,
    validateOnSubmit,
} from '@zeal/domains/Account/domains/Label/helpers/validator'
import { Address } from '@zeal/domains/Address'
import { TrackOnly } from '@zeal/domains/KeyStore'
type Props = {
    accountsMap: AccountsMap
    address: Address
    onMsg: (msg: Msg) => void
}
type Msg =
    | { type: 'close' }
    | { type: 'on_add_label_skipped'; address: Address }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: TrackOnly
          }[]
      }

export const LabelAddress = ({ accountsMap, address, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [form, setForm] = useState<Form>({ label: '' })
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const accounts = values(accountsMap)

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
                onMsg({
                    type: 'on_account_create_request',
                    accountsWithKeystores: [
                        {
                            account: {
                                address: address,
                                label: result.data.label,
                                avatarSrc: null,
                            },
                            keystore: { id: uuid(), type: 'track_only' },
                        },
                    ],
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
            aria-labelledby="label-address-label"
            aria-describedby="label-address-description"
        >
            <Header
                titleId="label-address-label"
                subtitleId="label-address-description"
                icon={({ size, color }) => (
                    <BoldSave size={size} color={color} />
                )}
                title={
                    <FormattedMessage
                        id="SendERC20.label_address.title"
                        defaultMessage="Label this wallet"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="SendERC20.label_address.subtitle"
                        defaultMessage="Label this wallet so you can find it later."
                    />
                }
            />

            <Popup.Content>
                <Input
                    keyboardType="default"
                    onSubmitEditing={onSubmit}
                    variant="regular"
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
                    placeholder={formatMessage({
                        id: 'SendERC20.label_address.input_placeholder',
                        defaultMessage: 'Wallet label',
                    })}
                />
            </Popup.Content>

            <Popup.Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={() =>
                        onMsg({ type: 'on_add_label_skipped', address })
                    }
                >
                    <FormattedMessage id="actions.skip" defaultMessage="Skip" />
                </Button>

                <Button
                    variant="primary"
                    size="regular"
                    disabled={!!error?.submit}
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
