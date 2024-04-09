import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Chain } from 'viem'
import { Config, createConfig, http, WagmiProvider } from 'wagmi'
import * as wagmiChains from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { OutlineWallet } from '@zeal/uikit/Icon/OutlineWallet'
import { AmountInput } from '@zeal/uikit/Input/AmountInput'
import { ListItem } from '@zeal/uikit/ListItem'
import { NextStepSeparator } from '@zeal/uikit/NextStepSeparator'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { values } from '@zeal/toolkit/Object'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import { CryptoCurrency } from '@zeal/domains/Currency'
import { AppErrorPopup } from '@zeal/domains/Error/components/AppErrorPopup'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { NetworkHexId } from '@zeal/domains/Network'
import { parseNetworkHexId } from '@zeal/domains/Network/helpers/parse'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { fetchSupportedTopUpCurrencies } from 'src/features/SendCryptoCurrency/api/fetchSupportedTopUpCurrencies'

import { Flow } from './Flow'

type Props = {
    zealAccount: Account
}

const createWagmiConfigWithSupportedCurrencies = (
    cryptoCurrencies: CryptoCurrency[]
): { config: Config; supportedCurrencies: CryptoCurrency[] } => {
    const numericChainIds = new Set(
        cryptoCurrencies.map((currency) => Number(currency.networkHexChainId))
    )

    const wagmiFilteredChains: Chain[] = values(wagmiChains).filter(
        (chain: Chain) => numericChainIds.has(chain.id)
    )

    const [firstChain, ...otherChains]: Chain[] = wagmiFilteredChains

    const wagmiChainHexIds: Set<NetworkHexId> = new Set<NetworkHexId>(
        wagmiFilteredChains
            .map((chain) => chain.id.toString(10))
            .map((id) => {
                const result = parseNetworkHexId(id)
                switch (result.type) {
                    case 'Failure':
                        return null
                    case 'Success':
                        return result.data

                    default:
                        return notReachable(result)
                }
            })
            .filter((result): result is NetworkHexId => result !== null)
    )

    const config = createConfig({
        chains: [firstChain, ...otherChains],
        multiInjectedProviderDiscovery: true,
        connectors: [
            injected(),
            coinbaseWallet({ appName: 'Zeal' }),
            walletConnect({
                projectId: '77e3b295469d80a9a369cc184afe0369',
            }),
        ],
        transports: wagmiFilteredChains.reduce((hash, chain) => {
            if (chain && chain.id) {
                hash[chain.id] = http()
            }

            return hash
        }, {} as Record<number, ReturnType<typeof http>>),
    })

    return {
        config,
        supportedCurrencies: cryptoCurrencies.filter((currency) =>
            wagmiChainHexIds.has(currency.networkHexChainId)
        ),
    }
}

const fetchSupportedCurrencies = async (): Promise<{
    config: Config
    supportedCurrencies: CryptoCurrency[]
}> => {
    const cryptoCurrencies = await fetchSupportedTopUpCurrencies()
    return createWagmiConfigWithSupportedCurrencies(cryptoCurrencies)
}

const queryClient = new QueryClient()

export const DataLoader = ({ zealAccount }: Props) => {
    const [loadable, setLoadable] = useLoadableData(fetchSupportedCurrencies, {
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        postUserEvent({
            type: 'TopUpDappOpenedEvent',
            installationId: 'dapp-no-installation-id',
        })
    }, [])

    switch (loadable.type) {
        case 'loading':
            return <Skeleton zealAccount={zealAccount} />

        case 'loaded':
            return (
                <WagmiProvider config={loadable.data.config}>
                    <QueryClientProvider client={queryClient}>
                        <Flow
                            topUpCurrencies={loadable.data.supportedCurrencies}
                            zealAccount={zealAccount}
                        />
                    </QueryClientProvider>
                </WagmiProvider>
            )
        case 'error':
            return (
                <>
                    <Skeleton zealAccount={zealAccount} />
                    <AppErrorPopup
                        error={parseAppError(loadable.error)}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'try_again_clicked':
                                    setLoadable({
                                        type: 'loading',
                                        params: loadable.params,
                                    })
                                    break

                                /* istanbul ignore next */
                                default:
                                    notReachable(msg)
                            }
                        }}
                    />
                </>
            )

        /* istanbul ignore next */
        default:
            return notReachable(loadable)
    }
}

const Skeleton = ({ zealAccount }: { zealAccount: Account }) => (
    <Screen padding="form" background="light">
        <UIActionBar
            top={
                <Row spacing={8}>
                    <OutlineWallet size={24} color="textSecondary" />
                    <Text
                        variant="paragraph"
                        weight="medium"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="topUpDapp.connectWallet"
                            defaultMessage="Connect wallet"
                        />
                    </Text>
                </Row>
            }
            left={
                <Text variant="title3" weight="semi_bold" color="textPrimary">
                    <FormattedMessage
                        id="topup.addFundsToZeal"
                        defaultMessage="Add funds to Zeal"
                    />
                </Text>
            }
        />

        <Column spacing={16} shrink alignY="stretch">
            <Column spacing={4}>
                <AmountInput
                    state="normal"
                    content={{
                        topLeft: (
                            <Row spacing={8}>
                                <UISkeleton
                                    variant="default"
                                    width={32}
                                    height={32}
                                />
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={20}
                                />
                            </Row>
                        ),
                        topRight: () => (
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={20}
                            />
                        ),
                        bottomRight: (
                            <UISkeleton
                                variant="default"
                                width={35}
                                height={10}
                            />
                        ),
                    }}
                />

                <NextStepSeparator />

                <Group variant="default">
                    <ListItem
                        size="large"
                        aria-current={false}
                        avatar={({ size }) => (
                            <AvatarWithoutBadge
                                size={size}
                                account={zealAccount}
                            />
                        )}
                        primaryText={zealAccount.label}
                        shortText={formatAddress(zealAccount.address)}
                    />
                </Group>
            </Column>

            <Actions>
                <Button size="regular" variant="primary" disabled>
                    <FormattedMessage
                        id="topUpDapp.connectWallet"
                        defaultMessage="Connect wallet"
                    />
                </Button>
            </Actions>
        </Column>
    </Screen>
)
