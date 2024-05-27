import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Shield = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M20.4495 6.02608C20.4495 5.26122 19.9462 4.57382 19.2014 4.32867L12.5687 2.1037C12.1661 1.96543 11.7333 1.96543 11.3408 2.1037L4.72821 4.41693C3.99348 4.67286 3.49024 5.3583 3.5003 6.12316L3.54056 12.7628C3.55063 14.773 4.31555 16.7244 5.68437 18.2345C6.30839 18.9307 7.10351 19.5191 8.12006 20.0486L11.7233 21.9117C11.834 21.9706 11.9648 22 12.0856 22C12.2064 22 12.3272 21.9706 12.4379 21.9117L16.0109 19.9996C17.0174 19.4603 17.8125 18.8621 18.4265 18.1561C19.7751 16.6253 20.5099 14.674 20.4998 12.6637L20.4495 6.02608Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
