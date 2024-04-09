import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Filter2 = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            height={size}
            fill="transparent"
            viewBox="0 0 20 20"
            width={size}
        >
            <Path
                d="M1.6665 4.99935C1.6665 4.53911 2.0396 4.16602 2.49984 4.16602H17.4998C17.9601 4.16602 18.3332 4.53911 18.3332 4.99935C18.3332 5.45959 17.9601 5.83268 17.4998 5.83268H2.49984C2.0396 5.83268 1.6665 5.45959 1.6665 4.99935Z"
                fill="currentColor"
            />
            <Path
                d="M4.1665 9.99935C4.1665 9.53911 4.5396 9.16602 4.99984 9.16602H14.9998C15.4601 9.16602 15.8332 9.53911 15.8332 9.99935C15.8332 10.4596 15.4601 10.8327 14.9998 10.8327H4.99984C4.5396 10.8327 4.1665 10.4596 4.1665 9.99935Z"
                fill="currentColor"
            />
            <Path
                d="M7.49984 14.9993C7.49984 14.5391 7.87293 14.166 8.33317 14.166H11.6665C12.1267 14.166 12.4998 14.5391 12.4998 14.9993C12.4998 15.4596 12.1267 15.8327 11.6665 15.8327H8.33317C7.87293 15.8327 7.49984 15.4596 7.49984 14.9993Z"
                fill="currentColor"
            />
        </Svg>
    )
}
