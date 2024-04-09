import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap, GasCurrencyPresetMap } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { SendNFT as SendNFTEntrypoint } from '@zeal/domains/Main'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import {
    PortfolioNFT,
    PortfolioNFTCollection,
} from '@zeal/domains/NFTCollection'
import { Portfolio, PortfolioMap } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { FeePresetMap } from '@zeal/domains/Transactions/api/fetchFeeForecast'

import { Flow } from './Flow'

type Props = {
    accountsMap: AccountsMap
    portfolioMap: PortfolioMap
    customCurrencyMap: CustomCurrencyMap
    keyStoreMap: KeyStoreMap
    sessionPassword: string
    installationId: string
    entryPoint: SendNFTEntrypoint
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    feePresetMap: FeePresetMap
    currencyHiddenMap: CurrencyHiddenMap
    portfolio: Portfolio
    gasCurrencyPresetMap: GasCurrencyPresetMap
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof Flow>

const calculateToken = ({
    entryPoint,
    accountsMap,
    portfolio,
}: {
    entryPoint: SendNFTEntrypoint
    accountsMap: AccountsMap
    portfolio: Portfolio
}): {
    fromAccount: Account
    nft: PortfolioNFT
    collection: PortfolioNFTCollection
} => {
    const fromAccount = accountsMap[entryPoint.fromAddress]
    if (!fromAccount) {
        throw new ImperativeError(
            'we try to send token from non existent account'
        )
    }

    const collection = portfolio.nftCollections.find((collection) => {
        return (
            collection.networkHexId === entryPoint.networkHexId &&
            collection.mintAddress === entryPoint.mintAddress
        )
    })
    if (!collection) {
        throw new ImperativeError(
            'we try to send NFT but we collection is missing in portfolio'
        )
    }

    const nft = collection.nfts.find((nft) => nft.tokenId === entryPoint.nftId)
    if (!nft) {
        throw new ImperativeError(
            'we try to send NFT but we cannot find NFT in collection'
        )
    }

    return { fromAccount, nft, collection }
}

export const SendNFT = ({
    entryPoint,
    accountsMap,
    customCurrencyMap,
    keyStoreMap,
    portfolio,
    sessionPassword,
    installationId,
    networkMap,
    networkRPCMap,
    feePresetMap,
    currencyHiddenMap,
    portfolioMap,
    onMsg,
    gasCurrencyPresetMap,
}: Props) => {
    const { fromAccount, collection, nft } = calculateToken({
        entryPoint,
        accountsMap,
        portfolio,
    })

    return (
        <Flow
            gasCurrencyPresetMap={gasCurrencyPresetMap}
            portfolio={portfolio}
            currencyHiddenMap={currencyHiddenMap}
            feePresetMap={feePresetMap}
            networkMap={networkMap}
            networkRPCMap={networkRPCMap}
            installationId={installationId}
            collection={collection}
            nft={nft}
            fromAccount={fromAccount}
            customCurrencyMap={customCurrencyMap}
            accountsMap={accountsMap}
            keyStoreMap={keyStoreMap}
            portfolioMap={portfolioMap}
            sessionPassword={sessionPassword}
            onMsg={onMsg}
        />
    )
}
