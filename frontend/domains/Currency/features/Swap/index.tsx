import { MsgOf } from '@zeal/toolkit/MsgOf'

import { AccountsMap } from '@zeal/domains/Account'
import {
    CurrencyHiddenMap,
    CurrencyPinMap,
    GasCurrencyPresetMap,
} from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { Swap as SwapEntrypoint } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { DataLoader } from './DataLoader'

type Props = {
    entrypoint: SwapEntrypoint

    accountsMap: AccountsMap
    portfolioMap: PortfolioMap

    customCurrencies: CustomCurrencyMap

    sessionPassword: string
    keystoreMap: KeyStoreMap
    installationId: string
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    gasCurrencyPresetMap: GasCurrencyPresetMap

    swapSlippagePercent: number | null

    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap

    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof DataLoader>

export const Swap = ({
    entrypoint: { fromAddress, fromCurrencyId },
    portfolioMap,
    accountsMap,
    installationId,
    keystoreMap,
    sessionPassword,
    swapSlippagePercent,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    currencyPinMap,
    customCurrencies,
    gasCurrencyPresetMap,
    onMsg,
}: Props) => {
    return (
        <DataLoader
            gasCurrencyPresetMap={gasCurrencyPresetMap}
            customCurrencies={customCurrencies}
            feePresetMap={feePresetMap}
            currencyHiddenMap={currencyHiddenMap}
            currencyPinMap={currencyPinMap}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            swapSlippagePercent={swapSlippagePercent}
            accountsMap={accountsMap}
            installationId={installationId}
            keystoreMap={keystoreMap}
            sessionPassword={sessionPassword}
            fromCurrencyId={fromCurrencyId}
            fromAccount={accountsMap[fromAddress]}
            portfolio={getPortfolio({
                address: fromAddress,
                portfolioMap,
            })}
            onMsg={onMsg}
        />
    )
}
