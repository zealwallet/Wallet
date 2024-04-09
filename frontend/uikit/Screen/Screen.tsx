import React from 'react'
import { KeyboardAvoidingView, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'

import { notReachable } from '@zeal/toolkit'

const BACKGROUND_SPACING_ONBOARDING = 142

const styles = StyleSheet.create({
    fullsize: {
        flex: 1,
        width: '100%',
    },

    container: {
        flexShrink: 1,
        height: '100%',
        width: '100%',
        // @ts-ignore FIXME @resetko-zeal
        overflowY: 'auto',
        scrollbarWidth: 'none',
        '-ms-overflow-style': 'none',
        '&::-webkit-scrollbar': {
            display: 'none',
        },
    },

    svgBackground: {
        backgroundColor: 'rgba(0,255,255,1)',
        position: 'absolute',
        paddingBottom: BACKGROUND_SPACING_ONBOARDING,
        top: 0,
        left: 0,
        bottom: 0,
        right: 0,
        zIndex: -1,
    },

    padding_form: { padding: 16 },
    padding_pin: {
        paddingTop: 16,
        paddingBottom: 56,
        paddingLeft: 16,
        paddingRight: 16,
    },
    padding_extension_connection_manager: { padding: 16, paddingTop: 12 },
    padding_main: { padding: 0 },
    padding_centered: { padding: 16, paddingTop: 52 },
    padding_story: { padding: 0 },

    background_default: { backgroundColor: colors.surfaceDefault },

    background_splashScreen: { backgroundColor: colors.backgroundSplashScreen },

    background_magenta: { backgroundColor: colors.unknownColor },
    background_light: { backgroundColor: colors.surfaceLight },
    background_dark: { backgroundColor: colors.backgroundDark },
    background_surfaceDark: { backgroundColor: colors.surfaceDark },
})

type Padding = Extractor<keyof typeof styles, 'padding'>

type Background = Extractor<keyof typeof styles, 'background'>

type Props = {
    'aria-label'?: string
    'aria-labelledby'?: string
    padding: Padding
    background: Background
    children: React.ReactNode
}

export const Screen = ({
    padding,
    background,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}: Props) => {
    const insent = useSafeAreaInsets()
    const calculatedPaddings = (() => {
        switch (padding) {
            case 'main':
            case 'centered':
            case 'form':
            case 'extension_connection_manager':
            case 'pin':
                return [
                    insent.top > 0 && { paddingTop: insent.top },
                    insent.bottom > 0 && { paddingBottom: insent.bottom },
                ]

            case 'story':
                return [insent.bottom > 0 && { paddingBottom: insent.bottom }]
            /* istanbul ignore next */
            default:
                return notReachable(padding)
        }
    })()

    return (
        <KeyboardAvoidingView behavior="height" style={[styles.fullsize]}>
            <View
                aria-label={ariaLabel}
                aria-labelledby={ariaLabelledBy}
                style={[
                    styles.container,
                    styles[`padding_${padding}`],
                    ...calculatedPaddings,
                    styles[`background_${background}`],
                ]}
            >
                {children}
            </View>
        </KeyboardAvoidingView>
    )
}
