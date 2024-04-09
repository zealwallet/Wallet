import React, { ReactNode } from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { styles as textStyles } from '@zeal/uikit/Text'

type Props = {
    leftIcon: ReactNode
    children: ReactNode
    rightIcon: ReactNode
    disabled?: boolean
    onClick?: () => void
}

const styles = StyleSheet.create({
    base: {
        flexDirection: 'row',
        width: '100%',
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 4,
        // @ts-ignore FIXME @resetko-zeal
        transitionProperty: 'border-color',
        transitionTimingFunction: 'ease',
        transitionDuration: '0.3s',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.borderDefault,
        backgroundColor: colors.surfaceDefault,
    },
    wrapper: {
        flexDirection: 'row',
        columnGap: 12,
        flex: 1,
        maxWidth: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    text: {
        ...textStyles.weight_regular,
        ...textStyles.variant_paragraph,
        ...textStyles.color_textPrimary,
    },
    state_active: {
        borderColor: colors.borderFocus,
    },
    state_disabled: {
        borderColor: colors.borderSecondary,
        ...textStyles.color_textSecondary,
    },
})

export const InputButton = ({
    leftIcon,
    rightIcon,
    disabled,
    children,
    onClick,
}: Props) => {
    return (
        <Pressable role="button" disabled={disabled} onPress={onClick}>
            {({ pressed }) => (
                <View
                    style={[
                        styles.base,
                        pressed && styles.state_active,
                        disabled && styles.state_disabled,
                    ]}
                >
                    <View style={[styles.wrapper]}>
                        {leftIcon}
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.text,
                                disabled && styles.state_disabled,
                            ]}
                        >
                            {children}
                        </Text>
                    </View>
                    {rightIcon}
                </View>
            )}
        </Pressable>
    )
}
