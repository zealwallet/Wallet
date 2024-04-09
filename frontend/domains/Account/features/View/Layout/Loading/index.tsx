import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { WidgetSkeleton } from '@zeal/domains/Account/components/Widget'
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
    onMsg: (msg: Msg) => void
}

export type Msg = MsgOf<typeof WidgetSkeleton> | MsgOf<typeof ActionBar>

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

export const Loading = ({
    account,
    currentNetwork,
    keystore,
    installationId,
    mode,
    networkMap,
    onMsg,
}: Props) => {
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

                    <WidgetSkeleton
                        installationId={installationId}
                        keystore={keystore}
                        currentNetwork={currentNetwork}
                        currentAccount={account}
                        onMsg={onMsg}
                    />
                </Column>

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
            </Column>
        </Screen>
    )
}
