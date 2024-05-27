import React from 'react'
import { Keyboard, StyleSheet } from 'react-native'
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated'

import { Portal } from '@gorhom/portal'

type Props = {
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-describedby'?: string
    isAnimated?: boolean
}

const styles = StyleSheet.create({
    overlay: {
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999, //Required for iOS to display out anims correctly
    },
})

export const Modal = ({
    children,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
    isAnimated = true, //FIXME @hayder improve if applied everywhere
}: Props) => (
    <Portal handleOnMount={() => Keyboard.dismiss()}>
        <Animated.View
            entering={isAnimated ? FadeInUp : undefined}
            exiting={isAnimated ? FadeOutUp : undefined}
            style={[StyleSheet.absoluteFill, styles.overlay]}
            aria-labelledby={ariaLabelledby}
            aria-describedby={ariaDescribedby}
        >
            {children}
        </Animated.View>
    </Portal>
)
