import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { LightArrowRight2 } from '@zeal/uikit/Icon/LightArrowRight2'
import { Refresh } from '@zeal/uikit/Icon/Refresh'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { FloatInput } from '@zeal/uikit/Input/FloatInput'
import { Popup } from '@zeal/uikit/Popup'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'
import { Toggle } from '@zeal/uikit/Toggle'

import { noop, notReachable } from '@zeal/toolkit'
import {
    failure,
    required,
    RequiredError,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

import { Currency } from '@zeal/domains/Currency'
import { CryptoMoney } from '@zeal/domains/Money'
import { useFormatTokenBalance2 } from '@zeal/domains/Money/components/FormattedTokenBalances'
import { Network, NetworkRPCMap } from '@zeal/domains/Network'
import { EthSendTransaction } from '@zeal/domains/RPCRequest'
import { ApprovalTransaction } from '@zeal/domains/Transactions/domains/SimulatedTransaction'
import { updateApprovalAmount } from '@zeal/domains/Transactions/domains/SimulatedTransaction/helpers/updateApprovalAmount'

type Props = {
    originalEthSendTransaction: EthSendTransaction
    transaction: ApprovalTransaction
    network: Network
    networkRPCMap: NetworkRPCMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | {
          type: 'close'
      }
    | {
          type: 'on_edit_approval_form_submit'
          updatedEthSendTransaction: EthSendTransaction
      }
    | { type: 'on_spend_limit_info_click' }
    | { type: 'on_high_spend_limit_warning_click' }

type SpendLimit = {
    type: 'limited' | 'unlimited'
    limit: string | null
}

type Form = {
    spendLimit: SpendLimit
}

type SpendLimitError = {
    type: 'limit_too_high'
}

type FormErrors = {
    spendLimit?: SpendLimitError
    submit?: RequiredError
}

const UNLIMITED_VALUE = Number.MAX_SAFE_INTEGER.toString()

const validateLimit = (
    spendLimit: SpendLimit
): Result<SpendLimitError, SpendLimit> => {
    if (!spendLimit) {
        return success(spendLimit)
    }

    switch (spendLimit.type) {
        case 'limited':
            return success(spendLimit)
        case 'unlimited':
            return failure({ type: 'limit_too_high' })
        /* istanbul ignore next */
        default:
            return notReachable(spendLimit.type)
    }
}

const validateAsUserTypes = ({
    form,
}: {
    form: Form
}): Result<FormErrors, unknown> =>
    shape({
        spendLimit: validateLimit(form.spendLimit),
        submit: required(form.spendLimit.limit),
    })

const validateOnSubmit = ({
    form,
    originalEthSendTransaction,
    approvalTransaction,
    currency,
    network,
    networkRPCMap,
}: {
    form: Form
    originalEthSendTransaction: EthSendTransaction
    approvalTransaction: ApprovalTransaction
    currency: Currency
    network: Network
    networkRPCMap: NetworkRPCMap
}): Result<FormErrors, EthSendTransaction> =>
    shape({
        spendLimit: required(form.spendLimit.limit),
    }).map((result) =>
        updateApprovalAmount({
            originalEthSendTransaction,
            approvalTransaction,
            currency,
            newSpendLimit: result.spendLimit,
            network,
            networkRPCMap,
        })
    )

const calculateInitialForm = ({
    transaction,
    format,
}: {
    transaction: ApprovalTransaction
    format: (params: { money: CryptoMoney }) => string | null
}): Form => {
    switch (transaction.amount.type) {
        case 'Limited':
            return {
                spendLimit: {
                    type: 'limited',
                    limit: format({
                        money: transaction.amount.amount,
                    }),
                },
            }
        case 'Unlimited':
            return {
                spendLimit: { type: 'unlimited', limit: UNLIMITED_VALUE },
            }
        /* istanbul ignore next */
        default:
            return notReachable(transaction.amount)
    }
}

export const Layout = ({
    originalEthSendTransaction,
    transaction,
    network,
    networkRPCMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()

    const format = useFormatTokenBalance2()
    const initialForm = calculateInitialForm({
        transaction,
        format,
    })

    const [form, setForm] = useState<Form>(initialForm)
    const currency = transaction.amount.amount.currency

    const errors = validateAsUserTypes({ form }).getFailureReason() || {}

    const isUnlimited = ((): boolean => {
        switch (form.spendLimit.type) {
            case 'limited':
                return false
            case 'unlimited':
                return true
            /* istanbul ignore next */
            default:
                return notReachable(form.spendLimit.type)
        }
    })()

    const onSubmit = () => {
        const result = validateOnSubmit({
            form,
            originalEthSendTransaction,
            approvalTransaction: transaction,
            currency,
            network,
            networkRPCMap,
        })

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_edit_approval_form_submit',
                    updatedEthSendTransaction: result.data,
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
            aria-labelledby="edit-permissions-label"
            variant="screen"
        >
            <Column spacing={24}>
                <Header
                    titleId="edit-permissions-label"
                    title={
                        <FormattedMessage
                            id="approval.spend-limit.edit-modal.title"
                            defaultMessage="Edit permissions"
                        />
                    }
                />
                <Popup.Content>
                    <Column spacing={8}>
                        <Row spacing={4}>
                            <Text
                                id="spend-limit-amount-label"
                                variant="paragraph"
                                weight="regular"
                                color="textSecondary"
                            >
                                <FormattedMessage
                                    id="approval.spend-limit.edit-modal.limit-label"
                                    defaultMessage="Spend limit"
                                />
                            </Text>
                            <IconButton
                                variant="on_light"
                                aria-label={formatMessage({
                                    id: 'approval.spend_limit_info',
                                    defaultMessage: 'What is spend limit?',
                                })}
                                onClick={() =>
                                    onMsg({
                                        type: 'on_spend_limit_info_click',
                                    })
                                }
                            >
                                {({ color }) => (
                                    <InfoCircle size={16} color={color} />
                                )}
                            </IconButton>
                            <Spacer />
                            <Toggle
                                title={
                                    <FormattedMessage
                                        id="approval.spend-limit.edit-modal.set-to-unlimited"
                                        defaultMessage="Set to Unlimited"
                                    />
                                }
                                size="small"
                                checked={isUnlimited}
                                onClick={() =>
                                    setForm(() =>
                                        isUnlimited
                                            ? {
                                                  spendLimit: {
                                                      type: 'limited',
                                                      limit: null,
                                                  },
                                              }
                                            : {
                                                  spendLimit: {
                                                      type: 'unlimited',
                                                      limit: UNLIMITED_VALUE,
                                                  },
                                              }
                                    )
                                }
                            />
                        </Row>
                        {isUnlimited ? (
                            <Input
                                keyboardType="default"
                                aria-labelledby="spend-limit-amount-label"
                                disabled
                                variant="regular"
                                value="Unlimited"
                                onChange={noop}
                                onSubmitEditing={onSubmit}
                                state="normal"
                                message={
                                    <Tertiary
                                        color="warning"
                                        size="small"
                                        onClick={() =>
                                            onMsg({
                                                type: 'on_high_spend_limit_warning_click',
                                            })
                                        }
                                    >
                                        {({
                                            color,
                                            textVariant,
                                            textWeight,
                                        }) => (
                                            <>
                                                <BoldDangerTriangle
                                                    size={14}
                                                    color={color}
                                                />
                                                <Text
                                                    color={color}
                                                    variant={textVariant}
                                                    weight={textWeight}
                                                >
                                                    <FormattedMessage
                                                        id="approval.spend-limit.edit-modal.max-limit-error"
                                                        defaultMessage="Warning, high limit"
                                                    />
                                                </Text>
                                                <LightArrowRight2
                                                    size={14}
                                                    color={color}
                                                />
                                            </>
                                        )}
                                    </Tertiary>
                                }
                                placeholder="Unlimited"
                                sideMessage={
                                    <Tertiary
                                        color="on_light"
                                        size="small"
                                        disabled={
                                            form.spendLimit.limit ===
                                            initialForm.spendLimit.limit
                                        }
                                        onClick={() =>
                                            setForm({
                                                spendLimit:
                                                    initialForm.spendLimit,
                                            })
                                        }
                                    >
                                        {({
                                            color,
                                            textVariant,
                                            textWeight,
                                        }) => (
                                            <>
                                                <Refresh
                                                    size={14}
                                                    color={color}
                                                />
                                                <Text
                                                    color={color}
                                                    variant={textVariant}
                                                    weight={textWeight}
                                                >
                                                    <FormattedMessage
                                                        id="approval.spend-limit.edit-modal.revert"
                                                        defaultMessage="Revert changes"
                                                    />
                                                </Text>
                                            </>
                                        )}
                                    </Tertiary>
                                }
                            />
                        ) : (
                            <FloatInput
                                prefix=""
                                value={form.spendLimit.limit}
                                fraction={currency.fraction}
                                onChange={(value) =>
                                    setForm({
                                        spendLimit: {
                                            type: 'limited',
                                            limit: value,
                                        },
                                    })
                                }
                            >
                                {({ value, onChange }) => (
                                    <Input
                                        keyboardType="numeric"
                                        aria-labelledby="spend-limit-amount-label"
                                        autoFocus
                                        onChange={onChange}
                                        onSubmitEditing={onSubmit}
                                        state="normal"
                                        placeholder="Limit"
                                        variant="regular"
                                        value={value}
                                        sideMessage={
                                            <Tertiary
                                                color="on_light"
                                                size="small"
                                                disabled={
                                                    form.spendLimit ===
                                                    initialForm.spendLimit
                                                }
                                                onClick={() =>
                                                    setForm({
                                                        spendLimit:
                                                            initialForm.spendLimit,
                                                    })
                                                }
                                            >
                                                {({
                                                    color,
                                                    textVariant,
                                                    textWeight,
                                                }) => (
                                                    <>
                                                        <Refresh
                                                            size={14}
                                                            color={color}
                                                        />
                                                        <Text
                                                            color={color}
                                                            variant={
                                                                textVariant
                                                            }
                                                            weight={textWeight}
                                                        >
                                                            <FormattedMessage
                                                                id="approval.spend-limit.edit-modal.revert"
                                                                defaultMessage="Revert changes"
                                                            />
                                                        </Text>
                                                    </>
                                                )}
                                            </Tertiary>
                                        }
                                    />
                                )}
                            </FloatInput>
                        )}
                    </Column>
                </Popup.Content>

                <Popup.Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={(ev) => {
                            ev.preventDefault()
                            onMsg({ type: 'close' })
                        }}
                    >
                        <FormattedMessage
                            id="approval.spend-limit.edit-modal.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>
                    <Button
                        onClick={onSubmit}
                        size="regular"
                        variant="primary"
                        disabled={!!errors.submit}
                    >
                        <FormattedMessage
                            id="approval.spend-limit.edit-modal.submit"
                            defaultMessage="Save changes"
                        />
                    </Button>
                </Popup.Actions>
            </Column>
        </Popup.Layout>
    )
}
