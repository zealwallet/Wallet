import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { colors } from '../colors'
import { Extractor } from '../Extractor'
import { styles as textStyles } from '../Text'

const styles = StyleSheet.create({
    infoCard: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        columnGap: 8,
        padding: 8,
        borderRadius: 8,
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
    iconContainer: {
        alignSelf: 'center',
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        rowGap: 4,
    },

    variant_neutral: {
        backgroundColor: colors.surfaceDefault,
    },
    variant_security: {
        backgroundColor: colors.surfaceDefault,
    },
    variant_critical: {
        backgroundColor: colors.surfaceDefault,
    },
    variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },

    title_neutral: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        color: colors.textPrimary,
    },
    title_security: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        color: colors.textPrimary,
    },
    title_critical: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        color: colors.textPrimary,
    },
    title_warning: {
        ...textStyles.variant_paragraph,
        ...textStyles.weight_medium,
        color: colors.textStatusWarningOnColor,
    },

    subtitle_neutral: {
        ...textStyles.variant_footnote,
        ...textStyles.weight_regular,
        color: colors.textSecondary,
    },
    subtitle_security: {
        ...textStyles.variant_footnote,
        ...textStyles.weight_regular,
        color: colors.textSecondary,
    },
    subtitle_critical: {
        ...textStyles.variant_footnote,
        ...textStyles.weight_regular,
        color: colors.textSecondary,
    },
    subtitle_warning: {
        ...textStyles.variant_footnote,
        ...textStyles.weight_regular,
        color: colors.textPrimary,
    },

    icon_neutral: {
        color: colors.iconAccent2,
    },
    icon_security: {
        color: colors.iconStatusNeutral,
    },
    icon_critical: {
        color: colors.iconStatusCritical,
    },
    icon_warning: {
        color: colors.iconStatusWarningOnColor,
    },

    hover_neutral: {
        backgroundColor: colors.surfaceDefault,
    },
    hover_security: {
        backgroundColor: colors.surfaceDefault,
    },
    hover_critical: {
        backgroundColor: colors.surfaceDefault,
    },
    hover_warning: {
        backgroundColor: colors.backgroundAlertWarningHover,
    },

    active_neutral: {
        backgroundColor: colors.surfaceDefault,
    },
    active_security: {
        backgroundColor: colors.surfaceDefault,
    },
    active_critical: {
        backgroundColor: colors.surfaceDefault,
    },
    active_warning: {
        backgroundColor: colors.backgroundAlertWarningClicked,
    },
})

type Variant = Extractor<keyof typeof styles, 'variant'>

const ICON_SIZE = 28

type Props = {
    title?: ReactNode
    subtitle: ReactNode
    icon?: (renderProps: { size: number }) => ReactNode
    onClick?: () => void
    variant: Variant
}

export const InfoCard = ({
    subtitle,
    onClick,
    title,
    icon,
    variant,
}: Props) => (
    <Pressable
        onPress={onClick}
        style={({ pressed, hovered }) => [
            styles.infoCard,
            styles[`variant_${variant}`],
            onClick && pressed && styles[`active_${variant}`],
            onClick && hovered && styles[`hover_${variant}`],
            !onClick && styles.nonPressable,
        ]}
    >
        {icon && (
            <View style={[styles.iconContainer, styles[`icon_${variant}`]]}>
                {icon({ size: ICON_SIZE })}
            </View>
        )}
        <View style={styles.contentContainer}>
            {title && (
                <Text numberOfLines={1} style={styles[`title_${variant}`]}>
                    {title}
                </Text>
            )}
            <Text style={styles[`subtitle_${variant}`]}>{subtitle}</Text>
        </View>
    </Pressable>
)
