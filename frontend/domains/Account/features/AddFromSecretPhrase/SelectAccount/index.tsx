import React, { useState } from 'react'
import { FormattedMessage } from 'react-intl'
import { FlatList } from 'react-native'

import { range } from 'lodash'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader, Section } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { useReloadableData } from '@zeal/toolkit/LoadableData/ReloadableData'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { generateSecretPhraseAddress } from '@zeal/domains/KeyStore/helpers/generateSecretPhraseAddress'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { Item } from './Item'

type Props = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    keystore: SecretPhrase
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_account_create_request'
          accountsWithKeystores: {
              account: Account
              keystore: SecretPhrase
          }[]
      }

const fetch = async ({
    offset,
    sessionPassword,
    limit,
    encryptedPhrase,
}: {
    sessionPassword: string
    encryptedPhrase: string
    offset: number
    limit: number
}): Promise<{ address: Address; path: string }[]> => {
    return Promise.all(
        range(offset, offset + limit).map(async (currentOffset) => {
            return await generateSecretPhraseAddress({
                encryptedPhrase,
                sessionPassword,
                offset: currentOffset,
            })
        })
    )
}

const toggleSelected = (selected: Address[], address: Address): Address[] =>
    selected.find((item) => item === address)
        ? selected.filter((item) => item !== address)
        : [...selected, address]

export const SelectAccount = ({
    accountsMap,
    keystoreMap,
    keystore,
    sessionPassword,
    customCurrencies,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const accounts = values(accountsMap)
    const [selected, setSelected] = useState<Address[]>([])

    const [reloadable, setReloadable] = useReloadableData(
        fetch,
        {
            type: 'loading',
            params: {
                encryptedPhrase: keystore.encryptedPhrase,
                offset: 0,
                limit: 10,
                sessionPassword,
            },
        },
        {
            accumulate: (newData, prevData) => {
                return [...prevData, ...newData]
            },
        }
    )

    return (
        <Screen
            background="light"
            padding="form"
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

            <Column shrink spacing={24} fill>
                <Header
                    title={
                        <FormattedMessage
                            id="AddFromExistingSecretPhrase.WalletSelection.title"
                            defaultMessage="Quick add a wallet"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="AddFromExistingSecretPhrase.WalletSelection.subtitle"
                            defaultMessage="Your Secret Phrase can back up many wallets. Pick the ones you want to use."
                        />
                    }
                />

                <Section>
                    <GroupHeader
                        left={({ color, textVariant, textWeight }) => (
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="AddFromNewSecretPhrase.wallets"
                                    defaultMessage="Wallets"
                                />
                            </Text>
                        )}
                        right={null}
                    />
                    <Group variant="default" fill>
                        {(() => {
                            switch (reloadable.type) {
                                case 'loading':
                                    return <ListItemSkeleton avatar shortText />
                                case 'loaded':
                                    return (
                                        <FlatList
                                            keyExtractor={(item) =>
                                                item.address
                                            }
                                            style={{ flexGrow: 1 }}
                                            showsVerticalScrollIndicator={false}
                                            data={reloadable.data}
                                            renderItem={({ item, index }) => (
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
                                                    accounts={accounts}
                                                    address={item.address}
                                                    index={index}
                                                    isSelected={
                                                        !!selected.find(
                                                            (sel) =>
                                                                sel ===
                                                                item.address
                                                        )
                                                    }
                                                    keystoreMap={keystoreMap}
                                                    key={item.address}
                                                    onClick={() =>
                                                        setSelected(
                                                            toggleSelected(
                                                                selected,
                                                                item.address
                                                            )
                                                        )
                                                    }
                                                />
                                            )}
                                            onEndReached={() =>
                                                setReloadable({
                                                    type: 'reloading',
                                                    data: reloadable.data,
                                                    params: {
                                                        limit: reloadable.params
                                                            .limit,
                                                        encryptedPhrase:
                                                            keystore.encryptedPhrase,
                                                        sessionPassword:
                                                            sessionPassword,
                                                        offset:
                                                            reloadable.params
                                                                .offset +
                                                            reloadable.params
                                                                .limit,
                                                    },
                                                })
                                            }
                                        />
                                    )
                                case 'reloading':
                                    return (
                                        <FlatList
                                            keyExtractor={(item) =>
                                                item.address
                                            }
                                            style={{ flexGrow: 1 }}
                                            showsVerticalScrollIndicator={false}
                                            data={reloadable.data}
                                            renderItem={({ item, index }) => (
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
                                                    accounts={accounts}
                                                    address={item.address}
                                                    index={index}
                                                    isSelected={
                                                        !!selected.find(
                                                            (sel) =>
                                                                sel ===
                                                                item.address
                                                        )
                                                    }
                                                    keystoreMap={keystoreMap}
                                                    key={item.address}
                                                    onClick={() =>
                                                        setSelected(
                                                            toggleSelected(
                                                                selected,
                                                                item.address
                                                            )
                                                        )
                                                    }
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
                                                keyExtractor={(item) =>
                                                    item.address
                                                }
                                                showsVerticalScrollIndicator={
                                                    false
                                                }
                                                data={reloadable.data}
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
                                                        accounts={accounts}
                                                        address={item.address}
                                                        index={index}
                                                        isSelected={
                                                            !!selected.find(
                                                                (sel) =>
                                                                    sel ===
                                                                    item.address
                                                            )
                                                        }
                                                        keystoreMap={
                                                            keystoreMap
                                                        }
                                                        key={item.address}
                                                        onClick={() =>
                                                            setSelected(
                                                                toggleSelected(
                                                                    selected,
                                                                    item.address
                                                                )
                                                            )
                                                        }
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
                                                    reloadable.error
                                                )}
                                                onMsg={(msg) => {
                                                    switch (msg.type) {
                                                        case 'close':
                                                            onMsg(msg)
                                                            break
                                                        case 'try_again_clicked':
                                                            setReloadable({
                                                                type: 'reloading',
                                                                params: reloadable.params,
                                                                data: reloadable.data,
                                                            })
                                                            break
                                                        /* istanbul ignore next */
                                                        default:
                                                            return notReachable(
                                                                msg
                                                            )
                                                    }
                                                }}
                                            />
                                        </>
                                    )
                                case 'error':
                                    return (
                                        <AppErrorPopup
                                            error={parseAppError(
                                                reloadable.error
                                            )}
                                            onMsg={(msg) => {
                                                switch (msg.type) {
                                                    case 'close':
                                                        onMsg(msg)
                                                        break
                                                    case 'try_again_clicked':
                                                        setReloadable({
                                                            type: 'loading',
                                                            params: reloadable.params,
                                                        })
                                                        break
                                                    /* istanbul ignore next */
                                                    default:
                                                        return notReachable(msg)
                                                }
                                            }}
                                        />
                                    )

                                default:
                                    return notReachable(reloadable)
                            }
                        })()}
                    </Group>
                </Section>
                <Actions>
                    {(() => {
                        switch (reloadable.type) {
                            case 'loaded':
                            case 'reloading':
                            case 'subsequent_failed':
                                return (
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        disabled={!selected.length}
                                        onClick={() => {
                                            const selectedSet =
                                                new Set<Address>(selected)

                                            const labels =
                                                generateAccountsLabels(
                                                    accounts,
                                                    'Wallet',
                                                    selected.length
                                                )

                                            onMsg({
                                                type: 'on_account_create_request',
                                                accountsWithKeystores:
                                                    reloadable.data
                                                        .filter((item) =>
                                                            selectedSet.has(
                                                                item.address
                                                            )
                                                        )
                                                        .map((item, index) => ({
                                                            account: {
                                                                address:
                                                                    item.address,
                                                                label: labels[
                                                                    index
                                                                ],
                                                                avatarSrc: null,
                                                            },
                                                            keystore: {
                                                                id: uuid(),
                                                                type: 'secret_phrase_key',
                                                                bip44Path:
                                                                    item.path,
                                                                encryptedPhrase:
                                                                    keystore.encryptedPhrase,
                                                                confirmed:
                                                                    keystore.confirmed,
                                                                googleDriveFile:
                                                                    keystore.googleDriveFile,
                                                            },
                                                        })),
                                            })
                                        }}
                                    >
                                        <FormattedMessage
                                            id="AddFromSecretPhrase.importWallets"
                                            defaultMessage={`{count, plural,
                                            =0 {No wallets selected}
                                            one {Import wallet}
                                            other {Import {count} wallets}}`}
                                            values={{
                                                count: selected.length,
                                            }}
                                        />
                                    </Button>
                                )

                            case 'loading':
                            case 'error':
                                return (
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        disabled
                                        onClick={noop}
                                    >
                                        <FormattedMessage
                                            id="AddFromSecretPhrase.importWallets"
                                            defaultMessage={`{count, plural,
                                            =0 {No wallets selected}
                                            one {Import wallet}
                                            other {Import {count} wallets}}`}
                                            values={{
                                                count: selected.length,
                                            }}
                                        />
                                    </Button>
                                )

                            default:
                                return notReachable(reloadable)
                        }
                    })()}
                </Actions>
            </Column>
        </Screen>
    )
}
