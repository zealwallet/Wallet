import React, { createContext, useContext } from 'react'
import { StyleSheet, Text as NativeText } from 'react-native'

import { colors } from '../colors'
import { Extractor } from '../Extractor'

export const styles = StyleSheet.create({
    base: {
        fontFamily: 'Lexend, sans-serif',
        includeFontPadding: false,
        textAlignVertical: 'center',
        minWidth: 0,
    },

    variant_inherit: {},
    variant_caption1: {
        fontSize: 12,
        lineHeight: 15,
    },
    variant_caption2: {
        fontSize: 11,
        lineHeight: 14,
        letterSpacing: 0.0006 * 11,
    },
    variant_homeScreenTitle: {
        fontSize: 34,
        lineHeight: 43,
        letterSpacing: 0.136,
    },
    variant_title1: {
        fontSize: 28,
        lineHeight: 35,
        letterSpacing: -(28 * 0.0038),
    },
    variant_title2: {
        fontSize: 22,
        lineHeight: 28,
        letterSpacing: -(22 * 0.0026),
    },

    variant_title3: {
        fontSize: 20,
        lineHeight: 25,
        letterSpacing: -0.09,
    },

    variant_callout: {
        fontSize: 16,
        lineHeight: 20,
        letterSpacing: -(16 * 0.0031),
    },

    variant_footnote: {
        fontSize: 13,
        lineHeight: 16,
        letterSpacing: -0.0104,
    },

    variant_paragraph: {
        fontSize: 14,
        lineHeight: 18,
        letterSpacing: -0.0602,
    },

    weight_inherit: {},
    weight_regular: {
        fontWeight: '400',
    },
    weight_medium: {
        fontWeight: '500',
    },
    weight_semi_bold: {
        fontWeight: '600',
    },
    weight_bold: {
        fontWeight: '700',
    },

    color_textOnDark: {
        color: colors.textOnDark,
    },

    color_textPrimary: {
        color: colors.textPrimary,
    },

    color_textDisabled: {
        color: colors.textDisabled,
    },

    color_textSecondary: {
        color: colors.textSecondary,
    },

    color_textError: {
        color: colors.textError,
    },

    color_textStatusCritical: {
        color: colors.textStatusCritical,
    },

    color_textStatusCriticalOnColor: {
        color: colors.textStatusCriticalOnColor,
    },

    color_textStatusCriticalOnColorHover: {
        color: colors.textStatusCriticalOnColorHover,
    },

    color_textStatusCriticalOnColorPressed: {
        color: colors.textStatusCriticalOnColorPressed,
    },

    color_textOnDarkPrimary: {
        color: colors.textOnDarkPrimary,
    },

    color_textStatusWarning: {
        color: colors.textStatusWarning,
    },

    color_textStatusWarningOnColor: {
        color: colors.textStatusWarningOnColor,
    },

    color_textStatusWarningOnColorHover: {
        color: colors.textStatusWarningOnColorHover,
    },

    color_textStatusWarningOnColorPressed: {
        color: colors.textStatusWarningOnColorPressed,
    },

    color_textStatusNeutralOnColor: {
        color: colors.textStatusNeutralOnColor,
    },

    color_textStatusNeutralOnColorHover: {
        color: colors.textStatusNeutralOnColorHover,
    },

    color_textStatusNeutralOnColorPressed: {
        color: colors.textStatusNeutralOnColorPressed,
    },

    color_textStatusSuccess: {
        color: colors.textStatusSuccess,
    },

    color_textStatusSuccessOnColor: {
        color: colors.textStatusSuccessOnColor,
    },

    color_textStatusSuccessOnColorHover: {
        color: colors.textStatusSuccessOnColorHover,
    },

    color_textStatusSuccessOnColorPressed: {
        color: colors.textStatusSuccessOnColorPressed,
    },

    color_textAccent2: {
        color: colors.textAccent2,
    },

    color_iconDefault: {
        color: colors.iconDefault,
    },

    color_iconPressed: {
        color: colors.iconPressed,
    },

    color_darkActionSecondaryDefault: {
        color: colors.darkActionSecondaryDefault,
    },

    color_darkActionSecondaryHover: {
        color: colors.darkActionSecondaryHover,
    },

    color_darkActionSecondaryPressed: {
        color: colors.darkActionSecondaryPressed,
    },

    color_actionPrimaryPressed: {
        color: colors.actionPrimaryPressed,
    },

    color_iconHover: {
        color: colors.iconHover,
    },
    color_textOnColorPrimiary: {
        color: colors.textOnColorPrimiary,
    },
    color_textOnColorSecondary: {
        color: colors.textOnColorSecondary,
    },
    color_textOnColorSecondaryHover: {
        color: colors.textOnColorSecondaryHover,
    },
    color_textOnColorSecondaryPressed: {
        color: colors.textOnColorSecondaryPressed,
    },
    color_networkPolygon: {
        color: colors.networkPolygon,
    },
    color_networkPolygonZkevm: {
        color: colors.networkPolygonZkevm,
    },
    color_networkEthereum: {
        color: colors.networkEthereum,
    },
    color_networkOptimism: {
        color: colors.networkOptimism,
    },
    color_networkBSC: {
        color: colors.networkBSC,
    },
    color_networkGnosis: {
        color: colors.networkGnosis,
    },
    color_networkFantom: {
        color: colors.networkFantom,
    },
    color_networkArbitrum: {
        color: colors.networkArbitrum,
    },
    color_networkAvalanche: {
        color: colors.networkAvalanche,
    },
    color_networkAurora: {
        color: colors.networkAurora,
    },
    color_networkBase: {
        color: colors.networkBase,
    },
    color_networkzkSync: {
        color: colors.networkzkSync,
    },

    align_center: {
        textAlign: 'center',
    },
    align_left: {
        textAlign: 'left',
    },
})

export type Variant = Extractor<keyof typeof styles, 'variant'>
export type Weight = Extractor<keyof typeof styles, 'weight'>
export type Color = Extractor<keyof typeof styles, 'color'>
type Align = Extractor<keyof typeof styles, 'align'>

type TextStyles = {
    variant: Variant
    weight: Weight
    color: Color
}

export const DEFAULT_TEXT_STYLES: TextStyles = {
    color: 'textSecondary',
    weight: 'regular',
    variant: 'paragraph',
}

export const TextStyleInheritContext =
    createContext<TextStyles>(DEFAULT_TEXT_STYLES)

export const useTextStyleInheritContext = () =>
    useContext(TextStyleInheritContext)

export type Props = {
    id?: string
    children: React.ReactNode
    variant?: Variant
    weight?: Weight
    color?: Color
    align?: Align
    ellipsis?: boolean
}
export const Text = ({
    id,
    children,
    align = 'left',
    color,
    variant,
    weight,
    ellipsis,
}: Props) => {
    const textStylesContext = useTextStyleInheritContext()
    const currentStyles: TextStyles = {
        color: color || textStylesContext.color,
        variant: variant || textStylesContext.variant,
        weight: weight || textStylesContext.weight,
    }

    return (
        <TextStyleInheritContext.Provider value={currentStyles}>
            <NativeText
                id={id}
                numberOfLines={ellipsis ? 1 : undefined}
                style={[
                    styles.base,
                    styles[`variant_${currentStyles.variant}`],
                    styles[`weight_${currentStyles.weight}`],
                    styles[`color_${currentStyles.color}`],
                    styles[`align_${align}`],
                ]}
            >
                {children}
            </NativeText>
        </TextStyleInheritContext.Provider>
    )
}
