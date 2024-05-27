import React from 'react'
import { Pressable, StyleSheet } from 'react-native'

type Props = {
    disabled?: true
    onClick: () => void
    children: React.ReactNode
}

const styles = StyleSheet.create({
    pressable: {
        justifyContent: 'center',
    },
})

export const Clickable = ({ disabled, onClick, children }: Props) => {
    return (
        <Pressable
            disabled={disabled}
            onPress={onClick}
            style={styles.pressable}
        >
            {children}
        </Pressable>
    )
}
