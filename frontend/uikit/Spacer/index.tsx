import React from 'react'
import { StyleSheet, View } from 'react-native'

export type Size = 12

type Props = {
    size?: Size
}

const styles = StyleSheet.create({
    flexible: {
        flexBasis: 0,
        flexGrow: 1,
    },
})

export const Spacer = ({ size }: Props) => (
    <View style={size ? { width: size, height: size } : styles.flexible} />
)
