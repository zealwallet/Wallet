import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import {
    Color as TextColor,
    Variant as TextVariant,
    Weight as TextWeight,
} from '@zeal/uikit/Text'

type Props = {
    right:
        | null
        | ((props: {
              color: TextColor
              textVariant: TextVariant
              textWeight: TextWeight
          }) => ReactNode)
    left:
        | null
        | ((props: {
              color: TextColor
              textVariant: TextVariant
              textWeight: TextWeight
          }) => ReactNode)
    onClick?: () => void
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        rowGap: 4,
        flexWrap: 'nowrap',
        justifyContent: 'space-between',
    },
    content: {
        flexDirection: 'row',
        columnGap: 4,
        alignItems: 'center',
        flexWrap: 'nowrap',
    },
})

export const GroupHeader = ({ onClick, right, left }: Props) => {
    return (
        <Pressable onPress={onClick} style={styles.container}>
            <View style={styles.content}>
                {left &&
                    left({
                        color: 'textSecondary',
                        textVariant: 'paragraph',
                        textWeight: 'regular',
                    })}
            </View>
            <View style={styles.content}>
                {right &&
                    right({
                        color: 'textSecondary',
                        textVariant: 'paragraph',
                        textWeight: 'regular',
                    })}
            </View>
        </Pressable>
    )
}
