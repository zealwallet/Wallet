import { Account, AccountsMap } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStore, KeyStoreMap } from '@zeal/domains/KeyStore'
import { addKeyStore } from '@zeal/domains/KeyStore/helpers/addKeyStore'
import { Storage } from '@zeal/domains/Storage'

export const addAccountsWithKeystores = (
    storage: Storage,
    accountsWithKeystores: { account: Account; keystore: KeyStore }[]
): Storage => {
    if (!accountsWithKeystores.length) {
        throw new ImperativeError(`Trying to add zero accounts`)
    }

    const newKeyStores: KeyStoreMap = accountsWithKeystores.reduce(
        (map, { account, keystore }) =>
            addKeyStore({
                keyStoreMap: map,
                address: account.address,
                keyStore: keystore,
            }),
        {} as KeyStoreMap
    )

    const newAccounts: AccountsMap = accountsWithKeystores.reduce(
        (map, { account }) => {
            map[account.address] = account
            return map
        },
        {} as AccountsMap
    )

    return {
        ...storage,
        selectedAddress: accountsWithKeystores[0].account.address,
        accounts: {
            ...storage.accounts,
            ...newAccounts,
        },
        keystoreMap: {
            ...storage.keystoreMap,
            ...newKeyStores,
        },
    }
}
