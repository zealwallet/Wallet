import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const NetworkSelector = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            height={size}
            fill="transparent"
            viewBox="0 0 28 28"
            width={size}
        >
            <Path
                d="M5.66602 8.99935C5.66602 8.53911 6.03911 8.16602 6.49935 8.16602H21.4993C21.9596 8.16602 22.3327 8.53911 22.3327 8.99935C22.3327 9.45959 21.9596 9.83268 21.4993 9.83268H6.49935C6.03911 9.83268 5.66602 9.45959 5.66602 8.99935Z"
                fill="currentColor"
            />
            <Path
                d="M8.16602 13.9993C8.16602 13.5391 8.53911 13.166 8.99935 13.166H18.9993C19.4596 13.166 19.8327 13.5391 19.8327 13.9993C19.8327 14.4596 19.4596 14.8327 18.9993 14.8327H8.99935C8.53911 14.8327 8.16602 14.4596 8.16602 13.9993Z"
                fill="currentColor"
            />
            <Path
                d="M11.4993 18.9993C11.4993 18.5391 11.8724 18.166 12.3327 18.166H15.666C16.1263 18.166 16.4993 18.5391 16.4993 18.9993C16.4993 19.4596 16.1263 19.8327 15.666 19.8327H12.3327C11.8724 19.8327 11.4993 19.4596 11.4993 18.9993Z"
                fill="currentColor"
            />
        </Svg>
    )
}
