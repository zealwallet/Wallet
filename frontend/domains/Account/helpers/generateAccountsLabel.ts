import { generateUniqueLabels } from '@zeal/toolkit/String/generateUniqueLabels'

import { Account } from '@zeal/domains/Account'

export const generateAccountsLabels = (
    existingAccounts: Account[],
    prefix: string,
    count: number
): string[] => {
    const existingLabels = existingAccounts.map((account) => account.label)
    return generateUniqueLabels(existingLabels, prefix, count)
}

export const DEFAULT_WALLET_LABEL = 'Wallet'
export const generateAccountLabel = (
    existingAccounts: Account[],
    prefix: string
): string => {
    const [label] = generateAccountsLabels(existingAccounts, prefix, 1)
    return label
}
