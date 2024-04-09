import React, { ReactNode, useState } from 'react'
import { StyleSheet, TouchableWithoutFeedback, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Group } from '@zeal/uikit/Group'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceDefault,
        alignItems: 'center',
        flexDirection: 'column',
        rowGap: 8,
    },
    sizeLarge: {
        paddingVertical: 65,
        paddingHorizontal: 16,
    },
    sizeRegular: {
        paddingVertical: 16,
        paddingHorizontal: 16,
    },
    actions: {
        flexGrow: 1,
        flexDirection: 'row',
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return { flexBasis: 0 }
                case 'web':
                    return {}
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    // @ts-ignore
    clickable: {
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'pointer' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
})

type Props = {
    icon: (renderProps: { size: number }) => ReactNode
    size: 'regular' | 'large'
    title: ReactNode
    onClick?: () => void
    action?: ReactNode
}

const ICON_SIZE = 24

export const EmptyStateWidget = ({
    icon,
    size,
    title,
    action,
    onClick,
}: Props) => {
    const [labelId] = useState(uuid())

    const wrapperStyles = [
        styles.container,
        size === 'large' ? styles.sizeLarge : styles.sizeRegular,
        onClick ? styles.clickable : null,
    ]

    return (
        <Group variant="default">
            <TouchableWithoutFeedback onPress={onClick}>
                <View
                    style={wrapperStyles}
                    role={onClick && 'button'}
                    aria-labelledby={labelId}
                >
                    {icon({ size: ICON_SIZE })}
                    <Text
                        id={labelId}
                        align="center"
                        variant="paragraph"
                        weight="regular"
                        color="textSecondary"
                    >
                        {title}
                    </Text>

                    {!action ? null : (
                        <Row spacing={0}>
                            <Spacer />
                            <View style={styles.actions}>{action}</View>
                            <Spacer />
                        </Row>
                    )}
                </View>
            </TouchableWithoutFeedback>
        </Group>
    )
}
