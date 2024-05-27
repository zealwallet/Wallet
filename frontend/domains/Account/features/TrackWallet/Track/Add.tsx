import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions as UIActions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import {
    LoadableData,
    useLoadableData,
} from '@zeal/toolkit/LoadableData/LoadableData'
import {
    EmptyStringError,
    failure,
    nonEmptyString,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import { AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { fetchENS } from '@zeal/domains/Address/api/fetchENS'
import { format } from '@zeal/domains/Address/helpers/format'
import {
    fromString as parseAddressFromString,
    ValidationError as NotAValidAddress,
} from '@zeal/domains/Address/helpers/fromString'
import { NetworkRPCMap } from '@zeal/domains/Network'

type Props = {
    networkRPCMap: NetworkRPCMap
    initialAddress: Address
    accounts: AccountsMap
    variant: 'track' | 'track_or_create'
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_ens_address_added'; domain: string; address: Address }
    | { type: 'on_address_added'; address: Address }
    | { type: 'on_create_wallet_instead_clicked' }

type Form = LoadableData<string, { domain: string }>

type FormError = {
    address?: EmptyStringError | NotAValidAddress | AccountAlreadyAddedError
    inputButton?:
        | EmptyStringError
        | NotAValidAddress
        | AccountAlreadyAddedError
        | ENSLoading
    submit?:
        | EmptyStringError
        | NotAValidAddress
        | AccountAlreadyAddedError
        | ENSLoading
}

type ENSLoading = { type: 'ens_loading' }

type AccountAlreadyAddedError = { type: 'account_already_added' }

const accountAlreadyAdded = (
    address: Address,
    accounts: AccountsMap
): Result<AccountAlreadyAddedError, Address> => {
    return !accounts[address]
        ? success(address)
        : failure({ type: 'account_already_added' })
}

const validateOnSubmit = (
    form: Form,
    accounts: AccountsMap
): Result<
    FormError,
    | { type: 'address'; address: Address }
    | { type: 'ens'; domain: string; address: Address }
> => {
    switch (form.type) {
        case 'error':
            return shape({
                address: nonEmptyString(form.params.domain)
                    .andThen(parseAddressFromString)
                    .andThen((address) =>
                        accountAlreadyAdded(address, accounts)
                    ),
                inputButton: nonEmptyString(form.params.domain)
                    .andThen(parseAddressFromString)
                    .andThen((address) =>
                        accountAlreadyAdded(address, accounts)
                    ),
                submit: nonEmptyString(form.params.domain)
                    .andThen(parseAddressFromString)
                    .andThen((address) =>
                        accountAlreadyAdded(address, accounts)
                    ),
            }).map(({ address }) => ({ type: 'address', address }))

        case 'loaded':
            return shape({
                address: accountAlreadyAdded(form.data, accounts),
                inputButton: accountAlreadyAdded(form.data, accounts),
                submit: accountAlreadyAdded(form.data, accounts),
            }).map(({ address }) => ({
                type: 'ens',
                address,
                domain: form.params.domain,
            }))

        case 'loading':
            return shape({
                submit: failure({ type: 'ens_loading' } as const),
                inputButton: failure({ type: 'ens_loading' } as const),
            }).map(({ submit }) => ({ type: 'address', address: submit }))

        /* istanbul ignore next */
        default:
            return notReachable(form)
    }
}

const validateAsYouType = (
    form: Form,
    accounts: AccountsMap
): Result<FormError, unknown> => {
    switch (form.type) {
        case 'error':
            return shape({
                address: accountAlreadyAdded(form.params.domain, accounts),
                inputButton: nonEmptyString(form.params.domain)
                    .andThen(parseAddressFromString)
                    .andThen((address) =>
                        accountAlreadyAdded(address, accounts)
                    ),

                submit: nonEmptyString(form.params.domain).andThen((address) =>
                    accountAlreadyAdded(address, accounts)
                ),
            })

        case 'loaded':
            return shape({
                address: accountAlreadyAdded(form.data, accounts),
                inputButton: accountAlreadyAdded(form.data, accounts),
            })

        case 'loading':
            return shape({
                inputButton: failure({ type: 'ens_loading' } as const),
                submit: failure({ type: 'ens_loading' } as const),
            })

        /* istanbul ignore next */
        default:
            return notReachable(form)
    }
}

const AddressErrorMessage = ({ error }: { error: FormError['address'] }) => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'account_already_added':
            return (
                <FormattedMessage
                    id="address.add.accountAlreadyAdded"
                    defaultMessage="Wallet already added"
                />
            )

        case 'value_is_not_a_string':
        case 'string_is_empty':
        case 'not_a_valid_address':
            return (
                <FormattedMessage
                    id="address.add.notCorrectAddressError"
                    defaultMessage="That is not a correct wallet address"
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

// TODO: https://github.com/ethereum/EIPs/blob/master/EIPS/eip-55.md

export const Add = ({
    initialAddress,
    accounts,
    variant,
    networkRPCMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [form, setForm] = useLoadableData(fetchENS, {
        type: 'loading',
        params: { domain: initialAddress, networkRPCMap },
    })
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const formattedAddress = !!parseAddressFromString(
        form.params.domain
    ).getSuccessResult()
        ? format(form.params.domain)
        : form.params.domain

    const addressValue = isFocused ? form.params.domain : formattedAddress
    const error = isSubmitted
        ? validateOnSubmit(form, accounts).getFailureReason()
        : validateAsYouType(form, accounts).getFailureReason()

    const inputState = error?.address ? 'error' : 'normal'

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form, accounts)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success': {
                switch (result.data.type) {
                    case 'ens':
                        onMsg({
                            type: 'on_ens_address_added',
                            address: result.data.address,
                            domain: result.data.domain,
                        })
                        break

                    case 'address':
                        onMsg({
                            type: 'on_address_added',
                            address: result.data.address,
                        })
                        break

                    /* istanbul ignore next */
                    default:
                        notReachable(result.data)
                }
                break
            }

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

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="address.add.header"
                            defaultMessage="See your wallet in Zeal{br}with read-only mode"
                            values={{
                                br: '\n',
                            }}
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="address.add.subheader"
                            defaultMessage="Enter your address or ENS to see your assets on all EVM networks in one place. Create or import more wallets later."
                        />
                    }
                />

                <Column spacing={4}>
                    <Input
                        keyboardType="default"
                        onSubmitEditing={onSubmit}
                        variant="regular"
                        autoFocus
                        value={addressValue}
                        onChange={(e) =>
                            setForm({
                                type: 'loading',
                                params: {
                                    domain: e.nativeEvent.text,
                                    networkRPCMap,
                                },
                            })
                        }
                        state={inputState}
                        message={<AddressErrorMessage error={error?.address} />}
                        sideMessage={null}
                        placeholder={formatMessage({
                            id: 'address.add.placeholder',
                            defaultMessage: '0x address or ENS',
                        })}
                        onBlur={() => {
                            setIsFocused(false)
                        }}
                        onFocus={() => {
                            setIsFocused(true)
                        }}
                        rightIcon={
                            !error?.inputButton ? (
                                <Checkbox size={24} color="iconAccent2" />
                            ) : null
                        }
                    />

                    {(() => {
                        switch (form.type) {
                            case 'loaded':
                                return (
                                    <Group variant="default">
                                        <Text
                                            variant="caption2"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            {form.data}
                                        </Text>
                                    </Group>
                                )

                            case 'loading':
                            case 'error':
                                return null

                            default:
                                return notReachable(form)
                        }
                    })()}
                </Column>
            </Column>

            <Spacer />

            <Actions
                onSubmit={onSubmit}
                variant={variant}
                continueDisabled={!!error?.submit}
                onCreateClicked={() =>
                    onMsg({ type: 'on_create_wallet_instead_clicked' })
                }
            />
        </Screen>
    )
}

export const Actions = ({
    continueDisabled,
    variant,
    onCreateClicked,
    onSubmit,
}: {
    continueDisabled: boolean
    variant: 'track' | 'track_or_create'
    onCreateClicked: () => void
    onSubmit: () => void
}) => {
    switch (variant) {
        case 'track':
            return (
                <UIActions variant="row">
                    <Button
                        size="regular"
                        variant="primary"
                        disabled={continueDisabled}
                        onClick={onSubmit}
                    >
                        <FormattedMessage
                            id="action.continue"
                            defaultMessage="Continue"
                        />
                    </Button>
                </UIActions>
            )
        case 'track_or_create':
            return (
                <UIActions variant="column">
                    <Button
                        size="regular"
                        variant="primary"
                        disabled={continueDisabled}
                        onClick={onSubmit}
                    >
                        <FormattedMessage
                            id="account.track_wallet.previewWalletInReadOnly"
                            defaultMessage="Preview wallet in read-only"
                        />
                    </Button>

                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={onCreateClicked}
                    >
                        <FormattedMessage
                            id="account.track_wallet.create_new_or_import_instead"
                            defaultMessage="Create, Connect or Import Wallet"
                        />
                    </Button>
                </UIActions>
            )

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}
