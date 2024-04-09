import { FormattedMessage } from 'react-intl'

import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { InfoCard } from '@zeal/uikit/InfoCard'

import { notReachable } from '@zeal/toolkit'
import { openExternalURL } from '@zeal/toolkit/Window'

import { TestNetwork } from '@zeal/domains/Network'

type Props = {
    testNetwork: TestNetwork
}

export const TopupTestNetworkNotification = ({ testNetwork }: Props) => {
    switch (testNetwork.name) {
        case 'EthereumSepolia':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL('https://sepolia-faucet.pk910.de/')
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.EthereumSepolia.primary"
                            defaultMessage="Top up your testnet SepETH"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.EthereumSepolia.secondary"
                            defaultMessage="Go to Sepolia Faucet"
                        />
                    }
                />
            )
        case 'EthereumGoerli':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL(
                            'https://faucet.quicknode.com/ethereum/goerli'
                        )
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.EthereumGoerli.primary"
                            defaultMessage="Top up your testnet ETH"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.EthereumGoerli.secondary"
                            defaultMessage="Go to Goerli Faucet"
                        />
                    }
                />
            )

        case 'PolygonMumbai':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL('https://faucet.polygon.technology/')
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.PolygonMumbai.primary"
                            defaultMessage="Top up your testnet MATIC"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.PolygonMumbai.secondary"
                            defaultMessage="Go to Mumbai Faucet"
                        />
                    }
                />
            )

        case 'BscTestnet':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL(
                            'https://testnet.bnbchain.org/faucet-smart'
                        )
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.BscTestnet.primary"
                            defaultMessage="Top up your testnet BNB"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.BscTestnet.secondary"
                            defaultMessage="Go to Faucet"
                        />
                    }
                />
            )
        case 'AvalancheFuji':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL('https://faucet.avax.network/')
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.AvalancheFuji.primary"
                            defaultMessage="Top up your testnet AVAX"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.AvalancheFuji.secondary"
                            defaultMessage="Go to Faucet"
                        />
                    }
                />
            )
        case 'OptimismGoerli':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL(
                            'https://faucet.quicknode.com/ethereum/goerli'
                        )
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.OptimismGoerli.primary"
                            defaultMessage="Top up your testnet ETH"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.OptimismGoerli.secondary"
                            defaultMessage="Go to Goerli Faucet"
                        />
                    }
                />
            )
        case 'FantomTestnet':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL('https://faucet.fantom.network/')
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.FantomTestnet.primary"
                            defaultMessage="Top up your testnet FTM"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.FantomTestnet.secondary"
                            defaultMessage="Go to Faucet"
                        />
                    }
                />
            )
        case 'ArbitrumGoerli':
            return (
                <InfoCard
                    onClick={() =>
                        openExternalURL(
                            'https://faucet.triangleplatform.com/arbitrum/goerli'
                        )
                    }
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.ArbitrumGoerli.primary"
                            defaultMessage="Top up your testnet ETH"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.ArbitrumGoerli.secondary"
                            defaultMessage="Go to Faucet"
                        />
                    }
                />
            )
        case 'AuroraTestnet':
            return (
                <InfoCard
                    onClick={() => openExternalURL('https://aurora.dev/faucet')}
                    variant="neutral"
                    icon={({ size }) => <InfoCircle size={size} />}
                    title={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.AuroraTestnet.primary"
                            defaultMessage="Top up your testnet ETH"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="portfolio.view.topupTestNet.AuroraTestnet.secondary"
                            defaultMessage="Go to Faucet"
                        />
                    }
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(testNetwork.name)
    }
}
