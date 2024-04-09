import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Color, colors } from '../colors'

export type BadgeSize = 10 | 12 | 16 | 32 | 48

type Props = {
    backgroundColor?: Color
    outlineColor?: Color | 'transparent'
    size: BadgeSize
    children: React.ReactNode
}

const styles = StyleSheet.create({
    outerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
    },
    innerContainer: {
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'solid',
        borderWidth: 1,
    },
})

export const Badge = ({
    backgroundColor,
    outlineColor = 'borderSecondary',
    size,
    children,
}: Props) => {
    return (
        <View style={[styles.outerContainer, { width: size, height: size }]}>
            <View
                style={[
                    styles.innerContainer,
                    {
                        width: size + 2,
                        height: size + 2,
                        borderRadius: size / 2 + 1,
                    },
                    {
                        borderColor:
                            outlineColor === 'transparent'
                                ? 'transparent'
                                : colors[outlineColor],
                    },
                    backgroundColor && {
                        backgroundColor: colors[backgroundColor],
                    },
                ]}
            >
                {children}
            </View>
        </View>
    )
}
