import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Billiard = ({ size, color }: Props) => {
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
                d="M16 25C20.9706 25 25 20.9706 25 16C25 11.0294 20.9706 7 16 7C11.0294 7 7 11.0294 7 16C7 20.9706 11.0294 25 16 25ZM16 21.625C19.1066 21.625 21.625 19.1066 21.625 16C21.625 12.8934 19.1066 10.375 16 10.375C12.8934 10.375 10.375 12.8934 10.375 16C10.375 19.1066 12.8934 21.625 16 21.625ZM18.75 17.5C18.75 18.8807 17.5188 20 16 20C14.4812 20 13.25 18.8807 13.25 17.5C13.25 16.7939 13.572 16.1562 14.0898 15.7016C13.7218 15.3098 13.5 14.8032 13.5 14.25C13.5 13.0074 14.6193 12 16 12C17.3807 12 18.5 13.0074 18.5 14.25C18.5 14.8032 18.2782 15.3098 17.9102 15.7016C18.428 16.1562 18.75 16.7939 18.75 17.5ZM17 17.5C17 18.0523 16.5523 18.5 16 18.5C15.4477 18.5 15 18.0523 15 17.5C15 16.9477 15.4477 16.5 16 16.5C16.5523 16.5 17 16.9477 17 17.5ZM16 15.4C16.5523 15.4 17 14.9523 17 14.4C17 13.8477 16.5523 13.4 16 13.4C15.4477 13.4 15 13.8477 15 14.4C15 14.9523 15.4477 15.4 16 15.4Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
