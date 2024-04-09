import React from 'react'
import { StyleSheet, View, ViewStyle } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { DEFAULT_TEXT_STYLES, TextStyleInheritContext } from '@zeal/uikit/Text'

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
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
    },
})

export const ApplicationContainer = ({ variant, children }: Props) => (
    <TextStyleInheritContext.Provider value={DEFAULT_TEXT_STYLES}>
        <View style={styles[`container_${variant}`]}>
            <SafeAreaProvider>{children}</SafeAreaProvider>
        </View>
    </TextStyleInheritContext.Provider>
)
