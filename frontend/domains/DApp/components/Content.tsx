import { ComponentPropsWithoutRef } from 'react'

import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { Range } from '@zeal/toolkit/Range'

import { DAppSiteInfo } from '@zeal/domains/DApp'

import { Avatar } from './Avatar'

type Props = {
    dApp: DAppSiteInfo
    highlightHostName: Range | null
    avatarBadge?: ComponentPropsWithoutRef<typeof Avatar>['badge']
}

export const Content = ({ dApp, highlightHostName, avatarBadge }: Props) => {
    return (
        <Column spacing={0} alignX="center" alignY="center" fill>
            <Spacer />

            <Row spacing={0} alignX="center">
                <Column alignX="center" spacing={4}>
                    <Column alignX="center" spacing={12}>
                        <Avatar dApp={dApp} size={80} badge={avatarBadge} />
                        <Text
                            ellipsis
                            variant="title2"
                            weight="bold"
                            color="textPrimary"
                        >
                            {dApp.title}
                        </Text>
                    </Column>
                    <Text
                        ellipsis
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        {dApp.hostname}
                    </Text>
                </Column>
            </Row>

            <Spacer />
        </Column>
    )
}
