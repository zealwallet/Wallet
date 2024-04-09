import React from 'react'
import { Pressable } from 'react-native'

type Props = {
    disabled?: true
    onClick: () => void
    children: React.ReactNode
}

export const Clickable = ({ disabled, onClick, children }: Props) => {
    return (
        <Pressable disabled={disabled} onPress={onClick}>
            {children}
        </Pressable>
    )
}
