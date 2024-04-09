import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const Base = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#0052FF" />
            <Path
                d="M60.0001 102C83.1961 102 102 83.196 102 60C102 36.804 83.1961 18 60.0001 18C37.6859 18 19.436 35.4017 18.0808 57.3747H73.1251V62.6247H18.0808C19.4357 84.598 37.6857 102 60.0001 102Z"
                fill="white"
            />
        </Svg>
    )
}
