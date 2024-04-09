import React, { ReactNode } from 'react'
import { StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Row } from '@zeal/uikit/Row'

const styles = StyleSheet.create({
    banner: {
        borderRadius: 5,
        padding: 8,
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.borderDefault,
    },
    variant_outline: {
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.borderDefault,
    },
    content: {
        flexGrow: 1,
    },
})

type Props = {
    icon: ReactNode
    children: NonNullable<ReactNode>
}

export const BannerOutline = ({ icon, children }: Props) => (
    <View style={styles.banner}>
        <Row spacing={8} alignY="start" grow>
            {icon && <View>{icon}</View>}
            <View style={styles.content}>{children}</View>
        </Row>
    </View>
)
