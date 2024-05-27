import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const Key = ({ color, size }: Props) => {
    return (
        <SvgIcon
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M1.66699 15.9997C1.66699 11.7655 5.09948 8.33301 9.33366 8.33301C12.2411 8.33301 14.7686 9.95129 16.0681 12.333H28.0003C29.289 12.333 30.3337 13.3777 30.3337 14.6663V17.9997C30.3337 18.552 29.8859 18.9997 29.3337 18.9997H26.3337V21.333C26.3337 21.8853 25.8859 22.333 25.3337 22.333H22.0003C21.448 22.333 21.0003 21.8853 21.0003 21.333V18.9997H16.3908C15.2235 21.7421 12.5044 23.6663 9.33366 23.6663C5.09948 23.6663 1.66699 20.2339 1.66699 15.9997ZM9.33366 13.333C7.8609 13.333 6.66699 14.5269 6.66699 15.9997C6.66699 17.4724 7.8609 18.6663 9.33366 18.6663C10.8064 18.6663 12.0003 17.4724 12.0003 15.9997C12.0003 14.5269 10.8064 13.333 9.33366 13.333Z"
                fill="#01C9C9"
            />
        </SvgIcon>
    )
}
