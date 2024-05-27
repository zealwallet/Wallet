import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { InternalItem, Props as InternalItemProps } from './InternalItem'

type Props = {
    variant?: Extractor<keyof typeof styles, 'variant'>
    onClick?: () => void
    disabled?: boolean
    'aria-current': boolean
} & InternalItemProps

export const styles = StyleSheet.create({
    // @ts-ignore
    pressable: {
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { outlineStyle: 'none' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
    container: {
        padding: 8,
        borderRadius: 5,
    },
    selected: {
        backgroundColor: colors.backgroundLight,
    },
    variant_default: {},
    variant_solid: {
        backgroundColor: colors.backgroundLight,
    },
    variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    variant_critical: {
        backgroundColor: colors.backgroundAlertCritical,
    },

    clickable: {
        // @ts-ignore
        transitionProperty: 'border-color',
        transitionTimingFunction: 'ease',
        transitionDuration: '0.3s',
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
    clickable_hover: {
        backgroundColor: colors.actionSecondaryHovered,
    },
    clickable_active: {
        backgroundColor: colors.actionSecondaryPressed,
    },
    disabled: {
        opacity: 0.3,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'not-allowed' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
})

export const ListItem = ({
    variant = 'default',
    onClick,
    disabled,
    primaryText,
    primaryTextIcon,
    shortText,
    side,
    avatar,
    'aria-current': ariaCurrent,
    size,
}: Props) => {
    const [labelId] = useState(`list-item-label-${uuid()}`)
    const [descriptionId] = useState(`list-item-desc-${uuid()}`)

    return onClick ? (
        <Pressable
            style={[styles.pressable]}
            onPress={onClick}
            disabled={disabled}
            role="button"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
        >
            {({ hovered, pressed }) => (
                <View
                    style={[
                        styles.container,
                        styles[`variant_${variant}`],
                        styles.clickable,
                        hovered && styles.clickable_hover,
                        pressed && styles.clickable_active,
                        disabled && styles.disabled,
                        ariaCurrent && styles.selected,
                    ]}
                >
                    <InternalItem
                        size={size}
                        primaryText={primaryText}
                        primaryTextId={labelId}
                        primaryTextIcon={primaryTextIcon}
                        shortText={shortText}
                        shortTextId={descriptionId}
                        side={side}
                        avatar={avatar}
                    />
                </View>
            )}
        </Pressable>
    ) : (
        <View
            role="listitem"
            aria-labelledby={labelId}
            aria-describedby={descriptionId}
        >
            <View
                style={[
                    styles.container,
                    styles[`variant_${variant}`],
                    disabled && styles.disabled,
                ]}
            >
                <InternalItem
                    size={size}
                    primaryText={primaryText}
                    primaryTextId={labelId}
                    primaryTextIcon={primaryTextIcon}
                    shortText={shortText}
                    shortTextId={descriptionId}
                    side={side}
                    avatar={avatar}
                />
            </View>
        </View>
    )
}
