import React from 'react'
import { ScrollView, StyleSheet, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { BackNavigator } from '@zeal/uikit/GestureDetectors/BackNavigator'

import { Column } from '../Column'
import { Overlay } from '../Overlay'

type Props = {
    children: React.ReactNode
    onClose: () => void
}

const styles = StyleSheet.create({
    scrollView: {
        width: '100%',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: colors.backgroundLight,
    },
    content: {
        paddingVertical: 16,
    },
})

export const Drawer = ({ children, onClose }: Props) => (
    <BackNavigator onNavigateBack={onClose} enableSwipeIos={false}>
        <Overlay onClick={onClose}>
            <Column spacing={0}>
                <ScrollView
                    style={[styles.scrollView]}
                    contentContainerStyle={[styles.content]}
                    showsVerticalScrollIndicator={false}
                    alwaysBounceVertical={false}
                >
                    <View style={{ paddingHorizontal: 16 }}>{children}</View>
                </ScrollView>
            </Column>
        </Overlay>
    </BackNavigator>
)
