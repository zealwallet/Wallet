import { notReachable } from '@zeal/toolkit'
import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { sortByBalance } from '@zeal/domains/Account/helpers/sortByBalance'
import { Address } from '@zeal/domains/Address'
import { parse } from '@zeal/domains/Address/helpers/parse'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'

type SearchResults =
    | { type: 'accounts_not_found_search_valid_address'; address: Address }
    | { type: 'accounts_not_found' }
    | { type: 'grouped_accounts'; tracked: Account[]; active: Account[] }

type Params = {
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    search: string
}

const doesMatchSearch = (account: Account, search: string): boolean => {
    return search
        .toLowerCase()
        .split(' ')
        .every(
            (word) =>
                account.label.toLowerCase().includes(word) ||
                account.address.toLowerCase().includes(word)
        )
}

export const validateAccountSearch = ({
    accountsMap,
    keystoreMap,
    portfolioMap,
    currencyHiddenMap,
    search,
}: Params): SearchResults => {
    const accounts = values(accountsMap)

    if (!search && accounts.length === 0) {
        return { type: 'grouped_accounts', active: [], tracked: [] }
    }

    const tracked = accounts
        .filter((account) => {
            const keystore = getKeyStore({
                keyStoreMap: keystoreMap,
                address: account.address,
            })

            switch (keystore.type) {
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                case 'safe_4337':
                    return false

                case 'track_only':
                    return true

                /* istanbul ignore next */
                default:
                    return notReachable(keystore)
            }
        })
        .filter((account) => doesMatchSearch(account, search))
        .sort((a, b) => a.label.localeCompare(b.label))

    const active = accounts
        .filter((account) => {
            const keystore = getKeyStore({
                keyStoreMap: keystoreMap,
                address: account.address,
            })

            switch (keystore.type) {
                case 'private_key_store':
                case 'ledger':
                case 'secret_phrase_key':
                case 'trezor':
                case 'safe_4337':
                    return true

                case 'track_only':
                    return false

                /* istanbul ignore next */
                default:
                    return notReachable(keystore)
            }
        })
        .filter((account) => doesMatchSearch(account, search))
        .sort(sortByBalance(portfolioMap, currencyHiddenMap))

    if (tracked.length || active.length) {
        return {
            type: 'grouped_accounts',
            active,
            tracked,
        }
    }

    const parseAddress = parse(search)
    switch (parseAddress.type) {
        case 'Failure':
            return { type: 'accounts_not_found' }
        case 'Success':
            return {
                type: 'accounts_not_found_search_valid_address',
                address: parseAddress.data,
            }
        /* istanbul ignore next */
        default:
            return notReachable(parseAddress)
    }
}
