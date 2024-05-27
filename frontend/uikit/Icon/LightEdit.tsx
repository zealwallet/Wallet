import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const LightEdit = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            height={size}
            viewBox="0 0 16 16"
            fill="none"
            width={size}
        >
            <Path
                d="M9.66553 13.6292H14.5006"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M9.02 2.52986C9.5371 1.91186 10.4667 1.82124 11.0975 2.32782C11.1324 2.35531 12.253 3.22586 12.253 3.22586C12.946 3.64479 13.1613 4.5354 12.7329 5.21506C12.7102 5.25146 6.37463 13.1763 6.37463 13.1763C6.16385 13.4393 5.84389 13.5945 5.50194 13.5982L3.07569 13.6287L2.52902 11.3149C2.45244 10.9895 2.52902 10.6478 2.7398 10.3849L9.02 2.52986Z"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <Path
                d="M7.84766 4L11.4825 6.79142"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </SvgIcon>
    )
}
