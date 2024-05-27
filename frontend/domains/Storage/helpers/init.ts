import { Storage } from '../index'

export const init = (encryptedPassword: string): Storage => {
    return {
        selectedAddress: null,
        fetchedAt: new Date(),
        accounts: {},
        portfolios: {},
        keystoreMap: {},
        dApps: {},
        encryptedPassword,
        transactionRequests: {},
        submitedBridges: {},
        submittedOffRampTransactions: [],
        customCurrencies: {},
        swapSlippagePercent: null,
        customNetworkMap: {},
        networkRPCMap: {},
        bankTransferInfo: { type: 'not_started' },
        isOnboardingStorySeen: false,
        feePresetMap: {},
        currencyHiddenMap: {},
        currencyPinMap: {},
        gasCurrencyPresetMap: {},
        cardConfig: { type: 'card_owner_address_is_not_selected' },
    }
}
