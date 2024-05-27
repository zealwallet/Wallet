import React, { ReactNode } from 'react'
import { useIntl } from 'react-intl'
import {
    GestureResponderEvent,
    Pressable,
    StyleSheet,
    View,
} from 'react-native'

import { Color, colors } from '@zeal/uikit/colors'
import { Text } from '@zeal/uikit/Text'

import { Content, Layout } from './Layout'

import { Backspace } from '../Icon/Backspace'

type IconColor = Extract<Color, 'textPrimary' | 'textDisabled'>

const buttonStyles = StyleSheet.create({
    pressable: {
        flex: 1,
    },
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        maxHeight: 72,
        backgroundColor: colors.surfaceLight,
        borderRadius: 12,
    },
    hover: {
        backgroundColor: colors.borderSecondary,
    },
    pressed: {
        backgroundColor: colors.darkActionSecondaryDefault,
    },
})

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexShrink: 0,
    },
    row: {
        flex: 1,
        flexDirection: 'row',
    },
    action: {
        flexBasis: 0,
        flexGrow: 1,
    },
})

export const KeyPad = ({
    onPress,
    disabled,
    rightAction,
    leftAction,
}: {
    disabled: boolean
    leftAction: ReactNode
    rightAction: ReactNode
    onPress: (key: number) => void
}) => {
    const { formatMessage } = useIntl()

    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <KeypadButton
                    onPress={() => onPress(1)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-1',
                        defaultMessage: 'Keypad key 1',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            1
                        </Text>
                    )}
                </KeypadButton>
                <KeypadButton
                    onPress={() => onPress(2)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-2',
                        defaultMessage: 'Keypad key 2',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            2
                        </Text>
                    )}
                </KeypadButton>
                <KeypadButton
                    onPress={() => onPress(3)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-3',
                        defaultMessage: 'Keypad key 3',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            3
                        </Text>
                    )}
                </KeypadButton>
            </View>
            <View style={styles.row}>
                <KeypadButton
                    onPress={() => onPress(4)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-4',
                        defaultMessage: 'Keypad key 4',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            4
                        </Text>
                    )}
                </KeypadButton>
                <KeypadButton
                    onPress={() => onPress(5)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-5',
                        defaultMessage: 'Keypad key 5',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            5
                        </Text>
                    )}
                </KeypadButton>
                <KeypadButton
                    onPress={() => onPress(6)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-6',
                        defaultMessage: 'Keypad key 6',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            6
                        </Text>
                    )}
                </KeypadButton>
            </View>
            <View style={styles.row}>
                <KeypadButton
                    onPress={() => onPress(7)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-7',
                        defaultMessage: 'Keypad key 7',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            7
                        </Text>
                    )}
                </KeypadButton>
                <KeypadButton
                    onPress={() => onPress(8)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-8',
                        defaultMessage: 'Keypad key 8',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            8
                        </Text>
                    )}
                </KeypadButton>
                <KeypadButton
                    onPress={() => onPress(9)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-9',
                        defaultMessage: 'Keypad key 9',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            9
                        </Text>
                    )}
                </KeypadButton>
            </View>
            <View style={styles.row}>
                <View style={styles.action}>{leftAction}</View>
                <KeypadButton
                    onPress={() => onPress(0)}
                    disabled={disabled}
                    aria-label={formatMessage({
                        id: 'keypad-0',
                        defaultMessage: 'Keypad key 0',
                    })}
                >
                    {({ color }) => (
                        <Text
                            variant="homeScreenTitle"
                            color={color}
                            weight="regular"
                        >
                            0
                        </Text>
                    )}
                </KeypadButton>
                <View style={styles.action}>{rightAction}</View>
            </View>
        </View>
    )
}

type ButtonProps = {
    children: (renderProps: { color: IconColor; size: number }) => ReactNode
    onPress?: (e: GestureResponderEvent) => void
    disabled: boolean
    'aria-label': string
}

const KeypadButton = ({
    children,
    disabled,
    onPress,
    'aria-label': ariaLabel,
}: ButtonProps) => (
    <Pressable
        style={buttonStyles.pressable}
        role="button"
        disabled={disabled}
        onPress={onPress}
        aria-label={ariaLabel}
    >
        {({ pressed, hovered }) => (
            <View
                style={[
                    buttonStyles.container,
                    hovered && buttonStyles.hover,
                    pressed && buttonStyles.pressed,
                ]}
            >
                {children({
                    size: 32,
                    color: disabled ? 'textDisabled' : 'textPrimary',
                })}
            </View>
        )}
    </Pressable>
)

const BackSpaceButton = ({
    onPress,
    'aria-label': ariaLabel,
    disabled,
}: {
    onPress: () => void
    disabled: boolean
    'aria-label': string
}) => (
    <KeypadButton aria-label={ariaLabel} disabled={disabled} onPress={onPress}>
        {({ color, size }) => <Backspace size={size} color={color} />}
    </KeypadButton>
)

KeyPad.Button = KeypadButton
KeyPad.BackSpaceButton = BackSpaceButton
KeyPad.Layout = Layout
KeyPad.Content = Content
