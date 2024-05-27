import React from 'react'
import { StyleSheet, View } from 'react-native'

import { CardArtworkBack } from '@zeal/uikit/CardWidget/CardArtworkBack'
import { CardArtworkFront } from '@zeal/uikit/CardWidget/CardArtworkFront'

import { notReachable } from '@zeal/toolkit'

type Props = {
    side: Side
    children?: React.ReactNode
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 16,
        paddingVertical: 16,
    },
    card: {
        width: '100%',
        borderRadius: 20,
        aspectRatio: 358 / 200,
    },
    balance: { maxWidth: '85%' },
})

export type Side = 'front' | 'back'

const Background = ({ side }: { side: Side }) => {
    switch (side) {
        case 'back':
            return <CardArtworkBack />
        case 'front':
            return <CardArtworkFront />
        /* istanbul ignore next */
        default:
            return notReachable(side)
    }
}

export const CardWidget = ({ side, children }: Props) => {
    return (
        <View style={styles.card}>
            <Background side={side} />
            <View style={[StyleSheet.absoluteFill, styles.container]}>
                {children}
            </View>
        </View>
    )
}
