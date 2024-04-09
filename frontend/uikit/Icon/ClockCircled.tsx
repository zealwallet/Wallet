import React from 'react'
import { Path, Svg } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const ClockCircled = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            color={color && colors[color]}
            height={size}
            viewBox="0 0 40 40"
            fill="none"
            width={size}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M20.7031 40C9.66313 40 0.703125 31.06 0.703125 20C0.703125 8.96 9.66313 0 20.7031 0C31.7631 0 40.7031 8.96 40.7031 20C40.7031 31.06 31.7631 40 20.7031 40ZM27.0839 27.4194C27.3239 27.5594 27.5839 27.6394 27.8639 27.6394C28.3639 27.6394 28.8639 27.3794 29.1439 26.8994C29.5639 26.1994 29.3439 25.2794 28.6239 24.8394L21.5039 20.5994V11.3594C21.5039 10.5194 20.8239 9.85938 20.0039 9.85938C19.1839 9.85938 18.5039 10.5194 18.5039 11.3594V21.4594C18.5039 21.9794 18.7839 22.4594 19.2439 22.7394L27.0839 27.4194Z"
                fill="currentColor"
            />
        </Svg>
    )
}
