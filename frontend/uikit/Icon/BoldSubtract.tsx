import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldSubtract = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 20 20"
            height={size}
            width={size}
            color={color && colors[color]}
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.0599 2.15466C6.37246 1.8421 6.79639 1.6665 7.23841 1.6665L12.7613 1.6665C13.2033 1.6665 13.6272 1.8421 13.9398 2.15466L17.845 6.0599C18.1576 6.37246 18.3332 6.79639 18.3332 7.23841V12.7613C18.3332 13.2033 18.1576 13.6272 17.845 13.9398L13.9398 17.845C13.6272 18.1576 13.2033 18.3332 12.7613 18.3332H7.23841C6.79639 18.3332 6.37246 18.1576 6.0599 17.845L2.15466 13.9398C1.8421 13.6272 1.6665 13.2033 1.6665 12.7613L1.6665 7.23841C1.6665 6.79639 1.8421 6.37246 2.15466 6.0599L6.0599 2.15466ZM6.46432 9.1665C6.00409 9.1665 5.63099 9.5396 5.63099 9.99984C5.63099 10.4601 6.00409 10.8332 6.46432 10.8332H13.5354C13.9956 10.8332 14.3687 10.4601 14.3687 9.99984C14.3687 9.5396 13.9956 9.1665 13.5354 9.1665L6.46432 9.1665Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
