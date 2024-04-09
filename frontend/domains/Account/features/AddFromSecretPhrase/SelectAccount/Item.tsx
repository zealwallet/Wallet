import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Avatar as UIAvatar } from '@zeal/uikit/Avatar'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { NotSelected } from '@zeal/uikit/Icon/NotSelected'
import { ListItem } from '@zeal/uikit/ListItem'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Tag } from '@zeal/uikit/Tag'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { Account } from '@zeal/domains/Account'
import { Avatar } from '@zeal/domains/Account/components/Avatar'
import { Address } from '@zeal/domains/Address'
import { format } from '@zeal/domains/Address/helpers/format'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { fetchPortfolio } from '@zeal/domains/Portfolio/api/fetchPortfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Props = {
    address: Address
    isSelected: boolean
    index: number
    keystoreMap: KeyStoreMap
    accounts: Account[]
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    onClick: () => void
}

type State =
    | { type: 'not_imported_account' }
    | {
          type: 'imported_with_current_keystore_type'
          account: Account
          keystore: SecretPhrase
      }
    | {
          type: 'imported_other_keystore_type'
          account: Account
      }

const calculateState = (
    keyStoreMap: KeyStoreMap,
    accounts: Account[],
    address: Address
): State => {
    const account = accounts.find((account) => account.address === address)

    if (!account) {
        return { type: 'not_imported_account' }
    }

    const keystore = getKeyStore({ keyStoreMap, address: account.address })

    switch (keystore.type) {
        case 'private_key_store':
        case 'trezor':
        case 'ledger':
        case 'track_only':
        case 'safe_4337':
            return { type: 'imported_other_keystore_type', account }

        case 'secret_phrase_key':
            return {
                type: 'imported_with_current_keystore_type',
                account,
                keystore,
            }

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

/**
 * TODO It's almost same as frontend/wallet/src/domains/Account/features/Ledger/SelectAddresses/Layout/Item.tsx
 *                                                             /features/RestoreAccount/AddFromNewSecretPhrase/AccountSelection/Item.tsx
 *                                                             /features/AddFromExistingSecretPhrase/SelectAccount/Item.tsx
 *                                                             /features/AddFromTrezor/SelectAccounts/Item.tsx
 */
export const Item = ({
    address,
    keystoreMap,
    isSelected,
    accounts,
    customCurrencies,
    onClick,
    networkMap,
    networkRPCMap,
    currencyHiddenMap,
    index,
}: Props) => {
    const [loadable] = useLoadableData(fetchPortfolio, {
        type: 'loading',
        params: {
            address,
            customCurrencies,
            networkMap,
            networkRPCMap,
            forceRefresh: false,
        },
    })

    const state = calculateState(keystoreMap, accounts, address)

    switch (state.type) {
        case 'not_imported_account':
            return (
                <ListItem
                    onClick={onClick}
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <UIAvatar size={size} border="borderSecondary">
                            <Text
                                variant="caption1"
                                weight="medium"
                                color="textPrimary"
                                align="center"
                            >
                                {index + 1}
                            </Text>
                        </UIAvatar>
                    )}
                    primaryText={format(address)}
                    shortText={(() => {
                        switch (loadable.type) {
                            case 'loading':
                                return (
                                    <Skeleton
                                        variant="default"
                                        width={50}
                                        height={15}
                                    />
                                )

                            case 'loaded':
                                return (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        money={sumPortfolio(
                                            loadable.data,
                                            currencyHiddenMap
                                        )}
                                        knownCurrencies={
                                            loadable.data.currencies
                                        }
                                    />
                                )

                            case 'error':
                                return null

                            /* istanbul ignore next */
                            default:
                                return notReachable(loadable)
                        }
                    })()}
                    side={{
                        rightIcon: ({ size }) =>
                            isSelected ? (
                                <Checkbox size={size} color="iconAccent2" />
                            ) : (
                                <NotSelected size={size} color="iconDefault" />
                            ),
                    }}
                />
            )

        case 'imported_with_current_keystore_type':
            return (
                <ListItem
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <Avatar
                            account={state.account}
                            size={size}
                            keystore={state.keystore}
                        />
                    )}
                    primaryText={state.account.label}
                    shortText={(() => {
                        switch (loadable.type) {
                            case 'loading':
                                return (
                                    <Skeleton
                                        variant="default"
                                        width={50}
                                        height={15}
                                    />
                                )

                            case 'loaded':
                                return (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        money={sumPortfolio(
                                            loadable.data,
                                            currencyHiddenMap
                                        )}
                                        knownCurrencies={
                                            loadable.data.currencies
                                        }
                                    />
                                )

                            case 'error':
                                return null

                            /* istanbul ignore next */
                            default:
                                return notReachable(loadable)
                        }
                    })()}
                    side={{
                        rightIcon: () => (
                            <Tag bg="surfaceHover">
                                <Text
                                    variant="caption1"
                                    weight="regular"
                                    color="textSecondary"
                                >
                                    <FormattedMessage
                                        id="ledger.account_loaded.imported"
                                        defaultMessage="Imported"
                                    />
                                </Text>
                            </Tag>
                        ),
                    }}
                />
            )

        case 'imported_other_keystore_type':
            return (
                <ListItem
                    onClick={onClick}
                    aria-current={false}
                    size="regular"
                    avatar={({ size }) => (
                        <Avatar
                            account={state.account}
                            size={size}
                            keystore={getKeyStore({
                                keyStoreMap: keystoreMap,
                                address,
                            })}
                        />
                    )}
                    primaryText={state.account.label}
                    shortText={(() => {
                        switch (loadable.type) {
                            case 'loading':
                                return (
                                    <Skeleton
                                        variant="default"
                                        width={50}
                                        height={15}
                                    />
                                )

                            case 'loaded':
                                return (
                                    <FormattedTokenBalanceInDefaultCurrency
                                        money={sumPortfolio(
                                            loadable.data,
                                            currencyHiddenMap
                                        )}
                                        knownCurrencies={
                                            loadable.data.currencies
                                        }
                                    />
                                )

                            case 'error':
                                return null

                            /* istanbul ignore next */
                            default:
                                return notReachable(loadable)
                        }
                    })()}
                    side={{
                        rightIcon: ({ size }) =>
                            isSelected ? (
                                <Checkbox size={size} color="iconAccent2" />
                            ) : (
                                <NotSelected size={size} color="iconDefault" />
                            ),
                    }}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
