import React from 'react'
import { StyleSheet, View } from 'react-native'

import { Row } from '@zeal/uikit/Row'

import { notReachable } from '@zeal/toolkit'

const SPACING = 8

const styles = StyleSheet.create({
    row: {
        flexShrink: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        gap: SPACING,
    },
    column: {
        flexShrink: 0,
        flexDirection: 'column',
        gap: SPACING,
    },
})

type Props = {
    variant?: 'row' | 'column'
    children: React.ReactNode
}

export const Actions = ({ children, variant = 'row' }: Props) => (
    <View style={styles[variant]}>
        {React.Children.map(children, (child) => {
            switch (variant) {
                case 'row':
                    return child
                case 'column':
                    return <Row spacing={0}>{child}</Row>
                /* istanbul ignore next */
                default:
                    return notReachable(variant)
            }
        })}
    </View>
)
