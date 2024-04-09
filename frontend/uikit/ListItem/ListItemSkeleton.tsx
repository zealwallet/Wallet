import React from 'react'
import { View } from 'react-native'

import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'

import {
    AVATAR_SIZE,
    AvatarRenderProps,
    ICON_SIZE,
    IconRenderProps,
} from './InternalItem'
import { styles } from './ListItem'

export type ListItemSkeletonProps = {
    avatar?: true | ((avatarRenderProps: AvatarRenderProps) => React.ReactNode)
    shortText?: boolean
    side?: {
        rightIcon?: (iconRenderProps: IconRenderProps) => React.ReactNode
    }
}

export const ListItemSkeleton = ({
    avatar,
    shortText,
    side,
}: ListItemSkeletonProps) => {
    return (
        <View style={[styles.container]}>
            <Row spacing={8}>
                <Row grow shrink ignoreContentWidth spacing={12}>
                    {!avatar ? null : avatar === true ? (
                        <Skeleton
                            variant="default"
                            height={AVATAR_SIZE}
                            width={AVATAR_SIZE}
                        />
                    ) : (
                        avatar({ size: AVATAR_SIZE })
                    )}
                    <Column spacing={4} shrink>
                        <Skeleton variant="default" height={18} width="75%" />
                        {shortText && (
                            <Skeleton
                                variant="default"
                                height={15}
                                width="25%"
                            />
                        )}
                    </Column>
                </Row>

                {side && (
                    <Row spacing={8}>
                        {side.rightIcon ? (
                            <Row spacing={0} alignY="center">
                                {side.rightIcon({ size: ICON_SIZE })}
                            </Row>
                        ) : null}
                    </Row>
                )}
            </Row>
        </View>
    )
}
