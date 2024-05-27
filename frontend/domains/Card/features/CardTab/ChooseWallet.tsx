import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Group } from '@zeal/uikit/Group'
import { GroupList } from '@zeal/uikit/GroupList'
import { Header } from '@zeal/uikit/Header'
import { AddressBook } from '@zeal/uikit/Icon/AddressBook'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldFileDownload } from '@zeal/uikit/Icon/BoldFileDownload'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

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
    accountWithKeystore: { account: Account; keystore: SigningKeyStore } | null
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'on_continue_click'; account: Account; keystore: SigningKeyStore }
    | { type: 'card_tab_choose_wallet_on_import_new_wallet_clicked' }

type Form = {
    account: Account
    keystore: SigningKeyStore
} | null

type ValidForm = {
    account: Account
    keystore: SigningKeyStore
}

type FormError = {
    submit?: { type: 'no_wallet_selected' }
}

const validate = (form: Form): Result<FormError, ValidForm> =>
    form
        ? success({ account: form.account, keystore: form.keystore })
        : failure({ submit: { type: 'no_wallet_selected' } })

const getWalletsAllowedForCards = (
    accountsMap: AccountsMap,
    keyStoreMap: KeyStoreMap
): { account: Account; keystore: SigningKeyStore }[] =>
    values(accountsMap)
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

export const ChooseWallet = ({
    keystoreMap,
    accountsMap,
    portfolioMap,
    currencyHiddenMap,
    accountWithKeystore,
    onMsg,
    installationId,
}: Props) => {
    const [form, setForm] = useState<Form | null>(accountWithKeystore)

    const result = validate(form)
    const error = result.getFailureReason() || {}

    const onSubmit = () => {
        const result = validate(form)

        switch (result.type) {
            case 'Failure':
                break
            case 'Success':
                onMsg({
                    type: 'on_continue_click',
                    account: result.data.account,
                    keystore: result.data.keystore,
                })
                break
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    }

    const suitableWallets = getWalletsAllowedForCards(accountsMap, keystoreMap)

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
            <Column spacing={24} fill shrink alignY="stretch">
                <Header
                    title={
                        <FormattedMessage
                            id="card.choose-wallet.title"
                            defaultMessage="Choose wallet for Gnosis Pay Card"
                        />
                    }
                />
                <Column spacing={12} shrink fill>
                    {suitableWallets.length ? (
                        <GroupList
                            renderItem={({ item }) => (
                                <UnlockedListItem
                                    installationId={installationId}
                                    currencyHiddenMap={currencyHiddenMap}
                                    selectionVariant="checkbox"
                                    key={item.account.address}
                                    portfolio={getPortfolio({
                                        address: item.account.address,
                                        portfolioMap,
                                    })}
                                    keyStore={item.keystore}
                                    selected={
                                        !!(
                                            form &&
                                            form.account.address ===
                                                item.account.address
                                        )
                                    }
                                    account={item.account}
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'account_item_clicked':
                                                setForm({
                                                    account: msg.account,
                                                    keystore: item.keystore,
                                                })
                                                break
                                            /* istanbul ignore next */
                                            default:
                                                return notReachable(msg.type)
                                        }
                                    }}
                                />
                            )}
                            data={suitableWallets}
                        />
                    ) : (
                        <EmptyStateWidget
                            size="regular"
                            title={
                                <FormattedMessage
                                    id="cards.choose-wallet.no-active-accounts"
                                    defaultMessage="You don't have any active wallets"
                                />
                            }
                            icon={({ size }) => (
                                <AddressBook size={size} color="iconDefault" />
                            )}
                        />
                    )}
                    <Column spacing={0}>
                        <Group variant="default">
                            <ListItem
                                size="regular"
                                aria-current={false}
                                avatar={({ size }) => (
                                    <BoldFileDownload
                                        size={size}
                                        color="iconAccent2"
                                    />
                                )}
                                primaryText={
                                    <FormattedMessage
                                        id="bank_transfers.choose-wallet.test"
                                        defaultMessage="Import another wallet"
                                    />
                                }
                                onClick={() =>
                                    onMsg({
                                        type: 'card_tab_choose_wallet_on_import_new_wallet_clicked',
                                    })
                                }
                            />
                        </Group>
                    </Column>
                </Column>
                <Actions>
                    <Button
                        size="regular"
                        disabled={!!error.submit}
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
        </Screen>
    )
}
