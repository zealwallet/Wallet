import React, { ComponentProps, useState } from 'react'
import {
    NativeSyntheticEvent,
    StyleSheet,
    TextInput,
    TextInputChangeEventData,
    TextInputProps,
    TextInputSubmitEditingEventData,
    View,
} from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { styles as textStyles, Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

const styles = StyleSheet.create({
    container: {
        width: '100%',
        rowGap: 8,
    },
    inputWrapper: {
        flexDirection: 'row',
        width: '100%',
        borderWidth: 1,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 8,
        backgroundColor: colors.surfaceDefault,
        flexGrow: 0,
        flexShrink: 0,
        rowGap: 8,
    },

    input: {
        flex: 1,
        width: '100%',
        textAlign: 'left',
        color: colors.textPrimary,
        fontWeight: '400',
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { outlineStyle: 'none' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    inputDisabled: {
        color: colors.textDisabled,
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'default' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },

    State_normal: {
        borderColor: colors.borderSecondary,
    },

    State_focus: {
        borderColor: colors.borderFocus,
    },

    State_error: {
        borderColor: colors.borderError,
    },

    Variant_small: {
        paddingVertical: 3,
        paddingHorizontal: 12,
    },

    Variant_regular: {
        paddingVertical: 8,
        paddingHorizontal: 12,
    },

    Variant_large: {
        padding: 12,
    },

    inputWithIcon: {
        paddingVertical: 4,
    },
})

type Variant = 'regular' | 'large' | 'small'
type Props = {
    variant: Variant
    type?: 'password' | 'text' | 'multiline'
    autoFocus?: boolean
    spellCheck?: boolean
    value: string
    onChange: (e: NativeSyntheticEvent<TextInputChangeEventData>) => void
    onSubmitEditing: (
        e: NativeSyntheticEvent<TextInputSubmitEditingEventData>
    ) => void

    state: State
    message?: React.ReactNode
    sideMessage?: React.ReactNode
    rightIcon?: React.ReactNode
    leftIcon?: React.ReactNode

    placeholder: string

    onFocus?: () => void
    onBlur?: () => void

    'aria-labelledby'?: string
    'aria-label'?: string

    children?: React.ReactNode
    disabled?: boolean
    keyboardType:
        | 'default'
        | 'number-pad'
        | 'decimal-pad'
        | 'numeric'
        | 'email-address'
        | 'phone-pad'
        | 'url'
    returnKeyType?: TextInputProps['returnKeyType']
    blurOnSubmit?: TextInputProps['blurOnSubmit']
    autoComplete?: TextInputProps['autoComplete']
    autoCapitalize?: TextInputProps['autoCapitalize']
}

type State = 'normal' | 'error'

const messageColor = (
    state: State
): NonNullable<ComponentProps<typeof Text>['color']> => {
    switch (state) {
        case 'normal':
            return 'textSecondary'

        case 'error':
            return 'textError'

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const getAriaInvalid = (state: State): boolean => {
    switch (state) {
        case 'normal':
            return false

        case 'error':
            return true

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const variantToTypographyStyle = (variant: Variant) => {
    switch (variant) {
        case 'small':
            return textStyles.variant_footnote
        case 'regular':
            return textStyles.variant_paragraph
        case 'large':
            return textStyles.variant_callout

        /* istanbul ignore next */
        default:
            notReachable(variant)
    }
}

export const Input = React.forwardRef<TextInput, Props>(
    (
        {
            type = 'text',
            value,
            autoFocus,
            placeholder,
            onChange,
            onBlur,
            onFocus,
            message,
            sideMessage,
            onSubmitEditing,
            state,
            variant,
            rightIcon,
            leftIcon,
            'aria-labelledby': ariaLabelledBy,
            'aria-label': ariaLabel,
            disabled,
            spellCheck,
            keyboardType,
            returnKeyType,
            blurOnSubmit,
            autoComplete,
            autoCapitalize,
        }: Props,
        ref
    ) => {
        const [isFocused, setFocused] = useState(false)

        const inputWrapperStyles = [
            styles.inputWrapper,
            styles[
                `State_${
                    isFocused && state !== 'error' && !disabled
                        ? 'focus'
                        : state
                }`
            ],
            styles[`Variant_${variant}`],
            !!(leftIcon || rightIcon) && styles.inputWithIcon,
        ]

        const inputStyles = [
            styles.input,
            variantToTypographyStyle(variant),
            disabled && styles.inputDisabled,
        ]

        return (
            <View style={styles.container}>
                <View style={inputWrapperStyles}>
                    {leftIcon}
                    <TextInput
                        // needed to fix input height, on IOS it is re-mounted as new native component and value is lost if you change from multiline to a password
                        keyboardType={keyboardType}
                        key={type}
                        style={inputStyles}
                        aria-label={ariaLabel}
                        aria-labelledby={ariaLabelledBy}
                        aria-invalid={getAriaInvalid(state)}
                        secureTextEntry={type === 'password'}
                        multiline={type === 'multiline'}
                        textAlignVertical={
                            type === 'multiline' ? 'top' : 'center'
                        }
                        value={value}
                        autoFocus={autoFocus}
                        onSubmitEditing={onSubmitEditing}
                        returnKeyType={returnKeyType}
                        blurOnSubmit={blurOnSubmit}
                        autoComplete={autoComplete}
                        autoCapitalize={autoCapitalize}
                        onChange={onChange}
                        placeholder={placeholder}
                        placeholderTextColor={colors.textSecondary}
                        onFocus={() => {
                            setFocused(true)
                            onFocus && onFocus()
                        }}
                        onBlur={() => {
                            setFocused(false)
                            onBlur && onBlur()
                        }}
                        editable={!disabled}
                        aria-disabled={disabled}
                        spellCheck={spellCheck}
                        ref={ref}
                    />
                    {rightIcon}
                </View>
                {(message || sideMessage) && (
                    <Row spacing={8}>
                        {message && (
                            <Text
                                ellipsis
                                color={messageColor(state)}
                                variant="caption1"
                                weight="regular"
                            >
                                {message}
                            </Text>
                        )}
                        {sideMessage && (
                            <>
                                <Spacer />
                                <Text
                                    ellipsis
                                    color="textSecondary"
                                    variant="caption1"
                                    weight="regular"
                                >
                                    {sideMessage}
                                </Text>
                            </>
                        )}
                    </Row>
                )}
            </View>
        )
    }
)
