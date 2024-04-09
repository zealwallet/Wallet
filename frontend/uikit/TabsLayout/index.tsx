import React from 'react'
import { StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

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
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 0 },
        shadowOpacity: 0.15,
        shadowRadius: 15,
        padding: 12,
        backgroundColor: colors.surfaceDefault,
    },
})

type LayoutProps = {
    tabs: React.ReactNode[]
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
        <View
            style={[
                styles.shadowContainer,
                inset.bottom > 0 && { paddingBottom: inset.bottom },
            ]}
        >
            {children}
        </View>
    )
}
