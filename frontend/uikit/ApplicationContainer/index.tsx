import React from 'react'
import {
    KeyboardAvoidingView,
    StatusBar,
    StyleSheet,
    ViewStyle,
} from 'react-native'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { PortalProvider } from '@gorhom/portal'

import { DEFAULT_TEXT_STYLES, TextStyleInheritContext } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    variant: Variant
    children?: React.ReactNode
}

type Variant = 'dApp' | 'extension' | 'extension_zwidget' | 'mobile'

const styles = StyleSheet.create<Record<`container_${Variant}`, ViewStyle>>({
    container_dApp: {
        width: 360,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
    },
    container_extension: {
        width: 360,
        height: 600,
        display: 'flex',
        flexDirection: 'column',
    },
    container_extension_zwidget: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
    container_mobile: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
    },
})

export const ApplicationContainer = ({ variant, children }: Props) => (
    <TextStyleInheritContext.Provider value={DEFAULT_TEXT_STYLES}>
        <StatusBar
            translucent={true}
            barStyle="dark-content"
            backgroundColor="rgba(0,0,0,0)"
        />
        <KeyboardAvoidingView
            style={[styles[`container_${variant}`]]}
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
            <SafeAreaProvider>
                <GestureHandlerRootView>
                    <PortalProvider>{children}</PortalProvider>
                </GestureHandlerRootView>
            </SafeAreaProvider>
        </KeyboardAvoidingView>
    </TextStyleInheritContext.Provider>
)
