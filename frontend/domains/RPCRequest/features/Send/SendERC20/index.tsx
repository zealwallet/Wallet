import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { NoTokenSelected } from './NoTokenSelected'
import { TokenSelected } from './TokenSelected'

type Props = {
    portfolio: Portfolio
    currencyId: CurrencyId | null
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    sessionPassword: string
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap
    customCurrencies: CustomCurrencyMap

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof TokenSelected> | MsgOf<typeof NoTokenSelected>

const calculateToken = (
    currencyId: CurrencyId | null,
    portfolio: Portfolio
): Token | null => {
    const token =
        portfolio &&
        portfolio.tokens.find(
            (token) => token.balance.currencyId === currencyId
        )
    return token || null
}

export const SendERC20 = ({
    account,
    portfolioMap,
    currencyId,
    accountsMap,
    sessionPassword,
    customCurrencies,
    onMsg,
    installationId,
    keyStoreMap,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    portfolio,
    gasCurrencyPresetMap,
}: Props) => {
    const token = calculateToken(currencyId, portfolio)

    return token ? (
        <TokenSelected
            selectedToken={token}
            portfolio={portfolio}
            account={account}
            accountsMap={accountsMap}
            keyStoreMap={keyStoreMap}
            portfolioMap={portfolioMap}
            sessionPassword={sessionPassword}
            feePresetMap={feePresetMap}
            gasCurrencyPresetMap={gasCurrencyPresetMap}
            installationId={installationId}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            customCurrencies={customCurrencies}
            currencyHiddenMap={currencyHiddenMap}
            currencyPinMap={currencyPinMap}
            onMsg={onMsg}
        />
    ) : (
        <NoTokenSelected
            portfolio={portfolio}
            account={account}
            accountsMap={accountsMap}
            keyStoreMap={keyStoreMap}
            portfolioMap={portfolioMap}
            sessionPassword={sessionPassword}
            feePresetMap={feePresetMap}
            gasCurrencyPresetMap={gasCurrencyPresetMap}
            installationId={installationId}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            customCurrencies={customCurrencies}
            currencyHiddenMap={currencyHiddenMap}
            currencyPinMap={currencyPinMap}
            onMsg={onMsg}
        />
    )
}
