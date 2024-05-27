import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { Shadow } from 'react-native-shadow-2'

import { colors } from '@zeal/uikit/colors'

const styles = StyleSheet.create({
    column: {
        flex: 1,
        flexDirection: 'column',
        flexShrink: 0,
        flexBasis: '100%',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: colors.surfaceDefault,
    },
    contentContainer: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflow: 'hidden',
    },
    shadowContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'stretch',
        overflow: 'hidden',
        padding: 12,
        backgroundColor: colors.surfaceDefault,
    },
})

type LayoutProps = {
    tabs: React.ReactNode
    content: React.ReactNode
}

export const TabsLayout = ({ tabs, content }: LayoutProps) => {
    return (
        <View style={[styles.column]}>
            <View style={[styles.contentContainer]}>{content}</View>
            <TabsContainer>{tabs}</TabsContainer>
        </View>
    )
}

type ContainerProps = { children: React.ReactNode }

export const TabsContainer = ({ children }: ContainerProps) => {
    return (
        <TabsShadowContainer>
            <View style={[styles.row]}>{children}</View>
        </TabsShadowContainer>
    )
}

const TabsShadowContainer = ({ children }: ContainerProps) => {
    const inset = useSafeAreaInsets()
    return (
        <Shadow
            distance={10}
            startColor="#00000010"
            stretch
            paintInside={true}
            corners={{
                topStart: true,
                topEnd: true,
                bottomStart: false,
                bottomEnd: false,
            }}
            sides={{ start: true, end: true, top: true, bottom: false }}
            style={[
                styles.shadowContainer,
                inset.bottom > 0 && { paddingBottom: inset.bottom },
            ]}
        >
            {children}
        </Shadow>
    )
}
