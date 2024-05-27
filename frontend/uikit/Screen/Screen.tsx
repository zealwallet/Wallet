import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'
import { BackNavigator } from '@zeal/uikit/GestureDetectors/BackNavigator'
import { ImageBackground } from '@zeal/uikit/ImageBackground'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

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
        height: '100%',
        width: '100%',
    },

    padding_form: { padding: 16 },
    padding_controller_tabs_fullscreen_scroll: {
        padding: 16,
        paddingBottom: 0,
    },
    padding_controller_tabs_fullscreen: { padding: 16 },
    padding_controller_tabs_popup: {
        padding: 16,
        paddingTop: 4,
        paddingBottom: 0,
    },
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
    background_cardsArtwork: {},
})

type Padding = Extractor<keyof typeof styles, 'padding'>

type Background = Extractor<keyof typeof styles, 'background'>

type Props = {
    'aria-label'?: string
    'aria-labelledby'?: string
    padding: Padding
    background: Background
    children: React.ReactNode
    onNavigateBack: (() => void) | null
}

export const Screen = ({
    padding,
    background,
    onNavigateBack,
    children,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
}: Props) => {
    return onNavigateBack ? (
        <BackNavigator onNavigateBack={onNavigateBack}>
            <BackgroundWrapper
                background={background}
                padding={padding}
                ariaLabel={ariaLabel}
                ariaLabelledBy={ariaLabelledBy}
            >
                {children}
            </BackgroundWrapper>
        </BackNavigator>
    ) : (
        <BackgroundWrapper
            background={background}
            padding={padding}
            ariaLabel={ariaLabel}
            ariaLabelledBy={ariaLabelledBy}
        >
            {children}
        </BackgroundWrapper>
    )
}

const BackgroundWrapper = ({
    background,
    padding,
    ariaLabel,
    ariaLabelledBy,
    children,
}: {
    background: Props['background']
    padding: Props['padding']
    ariaLabel: Props['aria-label']
    ariaLabelledBy: Props['aria-labelledby']
    children: Props['children']
}) => {
    const originalInsent = useSafeAreaInsets()
    const insent = (() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'web':
                return originalInsent
            case 'android':
                return {
                    ...originalInsent,
                    top: originalInsent.top + 8,
                    bottom: originalInsent.bottom + 16,
                }
            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    })()

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
            case 'controller_tabs_fullscreen_scroll':
            case 'controller_tabs_fullscreen':
            case 'controller_tabs_popup':
                return [insent.top > 0 && { paddingTop: insent.top }]

            case 'story':
                return [insent.bottom > 0 && { paddingBottom: insent.bottom }]
            /* istanbul ignore next */
            default:
                return notReachable(padding)
        }
    })()

    switch (background) {
        case 'surfaceDark':
        case 'light':
        case 'magenta':
        case 'default':
        case 'splashScreen':
        case 'dark':
            return (
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
            )
        case 'cardsArtwork':
            return (
                <ImageBackground
                    source={require('@zeal/assets/cards_artwork.svg')}
                    style={styles.svgBackground}
                >
                    <View
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledBy}
                        style={[
                            styles.container,
                            styles[`padding_${padding}`],
                            ...calculatedPaddings,
                        ]}
                    >
                        {children}
                    </View>
                </ImageBackground>
            )
        /* istanbul ignore next */
        default:
            return notReachable(background)
    }
}
