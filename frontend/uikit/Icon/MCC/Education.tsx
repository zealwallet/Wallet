import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Education = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 32 32"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.9342 8.96887C16.0629 8.91199 16.2097 8.91199 16.3384 8.96887L24.2376 12.4593C24.6348 12.6348 24.6348 13.1985 24.2376 13.374L16.3384 16.8644C16.2097 16.9213 16.0629 16.9213 15.9342 16.8644L9 13.8004V18.5C9 18.7762 8.77614 19 8.5 19H8C7.72386 19 7.5 18.7762 7.5 18.5V13H7.74389C7.70937 12.7899 7.80641 12.5603 8.03501 12.4593L15.9342 8.96887ZM15.7321 18.289L11.0606 16.2248V19.4769C11.0606 20.8704 13.333 22 16.1363 22C18.9395 22 21.212 20.8704 21.212 19.4769V16.2248L16.5405 18.289C16.283 18.4028 15.9896 18.4028 15.7321 18.289ZM8.25 23C8.94036 23 9.5 22.3284 9.5 21.5C9.5 20.6716 8.94036 20 8.25 20C7.55964 20 7 20.6716 7 21.5C7 22.3284 7.55964 23 8.25 23Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
