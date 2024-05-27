import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Section } from '@zeal/uikit/Group'
import { Apps, NFT, Tokens } from '@zeal/uikit/Icon/Empty'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { uuid } from '@zeal/toolkit/Crypto'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ErrorWidget } from '@zeal/domains/Account/components/Widget'
import { AppsGroupHeader } from '@zeal/domains/App/components/AppsGroupHeader'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Mode } from '@zeal/domains/Main'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { GroupHeader as NFTGroupHeader } from '@zeal/domains/NFTCollection/components/GroupHeader'
import { TokensGroupHeader } from '@zeal/domains/Token/components/TokensGroupHeader'

import { ActionBar } from '../ActionBar'

type Props = {
    installationId: string
    account: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    networkMap: NetworkMap
    mode: Mode
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof ErrorWidget>
    | MsgOf<typeof ActionBar>
    | { type: 'reload_button_click' }

export const Error = ({
    account,
    installationId,
    currentNetwork,
    keystore,
    mode,
    networkMap,
    walletConnectInstanceLoadable,
    onMsg,
}: Props) => {
    const [tokensLabelId] = useState(uuid())
    return (
        <>
            <ActionBar
                installationId={installationId}
                mode={mode}
                networkMap={networkMap}
                onMsg={onMsg}
            />

            <ErrorWidget
                walletConnectInstanceLoadable={walletConnectInstanceLoadable}
                installationId={installationId}
                keystore={keystore}
                currentNetwork={currentNetwork}
                currentAccount={account}
                onMsg={onMsg}
            />

            <Column spacing={16}>
                <Section aria-labelledby={tokensLabelId}>
                    <TokensGroupHeader
                        labelId={tokensLabelId}
                        onClick={null}
                        tokens={[]}
                        knownCurrencies={{}}
                    />
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <Tokens size={size} color="backgroundLight" />
                        )}
                        title={
                            <FormattedMessage
                                id="token.widget.errorState"
                                defaultMessage="We failed to load your tokens"
                            />
                        }
                    />
                </Section>

                <Section>
                    <AppsGroupHeader
                        apps={[]}
                        knownCurrencies={{}}
                        onClick={null}
                    />
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <Apps size={size} color="backgroundLight" />
                        )}
                        title={
                            <FormattedMessage
                                id="app.widget.errorState"
                                defaultMessage="We failed to load your apps"
                            />
                        }
                    />
                </Section>

                <Section>
                    <NFTGroupHeader
                        nftCollections={[]}
                        knownCurrencies={{}}
                        onClick={null}
                    />
                    <EmptyStateWidget
                        size="regular"
                        icon={({ size }) => (
                            <NFT size={size} color="backgroundLight" />
                        )}
                        title={
                            <FormattedMessage
                                id="nft.widget.errorState"
                                defaultMessage="We failed to load your NFTs"
                            />
                        }
                    />
                </Section>

                <Row spacing={0} alignX="center">
                    <Tertiary
                        color="on_light"
                        size="regular"
                        onClick={() => onMsg({ type: 'reload_button_click' })}
                    >
                        {({ color, textVariant, textWeight }) => (
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="account.view.error.refreshAssets"
                                    defaultMessage="Refresh"
                                />
                            </Text>
                        )}
                    </Tertiary>
                </Row>
            </Column>
        </>
    )
}
