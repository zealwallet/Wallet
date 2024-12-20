import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldNewWallet = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M4.0825 3.09375L5.5 0L6.90625 3.09375L10 4.5L6.90625 5.9175L5.5 9L4.0825 5.9175L1 4.5L4.0825 3.09375Z"
            fill="currentColor"
        />
        <Path
            d="M10.3248 2.99996H16.5156C19.9645 2.99996 22 4.98456 22 8.38176H17.7689V8.41643C15.8052 8.41643 14.2134 9.96845 14.2134 11.883C14.2134 13.7975 15.8052 15.3495 17.7689 15.3495H22V15.6615C22 19.0154 19.9645 21 16.5156 21H7.48447C4.03559 21 2.00003 19.0154 2.00003 15.6615V8.33843C2.00003 7.74748 2.06323 7.19905 2.18621 6.69648L2.95157 7.04843L5.50543 12.6021L8.03903 7.04843L13.613 4.49456L10.3248 2.99996Z"
            fill="currentColor"
        />
        <Path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M17.7692 9.87106H21.2536C21.666 9.87106 22.0003 10.197 22.0003 10.599V13.1296C21.9955 13.5297 21.664 13.8529 21.2536 13.8576H17.8492C16.855 13.8706 15.9857 13.207 15.7603 12.263C15.6473 11.6769 15.8059 11.0722 16.1933 10.6109C16.5808 10.1495 17.1576 9.87872 17.7692 9.87106ZM17.9207 12.5297H18.2496C18.6718 12.5297 19.0141 12.196 19.0141 11.7844C19.0141 11.3728 18.6718 11.0391 18.2496 11.0391H17.9207C17.7188 11.0368 17.5243 11.1133 17.3807 11.2517C17.2371 11.3901 17.1563 11.5788 17.1563 11.7757C17.1562 12.1888 17.4971 12.5249 17.9207 12.5297Z"
            fill="currentColor"
        />
    </SvgIcon>
)
