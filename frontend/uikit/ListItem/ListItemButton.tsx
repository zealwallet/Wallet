import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { InternalItem, Props as InternalItemProps } from './InternalItem'

type Props = {
    onClick: () => void
} & Omit<InternalItemProps, 'size'>

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.surfaceDefault,
        borderRadius: 8,
        borderColor: colors.borderDefault,
        borderStyle: 'solid',
        borderWidth: 1,
        paddingVertical: 8,
        paddingHorizontal: 10,
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
    hover: {
        borderColor: colors.iconHover,
    },
    active: {
        borderColor: colors.borderSecondary,
    },
})

export const ListItemButton = ({
    onClick,
    primaryTextIcon,
    shortText,
    primaryText,
    side,
    avatar,
}: Props) => {
    const [labelId] = useState(`list-item-label-${uuid()}`)
    const [descriptionId] = useState(`list-item-desc-${uuid()}`)
    return (
        <Pressable onPress={onClick}>
            {({ pressed, hovered }) => (
                <View
                    style={[
                        styles.container,
                        hovered && styles.hover,
                        pressed && styles.active,
                    ]}
                >
                    <InternalItem
                        size="large"
                        primaryText={primaryText}
                        primaryTextId={labelId}
                        primaryTextIcon={primaryTextIcon}
                        side={side}
                        avatar={avatar}
                        shortText={shortText}
                        shortTextId={descriptionId}
                    />
                </View>
            )}
        </Pressable>
    )
}
