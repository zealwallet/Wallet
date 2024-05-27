import { useEffect, useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldDelete } from '@zeal/uikit/Icon/BoldDelete'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { IntegerInput } from '@zeal/uikit/Input/IntegerInput'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import {
    LazyLoadableData,
    useLazyLoadableData,
} from '@zeal/toolkit/LoadableData/LazyLoadableData'
import {
    EmptyStringError,
    failure,
    nonEmptyString,
    number,
    Result,
    shape,
    StringValueNotNumberError,
    success,
} from '@zeal/toolkit/Result'

import { Address } from '@zeal/domains/Address'
import { fetchBalanceOf } from '@zeal/domains/Address/api/fetchBalanceOf'
import { fetchContractFraction } from '@zeal/domains/Address/api/fetchContractFraction'
import { fetchContractSymbol } from '@zeal/domains/Address/api/fetchContractSymbol'
import { ValidationError as AddressValidationError } from '@zeal/domains/Address/helpers/fromString'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { initCustomCurrency } from '@zeal/domains/Currency/helpers/initCustomCurrency'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { Name } from '@zeal/domains/Network/components/Name'

type Props = {
    network: Network
    networkRPCMap: NetworkRPCMap
    currency: CryptoCurrency | null
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'custom_currency_delete_click'
          currency: CryptoCurrency
      }
    | {
          type: 'on_custom_currency_updated'
          currency: CryptoCurrency
      }

type Loadable = LazyLoadableData<
    { fraction: number; symbol: string },
    { address: Address }
>

type Form = {
    fraction: number | null
    symbol: string | null
}

const fetch = async ({
    address,
    network,
    networkRPCMap,
}: {
    network: Network
    networkRPCMap: NetworkRPCMap
    address: string
}): Promise<{ fraction: number; symbol: string }> => {
    const [fraction, symbol] = await Promise.all([
        fetchContractFraction({
            contract: address,
            network,
            networkRPCMap,
        }),
        fetchContractSymbol({
            contract: address,
            network,
            networkRPCMap,
        }),
        fetchBalanceOf({
            contract: address,
            network,
            networkRPCMap,
            account: '0x1111111111111111111111111111111111111111',
        }),
    ])
    return {
        fraction,
        symbol,
    }
}

type FormError = {
    address?: AddressValidationError
    submit?:
        | StringValueNotNumberError
        | EmptyStringError
        | AddressValidationError
        | { type: 'should_be_gt_zero' }
        | { type: 'value_is_not_a_number'; value: unknown }
}

const validateAddress = ({
    loadable,
}: {
    loadable: Loadable
}): Result<AddressValidationError, Address> => {
    switch (loadable.type) {
        case 'not_asked':
        case 'loading':
        case 'error':
            return failure({ type: 'not_a_valid_address' })
        case 'loaded':
            return success(loadable.params.address)
        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const validateFraction = (
    fraction: number | null
): Result<
    | { type: 'should_be_gt_zero' }
    | { type: 'value_is_not_a_number'; value: unknown },
    number
> => {
    return number(fraction).andThen((f) => {
        return f > 0
            ? success(f)
            : failure({ type: 'should_be_gt_zero' as const })
    })
}

const validateOnSubmit = ({
    form,
    loadable,
    network,
}: {
    form: Form
    loadable: Loadable
    network: Network
}): Result<FormError, CryptoCurrency> => {
    return shape({
        address: validateAddress({ loadable }),
        symbol: nonEmptyString(form.symbol),
        fraction: validateFraction(form.fraction),
        submit: nonEmptyString(form.symbol)
            .andThen(() => validateFraction(form.fraction))
            .andThen(() => validateAddress({ loadable })),
    }).map(({ address, symbol, fraction }) =>
        initCustomCurrency({
            id: [network.name, address.toLowerCase()].join('|'),
            address,
            symbol,
            fraction,
            networkHexChainId: network.hexChainId,
            icon: null,
        })
    )
}

export const Layout = ({ onMsg, network, networkRPCMap, currency }: Props) => {
    const [isSubmitted, setSubmitted] = useState<boolean>(false)
    const [form, setForm] = useState<Form>(() => ({
        fraction: currency?.fraction || null,
        symbol: currency?.symbol || null,
        id: currency?.id || uuid(),
    }))
    const [loadable, setLoadable] = useLazyLoadableData(
        fetch,
        currency
            ? {
                  type: 'loading' as const,
                  params: {
                      address: currency.address,
                      network,
                      networkRPCMap,
                  },
              }
            : {
                  type: 'not_asked' as const,
              }
    )

    const errors = isSubmitted
        ? validateOnSubmit({
              form,
              loadable,
              network,
          }).getFailureReason() || {}
        : {}

    useEffect(() => {
        switch (loadable.type) {
            case 'not_asked':
            case 'loading':
            case 'error':
                break
            case 'loaded':
                setForm((form) => {
                    return {
                        fraction: form?.fraction ?? loadable.data.fraction,
                        symbol: form?.symbol ?? loadable.data.symbol,
                    }
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(loadable)
        }
    }, [loadable])

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
                right={
                    currency ? (
                        <IconButton
                            variant="on_light"
                            onClick={() =>
                                onMsg({
                                    type: 'custom_currency_delete_click',
                                    currency: currency,
                                })
                            }
                        >
                            {({ color }) => (
                                <BoldDelete size={24} color={color} />
                            )}
                        </IconButton>
                    ) : null
                }
            />
            <Column spacing={16}>
                <Row spacing={16}>
                    <Avatar size={64}>
                        <QuestionCircle size={64} color="iconDefault" />
                    </Avatar>
                    <Column spacing={3}>
                        {form.symbol ? (
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textPrimary"
                            >
                                {form.symbol}
                            </Text>
                        ) : (
                            <Text
                                variant="title3"
                                weight="semi_bold"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="currency.add_currency.add_token"
                                    defaultMessage="Add token"
                                />
                            </Text>
                        )}
                        <Text
                            variant="paragraph"
                            weight="medium"
                            color="textSecondary"
                        >
                            <Name
                                currentNetwork={{
                                    type: 'specific_network',
                                    network,
                                }}
                            />
                        </Text>
                    </Column>
                </Row>
                <Column spacing={16}>
                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.add_currency.token_feild"
                                defaultMessage="Token address"
                            />
                        </Text>
                        <Input
                            keyboardType="default"
                            onSubmitEditing={noop}
                            variant="regular"
                            value={loadable.params?.address || ''}
                            onChange={(e) => {
                                setLoadable({
                                    type: 'loading',
                                    params: {
                                        network,
                                        networkRPCMap,
                                        address: e.nativeEvent.text,
                                    },
                                })
                            }}
                            state={errors.address ? 'error' : 'normal'}
                            message={
                                errors.address ? (
                                    <FormattedMessage
                                        id="currency.add_currency.not_a_valid_address"
                                        defaultMessage="This is not a valid token address"
                                    />
                                ) : null
                            }
                            placeholder="0x0000..0000"
                        />
                    </Column>

                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.add_currency.token_symbol_feild"
                                defaultMessage="Token symbol"
                            />
                        </Text>

                        <Input
                            keyboardType="default"
                            onSubmitEditing={noop}
                            variant="regular"
                            value={form.symbol || ''}
                            onChange={(e) => {
                                setForm({
                                    ...form,
                                    symbol: e.nativeEvent.text,
                                })
                            }}
                            state="normal"
                            placeholder="ETH"
                        />
                    </Column>

                    <Column spacing={8}>
                        <Text
                            variant="paragraph"
                            weight="regular"
                            color="textSecondary"
                        >
                            <FormattedMessage
                                id="currency.add_currency.token_decimals_feild"
                                defaultMessage="Token decimals"
                            />
                        </Text>

                        <IntegerInput
                            integerString={
                                (form.fraction && form.fraction.toString(10)) ||
                                '0'
                            }
                            onChange={(value) => {
                                const num = Number(value)
                                setForm({
                                    ...form,
                                    fraction: Number.isNaN(num) ? null : num,
                                })
                            }}
                        >
                            {({ onChange, value }) => (
                                <Input
                                    keyboardType="number-pad"
                                    variant="regular"
                                    value={value}
                                    onChange={onChange}
                                    onSubmitEditing={noop}
                                    state="normal"
                                    placeholder="18"
                                />
                            )}
                        </IntegerInput>
                    </Column>
                </Column>
            </Column>

            <Spacer />
            <Actions>
                <Button
                    disabled={!!errors.submit}
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        setSubmitted(true)
                        const res = validateOnSubmit({
                            form,
                            loadable,
                            network,
                        })

                        switch (res.type) {
                            case 'Failure':
                                break
                            case 'Success':
                                onMsg({
                                    type: 'on_custom_currency_updated',
                                    currency: res.data,
                                })
                                break
                            /* istanbul ignore next */
                            default:
                                return notReachable(res)
                        }
                    }}
                >
                    {currency ? (
                        <FormattedMessage
                            id="currency.add_currency.update_token"
                            defaultMessage="Update token"
                        />
                    ) : (
                        <FormattedMessage
                            id="currency.add_currency.add_token"
                            defaultMessage="Add token"
                        />
                    )}
                </Button>
            </Actions>
        </Screen>
    )
}
