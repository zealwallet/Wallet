import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Color } from '../colors'
import { Column } from '../Column'
import { ViewFinder as ViewFinderIcon } from '../Icon/ViewFinder'

export const styles = StyleSheet.create({
    viewFinderContainer: {
        paddingTop: 57,
    },
    viewFinder: {
        height: 284,
        width: 284,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
})

type Props = {
    color: Color
    content: React.ReactNode
    bottom: React.ReactNode
}

export const ViewFinder = ({ color, bottom, content }: Props) => (
    <View style={styles.viewFinderContainer}>
        <Column spacing={24} alignX="center">
            <View style={styles.viewFinder}>
                <View style={StyleSheet.absoluteFill}>
                    <ViewFinderIcon size={284} color={color} />
                </View>

                {content}
            </View>

            <View>{bottom}</View>
        </Column>
    </View>
)
