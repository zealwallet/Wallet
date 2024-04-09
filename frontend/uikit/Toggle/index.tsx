import React, { useState } from 'react'
import { Pressable, StyleSheet, View } from 'react-native'

import { notReachable } from '@zeal/toolkit'
import { uuid } from '@zeal/toolkit/Crypto'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Switch } from './Switch'

import { Text } from '../Text'

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        gap: 8,
    },
    // @ts-ignore
    disabled: {
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'not-allowed' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
})

type Size = 'regular' | 'small'

type Props = {
    title: React.ReactNode | null
    size: Size
    disabled?: boolean
    checked: boolean
    onClick: () => void
}

export const Toggle = ({ title, disabled, checked, onClick, size }: Props) => {
    const [titleId] = useState(uuid())

    const textVariant = (() => {
        switch (size) {
            case 'regular':
                return 'paragraph'
            case 'small':
                return 'caption1'
            default:
                notReachable(size)
        }
    })()

    return (
        <Pressable disabled={disabled} onPress={onClick}>
            <View style={[styles.container, disabled && styles.disabled]}>
                <Text
                    id={titleId}
                    weight="regular"
                    color="textSecondary"
                    variant={textVariant}
                >
                    {title}
                </Text>

                <Switch
                    aria-labelledby={titleId}
                    disabled={disabled}
                    value={checked}
                    size={size}
                />
            </View>
        </Pressable>
    )
}
