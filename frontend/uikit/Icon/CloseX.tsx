import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const CloseX = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 28 28"
            width={size}
            height={size}
            color={color && colors[color]}
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M14.0004 12.1323L20.8927 5.24005C21.4081 4.72466 22.2437 4.7247 22.7591 5.24013C23.2743 5.75551 23.2743 6.59101 22.759 7.10633L15.8666 13.9985L22.759 20.8908C23.2743 21.4062 23.2743 22.2417 22.759 22.757C22.2436 23.2724 21.4081 23.2724 20.8928 22.757L14.0004 15.8647L7.10828 22.757C6.59296 23.2723 5.75746 23.2724 5.24208 22.7571C4.72665 22.2418 4.72661 21.4061 5.242 20.8907L12.1343 13.9985L5.24202 7.10642C4.72662 6.59104 4.72662 5.75544 5.242 5.24005C5.75739 4.72466 6.593 4.72467 7.10837 5.24006L14.0004 12.1323Z"
                fill="currentColor"
            />
        </Svg>
    )
}
