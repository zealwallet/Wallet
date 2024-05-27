import React, { useState } from 'react'
import {
    KeyboardAvoidingView,
    LayoutChangeEvent,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'
import Animated from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { BackNavigator } from '@zeal/uikit/GestureDetectors/BackNavigator'
import {
    DragToCloseGestureDetector,
    useDragToCloseGesture,
} from '@zeal/uikit/GestureDetectors/DragToCloseGestureDetector'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { colors } from '../colors'
import { Extractor } from '../Extractor'
import { Modal } from '../Modal'
import absoluteFill = StyleSheet.absoluteFill

const styles = StyleSheet.create({
    innerContainer: {
        flexDirection: 'column',
        width: '100%',
        flexGrow: 1,
        justifyContent: 'flex-end',
        backgroundColor: colors.backgroundOverlay,
    },
    fixedViewPort: {
        position: 'absolute',
        width: 360,
        height: 600,
        borderRadius: 12,
    },
    stopper: {
        minHeight: 56,
        flexShrink: 0,
        flexGrow: 1,
        width: '100%',
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
    dynamic: {
        flexDirection: 'column',
        overflow: 'hidden',
        borderTopLeftRadius: 12,
        borderTopRightRadius: 12,
        padding: 16,
        flexShrink: 1,
    },
    contentContainer: {
        flexDirection: 'column',
        rowGap: 24,
    },
    background_surfaceDefault: {
        backgroundColor: colors.surfaceDefault,
    },
    background_backgroundLight: {
        backgroundColor: colors.backgroundLight,
    },
})

type Props = {
    children: React.ReactNode
    background?: Extractor<keyof typeof styles, 'background'>
    'aria-labelledby'?: string
    'aria-describedby'?: string
    fixedViewPort?: boolean
    variant?: 'screen' | 'modal'
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const Layout = ({
    children,
    background = 'backgroundLight',
    onMsg,
    fixedViewPort,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    variant = 'modal',
}: Props) => {
    const inset = useSafeAreaInsets()
    const [modalHeight, setModalHeight] = useState(0)

    const { backgroundTransition, popupTransform, handlePopupGesture } =
        useDragToCloseGesture(modalHeight, () => {
            onMsg({ type: 'close' })
        })

    return (
        <Wrapper
            variant={variant}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
        >
            <BackNavigator
                onNavigateBack={() => onMsg({ type: 'close' })}
                enableSwipeIos={false}
            >
                <DragToCloseGestureDetector gesture={handlePopupGesture}>
                    <Animated.View
                        role="dialog"
                        aria-labelledby={ariaLabelledby}
                        aria-describedby={ariaDescribedby}
                        style={[
                            styles.innerContainer,
                            fixedViewPort && styles.fixedViewPort,
                            backgroundTransition,
                        ]}
                    >
                        <Pressable
                            style={styles.stopper}
                            onPress={() => onMsg({ type: 'close' })}
                        />
                        <Animated.View
                            onLayout={(event: LayoutChangeEvent) => {
                                setModalHeight(event.nativeEvent.layout.height)
                            }}
                            style={[
                                styles.dynamic,
                                inset.bottom > 0 && {
                                    paddingBottom: inset.bottom,
                                },
                                background &&
                                    styles[`background_${background}`],
                                popupTransform,
                            ]}
                        >
                            <View style={styles.contentContainer}>
                                {children}
                            </View>
                        </Animated.View>
                    </Animated.View>
                </DragToCloseGestureDetector>
            </BackNavigator>
        </Wrapper>
    )
}

type WrapperProps = {
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-describedby'?: string
    variant?: 'screen' | 'modal'
}

export const Wrapper = ({
    children,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    variant = 'modal',
}: WrapperProps) => {
    switch (variant) {
        case 'screen':
            return (
                <View style={[absoluteFill]}>
                    <KeyboardAvoidingView
                        style={[StyleSheet.absoluteFill]}
                        behavior={(() => {
                            switch (ZealPlatform.OS) {
                                case 'ios':
                                    return 'padding'
                                case 'android':
                                    return 'height'
                                case 'web':
                                    return undefined
                                default:
                                    return notReachable(ZealPlatform.OS)
                            }
                        })()}
                    >
                        {children}
                    </KeyboardAvoidingView>
                </View>
            )
        case 'modal':
            return (
                <Modal
                    aria-labelledby={ariaLabelledby}
                    aria-describedby={ariaDescribedby}
                >
                    {children}
                </Modal>
            )

        /* istanbul ignore next */
        default:
            return notReachable(variant)
    }
}
