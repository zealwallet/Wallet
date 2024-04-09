import { Account } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'
import { Storage } from '@zeal/domains/Storage'

export const changeAccountLabel = (
    storage: Storage,
    account: Account,
    label: string
): Storage => {
    const { address } = account

    const existingAccount = storage.accounts[address] || null

    if (existingAccount) {
        return {
            ...storage,
            accounts: {
                ...storage.accounts,
                [address]: { ...existingAccount, label },
            },
        }
    }

    throw new ImperativeError(
        'Trying to change label of accounts which does not exist in storage'
    )
}
