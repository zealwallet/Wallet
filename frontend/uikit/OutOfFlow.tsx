import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { Extractor } from '@zeal/uikit/Extractor'

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        alignSelf: 'stretch',
    },

    align_bottomRight: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
})

type Props = {
    align: Extractor<keyof typeof styles, 'align'>
    children: ReactNode
}

export const OutOfFlow = ({ align, children }: Props) => {
    return (
        <View style={styles.container}>
            <View style={styles[`align_${align}`]}>{children}</View>
        </View>
    )
}
