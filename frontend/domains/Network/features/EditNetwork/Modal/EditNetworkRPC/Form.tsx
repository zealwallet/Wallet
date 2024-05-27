import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldNetwork } from '@zeal/uikit/Icon/BoldNetwork'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    nonEmptyString,
    parseHttpOrHttpsUrl,
    Result,
    shape,
    ValueIsNotHttpOrHttpsURL,
} from '@zeal/toolkit/Result'

export type Props = {
    form: NetworkForm
    onMsg: (msg: Msg) => void
}

export type NetworkForm = {
    rpcUrl: string
}

type FormError = {
    rpcUrl?: RPCError
    submit?: RPCError
}

type RPCError = EmptyStringError | ValueIsNotHttpOrHttpsURL

const validateRPCUrl = (input?: string): Result<RPCError, string> =>
    nonEmptyString(input).andThen(parseHttpOrHttpsUrl)

const validateOnSubmit = (form: NetworkForm): Result<FormError, string> =>
    shape({
        rpcUrl: validateRPCUrl(form.rpcUrl),
        submit: validateRPCUrl(form.rpcUrl),
    }).map((result) => result.rpcUrl)

export type Msg =
    | { type: 'close' }
    | { type: 'on_form_change'; form: NetworkForm }
    | { type: 'on_form_submit'; rpcUrl: string }

export const Form = ({ form, onMsg }: Props) => {
    const [submited, setSubmited] = useState<boolean>(false)
    const errors = submited
        ? validateOnSubmit(form).getFailureReason() || {}
        : {}

    const onSubmit = () => {
        setSubmited(true)

        const validation = validateOnSubmit(form)

        switch (validation.type) {
            case 'Failure':
                break

            case 'Success': {
                onMsg({
                    type: 'on_form_submit',
                    rpcUrl: validation.data,
                })
                break
            }

            default:
                notReachable(validation)
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

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="editNetworkRpc.headerTitle"
                            defaultMessage="Custom RPC Node"
                        />
                    }
                    icon={({ color, size }) => (
                        <BoldNetwork size={size} color={color} />
                    )}
                />

                <Column spacing={8}>
                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="editNetworkRpc.rpcNodeUrl"
                                defaultMessage="RPC Node URL"
                            />
                        </Text>

                        <Input
                            keyboardType="url"
                            onSubmitEditing={onSubmit}
                            onChange={(e) =>
                                onMsg({
                                    type: 'on_form_change',
                                    form: {
                                        rpcUrl: e.nativeEvent.text,
                                    },
                                })
                            }
                            spellCheck={false}
                            state={errors?.rpcUrl ? 'error' : 'normal'}
                            placeholder="https://..."
                            variant="regular"
                            value={form.rpcUrl}
                            message={(() => {
                                if (!errors?.rpcUrl) {
                                    return null
                                }
                                switch (errors.rpcUrl.type) {
                                    case 'string_is_empty':
                                    case 'value_is_not_a_string':
                                        return (
                                            <FormattedMessage
                                                id="editNework.rpc_url.cannot_be_empty"
                                                defaultMessage="Required"
                                            />
                                        )
                                    case 'value_is_not_http_or_https_url':
                                        return (
                                            <FormattedMessage
                                                id="editNework.rpc_url.not_a_valid_https_url"
                                                defaultMessage="Must be a valid HTTP(S) URL"
                                            />
                                        )
                                    default:
                                        return notReachable(errors.rpcUrl)
                                }
                            })()}
                        />
                    </Column>
                </Column>
            </Column>
            <Spacer />

            <Actions>
                <Button
                    variant="secondary"
                    size="regular"
                    onClick={(ev) => {
                        ev.preventDefault()
                        onMsg({ type: 'close' })
                    }}
                >
                    <FormattedMessage
                        id="actions.cancel"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    onClick={onSubmit}
                    variant="primary"
                    size="regular"
                    disabled={!!errors?.submit}
                >
                    <FormattedMessage
                        id="actions.save_changes"
                        defaultMessage="Save RPC"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
