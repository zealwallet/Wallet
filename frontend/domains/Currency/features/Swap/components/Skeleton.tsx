import { Column } from '@zeal/uikit/Column'
import { FeeInputButton } from '@zeal/uikit/FeeInputButton'
import { Group } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Skeleton as UISkeleton } from '@zeal/uikit/Skeleton'
import { Spacer } from '@zeal/uikit/Spacer'

import { noop } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    onClose: () => void
    account: Account
    keystoreMap: KeyStoreMap
}

export const Skeleton = ({ onClose, account, keystoreMap }: Props) => {
    return (
        <Screen background="light" padding="form" onNavigateBack={onClose}>
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                network={null}
                left={
                    <IconButton variant="on_light" onClick={onClose}>
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={16}>
                <Group variant="default">
                    <Column spacing={16}>
                        <Column spacing={24}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <Row spacing={4} alignX="stretch">
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={32}
                                />

                                <UISkeleton
                                    variant="default"
                                    width={35}
                                    height={15}
                                />
                            </Row>
                        </Column>
                        <Row spacing={4} alignX="stretch">
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column>
                </Group>

                <Group variant="default">
                    <Column spacing={16}>
                        <Column spacing={24}>
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <Row spacing={4} alignX="stretch">
                                <UISkeleton
                                    variant="default"
                                    width={75}
                                    height={32}
                                />

                                <UISkeleton
                                    variant="default"
                                    width={35}
                                    height={15}
                                />
                            </Row>
                        </Column>
                        <Row spacing={4} alignX="stretch">
                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />

                            <UISkeleton
                                variant="default"
                                width={55}
                                height={15}
                            />
                        </Row>
                    </Column>
                </Group>
            </Column>

            <Spacer />

            <Column spacing={8}>
                <FeeInputButton
                    left={
                        <UISkeleton variant="default" width={35} height={16} />
                    }
                    right={
                        <UISkeleton variant="default" width={55} height={16} />
                    }
                    onClick={noop}
                />

                <UISkeleton variant="default" width="100%" height={42} />
            </Column>
        </Screen>
    )
}
