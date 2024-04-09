import React from 'react'
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

type Props = {
    size: number
}

export const Celo = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <G clipPath="url(#clip0_936_5506)">
                <Rect width="120" height="120" rx="60" fill="#EDF0F4" />
                <Circle cx="60" cy="60" r="60" fill="#FCFE55" />
                <Path
                    d="M28 28H93V51.5344H83.4744C79.8879 42.3507 70.9537 35.8447 60.5 35.8447C46.8833 35.8447 35.8448 46.8832 35.8448 60.4999C35.8448 74.1166 46.8833 85.1551 60.5 85.1551C70.0812 85.1551 78.3859 79.6899 82.4668 71.7068H93V93H28V28Z"
                    fill="#060700"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_936_5506">
                    <Rect width="120" height="120" rx="60" fill="white" />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
