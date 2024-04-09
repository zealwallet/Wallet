import React from 'react'
import { ImageBackground } from 'react-native'

type Size = `${number}%` | number

type Props = { src: string } & ({ size: Size } | { width: Size; height: Size })

export const Img = ({ src, ...props }: Props) => {
    if ('size' in props) {
        return (
            <ImageBackground
                style={[{ width: props.size, height: props.size }]}
                source={{ uri: src }}
            />
        )
    }

    return (
        <ImageBackground
            style={[{ width: props.width, height: props.height }]}
            source={{ uri: src }}
        />
    )
}
