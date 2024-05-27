import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'

import { notReachable } from '@zeal/toolkit'

import { BadgeSize } from './Badge'

import { Color, colors } from '../colors'

export type AvatarSize =
    | 10
    | 12
    | 14
    | 16
    | 18
    | 20
    | 24
    | 28
    | 32
    | 40
    | 48
    | 64
    | 72
    | 80
    | 92
    | 146
    | 320

const AVATAR_SIZE_TO_BADGE_SIZE: Record<AvatarSize, BadgeSize> = {
    10: 10,
    12: 10,
    14: 10,
    16: 10,
    18: 10,
    20: 10,
    24: 10,
    28: 12,
    32: 16,
    40: 16,
    48: 16,
    64: 16,
    72: 48,
    80: 32,
    92: 48,
    146: 48,
    320: 48,
}

type AvatarBorderColor = Extract<Color, `border${string}`>

type Props = {
    size: AvatarSize
    backgroundColor?: Color
    leftBadge?: (renderProps: { size: BadgeSize }) => React.ReactNode
    rightBadge?: (renderProps: { size: BadgeSize }) => React.ReactNode
    variant?: 'round' | 'squared' | 'rounded' | 'square'
    border?: AvatarBorderColor

    children: React.ReactNode
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
    },

    borderContainer_none: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
    },

    badge: {
        position: 'absolute',
    },
})

const getBorderStyle = (border: AvatarBorderColor): ViewStyle => ({
    position: 'absolute',
    top: -1,
    left: -1,
    right: -1,
    bottom: -1,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: colors[border],
    borderStyle: 'solid',
    borderWidth: 1,
    overflow: 'hidden',
})

export const Avatar = ({
    size,
    backgroundColor,
    leftBadge,
    rightBadge,
    border,
    variant = 'round',
    children,
}: Props) => {
    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <View
                style={[
                    border
                        ? getBorderStyle(border)
                        : styles.borderContainer_none,
                    backgroundColor && {
                        backgroundColor: colors[backgroundColor],
                    },
                    {
                        borderRadius: (() => {
                            switch (variant) {
                                case 'round':
                                    return size / 2 + 1
                                case 'squared':
                                    return 2
                                case 'rounded':
                                    return 10
                                case 'square':
                                    return 0
                                default:
                                    return notReachable(variant)
                            }
                        })(),
                    },
                ]}
            >
                {children}
            </View>

            {leftBadge && (
                <View
                    style={[
                        styles.badge,
                        {
                            top: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                            left: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                        },
                    ]}
                >
                    {leftBadge({
                        size: AVATAR_SIZE_TO_BADGE_SIZE[size],
                    })}
                </View>
            )}

            {rightBadge && (
                <View
                    style={[
                        styles.badge,
                        {
                            bottom: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                            right: -AVATAR_SIZE_TO_BADGE_SIZE[size] / 4,
                        },
                    ]}
                >
                    {rightBadge({
                        size: AVATAR_SIZE_TO_BADGE_SIZE[size],
                    })}
                </View>
            )}
        </View>
    )
}
