import React from 'react'
import {
    KeyboardAvoidingView,
    Modal as NativeModal,
    StyleSheet,
} from 'react-native'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
})

type Props = {
    children: React.ReactNode
    'aria-labelledby'?: string
    'aria-describedby'?: string
}

export const Modal = ({
    children,
    'aria-labelledby': ariaLabelledby,
    'aria-describedby': ariaDescribedby,
}: Props) => (
    <NativeModal
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
        animationType="none"
        statusBarTranslucent
        transparent
        visible
    >
        <KeyboardAvoidingView
            behavior={(() => {
                switch (ZealPlatform.OS) {
                    case 'ios':
                        return 'padding' // FIXME @fred check if height also works for ios in custom RPC usr form jitter
                    case 'android':
                        return 'height'
                    case 'web':
                        return undefined
                    default:
                        return notReachable(ZealPlatform.OS)
                }
            })()}
            style={styles.overlay}
        >
            {children}
        </KeyboardAvoidingView>
    </NativeModal>
)
