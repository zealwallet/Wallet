import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { EmptyStateWidget } from '@zeal/uikit/EmptyStateWidget'
import { Section } from '@zeal/uikit/Group'
import { Apps, NFT, Tokens } from '@zeal/uikit/Icon/Empty'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ErrorWidget } from '@zeal/domains/Account/components/Widget'
import { AppsGroupHeader } from '@zeal/domains/App/components/AppsGroupHeader'
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
    onMsg: (msg: Msg) => void
}

export type Msg =
    | MsgOf<typeof ErrorWidget>
    | MsgOf<typeof ActionBar>
    | { type: 'reload_button_click' }

const getScreenPadding = (
    mode: Mode
): React.ComponentProps<typeof Screen>['padding'] => {
    switch (mode) {
        case 'fullscreen':
            return 'form'
        case 'popup':
            return 'extension_connection_manager'
        default:
            return notReachable(mode)
    }
}

export const Error = ({
    account,
    installationId,
    currentNetwork,
    keystore,
    mode,
    networkMap,
    onMsg,
}: Props) => {
    const [tokensLabelId] = useState(uuid())
    return (
        <Screen padding={getScreenPadding(mode)} background="light">
            <Column spacing={12}>
                <Column spacing={8}>
                    <ActionBar
                        installationId={installationId}
                        mode={mode}
                        networkMap={networkMap}
                        onMsg={onMsg}
                    />

                    <ErrorWidget
                        installationId={installationId}
                        keystore={keystore}
                        currentNetwork={currentNetwork}
                        currentAccount={account}
                        onMsg={onMsg}
                    />
                </Column>

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
                            onClick={() =>
                                onMsg({ type: 'reload_button_click' })
                            }
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
            </Column>
        </Screen>
    )
}
