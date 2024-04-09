import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'
import { ScrollView } from 'react-native'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Clickable } from '@zeal/uikit/Clickable'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { OutlineSearch } from '@zeal/uikit/Icon/OutlineSearch'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
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
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    installationId: string
    toAddress: Address | null
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}
type Msg =
    | { type: 'close' }
    | { type: 'on_continue_clicked'; address: Address }
    | MsgOf<typeof ActiveAccountsSection>
    | MsgOf<typeof TrackedAccountsSection>
    | MsgOf<typeof EmptySearch>
    | MsgOf<typeof EmptySearchForValidAddress>
    | MsgOf<typeof UnlockedListItem>

export const Layout = ({
    accountsMap,
    keyStoreMap,
    portfolioMap,
    toAddress,
    currencyHiddenMap,
    installationId,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const [search, setSearch] = useState<string>('')

    const searchResult = validateAccountSearch({
        accountsMap,
        keystoreMap: keyStoreMap,
        search,
        portfolioMap,
        currencyHiddenMap,
    })

    return (
        <Screen
            background="light"
            padding="form"
            aria-labelledby="send-to-layout"
        >
            <Column spacing={16} shrink fill>
                <Column spacing={0}>
                    <ActionBar
                        left={
                            <Clickable onClick={() => onMsg({ type: 'close' })}>
                                <Row spacing={4}>
                                    <BackIcon size={24} color="iconDefault" />
                                    <Text
                                        variant="title3"
                                        weight="semi_bold"
                                        color="textPrimary"
                                        id="send-to-layout"
                                    >
                                        <FormattedMessage
                                            id="SendERC20.send_to"
                                            defaultMessage="Send to"
                                        />
                                    </Text>
                                </Row>
                            </Clickable>
                        }
                    />
                </Column>

                <Input
                    keyboardType="default"
                    autoFocus
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
                    onSubmitEditing={noop}
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
                                                    selected={
                                                        toAddress ===
                                                        account.address
                                                    }
                                                    keyStore={getKeyStore({
                                                        keyStoreMap,
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
                                                    selected={
                                                        toAddress ===
                                                        account.address
                                                    }
                                                    keyStore={getKeyStore({
                                                        keyStoreMap,
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

                <Actions>
                    <CTA onMsg={onMsg} searchResult={searchResult} />
                </Actions>
            </Column>
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
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => {
                        onMsg({
                            type: 'on_continue_clicked',
                            address: searchResult.address,
                        })
                    }}
                >
                    <FormattedMessage
                        id="actions.continue"
                        defaultMessage="Continue"
                    />
                </Button>
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
