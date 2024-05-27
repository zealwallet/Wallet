import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'
import { WidgetContainer } from '@zeal/uikit/WidgetContainer'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { KeyStore } from '@zeal/domains/KeyStore'
import { CurrentNetwork } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'

import { AccountRow } from './AccountRow'
import { RefreshAndNetworkFilter } from './RefreshAndNetworkFilter'
import { ShowBalance } from './ShowBalance'

type Props = {
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    portfolio: Portfolio | null
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    installationId: string
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'account_filter_click' }
    | MsgOf<typeof RefreshAndNetworkFilter>
    | MsgOf<typeof AccountRow>

export const Widget = ({
    portfolio,
    currentAccount,
    currentNetwork,
    keystore,
    currencyHiddenMap,
    installationId,
    walletConnectInstanceLoadable,
    onMsg,
}: Props) => {
    return (
        <WidgetContainer
            onClick={() => onMsg({ type: 'account_filter_click' })}
        >
            <Column spacing={20}>
                <AccountRow
                    walletConnectInstanceLoadable={
                        walletConnectInstanceLoadable
                    }
                    installationId={installationId}
                    keystore={keystore}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />

                <Row spacing={8}>
                    <Text
                        variant="homeScreenTitle"
                        weight="medium"
                        color="textOnColorPrimiary"
                    >
                        <ShowBalance
                            currencyHiddenMap={currencyHiddenMap}
                            portfolio={portfolio}
                            currentNetwork={currentNetwork}
                        />
                    </Text>

                    <Spacer />

                    <RefreshAndNetworkFilter
                        currentNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </Row>
            </Column>
        </WidgetContainer>
    )
}

export const WidgetSkeleton = ({
    currentAccount,
    currentNetwork,
    installationId,
    keystore,
    walletConnectInstanceLoadable,
    onMsg,
}: {
    currentAccount: Account
    installationId: string
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    onMsg: (msg: Msg) => void
}) => {
    return (
        <WidgetContainer
            onClick={() => onMsg({ type: 'account_filter_click' })}
        >
            <Column spacing={20}>
                <AccountRow
                    walletConnectInstanceLoadable={
                        walletConnectInstanceLoadable
                    }
                    installationId={installationId}
                    keystore={keystore}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />

                <Row spacing={8}>
                    <Skeleton variant="transparent" width={155} height={43} />

                    <Spacer />

                    <RefreshAndNetworkFilter
                        currentNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </Row>
            </Column>
        </WidgetContainer>
    )
}

export const ErrorWidget = ({
    currentNetwork,
    currentAccount,
    keystore,
    installationId,
    walletConnectInstanceLoadable,
    onMsg,
}: {
    currentAccount: Account
    keystore: KeyStore
    currentNetwork: CurrentNetwork
    installationId: string
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    onMsg: (msg: Msg) => void
}) => {
    return (
        <WidgetContainer
            onClick={() => onMsg({ type: 'account_filter_click' })}
        >
            <Column spacing={32}>
                <AccountRow
                    walletConnectInstanceLoadable={
                        walletConnectInstanceLoadable
                    }
                    installationId={installationId}
                    keystore={keystore}
                    currentAccount={currentAccount}
                    onMsg={onMsg}
                />

                <Row spacing={8}>
                    <Text variant="title1" weight="bold" color="textOnDark">
                        &nbsp;
                    </Text>

                    <Spacer />

                    <RefreshAndNetworkFilter
                        currentNetwork={currentNetwork}
                        onMsg={onMsg}
                    />
                </Row>
            </Column>
        </WidgetContainer>
    )
}
