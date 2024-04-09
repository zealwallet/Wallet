import React from 'react'
import Svg, { Circle, Path } from 'react-native-svg'

type Props = {
    size: number
}

export const Avalanche = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#E84142" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M63.0407 23.2806C61.2803 20.2398 58.4796 20.2398 56.7192 23.2806L24.7513 79.5744C22.9909 82.6551 24.4313 85.0957 27.9521 85.0957H43.9961C47.2369 84.8957 50.1576 83.1753 51.918 80.4546L71.2428 46.9664C72.6431 44.0857 72.6431 40.6848 71.2428 37.8041L65.4813 27.6816L63.0407 23.2806ZM84.2859 60.3297C82.5254 57.289 79.6847 57.289 77.9243 60.3297L66.7616 79.5744C65.0411 82.6152 66.4815 85.0958 69.9624 85.0958H92.0478C95.5686 85.0958 97.009 82.6152 95.2486 79.5744L84.2859 60.3297Z"
                fill="white"
            />
        </Svg>
    )
}
