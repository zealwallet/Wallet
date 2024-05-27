import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldAddWallet } from '@zeal/uikit/Icon/BoldAddWallet'
import { IconButton } from '@zeal/uikit/IconButton'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'

import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { UnlockedListItem } from '@zeal/domains/Account/components/UnlockedListItem'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    installationId: string
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_back_button_clicked' }
    | { type: 'on_add_wallet_click' }
    | { type: 'on_continue_click'; account: Account; keystore: SigningKeyStore }

type Form = {
    selectedAccount: Account
    keystore: SigningKeyStore
} | null

type FormError = {
    submit?: { type: 'you_need_to_select_account_to_proceed' }
}

type ValidForm = {
    selectedAccount: Account
    keystore: SigningKeyStore
}

const validate = (form: Form): Result<FormError, ValidForm> => {
    return form
        ? success({
              selectedAccount: form.selectedAccount,
              keystore: form.keystore,
          })
        : failure({ submit: { type: 'you_need_to_select_account_to_proceed' } })
}

const getActiveAccounts = (
    accountsMap: AccountsMap,
    keyStoreMap: KeyStoreMap
): { account: Account; keystore: SigningKeyStore }[] => {
    const accounts = values(accountsMap)
    return accounts
        .map((account) => {
            return {
                account: account,
                keystore: getKeyStore({
                    address: account.address,
                    keyStoreMap,
                }),
            }
        })
        .filter(
            (
                accountKeystorePair
            ): accountKeystorePair is {
                account: Account
                keystore: SigningKeyStore
            } => {
                const { keystore } = accountKeystorePair
                switch (keystore.type) {
                    case 'track_only':
                        return false
                    case 'private_key_store':
                    case 'ledger':
                    case 'secret_phrase_key':
                    case 'trezor':
                    case 'safe_4337':
                        return true
                    /* istanbul ignore next */
                    default:
                        return notReachable(keystore)
                }
            }
        )
}

export const Layout = ({
    accountsMap,
    keystoreMap,
    portfolioMap,
    currencyHiddenMap,
    installationId,
    onMsg,
}: Props) => {
    const [form, setForm] = useState<Form>(null)

    const result = validate(form)
    const errors = result.getFailureReason() || {}

    const activeAccounts = getActiveAccounts(accountsMap, keystoreMap)

    const onSubmit = () => {
        const result = validate(form)
        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_continue_click',
                    account: result.data.selectedAccount,
                    keystore: result.data.keystore,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'on_back_button_clicked' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({ type: 'on_back_button_clicked' })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={24} shrink fill>
                <Header
                    title={
                        <FormattedMessage
                            id="bank_transfers.choose-wallet.title"
                            defaultMessage="Choose wallet"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="bank_transfers.choose-wallet.title"
                            defaultMessage="Choose the wallet you want to link your bank account to for direct transfers. "
                        />
                    }
                />

                <Column spacing={12} shrink fill>
                    <ScrollContainer>
                        <Column spacing={12}>
                            {activeAccounts.length === 0 ? null : (
                                <Group variant="default">
                                    {activeAccounts.map(
                                        ({ account, keystore }) => (
                                            <UnlockedListItem
                                                installationId={installationId}
                                                currencyHiddenMap={
                                                    currencyHiddenMap
                                                }
                                                selectionVariant="checkbox"
                                                key={account.address}
                                                account={account}
                                                selected={
                                                    form?.selectedAccount
                                                        .address ===
                                                    account.address
                                                }
                                                keyStore={getKeyStore({
                                                    keyStoreMap: keystoreMap,
                                                    address: account.address,
                                                })}
                                                portfolio={getPortfolio({
                                                    address: account.address,
                                                    portfolioMap,
                                                })}
                                                onMsg={(msg) => {
                                                    switch (msg.type) {
                                                        case 'account_item_clicked':
                                                            setForm({
                                                                selectedAccount:
                                                                    msg.account,
                                                                keystore,
                                                            })
                                                            break
                                                        /* istanbul ignore next */
                                                        default:
                                                            return notReachable(
                                                                msg.type
                                                            )
                                                    }
                                                }}
                                            />
                                        )
                                    )}
                                </Group>
                            )}

                            <Group variant="default">
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <BoldAddWallet
                                            size={size}
                                            color="textSecondary"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="bank_transfers.choose-wallet.test"
                                            defaultMessage="Add wallet"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({ type: 'on_add_wallet_click' })
                                    }
                                />
                            </Group>
                        </Column>
                    </ScrollContainer>

                    <Column spacing={8}>
                        <InfoCard
                            title={
                                <FormattedMessage
                                    id="bank_transfers.choose-wallet.warning.title"
                                    defaultMessage="Choose your wallet wisely"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="bank_transfers.choose-wallet.warning.subtitle"
                                    defaultMessage="You can only link one wallet at a time. You won’t be able to change the linked wallet."
                                />
                            }
                            variant="warning"
                        />

                        <Actions>
                            <Button
                                size="regular"
                                disabled={!!errors.submit}
                                variant="primary"
                                onClick={onSubmit}
                            >
                                <FormattedMessage
                                    id="bank_transfers.choose-wallet.continue"
                                    defaultMessage="Continue"
                                />
                            </Button>
                        </Actions>
                    </Column>
                </Column>
            </Column>
        </Screen>
    )
}
