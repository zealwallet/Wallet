import React, { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { CustomMetamask } from '@zeal/uikit/Icon/CustomMetamask'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { Plus } from '@zeal/uikit/Icon/Plus'
import { IconButton } from '@zeal/uikit/IconButton'
import { Input } from '@zeal/uikit/Input'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { ScrollContainer } from '@zeal/uikit/ScrollContainer'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { ActiveAccountsSection } from '@zeal/domains/Account/components/ActiveAccountsSection'
import { EmptySearch } from '@zeal/domains/Account/components/EmptySearch'
import { EmptySearchForValidAddress } from '@zeal/domains/Account/components/EmptySearchForValidAddress'
import { TrackedAccountsSection } from '@zeal/domains/Account/components/TrackedAccountsSection'
import { UnlockedListItem } from '@zeal/domains/Account/components/UnlockedListItem'
import { validateAccountSearch } from '@zeal/domains/Account/helpers/validateAccountSearch'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { AlternativeProvider } from '@zeal/domains/Main'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    installationId: string
    accounts: AccountsMap
    portfolioMap: PortfolioMap
    keystores: KeyStoreMap
    alternativeProvider: AlternativeProvider
    selectedProvider: { type: 'zeal'; account: Account } | { type: 'metamask' }
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'account_item_clicked'; account: Account }
    | { type: 'add_new_account_click' }
    | { type: 'track_account_click'; address: Address }
    | { type: 'other_provider_selected' }
    | MsgOf<typeof ActiveAccountsSection>
    | MsgOf<typeof TrackedAccountsSection>
    | MsgOf<typeof EmptySearch>
    | MsgOf<typeof EmptySearchForValidAddress>

export const Layout = ({
    accounts,
    keystores,
    selectedProvider,
    alternativeProvider,
    onMsg,
    portfolioMap,
    currencyHiddenMap,
    installationId,
}: Props) => {
    const [search, setSearch] = useState<string>('')

    const { formatMessage } = useIntl()
    const searchResult = validateAccountSearch({
        accountsMap: accounts,
        keystoreMap: keystores,
        search,
        portfolioMap,
        currencyHiddenMap,
    })
    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                left={
                    <Clickable onClick={() => onMsg({ type: 'close' })}>
                        <Row spacing={4}>
                            <BackIcon size={24} color="iconDefault" />

                            <Text
                                variant="title3"
                                weight="semi_bold"
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
                }
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({
                                type: 'add_new_account_click',
                            })
                        }
                    >
                        {({ color }) => <Plus size={24} color={color} />}
                    </IconButton>
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
                <ScrollContainer>
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
                                                <UnlockedListItem
                                                    installationId={
                                                        installationId
                                                    }
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    selectionVariant="default"
                                                    key={account.address}
                                                    account={account}
                                                    selected={(() => {
                                                        switch (
                                                            selectedProvider.type
                                                        ) {
                                                            case 'metamask':
                                                                return false
                                                            case 'zeal':
                                                                return (
                                                                    selectedProvider
                                                                        .account
                                                                        .address ===
                                                                    account.address
                                                                )

                                                            default:
                                                                return notReachable(
                                                                    selectedProvider
                                                                )
                                                        }
                                                    })()}
                                                    keyStore={getKeyStore({
                                                        keyStoreMap: keystores,
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

                                        {(() => {
                                            switch (alternativeProvider) {
                                                case 'metamask':
                                                    return (
                                                        <Section>
                                                            <GroupHeader
                                                                right={null}
                                                                left={({
                                                                    color,
                                                                    textVariant,
                                                                    textWeight,
                                                                }) => (
                                                                    <Text
                                                                        color={
                                                                            color
                                                                        }
                                                                        variant={
                                                                            textVariant
                                                                        }
                                                                        weight={
                                                                            textWeight
                                                                        }
                                                                    >
                                                                        <FormattedMessage
                                                                            id="account.other_providers"
                                                                            defaultMessage="Other providers"
                                                                        />
                                                                    </Text>
                                                                )}
                                                            />

                                                            <Group variant="default">
                                                                <ListItem
                                                                    size="regular"
                                                                    aria-current={(() => {
                                                                        switch (
                                                                            selectedProvider.type
                                                                        ) {
                                                                            case 'zeal':
                                                                                return false
                                                                            case 'metamask':
                                                                                return true

                                                                            default:
                                                                                return notReachable(
                                                                                    selectedProvider
                                                                                )
                                                                        }
                                                                    })()}
                                                                    avatar={({
                                                                        size,
                                                                    }) => (
                                                                        <CustomMetamask
                                                                            size={
                                                                                size
                                                                            }
                                                                        />
                                                                    )}
                                                                    primaryText="MetaMask"
                                                                    shortText={
                                                                        <FormattedMessage
                                                                            id="account.connect_with_metamask"
                                                                            defaultMessage="Connect with MetaMask"
                                                                        />
                                                                    }
                                                                    onClick={() =>
                                                                        onMsg({
                                                                            type: 'other_provider_selected',
                                                                        })
                                                                    }
                                                                />
                                                            </Group>
                                                        </Section>
                                                    )
                                                case 'provider_unavailable':
                                                    return null

                                                default:
                                                    return notReachable(
                                                        alternativeProvider
                                                    )
                                            }
                                        })()}

                                        <TrackedAccountsSection
                                            accounts={tracked}
                                            listItem={({ account }) => (
                                                <UnlockedListItem
                                                    installationId={
                                                        installationId
                                                    }
                                                    currencyHiddenMap={
                                                        currencyHiddenMap
                                                    }
                                                    selectionVariant="default"
                                                    key={account.address}
                                                    account={account}
                                                    selected={(() => {
                                                        switch (
                                                            selectedProvider.type
                                                        ) {
                                                            case 'metamask':
                                                                return false
                                                            case 'zeal':
                                                                return (
                                                                    selectedProvider
                                                                        .account
                                                                        .address ===
                                                                    account.address
                                                                )

                                                            default:
                                                                return notReachable(
                                                                    selectedProvider
                                                                )
                                                        }
                                                    })()}
                                                    keyStore={getKeyStore({
                                                        keyStoreMap: keystores,
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
                </ScrollContainer>
            </Column>
            <Spacer />
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
            return null
        case 'accounts_not_found_search_valid_address':
            return (
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() =>
                            onMsg({
                                type: 'track_account_click',
                                address: searchResult.address,
                            })
                        }
                    >
                        <FormattedMessage
                            id="address_book.change_account.cta"
                            defaultMessage="Track wallet"
                        />
                    </Button>
                </Actions>
            )
        case 'grouped_accounts':
            return null
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
            return null
        case 'accounts_not_found_search_valid_address':
            return <Checkbox color="iconAccent2" size={24} />
        case 'grouped_accounts':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(searchResult)
    }
}
