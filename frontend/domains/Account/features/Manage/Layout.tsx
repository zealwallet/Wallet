import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ScrollView } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { ArrowLeft2 } from '@zeal/uikit/Icon/ArrowLeft2'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { Plus } from '@zeal/uikit/Icon/Plus'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActiveAccountsSection } from '@zeal/domains/Account/components/ActiveAccountsSection'
import { EmptySearch } from '@zeal/domains/Account/components/EmptySearch'
import { EmptySearchForValidAddress } from '@zeal/domains/Account/components/EmptySearchForValidAddress'
import {
    ListItem,
    Msg as AccountListItemMsg,
} from '@zeal/domains/Account/components/ListItem'
import { TrackedAccountsSection } from '@zeal/domains/Account/components/TrackedAccountsSection'
import { validateAccountSearch } from '@zeal/domains/Account/helpers/validateAccountSearch'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystoreMap: KeyStoreMap
    account: Account
    installationId: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'add_new_account_click' }
    | { type: 'track_wallet_clicked' }
    | { type: 'create_new_contact_account_click'; address: Address }
    | { type: 'on_active_and_tracked_wallets_clicked' }
    | AccountListItemMsg
    | MsgOf<typeof ActiveAccountsSection>
    | MsgOf<typeof TrackedAccountsSection>
    | MsgOf<typeof EmptySearch>
    | MsgOf<typeof EmptySearchForValidAddress>

export const Layout = ({
    accounts,
    keystoreMap,
    account: selectedAccount,
    onMsg,
    portfolioMap,
    installationId,
    currencyHiddenMap,
}: Props) => {
    const [search, setSearch] = useState<string>('')

    const { formatMessage } = useIntl()

    const searchResult = validateAccountSearch({
        accountsMap: accounts,
        keystoreMap,
        search,
        portfolioMap,
        currencyHiddenMap,
    })

    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <Row spacing={4}>
                        <Clickable onClick={() => onMsg({ type: 'close' })}>
                            <Row spacing={4}>
                                <ArrowLeft2 size={24} color="iconDefault" />
                                <Text
                                    variant="title3"
                                    weight="medium"
                                    color="textPrimary"
                                    id="accounts-layout-label"
                                >
                                    <FormattedMessage
                                        id="storage.manageAccounts.title"
                                        defaultMessage="Wallets"
                                    />
                                </Text>
                            </Row>
                        </Clickable>
                        <IconButton
                            variant="on_light"
                            onClick={() =>
                                onMsg({
                                    type: 'on_active_and_tracked_wallets_clicked',
                                })
                            }
                        >
                            {({ color }) => (
                                <InfoCircle size={24} color={color} />
                            )}
                        </IconButton>
                    </Row>
                }
                right={
                    <Row spacing={12}>
                        <IconButton
                            variant="on_light"
                            onClick={() =>
                                onMsg({ type: 'add_new_account_click' })
                            }
                        >
                            {({ color }) => <Plus size={24} color={color} />}
                        </IconButton>
                    </Row>
                }
            />
            <Column spacing={16} shrink fill>
                <Input
                    keyboardType="default"
                    onSubmitEditing={noop}
                    leftIcon={<OutlineSearch size={24} color="iconDefault" />}
                    rightIcon={<RightIcon searchResult={searchResult} />}
                    variant="regular"
                    value={search}
                    onChange={(e) => {
                        setSearch(e.nativeEvent.text)
                    }}
                    state="normal"
                    placeholder={formatMessage({
                        id: 'address_book.change_account.search_placeholder',
                        defaultMessage: 'Add or search address',
                    })}
                />

                <ScrollView showsVerticalScrollIndicator={false}>
                    {(() => {
                        switch (searchResult.type) {
                            case 'accounts_not_found':
                                return <EmptySearch />

                            case 'accounts_not_found_search_valid_address':
                                return <EmptySearchForValidAddress />

                            case 'grouped_accounts': {
                                const { active, tracked } = searchResult

                                return (
                                    <Column spacing={24}>
                                        <ActiveAccountsSection
                                            accounts={active}
                                            listItem={({ account }) => (
                                                <ListItem
                                                    installationId={
                                                        installationId
                                                    }
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    key={account.address}
                                                    account={account}
                                                    selected={
                                                        account.address ===
                                                        selectedAccount.address
                                                    }
                                                    keystore={getKeyStore({
                                                        keyStoreMap:
                                                            keystoreMap,
                                                        address:
                                                            account.address,
                                                    })}
                                                    portfolio={getPortfolio({
                                                        address:
                                                            account.address,
                                                        portfolioMap,
                                                    })}
                                                    onMsg={onMsg}
                                                />
                                            )}
                                            onMsg={onMsg}
                                        />

                                        <TrackedAccountsSection
                                            accounts={tracked}
                                            listItem={({ account }) => (
                                                <ListItem
                                                    installationId={
                                                        installationId
                                                    }
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    key={account.address}
                                                    account={account}
                                                    selected={
                                                        account.address ===
                                                        selectedAccount.address
                                                    }
                                                    keystore={getKeyStore({
                                                        keyStoreMap:
                                                            keystoreMap,
                                                        address:
                                                            account.address,
                                                    })}
                                                    portfolio={getPortfolio({
                                                        address:
                                                            account.address,
                                                        portfolioMap,
                                                    })}
                                                    onMsg={onMsg}
                                                />
                                            )}
                                            onMsg={onMsg}
                                        />
                                    </Column>
                                )
                            }

                            /* istanbul ignore next */
                            default:
                                return notReachable(searchResult)
                        }
                    })()}
                </ScrollView>
            </Column>

            <CTA onMsg={onMsg} searchResult={searchResult} />
        </Screen>
    )
}

const CTA = ({
    searchResult,
    onMsg,
}: {
    searchResult: ReturnType<typeof validateAccountSearch>
    onMsg: (msg: Msg) => void
}) => {
    switch (searchResult.type) {
        case 'accounts_not_found':
        case 'grouped_accounts':
            return null

        case 'accounts_not_found_search_valid_address':
            return (
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() => {
                            onMsg({
                                type: 'create_new_contact_account_click',
                                address: searchResult.address,
                            })
                        }}
                    >
                        <FormattedMessage
                            id="address_book.change_account.cta"
                            defaultMessage="Track wallet"
                        />
                    </Button>
                </Actions>
            )

        /* istanbul ignore next */
        default:
            return notReachable(searchResult)
    }
}

const RightIcon = ({
    searchResult,
}: {
    searchResult: ReturnType<typeof validateAccountSearch>
}) => {
    switch (searchResult.type) {
        case 'accounts_not_found':
        case 'grouped_accounts':
            return null

        case 'accounts_not_found_search_valid_address':
            return <Checkbox color="iconAccent2" size={24} />

        /* istanbul ignore next */
        default:
            return notReachable(searchResult)
    }
}
