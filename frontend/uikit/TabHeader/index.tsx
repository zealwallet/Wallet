import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Text } from '../Text'

const styles = StyleSheet.create({
    // @ts-ignore
    nonSelectable: {
        ...(() => {
            switch (ZealPlatform.OS) {
                case 'ios':
                case 'android':
                    return {}
                case 'web':
                    return { cursor: 'auto' }
                /* istanbul ignore next */
                default:
                    return notReachable(ZealPlatform.OS)
            }
        })(),
    },
})

type Props = {
    selected: boolean
    children: React.ReactNode
    onClick?: () => void
}

export const TabHeader = ({ selected, children, onClick }: Props) => (
    <Pressable onPress={onClick} style={!onClick && styles.nonSelectable}>
        <Text
            variant="title3"
            weight="medium"
            color={selected ? 'textPrimary' : 'textSecondary'}
        >
            {children}
        </Text>
    </Pressable>
)
