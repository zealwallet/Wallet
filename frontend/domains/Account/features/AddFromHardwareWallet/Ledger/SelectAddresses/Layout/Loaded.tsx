import { FormattedMessage } from 'react-intl'
import { FlatList } from 'react-native'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { ReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, LEDGER } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { ActionBar, Msg as ActionBarMsg } from './ActionBar'
import { GroupHeader, Header, Msg as HeaderMsg } from './Header'
import { Item } from './Item'

import { HDPath } from '../../helpers/generatePaths'

type Loadable = Extract<
    ReloadableData<
        { address: Address; path: string }[],
        { offset: number; hdPath: HDPath }
    >,
    { type: 'loaded' | 'reloading' | 'subsequent_failed' }
>

type Props = {
    selected: Address[]
    accounts: Account[]
    keystoreMap: KeyStoreMap
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
    loadable: Loadable
}

export type Msg =
    | {
          type: 'item_clicked'
          item: { address: Address; path: string }
      }
    | ActionBarMsg
    | HeaderMsg
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: LEDGER
          }[]
      }
    | {
          type: 'scroll_marker_trigger'
          params: {
              offset: number
              hdPath: HDPath
          }
          data: { address: Address; path: string }[]
      }
    | MsgOf<typeof AppErrorPopup>

export const Loaded = ({
    loadable,
    accounts,
    selected,
    keystoreMap,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar onMsg={onMsg} />
            <Column shrink alignY="stretch" spacing={24}>
                <Column shrink spacing={24}>
                    <Header />
                    <Section>
                        <GroupHeader onMsg={onMsg} />
                        <Group variant="default">
                            {(() => {
                                switch (loadable.type) {
                                    case 'loaded':
                                        return (
                                            <FlatList
                                                showsVerticalScrollIndicator={
                                                    false
                                                }
                                                data={loadable.data}
                                                renderItem={({
                                                    item,
                                                    index,
                                                }) => (
                                                    <Item
                                                        currencyHiddenMap={
                                                            currencyHiddenMap
                                                        }
                                                        networkMap={networkMap}
                                                        networkRPCMap={
                                                            networkRPCMap
                                                        }
                                                        customCurrencies={
                                                            customCurrencies
                                                        }
                                                        keystoreMap={
                                                            keystoreMap
                                                        }
                                                        accounts={accounts}
                                                        key={item.address}
                                                        address={item.address}
                                                        index={index}
                                                        isSelected={selected.includes(
                                                            item.address
                                                        )}
                                                        onClick={() => {
                                                            onMsg({
                                                                type: 'item_clicked',
                                                                item,
                                                            })
                                                        }}
                                                    />
                                                )}
                                                onEndReached={() =>
                                                    onMsg({
                                                        type: 'scroll_marker_trigger',
                                                        params: loadable.params,
                                                        data: loadable.data,
                                                    })
                                                }
                                            />
                                        )
                                    case 'reloading':
                                        return (
                                            <FlatList
                                                showsVerticalScrollIndicator={
                                                    false
                                                }
                                                data={loadable.data}
                                                renderItem={({
                                                    item,
                                                    index,
                                                }) => (
                                                    <Item
                                                        currencyHiddenMap={
                                                            currencyHiddenMap
                                                        }
                                                        networkMap={networkMap}
                                                        networkRPCMap={
                                                            networkRPCMap
                                                        }
                                                        customCurrencies={
                                                            customCurrencies
                                                        }
                                                        keystoreMap={
                                                            keystoreMap
                                                        }
                                                        accounts={accounts}
                                                        key={item.address}
                                                        address={item.address}
                                                        index={index}
                                                        isSelected={selected.includes(
                                                            item.address
                                                        )}
                                                        onClick={() => {
                                                            onMsg({
                                                                type: 'item_clicked',
                                                                item,
                                                            })
                                                        }}
                                                    />
                                                )}
                                                ListFooterComponent={
                                                    <ListItemSkeleton
                                                        avatar
                                                        shortText
                                                    />
                                                }
                                            />
                                        )
                                    case 'subsequent_failed':
                                        return (
                                            <>
                                                <FlatList
                                                    showsVerticalScrollIndicator={
                                                        false
                                                    }
                                                    data={loadable.data}
                                                    renderItem={({
                                                        item,
                                                        index,
                                                    }) => (
                                                        <Item
                                                            currencyHiddenMap={
                                                                currencyHiddenMap
                                                            }
                                                            networkMap={
                                                                networkMap
                                                            }
                                                            networkRPCMap={
                                                                networkRPCMap
                                                            }
                                                            customCurrencies={
                                                                customCurrencies
                                                            }
                                                            keystoreMap={
                                                                keystoreMap
                                                            }
                                                            accounts={accounts}
                                                            key={item.address}
                                                            address={
                                                                item.address
                                                            }
                                                            index={index}
                                                            isSelected={selected.includes(
                                                                item.address
                                                            )}
                                                            onClick={() => {
                                                                onMsg({
                                                                    type: 'item_clicked',
                                                                    item,
                                                                })
                                                            }}
                                                        />
                                                    )}
                                                    ListFooterComponent={
                                                        <ListItemSkeleton
                                                            avatar
                                                            shortText
                                                        />
                                                    }
                                                />
                                                <AppErrorPopup
                                                    error={parseAppError(
                                                        loadable.error
                                                    )}
                                                    onMsg={onMsg}
                                                />
                                            </>
                                        )
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(loadable)
                                }
                            })()}
                        </Group>
                    </Section>
                </Column>
                <Spacer />
                <Actions>
                    <Button
                        disabled={selected.length === 0}
                        size="regular"
                        variant="primary"
                        onClick={() => {
                            const selectedAccounts = loadable.data.filter(
                                (acc) => selected.includes(acc.address)
                            )

                            const labels = generateAccountsLabels(
                                accounts,
                                'Ledger',
                                selectedAccounts.length
                            )

                            const accountsWithKeystores = selectedAccounts.map(
                                ({ address, path }, index) => {
                                    const account = accounts.find(
                                        (acc) => acc.address === address
                                    )
                                    return {
                                        account: {
                                            address,
                                            label:
                                                account?.label || labels[index],
                                            avatarSrc:
                                                account?.avatarSrc || null,
                                        },
                                        keystore: {
                                            id: uuid(),
                                            type: 'ledger' as const,
                                            address,
                                            path,
                                        },
                                    }
                                }
                            )

                            onMsg({
                                type: 'on_account_create_request',
                                accountsWithKeystores,
                            })
                        }}
                    >
                        <FormattedMessage
                            id="ledger.select_account.path_settings"
                            defaultMessage={`{count, plural,
              =0 {No wallets selected}
              one {Import wallet}
              other {Import {count} wallets}}`}
                            values={{
                                count: selected.length,
                            }}
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
