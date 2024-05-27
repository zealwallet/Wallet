import React, { ReactNode, useCallback } from 'react'
import { RefreshControl, ScrollView, StyleSheet } from 'react-native'

import * as Haptics from 'expo-haptics'

import { colors } from '@zeal/uikit/colors'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type Props = {
    children: ReactNode
    onRefreshPulled: () => void
    isRefreshing: boolean
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        paddingBottom: 16,
    },
})

export const RefreshContainer = ({
    children,
    onRefreshPulled,
    isRefreshing,
}: Props) => {
    const onRefresh = useCallback(() => {
        switch (ZealPlatform.OS) {
            case 'ios':
                Haptics.selectionAsync()
                return onRefreshPulled()
            case 'android':
            case 'web':
                return onRefreshPulled()

            /* istanbul ignore next */
            default:
                return notReachable(ZealPlatform.OS)
        }
    }, [onRefreshPulled])

    return (
        <ScrollView
            style={styles.container}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            alwaysBounceVertical={false}
            keyboardShouldPersistTaps="handled"
            refreshControl={
                <RefreshControl
                    colors={[colors.actionPrimaryDefault]}
                    progressBackgroundColor={colors.backgroundLight}
                    tintColor={colors.actionPrimaryDefault}
                    refreshing={isRefreshing}
                    onRefresh={onRefresh}
                />
            }
        >
            {children}
        </ScrollView>
    )
}
