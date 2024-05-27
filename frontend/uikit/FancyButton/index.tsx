import React from 'react'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'
import { Spacer } from '@zeal/uikit/Spacer'
import {
    Color as TextColor,
    Variant as TextVariant,
    Weight as TextWeight,
} from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'

const styles = StyleSheet.create({
    fill: {
        width: '100%',
    },
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
        paddingHorizontal: 8,
    },
    rounded: {
        borderRadius: 50,
    },

    background_secondary: { backgroundColor: colors.surfaceDefault },
    background_Polygon: { backgroundColor: '#f4e7ff' },
    background_PolygonZkevm: { backgroundColor: '#f4e7ff' },
    background_Ethereum: { backgroundColor: '#f5f9fe' },
    background_Optimism: { backgroundColor: '#ffebeb' },
    background_BSC: { backgroundColor: '#fff5d7' },
    background_Gnosis: { backgroundColor: '#e2fbf4' },
    background_Fantom: { backgroundColor: '#e9efff' },
    background_Arbitrum: { backgroundColor: '#e4f4ff' },
    background_Avalanche: { backgroundColor: '#ffebeb' },
    background_Aurora: { backgroundColor: '#e5fddd' },
    background_Linea: { backgroundColor: '#f4e7ff' }, // FIXME @resetko-zeal apply correct color
    background_Blast: { backgroundColor: '#e5fddd' }, // FIXME @resetko-zeal apply correct color
    background_OPBNB: { backgroundColor: '#e5fddd' }, // FIXME @resetko-zeal apply correct color
    background_Base: { backgroundColor: '#e4f4ff' },
    background_zkSync: { backgroundColor: '#e5fddd' },
})

type Props = {
    fill?: true
    color: Extractor<keyof typeof styles, 'background'>
    rounded: boolean
    left: (p: {
        color: TextColor
        textVariant: TextVariant
        textWeight: TextWeight
    }) => React.ReactNode
    right:
        | null
        | ((p: {
              color: TextColor
              textVariant: TextVariant
              textWeight: TextWeight
          }) => React.ReactNode)
    onClick: null | ((e: GestureResponderEvent) => void)
}

export const FancyButton = ({
    color: variant,
    left,
    right,
    onClick,
    rounded,
    fill,
}: Props) => {
    const color = (() => {
        switch (variant) {
            case 'Polygon':
                return 'networkPolygon'
            case 'PolygonZkevm':
                return 'networkPolygonZkevm'
            case 'Linea':
                return 'networkLinea'
            case 'Ethereum':
                return 'networkEthereum'
            case 'Optimism':
                return 'networkOptimism'
            case 'BSC':
                return 'networkBSC'
            case 'Gnosis':
                return 'networkGnosis'
            case 'Fantom':
                return 'networkFantom'
            case 'Arbitrum':
                return 'networkArbitrum'
            case 'Avalanche':
                return 'networkAvalanche'
            case 'Aurora':
                return 'networkAurora'
            case 'Base':
                return 'networkBase'
            case 'Blast':
                return 'networkBlast'
            case 'OPBNB':
                return 'networkOPBNB'
            case 'zkSync':
                return 'networkzkSync'
            case 'secondary':
                return 'textSecondary'
            default:
                return notReachable(variant)
        }
    })()

    return (
        <Pressable
            style={[fill && styles.fill]}
            role="button"
            onPress={onClick || noop}
        >
            <View
                style={[
                    styles.container,
                    rounded && styles.rounded,
                    styles[`background_${variant}`],
                    fill && styles.fill,
                ]}
            >
                {left &&
                    left({
                        color: color,
                        textVariant: 'caption1',
                        textWeight: 'medium',
                    })}
                <Spacer />
                {right &&
                    right({
                        color: color,
                        textVariant: 'caption1',
                        textWeight: 'medium',
                    })}
            </View>
        </Pressable>
    )
}
