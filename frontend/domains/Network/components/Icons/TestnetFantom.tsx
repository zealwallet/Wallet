import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const TestnetFantom = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#7B8794" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M65 48.005L78.5 40.0905V55.9196L65 48.005ZM78.5 81.9246L60.5 92.4774L42.5 81.9246V63.4573L60.5 74.0101L78.5 63.4573V81.9246ZM42.5 40.0905L56 48.005L42.5 55.9196V40.0905ZM62.75 51.7739L76.25 59.6884L62.75 67.603V51.7739ZM58.25 67.603L44.75 59.6884L58.25 51.7739V67.603ZM76.25 36.3216L60.5 45.3668L44.75 36.3216L60.5 26.8995L76.25 36.3216ZM38 34.8141V84.1859L60.5 97L83 84.1859V34.8141L60.5 22L38 34.8141Z"
                fill="white"
            />
        </Svg>
    )
}
