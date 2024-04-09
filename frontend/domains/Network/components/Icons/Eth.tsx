import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const Eth = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#EDF0F4" />
            <Path
                d="M59.8363 24L59.359 25.6213V72.663L59.8363 73.1392L81.6721 60.2318L59.8363 24Z"
                fill="#343434"
            />
            <Path
                d="M59.8364 24L38 60.2318L59.8364 73.1392V50.3064V24Z"
                fill="#8C8C8C"
            />
            <Path
                d="M59.8364 77.2734L59.5674 77.6015V94.3585L59.8364 95.1438L81.6856 64.3728L59.8364 77.2734Z"
                fill="#3C3C3B"
            />
            <Path
                d="M59.8364 95.1438V77.2734L38 64.3728L59.8364 95.1438Z"
                fill="#8C8C8C"
            />
            <Path
                d="M59.8363 73.1391L81.6721 60.2318L59.8363 50.3064V73.1391Z"
                fill="#141414"
            />
            <Path
                d="M38 60.2318L59.8364 73.1391V50.3064L38 60.2318Z"
                fill="#393939"
            />
        </Svg>
    )
}
