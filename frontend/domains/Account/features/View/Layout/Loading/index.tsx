import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { WidgetSkeleton } from '@zeal/domains/Account/components/Widget'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Mode } from '@zeal/domains/Main'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'

import { ActionBar } from '../ActionBar'

type Props = {
    account: Account
    installationId: string
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    networkMap: NetworkMap
    mode: Mode
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof WidgetSkeleton> | MsgOf<typeof ActionBar>

export const Loading = ({
    account,
    currentNetwork,
    keystore,
    installationId,
    mode,
    networkMap,
    walletConnectInstanceLoadable,
    onMsg,
}: Props) => {
    return (
        <>
            <ActionBar
                installationId={installationId}
                mode={mode}
                networkMap={networkMap}
                onMsg={onMsg}
            />
            <WidgetSkeleton
                walletConnectInstanceLoadable={walletConnectInstanceLoadable}
                installationId={installationId}
                keystore={keystore}
                currentNetwork={currentNetwork}
                currentAccount={account}
                onMsg={onMsg}
            />
            <Column spacing={16}>
                {new Array(3).fill(1).map((_, index) => (
                    <Section key={`s-${index}`}>
                        <Row spacing={0}>
                            <Skeleton
                                variant="default"
                                width={75}
                                height={18}
                            />
                            <Spacer />
                            <Skeleton
                                variant="default"
                                width={35}
                                height={18}
                            />
                        </Row>

                        <Group variant="default">
                            <Column spacing={24}>
                                {new Array(3).fill(1).map((_, index) => (
                                    <Skeleton
                                        key={`sk-${index}`}
                                        variant="default"
                                        width="100%"
                                        height={12}
                                    />
                                ))}
                            </Column>
                        </Group>
                    </Section>
                ))}
            </Column>
        </>
    )
}
