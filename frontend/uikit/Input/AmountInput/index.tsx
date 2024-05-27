import React, { useState } from 'react'
import { StyleSheet, TextInput, View } from 'react-native'

import { colors } from '@zeal/uikit/colors'
import { Extractor } from '@zeal/uikit/Extractor'
import { FloatInput } from '@zeal/uikit/Input/FloatInput'
import { Row } from '@zeal/uikit/Row'
import { Skeleton } from '@zeal/uikit/Skeleton'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

type InputRenderProps = {
    onFocus: () => void
    onBlur: () => void
}

type Props = {
    top?: React.ReactNode
    label?: string
    content: {
        topLeft: React.ReactNode
        topRight: (prop: InputRenderProps) => React.ReactNode
        bottomLeft?: React.ReactNode
        bottomRight?: React.ReactNode
    }
    bottom?: React.ReactNode
    state: 'normal' | 'error'
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.surfaceLight,
        borderRadius: 8,
        // @ts-ignore FIXME @resetko-zeal
        transition: 'border-color 300ms ease',
        backgroundColor: colors.surfaceDefault,
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    content: {
        paddingHorizontal: 12,
        paddingVertical: 8,
        minHeight: 75,
        justifyContent: 'space-between',
        flexDirection: 'column',
        width: '100%',
        gap: 0,
        overflow: 'hidden',
    },
    top_left: {
        flexShrink: 0,
        flexGrow: 0,
        flexBasis: 'auto',
    },
    top_right: {
        justifyContent: 'flex-end',
        flexShrink: 1,
        flexGrow: 1,
    },
    input: {
        // width: '100%',
        flexGrow: 1,
        flexShrink: 1,
        // flex: 1,
        textAlign: 'right',
        color: colors.textPrimary,
        height: 24,
        padding: 0,
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
        backgroundColor: 'rgba(0,0,0,0)',
        fontWeight: '500',
        fontSize: 20,
        lineHeight: 25,
    },
    bottom_left: {
        flexDirection: 'row',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    bottom_right: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    bottom: {
        width: '100%',
        borderTopWidth: 1,
        borderStyle: 'solid',
        borderColor: colors.surfaceLight,
        paddingVertical: 6,
        paddingHorizontal: 12,
    },
    top: {
        width: '100%',
    },
    state_hovered: {
        borderColor: colors.borderDefault,
    },
    state_focused: {
        borderColor: colors.borderDefault,
    },
    state_normal: {
        borderColor: colors.surfaceLight,
    },
    state_error: {
        borderColor: colors.borderError,
    },
})

type InteractionState = Extractor<keyof typeof styles, 'state'>

export const AmountInput = ({ top, content, bottom, state, label }: Props) => {
    const [isFocused, setIsFocused] = useState<boolean>(false)
    const [isHovered, setIsHovered] = useState<boolean>(false)

    const stateStyles: InteractionState = (() => {
        switch (state) {
            case 'normal':
                switch (true) {
                    case isFocused:
                        return 'focused'
                    case isHovered:
                        return 'hovered'
                    default:
                        return 'normal'
                }
            case 'error':
                return 'error'
            /* istanbul ignore next */
            default:
                return notReachable(state)
        }
    })()

    return (
        <View
            aria-label={label}
            onPointerEnter={() => setIsHovered(true)}
            onPointerLeave={() => setIsHovered(false)}
            style={[styles.container, styles[`state_${stateStyles}`]]}
        >
            {top && <View style={styles.top}>{top}</View>}
            <View style={styles.content}>
                <Row spacing={8}>
                    <View style={styles.top_left}>{content.topLeft}</View>
                    <View style={styles.top_right}>
                        {content.topRight({
                            onBlur: () => setIsFocused(false),
                            onFocus: () => setIsFocused(true),
                        })}
                    </View>
                </Row>
                <Row spacing={8}>
                    {content.bottomLeft && (
                        <View style={styles.bottom_left}>
                            {content.bottomLeft}
                        </View>
                    )}
                    {content.bottomRight && (
                        <View style={styles.bottom_right}>
                            {content.bottomRight}
                        </View>
                    )}
                </Row>
            </View>
            {bottom && <View style={styles.bottom}>{bottom}</View>}
        </View>
    )
}

type InputProps = {
    amount: string | null
    readOnly?: boolean
    prefix: string
    autoFocus?: true
    fraction: number
    label: string
    onChange: (value: string | null) => void
    onBlur: () => void
    onFocus: () => void
    onSubmitEditing: () => void
}

AmountInput.Input = ({
    amount,
    onChange,
    prefix,
    readOnly,
    autoFocus,
    label,
    fraction,
    onBlur,
    onFocus,
    onSubmitEditing,
}: InputProps) => {
    return (
        <FloatInput
            value={amount}
            prefix={prefix}
            fraction={fraction}
            onChange={onChange}
        >
            {({ onChange, value }) => (
                <TextInput
                    keyboardType="numeric"
                    editable={!readOnly}
                    aria-disabled={readOnly}
                    style={styles.input}
                    aria-label={label}
                    autoFocus={autoFocus}
                    placeholder="0"
                    value={value}
                    onChange={onChange}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={onFocus}
                    onBlur={onBlur}
                />
            )}
        </FloatInput>
    )
}

AmountInput.InputSkeleton = () => {
    return <Skeleton variant="default" width="100%" height={24} />
}
