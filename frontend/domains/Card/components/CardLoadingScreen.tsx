import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { CardWidget } from '@zeal/uikit/CardWidget'
import { Column } from '@zeal/uikit/Column'
import { Group, GroupHeader } from '@zeal/uikit/Group'
import { ListItem } from '@zeal/uikit/ListItem'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { SectionList } from '@zeal/uikit/SectionList'
import { Skeleton } from '@zeal/uikit/Skeleton'
import { Text } from '@zeal/uikit/Text'

import { noop } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'

type Props = {
    account: Account
}

export const CardLoadingScreen = ({ account }: Props) => {
    return (
        <Screen
            padding="controller_tabs_fullscreen"
            background="light"
            onNavigateBack={null}
        >
            <UIActionBar
                left={
                    <Row spacing={8}>
                        <AccountAvatar size={24} account={account} />
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>

                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {formatAddress(account.address)}
                        </Text>
                    </Row>
                }
            />
            <Column spacing={8}>
                <CardWidget side="front" />

                <Row spacing={8} alignX="center">
                    <Skeleton variant="default" width="30%" height={68} />

                    <Skeleton variant="default" width="30%" height={68} />

                    <Skeleton variant="default" width="30%" height={68} />
                </Row>

                <Group variant="default">
                    <SectionList
                        variant="default"
                        sections={[
                            {
                                data: new Array(3).fill(true).map((_, i) => i),
                            },
                        ]}
                        itemSpacing={12}
                        sectionSpacing={12}
                        renderSectionHeader={() => (
                            <GroupHeader
                                right={null}
                                left={() => (
                                    <Skeleton variant="default" width={150} />
                                )}
                            />
                        )}
                        footer={null}
                        onEndReached={noop}
                        renderItem={() => (
                            <ListItem
                                avatar={({ size }) => (
                                    <Skeleton
                                        variant="default"
                                        height={size}
                                        width={size}
                                    />
                                )}
                                size="regular"
                                primaryText={
                                    <Skeleton
                                        variant="default"
                                        width={75}
                                        height={18}
                                    />
                                }
                                shortText={
                                    <Skeleton
                                        variant="default"
                                        width={25}
                                        height={16}
                                    />
                                }
                                side={{
                                    title: (
                                        <Skeleton
                                            variant="default"
                                            width={50}
                                            height={18}
                                        />
                                    ),
                                    subtitle: (
                                        <Skeleton
                                            variant="default"
                                            width={25}
                                            height={16}
                                        />
                                    ),
                                }}
                                aria-current={false}
                            />
                        )}
                    />
                </Group>
            </Column>
        </Screen>
    )
}
