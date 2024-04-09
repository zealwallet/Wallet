import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { LightArrowRight2 } from '../Icon/LightArrowRight2'
import { styles as textStyles } from '../Text'

const styles = StyleSheet.create({
    limitBanner: {
        position: 'relative',
        overflow: 'hidden',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 8,
    },
    container: {
        flexDirection: 'row',
        columnGap: 4,
        alignItems: 'center',
    },
    // @ts-ignore
    nonPressable: {
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'auto' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    variant_default: {
        backgroundColor: colors.surfaceDefault,
    },
    variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    variant_neutral: {
        backgroundColor: colors.backgroundAlertNeutral,
    },
    variant_critical: {
        backgroundColor: colors.backgroundAlertCritical,
    },

    text_default: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textPrimary,
    },
    text_warning: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusWarningOnColor,
    },
    text_neutral: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusNeutralOnColor,
    },
    text_critical: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_regular,
        ...textStyles.color_textStatusCriticalOnColor,
    },

    hover_default: {
        backgroundColor: colors.surfaceDefault,
    },
    hover_warning: {
        backgroundColor: colors.backgroundAlertWarningHover,
    },
    hover_neutral: {
        backgroundColor: colors.backgroundAlertNeutralHover,
    },
    hover_critical: {
        backgroundColor: colors.backgroundAlertCriticalHover,
    },

    icon_default: {
        color: colors.textPrimary,
    },
    icon_warning: {
        color: colors.iconStatusWarningOnColor,
    },
    icon_neutral: {
        color: colors.iconStatusNeutralOnColor,
    },
    icon_critical: {
        color: colors.iconStatusCriticalOnColor,
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>

type Props = {
    variant: Variant
    icon: (renderProps: { size: number }) => ReactNode
    title: ReactNode
    onClick: (() => void) | null
}

const ICON_SIZE = 20

export const BannerLimit = ({ variant, icon, title, onClick }: Props) => (
    <Pressable
        onPress={onClick}
        style={({ hovered }) => [
            styles.limitBanner,
            styles[`variant_${variant}`],
            !onClick && styles.nonPressable,
            onClick && hovered && styles[`hover_${variant}`],
        ]}
    >
        <View style={styles.container}>
            <View style={styles[`icon_${variant}`]}>
                {icon({ size: ICON_SIZE })}
            </View>
            <Text style={styles[`text_${variant}`]}>{title}</Text>
            <Spacer />
            {onClick && (
                <View style={styles[`icon_${variant}`]}>
                    <LightArrowRight2 size={ICON_SIZE} />
                </View>
            )}
        </View>
    </Pressable>
)
