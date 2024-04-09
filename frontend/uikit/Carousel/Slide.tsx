import React, { ReactNode, useEffect, useRef } from 'react'
import { Animated, StyleSheet, TouchableOpacity } from 'react-native'

import { Color, Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { colors } from '../colors'
import { CloseCross } from '../Icon/CloseCross'

export type SlideVariant = 'neutral' | 'warning'

export type SlideColorVariant = 'white' | 'dark' | 'warning'

type Msg<T extends string> =
    | { type: 'on_nba_close_click'; slide: SlideData<T> }
    | { type: 'on_nba_cta_click'; slide: SlideData<T> }

export const SLIDE_WIDTH = 200

export type SlideData<T extends string> = {
    id: T
    title: ReactNode
    buttonText: ReactNode
    variant: SlideVariant
}

type Props<T extends string> = {
    slide: SlideData<T>
    slideColorVariant: SlideColorVariant
    isSelected: boolean
    onMsg: (msg: Msg<T>) => void
}

const styles = StyleSheet.create({
    slide: {
        borderRadius: 8,
        gap: 12,
        width: SLIDE_WIDTH,
        paddingVertical: 12,
        paddingLeft: 16,
        paddingRight: 32,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    variant_white: {
        backgroundColor: colors.surfaceDefault,
    },
    variant_dark: {
        backgroundColor: colors.backgroundDark,
    },
    variant_warning: {
        backgroundColor: colors.backgroundAlertWarning,
    },
    activeSlide: {},
    closeButton: {
        position: 'absolute',
        top: 8,
        right: 8,
        zIndex: 2,
    },
})

export const Slide = <T extends string>({
    slide,
    slideColorVariant,
    isSelected,
    onMsg,
}: Props<T>) => {
    const { buttonText, title } = slide

    const nodeRef = useRef(null)

    // const scaleValue = useRef(new Animated.Value(1))
    const activeScale = useRef(new Animated.Value(0.92))
    // const opacityValue = useRef(new Animated.Value(1))

    useEffect(() => {
        Animated.timing(activeScale.current, {
            toValue: isSelected ? 1 : 0.92,
            duration: 300,
            useNativeDriver: true,
        }).start()
    }, [isSelected, activeScale])

    // TODO : animation with https://reactcommunity.org/react-transition-group/transition

    // const handleClose = () => {
    //     Animated.parallel([
    //         Animated.timing(scaleValue, {
    //             toValue: 0.8,
    //             duration: 250,
    //             useNativeDriver: true,
    //         }),
    //         Animated.timing(opacityValue, {
    //             toValue: 0,
    //             duration: 250,
    //             useNativeDriver: true,
    //         }),
    //     ]).start(() => onRemove())
    // }

    return (
        <TouchableOpacity
            onPress={() => {
                onMsg({ type: 'on_nba_cta_click', slide })
            }}
        >
            <Animated.View
                ref={nodeRef}
                style={[
                    styles.slide,
                    { transform: [{ scale: activeScale.current }] },
                    styles[`variant_${slideColorVariant}`],
                ]}
            >
                <Text
                    variant="callout"
                    color={getColorByVariant(slideColorVariant)}
                    weight="regular"
                >
                    {title}
                </Text>

                <Text
                    variant="caption2"
                    color={getButtonColorByVariant(slideColorVariant)}
                >
                    {buttonText}
                </Text>
                <TouchableOpacity
                    onPress={() => {
                        onMsg({ type: 'on_nba_close_click', slide })
                    }}
                    style={styles.closeButton}
                >
                    <CloseCross
                        size={16}
                        color={getCloseButtonColorByVariant(slideColorVariant)}
                    />
                </TouchableOpacity>
            </Animated.View>
        </TouchableOpacity>
    )
}

const getColorByVariant = (variant: SlideColorVariant): Color => {
    switch (variant) {
        case 'white':
            return 'textPrimary'
        case 'dark':
            return 'textOnDarkPrimary'
        case 'warning':
            return 'textStatusWarningOnColor'
        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

const getButtonColorByVariant = (variant: SlideColorVariant): Color => {
    switch (variant) {
        case 'white':
        case 'dark':
            return 'textAccent2'
        case 'warning':
            return 'textPrimary'
        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}

const getCloseButtonColorByVariant = (variant: SlideColorVariant): Color => {
    switch (variant) {
        case 'white':
        case 'warning':
            return 'textPrimary'
        case 'dark':
            return 'textOnDarkPrimary'

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}
