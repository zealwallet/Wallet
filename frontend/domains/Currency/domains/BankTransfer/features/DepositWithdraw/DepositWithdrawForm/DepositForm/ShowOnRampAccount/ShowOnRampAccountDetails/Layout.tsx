import { FormattedMessage, useIntl } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { Avatar as CurrencyAvatar } from '@zeal/domains/Currency/components/Avatar'
import {
    BankAccountDetails,
    OnRampAccount,
    UnblockUser,
} from '@zeal/domains/Currency/domains/BankTransfer'
import { BankTransferCurrencies } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchBankTransferCurrencies'
import { OnRampFeeParams } from '@zeal/domains/Currency/domains/BankTransfer/api/fetchTransactionFee'
import { formatIBAN } from '@zeal/domains/Currency/domains/BankTransfer/helpers/formatIBAN'
import { formatSortCode } from '@zeal/domains/Currency/domains/BankTransfer/helpers/formatSortCode'
import { amountToBigint } from '@zeal/domains/Currency/helpers/amountToBigint'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { FormattedFiatCurrency } from '@zeal/domains/Money/components/FormattedFiatCurrency'
import { Network } from '@zeal/domains/Network'

import { CopyAccountProperty } from './components/CopyAccountProperty'

type Props = {
    currencies: BankTransferCurrencies
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onRampAccount: OnRampAccount
    form: OnRampFeeParams
    unblockUser: UnblockUser
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_zeal_account_tooltip_click' }
    | { type: 'on_sent_from_bank_click' }

export const Layout = ({
    onRampAccount,
    form,
    onMsg,
    currencies,
    account,
    network,
    keyStoreMap,
    unblockUser,
}: Props) => {
    const { formatMessage } = useIntl()
    const amount = amountToBigint(form.amount, form.inputCurrency.fraction)

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                network={network}
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                left={
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={12}>
                <Column spacing={16}>
                    <Header
                        title={
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.header"
                                defaultMessage="Make transfer from your bank"
                            />
                        }
                    />
                    <Column spacing={8}>
                        <Text variant="paragraph" color="textSecondary">
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.send-from-bank-label"
                                defaultMessage="Send from your bank"
                            />
                        </Text>
                        <Group variant="default">
                            <ListItem
                                aria-current={false}
                                avatar={() => (
                                    <CurrencyAvatar
                                        key={form.inputCurrency.id}
                                        currency={form.inputCurrency}
                                        size={32}
                                        rightBadge={() => null}
                                    />
                                )}
                                size="large"
                                primaryText={form.inputCurrency.code}
                                side={{
                                    rightIcon: () => {
                                        return form.amount ? (
                                            <Text
                                                variant="callout"
                                                color="textPrimary"
                                                weight="medium"
                                            >
                                                <FormattedFiatCurrency
                                                    money={{
                                                        amount,
                                                        currencyId:
                                                            form.inputCurrency
                                                                .id,
                                                    }}
                                                    minimumFractionDigits={0}
                                                    knownCurrencies={
                                                        currencies.knownCurrencies
                                                    }
                                                />
                                            </Text>
                                        ) : null
                                    },
                                }}
                            />
                        </Group>
                    </Column>
                </Column>
                <Row spacing={4}>
                    <Text variant="paragraph" color="textSecondary">
                        <FormattedMessage
                            id="bank_transfers.deposit.show-account.zeal-bank-account-label"
                            defaultMessage="To your Zeal bank account"
                        />
                    </Text>
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({ type: 'on_zeal_account_tooltip_click' })
                        }
                    >
                        {({ color }) => <InfoCircle size={14} color={color} />}
                    </IconButton>
                </Row>
                <Group variant="default">
                    <Column spacing={12}>
                        <Column spacing={4}>
                            <Text
                                variant="footnote"
                                color="textSecondary"
                                id="to-beneficiary-label"
                            >
                                <FormattedMessage
                                    id="bank_transfers.deposit.show-account.beneficiary"
                                    defaultMessage="To beneficiary"
                                />
                            </Text>
                            <CopyAccountProperty
                                aria-labelledby="to-beneficiary-label"
                                text={`${unblockUser.firstName} ${unblockUser.lastName}`}
                            />
                        </Column>
                        <BankAccount
                            accountDetails={onRampAccount.bankDetails}
                        />
                    </Column>
                </Group>
            </Column>

            <Spacer />

            <Actions>
                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() => onMsg({ type: 'on_sent_from_bank_click' })}
                >
                    <FormattedMessage
                        id="bank_transfers.deposit.show-account.sent-from-bank"
                        defaultMessage="I've sent from my bank"
                    />
                </Button>
            </Actions>
        </Screen>
    )
}

const BankAccount = ({
    accountDetails,
}: {
    accountDetails: BankAccountDetails
}) => {
    switch (accountDetails.type) {
        case 'uk':
            return (
                <>
                    <Column spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="account-number-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.account-number"
                                defaultMessage="Account"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="account-number-label"
                            text={accountDetails.accountNumber}
                        />
                    </Column>
                    <Column spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="sort-code-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.sort-code"
                                defaultMessage="Sort Code"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="sort-code-label"
                            text={formatSortCode(accountDetails.sortCode)}
                        />
                    </Column>
                </>
            )
        case 'iban':
            return (
                <Column spacing={4}>
                    <Text
                        variant="footnote"
                        color="textSecondary"
                        id="iban-label"
                    >
                        <FormattedMessage
                            id="bank_transfers.deposit.show-account.iban"
                            defaultMessage="IBAN"
                        />
                    </Text>
                    <CopyAccountProperty
                        aria-labelledby="iban-label"
                        text={formatIBAN(accountDetails.iban)}
                    />
                </Column>
            )
        case 'ngn':
            return (
                <>
                    <Column spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="ngn-account-number-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.ngn-account-number"
                                defaultMessage="Account number"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="ngn-account-number-label"
                            text={accountDetails.accountNumber}
                        />
                    </Column>
                    <Column spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="bank-code-label"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.bank-code"
                                defaultMessage="Bank code"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="bank-code-label"
                            text={accountDetails.bankCode}
                        />
                    </Column>
                    <Column spacing={4}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            id="bank-name"
                        >
                            <FormattedMessage
                                id="bank_transfers.deposit.show-account.bank-name"
                                defaultMessage="Bank name"
                            />
                        </Text>
                        <CopyAccountProperty
                            aria-labelledby="bank-name"
                            text="Globus Bank"
                        />
                    </Column>
                </>
            )
        /* istanbul ignore next */
        default:
            return notReachable(accountDetails)
    }
}
