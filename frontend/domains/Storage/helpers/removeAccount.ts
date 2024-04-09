import { notReachable } from '@zeal/toolkit'
import { keys, values } from '@zeal/toolkit/Object'

import { Account } from '@zeal/domains/Account'
import { removeKeyStore } from '@zeal/domains/KeyStore/helpers/removeKeyStore'
import { removePortfolio } from '@zeal/domains/Portfolio/helpers/removePortfolio'
import { Storage } from '@zeal/domains/Storage'
import { DAppConnectionState } from '@zeal/domains/Storage/domains/DAppConnectionState'

export const removeAccount = (
    storage: Storage,
    account: Account
): Storage | null => {
    const k: keyof Storage = keys(storage)[0]
    switch (k) {
        case 'encryptedPassword':
        case 'selectedAddress':
        case 'fetchedAt':
        case 'accounts':
        case 'portfolios':
        case 'keystoreMap':
        case 'transactionRequests':
        case 'dApps':
        case 'customCurrencies':
        case 'swapSlippagePercent':
        case 'submitedBridges':
        case 'customNetworkMap':
        case 'networkRPCMap':
        case 'bankTransferInfo':
        case 'isOnboardingStorySeen':
        case 'feePresetMap':
        case 'currencyHiddenMap':
        case 'currencyPinMap':
        case 'submittedOffRampTransactions':
        case 'gasCurrencyPresetMap':
        case 'userMadeActionOnNextBestActionIds':
            // !!! :: every time you add some indexes to storage make sure you do clean up when account is deleted
            break
        /* istanbul ignore next */
        default:
            return notReachable(k)
    }

    const bankTransferInfo = (() => {
        switch (storage.bankTransferInfo.type) {
            case 'not_started':
                return storage.bankTransferInfo

            case 'unblock_user_created':
            case 'bank_transfer_unblock_user_created_for_safe_wallet':
                return storage.bankTransferInfo.connectedWalletAddress ===
                    account.address
                    ? { type: 'not_started' as const }
                    : storage.bankTransferInfo

            default:
                return notReachable(storage.bankTransferInfo)
        }
    })()

    const accounts = { ...storage.accounts }
    delete accounts[account.address]

    const portfolios = removePortfolio({
        address: account.address,
        portfolioMap: storage.portfolios,
    })

    const keystoreMap = removeKeyStore({
        keyStoreMap: storage.keystoreMap,
        address: account.address,
    })

    const { [account.address]: _accTrxRequests, ...transactionRequests } =
        storage.transactionRequests

    const { [account.address]: _accBridgeRequests, ...submitedBridges } =
        storage.submitedBridges

    const dApps = values(storage.dApps)
        .map((dAppConnectionState): DAppConnectionState => {
            switch (dAppConnectionState.type) {
                case 'disconnected':
                case 'connected_to_meta_mask':
                    return dAppConnectionState
                case 'connected':
                    return dAppConnectionState.address === account.address
                        ? {
                              type: 'disconnected',
                              networkHexId: dAppConnectionState.networkHexId,
                              dApp: dAppConnectionState.dApp,
                          }
                        : dAppConnectionState

                /* istanbul ignore next */
                default:
                    return notReachable(dAppConnectionState)
            }
        })
        .reduce((memo, currentValue) => {
            memo[currentValue.dApp.hostname] = currentValue
            return memo
        }, {} as Record<string, DAppConnectionState>)

    const leftAccount = values(accounts)[0]
    return leftAccount
        ? {
              ...storage,
              selectedAddress: leftAccount.address,
              portfolios,
              accounts,
              dApps,
              keystoreMap,
              submitedBridges,
              transactionRequests,
              bankTransferInfo,
          }
        : null
}
