import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Copy = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.46875 6.79642V19.0858H4.3472C3.9667 19.0858 3.65717 18.7763 3.65717 18.3958V2.96438C3.65717 2.58388 3.9667 2.27436 4.3472 2.27436H16.08C16.4605 2.27436 16.7701 2.58388 16.7701 2.96438V4.33203H8.91224C7.56491 4.33203 6.46875 5.43765 6.46875 6.79642ZM4.3472 20.8602H6.46875V21.035C6.46875 22.3942 7.57398 23.4994 8.93314 23.4994H19.711C21.0697 23.4994 22.1754 22.3942 22.1754 21.035V6.79642C22.1754 5.43765 21.0697 4.33203 19.711 4.33203H18.5444V2.96438C18.5444 1.60562 17.4388 0.5 16.08 0.5H4.3472C2.98843 0.5 1.88281 1.60562 1.88281 2.96438V18.3958C1.88281 19.7545 2.98843 20.8602 4.3472 20.8602ZM8.24219 6.7955C8.24219 6.415 8.54225 6.10547 8.91132 6.10547H19.7101C20.0906 6.10547 20.4001 6.415 20.4001 6.7955V21.0341C20.4001 21.4146 20.0906 21.7241 19.7101 21.7241H8.93222C8.55171 21.7241 8.24219 21.4146 8.24219 21.0341V6.7955Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
