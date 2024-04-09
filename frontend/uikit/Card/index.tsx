import React from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '../colors'
import { Column } from '../Column'
import { Text } from '../Text'

type Props = {
    image: React.ReactNode
    imageWidth: number // TODO: there should be a way to avoid setting this manually
    rightTop?: React.ReactNode
    title?: React.ReactNode
    subtitle?: React.ReactNode
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        backgroundColor: colors.surfaceDefault,
        overflow: 'hidden',
    },
    rightTop: {
        position: 'absolute',
        top: 8,
        right: 8,
    },
    textContainer: {
        padding: 8,
        flexGrow: 0,
    },
})

export const Card = ({
    image,
    imageWidth,
    rightTop,
    subtitle,
    title,
}: Props) => (
    <View style={styles.container}>
        <View>
            {image}
            <View style={styles.rightTop}>{rightTop}</View>
        </View>

        {title && (
            <View style={[styles.textContainer, { width: imageWidth }]}>
                <Column spacing={4}>
                    <Text
                        ellipsis
                        variant="caption1"
                        weight="medium"
                        color="textPrimary"
                        align="left"
                    >
                        {title}
                    </Text>

                    {subtitle && (
                        <Text
                            variant="caption2"
                            weight="regular"
                            color="textSecondary"
                        >
                            {subtitle}
                        </Text>
                    )}
                </Column>
            </View>
        )}
    </View>
)
