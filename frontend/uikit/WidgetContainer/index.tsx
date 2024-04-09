import React from 'react'
import {
    Pressable,
    PressableStateCallbackType,
    StyleSheet,
    View,
} from 'react-native'

import { colors } from '@zeal/uikit/colors'

type Props = {
    children: React.ReactNode
    onClick: () => void
}

const styles = StyleSheet.create({
    container: {
        borderRadius: 20,
    },
    widget: {
        justifyContent: 'center',
        alignItems: 'stretch',
        backgroundColor: colors.backgroundWidget,
        padding: 16,
        borderRadius: 20,
    },
    widget_hover: {
        // @ts-ignore
        outlineWidth: 2,
        outlineStyle: 'solid',
        outlineOffset: -2,
        outlineColor: colors.borderWidgetHover,
    },
    widget_pressed: {
        // @ts-ignore
        outlineWidth: 0,
        backgroundColor: colors.backgroundWidgetPressed,
    },
})

export const WidgetContainer = ({ children, onClick }: Props) => (
    <Pressable style={[styles.container]} onPress={onClick}>
        {(pressableState: PressableStateCallbackType) => (
            <View
                style={[
                    styles.widget,
                    pressableState.hovered && styles.widget_hover,
                    pressableState.pressed && styles.widget_pressed,
                ]}
            >
                {children}
            </View>
        )}
    </Pressable>
)
