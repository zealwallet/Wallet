import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { ArrowDown } from '@zeal/uikit/Icon/ArrowDown'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { QuestionCircle } from '@zeal/uikit/Icon/QuestionCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { InputButton } from '@zeal/uikit/InputButton'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import {
    EmptyStringError,
    failure,
    nonEmptyString,
    required,
    RequiredError,
    Result,
    shape,
    string,
    success,
} from '@zeal/toolkit/Result'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { COUNTRIES_MAP, Country, CountryISOCode } from '@zeal/domains/Country'
import { Avatar as CountryIcon } from '@zeal/domains/Country/components/Avatar'
import { FiatCurrency } from '@zeal/domains/Currency'
import { CreateOffRampAccountRequest } from '@zeal/domains/Currency/domains/BankTransfer/api/createOffRampAccount'
import { UnblockLoginInfo } from '@zeal/domains/Currency/domains/BankTransfer/api/loginToUnblock'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'
import { BankTransferUnblockUserCreated } from '@zeal/domains/Storage'

import { Modal, State as ModalState } from './Modal'

type Props = {
    currency: FiatCurrency
    account: Account
    keyStoreMap: KeyStoreMap
    network: Network
    loginInfo: UnblockLoginInfo
    bankTransferInfo: BankTransferUnblockUserCreated
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'form_submitted'; form: CreateOffRampAccountRequest }

type InitialForm = {
    country?: Country
    bankDetails?: BankDetailsInput
}

type BankDetailsInput =
    | {
          type: 'uk'
          accountNumber?: string
          sortCode?: string
      }
    | { type: 'iban'; iban?: string }
    | {
          type: 'ngn'
          accountNumber?: string
          bankCode?: string
          bankVerificationNumber?: string
      }

type FormErrors = {
    accountNumber?: AccountNumberError
    sortCode?: SortCodeError
    iban?: IBANError
    bankCode?: BankCodeError
    bankVerificationNumber?: BankVerificationNumberError

    submit?: RequiredError
}

type AccountNumberError =
    | RequiredError
    | UKBankAccountNumberStringError
    | NgnBankAccountNumberStringError

type SortCodeError = RequiredError | UKBankSortCodeStringError

type IBANError = RequiredError | IBANStringError

type BankCodeError = RequiredError | NgnBankCodeStringError

type BankVerificationNumberError =
    | RequiredError
    | NgnBankVerificationNumberStringError

const validateAsYouType = (form: InitialForm): Result<FormErrors, unknown> => {
    return shape({
        submit: required(form.country).andThen(() =>
            required(form.bankDetails)
        ),
    })
}

const validateOnSubmit = (
    form: InitialForm,
    currency: FiatCurrency,
    loginInfo: UnblockLoginInfo
): Result<FormErrors, CreateOffRampAccountRequest> => {
    return shape({
        country: required(form.country),
        bankDetails: required(form.bankDetails),

        accountNumber: validateAccountNumber(form),
        sortCode: validateSortCode(form),
        iban: validateIBAN(form),
        bankCode: validateBankCode(form),
        bankVerificationNumber: validateBankVerificationNumber(form),

        submit: required(form.bankDetails),
    }).map((validForm) => {
        switch (validForm.submit.type) {
            case 'uk':
                return {
                    ...loginInfo,
                    country: validForm.country,
                    currency,
                    bankDetails: {
                        type: 'uk',
                        accountNumber: validForm.accountNumber,
                        sortCode: validForm.sortCode,
                    },
                }

            case 'iban':
                return {
                    ...loginInfo,
                    country: validForm.country,
                    currency,
                    bankDetails: {
                        type: 'iban',
                        iban: validForm.iban,
                    },
                }

            case 'ngn':
                return {
                    ...loginInfo,
                    country: validForm.country,
                    currency,
                    bankDetails: {
                        type: 'ngn',
                        accountNumber: validForm.accountNumber,
                        bankCode: validForm.bankCode,
                        bankVerificationNumber:
                            validForm.bankVerificationNumber,
                    },
                }

            default:
                return notReachable(validForm.submit)
        }
    })
}

const validateAccountNumber = (
    form: InitialForm
): Result<AccountNumberError, string> => {
    return required(form.bankDetails).andThen(
        (bankDetails): Result<AccountNumberError, string> => {
            switch (bankDetails.type) {
                case 'uk':
                    return ukBankAccountNumberString(bankDetails.accountNumber)

                case 'ngn':
                    return ngnBankAccountNumberString(bankDetails.accountNumber)

                case 'iban':
                    return success('')

                default:
                    return notReachable(bankDetails)
            }
        }
    )
}

const validateBankCode = (form: InitialForm): Result<BankCodeError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'ngn':
                return ngnBankCodeString(bankDetails.bankCode)

            case 'uk':
            case 'iban':
                return success('')

            default:
                return notReachable(bankDetails)
        }
    })
}

const validateSortCode = (form: InitialForm): Result<SortCodeError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'uk':
                return ukBankSortCodeString(bankDetails.sortCode)

            case 'iban':
            case 'ngn':
                return success('')

            default:
                return notReachable(bankDetails)
        }
    })
}

const validateIBAN = (form: InitialForm): Result<IBANError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'uk':
            case 'ngn':
                return success('')

            case 'iban':
                return ibanString(bankDetails.iban)

            default:
                return notReachable(bankDetails)
        }
    })
}

const validateBankVerificationNumber = (
    form: InitialForm
): Result<BankVerificationNumberError, string> => {
    return required(form.bankDetails).andThen((bankDetails) => {
        switch (bankDetails.type) {
            case 'ngn':
                return ngnBankVerificationNumberString(
                    bankDetails.bankVerificationNumber
                )

            case 'uk':
            case 'iban':
                return success('')

            default:
                return notReachable(bankDetails)
        }
    })
}

const changeCountry = (
    country: Country,
    form: InitialForm,
    currency: FiatCurrency
): InitialForm => {
    const newBankDetails = defaultBankDetails(country.code, currency)

    return {
        country,
        bankDetails:
            form.bankDetails?.type === newBankDetails?.type
                ? form.bankDetails
                : newBankDetails,
    }
}

const calculateInitialForm = (
    bankTransferInfo: BankTransferUnblockUserCreated,
    currency: FiatCurrency
): InitialForm => {
    const countryCode =
        bankTransferInfo.countryCode ||
        defaultCountryForCurrency(currency)?.code

    if (!countryCode) {
        return {}
    }

    return {
        country: COUNTRIES_MAP[countryCode],
        bankDetails: defaultBankDetails(countryCode, currency),
    }
}

const defaultCountryForCurrency = (currency: FiatCurrency): Country | null => {
    switch (currency.code) {
        case 'GBP':
            return COUNTRIES_MAP.GB
        case 'NGN':
            return COUNTRIES_MAP.NG

        default:
            return null
    }
}

const defaultBankDetails = (
    countryCode: CountryISOCode,
    currency: FiatCurrency
): InitialForm['bankDetails'] => {
    switch (countryCode) {
        case 'GB':
            if (currency.code === 'GBP') {
                return {
                    type: 'uk',
                }
            }
            return {
                type: 'iban',
            }
        case 'NG':
            if (currency.code === 'NGN') {
                return {
                    type: 'ngn',
                }
            }
            return {
                type: 'iban',
            }

        default:
            return {
                type: 'iban',
            }
    }
}

const parsedSortCode = (newValue: string, bankDetails: BankDetailsInput) => {
    switch (bankDetails.type) {
        case 'uk':
            return newValue.replace(/[^0-9]/g, '').substring(0, 6)

        case 'iban':
        case 'ngn':
            throw new ImperativeError('IBAN does not have a sort code')

        default:
            notReachable(bankDetails)
    }
}

const formattedSortCode = (sortCode: string | undefined) => {
    if (!sortCode) {
        return ''
    }

    const parts = sortCode.match(/.{1,2}/g) || []
    return parts.join('-')
}

// TODO Check if parts of this can be reused (see SetupOfframpBankAccount/Form/index.tsx)
export const Form = ({
    currency,
    bankTransferInfo,
    loginInfo,
    account,
    keyStoreMap,
    network,
    onMsg,
}: Props) => {
    const [form, setForm] = useState<InitialForm>(() =>
        calculateInitialForm(bankTransferInfo, currency)
    )

    const [modalState, setModalState] = useState<ModalState>({ type: 'closed' })

    const [isSubmitted, setIsSubmitted] = useState<boolean>(false)

    const error = isSubmitted
        ? validateOnSubmit(form, currency, loginInfo).getFailureReason() || {}
        : validateAsYouType(form).getFailureReason() || {}

    const onSubmit = () => {
        setIsSubmitted(true)
        const result = validateOnSubmit(form, currency, loginInfo)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'form_submitted',
                    form: result.data,
                })

                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <>
            <Screen
                background="light"
                padding="form"
                onNavigateBack={() => onMsg({ type: 'close' })}
            >
                <ActionBar
                    account={account}
                    keystore={getKeyStore({
                        keyStoreMap,
                        address: account.address,
                    })}
                    network={network}
                    left={
                        <IconButton
                            variant="on_light"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            {({ color }) => (
                                <BackIcon size={24} color={color} />
                            )}
                        </IconButton>
                    }
                />
                <Column spacing={8} fill>
                    <Column spacing={24} fill>
                        <Header
                            title={
                                <FormattedMessage
                                    id="currency.bank_transfer.create_unblock_withdraw_account.title"
                                    defaultMessage="Add {currencyCode} bank account"
                                    values={{
                                        currencyCode: currency.code,
                                    }}
                                />
                            }
                        />
                        <ScrollContainer>
                            <Column spacing={8} fill>
                                <Column spacing={8}>
                                    <Text
                                        variant="paragraph"
                                        weight="regular"
                                        color="textSecondary"
                                    >
                                        <FormattedMessage
                                            id="currency.bank_transfer.create_unblock_withdraw_account.bank_country"
                                            defaultMessage="Bank country"
                                        />
                                    </Text>

                                    <InputButton
                                        disabled={currency.code === 'NGN'}
                                        leftIcon={
                                            form.country ? (
                                                <CountryIcon
                                                    countryCode={
                                                        form.country.code
                                                    }
                                                    size={28}
                                                />
                                            ) : (
                                                <QuestionCircle
                                                    size={28}
                                                    color="iconDefault"
                                                />
                                            )
                                        }
                                        rightIcon={
                                            <ArrowDown
                                                color="iconDisabled"
                                                size={24}
                                            />
                                        }
                                        onClick={() => {
                                            setModalState({
                                                type: 'select_country',
                                            })
                                        }}
                                    >
                                        {form.country?.name || (
                                            <FormattedMessage
                                                id="bank_transfer.create_bank_accounts.country_placeholder"
                                                defaultMessage="Country"
                                            />
                                        )}
                                    </InputButton>
                                </Column>

                                {form.bankDetails?.type === 'uk' && (
                                    <Column spacing={8}>
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="currency.bank_transfer.create_unblock_withdraw_account.account_number"
                                                defaultMessage="Account number"
                                            />
                                        </Text>

                                        <Input
                                            keyboardType="number-pad"
                                            onSubmitEditing={onSubmit}
                                            onChange={(e) =>
                                                setForm((form) => ({
                                                    ...form,
                                                    bankDetails:
                                                        form.bankDetails && {
                                                            ...form.bankDetails,
                                                            accountNumber:
                                                                e.nativeEvent
                                                                    .text,
                                                        },
                                                }))
                                            }
                                            state={
                                                error.accountNumber
                                                    ? 'error'
                                                    : 'normal'
                                            }
                                            placeholder="00000000"
                                            variant="regular"
                                            value={
                                                form.bankDetails
                                                    .accountNumber || ''
                                            }
                                            message={
                                                error.accountNumber && (
                                                    <AccountNumberErrorMessage
                                                        error={
                                                            error.accountNumber
                                                        }
                                                    />
                                                )
                                            }
                                        />
                                    </Column>
                                )}

                                {form.bankDetails?.type === 'uk' && (
                                    <Column spacing={8}>
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="currency.bank_transfer.create_unblock_withdraw_account.sort_code"
                                                defaultMessage="Sort code"
                                            />
                                        </Text>

                                        <Input
                                            keyboardType="number-pad"
                                            onSubmitEditing={onSubmit}
                                            onChange={(e) =>
                                                setForm((form) => ({
                                                    ...form,
                                                    bankDetails:
                                                        form.bankDetails && {
                                                            ...form.bankDetails,
                                                            sortCode:
                                                                parsedSortCode(
                                                                    e
                                                                        .nativeEvent
                                                                        .text,
                                                                    form.bankDetails
                                                                ),
                                                        },
                                                }))
                                            }
                                            state={
                                                error.sortCode
                                                    ? 'error'
                                                    : 'normal'
                                            }
                                            placeholder="00-00-00"
                                            variant="regular"
                                            value={formattedSortCode(
                                                form.bankDetails.sortCode
                                            )}
                                            message={
                                                error.sortCode && (
                                                    <SortCodeErrorMessage
                                                        error={error.sortCode}
                                                    />
                                                )
                                            }
                                        />
                                    </Column>
                                )}

                                {form.bankDetails?.type === 'ngn' && (
                                    <Column spacing={8}>
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="currency.bank_transfer.create_unblock_withdraw_account.account_number"
                                                defaultMessage="Account number"
                                            />
                                        </Text>

                                        <Input
                                            keyboardType="number-pad"
                                            onSubmitEditing={onSubmit}
                                            onChange={(e) =>
                                                setForm((form) => ({
                                                    ...form,
                                                    bankDetails:
                                                        form.bankDetails && {
                                                            ...form.bankDetails,
                                                            accountNumber:
                                                                e.nativeEvent
                                                                    .text,
                                                        },
                                                }))
                                            }
                                            state={
                                                error.accountNumber
                                                    ? 'error'
                                                    : 'normal'
                                            }
                                            placeholder="0000000000"
                                            variant="regular"
                                            value={(() => {
                                                switch (
                                                    form.bankDetails?.type
                                                ) {
                                                    case 'ngn':
                                                        return (
                                                            form.bankDetails
                                                                .accountNumber ||
                                                            ''
                                                        )

                                                    default:
                                                        return ''
                                                }
                                            })()}
                                            message={
                                                error.accountNumber && (
                                                    <AccountNumberErrorMessage
                                                        error={
                                                            error.accountNumber
                                                        }
                                                    />
                                                )
                                            }
                                        />
                                    </Column>
                                )}

                                {form.bankDetails?.type === 'ngn' && (
                                    <>
                                        <Column spacing={8}>
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textSecondary"
                                            >
                                                <FormattedMessage
                                                    id="currency.bank_transfer.create_unblock_withdraw_account.bank_code"
                                                    defaultMessage="Bank code"
                                                />
                                            </Text>

                                            <Input
                                                keyboardType="number-pad"
                                                onSubmitEditing={onSubmit}
                                                onChange={(e) =>
                                                    setForm((form) => ({
                                                        ...form,
                                                        bankDetails:
                                                            form.bankDetails && {
                                                                ...form.bankDetails,
                                                                bankCode:
                                                                    e
                                                                        .nativeEvent
                                                                        .text,
                                                            },
                                                    }))
                                                }
                                                state={
                                                    error.bankCode
                                                        ? 'error'
                                                        : 'normal'
                                                }
                                                placeholder="101"
                                                variant="regular"
                                                value={(() => {
                                                    switch (
                                                        form.bankDetails?.type
                                                    ) {
                                                        case 'ngn':
                                                            return (
                                                                form.bankDetails
                                                                    .bankCode ||
                                                                ''
                                                            )

                                                        default:
                                                            return ''
                                                    }
                                                })()}
                                                message={
                                                    error.bankCode && (
                                                        <BankCodeErrorMessage
                                                            error={
                                                                error.bankCode
                                                            }
                                                        />
                                                    )
                                                }
                                            />
                                        </Column>
                                        <Column spacing={8}>
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textSecondary"
                                            >
                                                <FormattedMessage
                                                    id="currency.bank_transfer.create_unblock_withdraw_account.bvn"
                                                    defaultMessage="Bank verification number (BVN)"
                                                />
                                            </Text>

                                            <Input
                                                keyboardType="number-pad"
                                                onSubmitEditing={onSubmit}
                                                onChange={(e) =>
                                                    setForm((form) => ({
                                                        ...form,
                                                        bankDetails:
                                                            form.bankDetails && {
                                                                ...form.bankDetails,
                                                                bankVerificationNumber:
                                                                    e
                                                                        .nativeEvent
                                                                        .text,
                                                            },
                                                    }))
                                                }
                                                state={
                                                    error.bankVerificationNumber
                                                        ? 'error'
                                                        : 'normal'
                                                }
                                                placeholder="98765432345"
                                                variant="regular"
                                                value={(() => {
                                                    switch (
                                                        form.bankDetails?.type
                                                    ) {
                                                        case 'ngn':
                                                            return (
                                                                form.bankDetails
                                                                    .bankVerificationNumber ||
                                                                ''
                                                            )

                                                        default:
                                                            return ''
                                                    }
                                                })()}
                                                message={
                                                    error.bankVerificationNumber && (
                                                        <BankVerificationNumberErrorMessage
                                                            error={
                                                                error.bankVerificationNumber
                                                            }
                                                        />
                                                    )
                                                }
                                            />
                                        </Column>
                                    </>
                                )}

                                {form.bankDetails?.type === 'iban' && (
                                    <Column spacing={8}>
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textSecondary"
                                        >
                                            <FormattedMessage
                                                id="currency.bank_transfer.create_unblock_withdraw_account.iban"
                                                defaultMessage="IBAN"
                                            />
                                        </Text>

                                        <Input
                                            keyboardType="default"
                                            onSubmitEditing={onSubmit}
                                            onChange={(e) =>
                                                setForm((form) => ({
                                                    ...form,
                                                    bankDetails:
                                                        form.bankDetails && {
                                                            ...form.bankDetails,
                                                            iban: e.nativeEvent
                                                                .text,
                                                        },
                                                }))
                                            }
                                            state={
                                                error.iban ? 'error' : 'normal'
                                            }
                                            placeholder={`${form.country?.code}0000000000000000`}
                                            variant="regular"
                                            value={form.bankDetails.iban || ''}
                                            message={
                                                error.iban && (
                                                    <IBANErrorMessage
                                                        error={error.iban}
                                                    />
                                                )
                                            }
                                        />
                                    </Column>
                                )}
                            </Column>
                        </ScrollContainer>
                    </Column>

                    <Actions>
                        <Button
                            size="regular"
                            variant="primary"
                            disabled={!!error.submit}
                            onClick={onSubmit}
                        >
                            <FormattedMessage
                                id="action.continue"
                                defaultMessage="Continue"
                            />
                        </Button>
                    </Actions>
                </Column>
            </Screen>

            <Modal
                currentCountryCode={form.country?.code || null}
                state={modalState}
                onMsg={(msg) => {
                    switch (msg.type) {
                        case 'close':
                            setModalState({ type: 'closed' })
                            break

                        case 'on_country_selected':
                            setModalState({ type: 'closed' })
                            setForm((form) =>
                                changeCountry(
                                    COUNTRIES_MAP[msg.countryCode],
                                    form,
                                    currency
                                )
                            )
                            break

                        /* istanbul ignore next */
                        default:
                            return notReachable(msg)
                    }
                }}
            />
        </>
    )
}

const AccountNumberErrorMessage = ({
    error,
}: {
    error: AccountNumberError
}) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.account_number_missing"
                    defaultMessage="Required"
                />
            )

        case 'uk_bank_account_number_invalid':
        case 'ngn_bank_account_number_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.account_number_invalid"
                    defaultMessage="Invalid account number"
                />
            )

        default:
            return notReachable(error)
    }
}

const BankVerificationNumberErrorMessage = ({
    error,
}: {
    error: BankVerificationNumberError
}) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.bank_verification_number_missing"
                    defaultMessage="Required"
                />
            )

        case 'ngn_bank_verification_number_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.bank_verification_number_invalid"
                    defaultMessage="Invalid bank verification number"
                />
            )

        default:
            return notReachable(error)
    }
}

const BankCodeErrorMessage = ({ error }: { error: BankCodeError }) => {
    switch (error.type) {
        case 'ngn_bank_code_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.bank_code_invalid"
                    defaultMessage="Invalid bank code"
                />
            )
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.account_number_missing"
                    defaultMessage="Required"
                />
            )
        default:
            return notReachable(error)
    }
}

const SortCodeErrorMessage = ({ error }: { error: SortCodeError }) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_missing"
                    defaultMessage="Required"
                />
            )

        case 'uk_bank_sort_code_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_invalid"
                    defaultMessage="Invalid sort code"
                />
            )

        default:
            return notReachable(error)
    }
}

const IBANErrorMessage = ({ error }: { error: IBANError }) => {
    switch (error.type) {
        case 'value_is_required':
        case 'string_is_empty':
        case 'value_is_not_a_string':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_missing"
                    defaultMessage="Required"
                />
            )

        case 'iban_invalid':
            return (
                <FormattedMessage
                    id="currency.bank_transfer.create_unblock_user.sort_code_invalid"
                    defaultMessage="Invalid IBAN"
                />
            )

        default:
            return notReachable(error)
    }
}

export type UKBankAccountNumberStringError =
    | EmptyStringError
    | { type: 'uk_bank_account_number_invalid'; value: unknown }

export const ukBankAccountNumberString = (
    value: unknown
): Result<UKBankAccountNumberStringError, string> =>
    string(value)
        .andThen(nonEmptyString)
        .andThen((str) =>
            str.match(/^\d{8}$/)
                ? success(str)
                : failure({
                      type: 'uk_bank_account_number_invalid',
                      value: str,
                  })
        )

type NgnBankAccountNumberStringError =
    | EmptyStringError
    | { type: 'ngn_bank_account_number_invalid'; value: unknown }

const ngnBankAccountNumberString = (
    value: unknown
): Result<NgnBankAccountNumberStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{10}$/)
            ? success(str)
            : failure({
                  type: 'ngn_bank_account_number_invalid',
                  value: str,
              })
    )

type NgnBankCodeStringError =
    | EmptyStringError
    | { type: 'ngn_bank_code_invalid' }

const ngnBankCodeString = (
    value: unknown
): Result<NgnBankCodeStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{3}$/)
            ? success(str)
            : failure({ type: 'ngn_bank_code_invalid' })
    )

type NgnBankVerificationNumberStringError =
    | EmptyStringError
    | { type: 'ngn_bank_verification_number_invalid' }

const ngnBankVerificationNumberString = (
    value: unknown
): Result<NgnBankVerificationNumberStringError, string> =>
    nonEmptyString(value).andThen((str) =>
        str.match(/^\d{11}$/)
            ? success(str)
            : failure({
                  type: 'ngn_bank_verification_number_invalid',
                  value: str,
              })
    )

export type UKBankSortCodeStringError =
    | EmptyStringError
    | { type: 'uk_bank_sort_code_invalid'; value: unknown }

export const ukBankSortCodeString = (
    value: unknown
): Result<UKBankSortCodeStringError, string> =>
    string(value)
        .andThen(nonEmptyString)
        .andThen((str) =>
            str.match(/^\d{6}$/)
                ? success(str)
                : failure({
                      type: 'uk_bank_sort_code_invalid',
                      value: str,
                  })
        )

export type IBANStringError =
    | EmptyStringError
    | { type: 'iban_invalid'; value: unknown }

export const ibanString = (value: unknown): Result<IBANStringError, string> =>
    string(value)
        .andThen(nonEmptyString)
        .andThen((str) =>
            str.toUpperCase().match(/^[0-9A-Z]{16,34}$/)
                ? success(str.toUpperCase())
                : failure({
                      type: 'iban_invalid',
                      value: str,
                  })
        )
