import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldUpload = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 24 24"
        width={size}
        height={size}
        color={color && colors[color]}
        fill="none"
    >
        <Path
            id="Upload_2"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M8.46583 5.23624C8.24276 5.53752 8.26838 5.96727 8.5502 6.24C8.8502 6.54 9.3402 6.54 9.6402 6.24L11.2302 4.64V8.78H12.7702V4.64L14.3602 6.24L14.4464 6.31438C14.7477 6.53752 15.1775 6.51273 15.4502 6.24C15.6002 6.09 15.6802 5.89 15.6802 5.69C15.6802 5.5 15.6002 5.3 15.4502 5.15L12.5402 2.23L12.4495 2.14848C12.3202 2.0512 12.1602 2 12.0002 2C11.7902 2 11.6002 2.08 11.4502 2.23L8.5402 5.15L8.46583 5.23624ZM6.23116 8.78617C3.87791 8.89732 2 10.8769 2 13.2885V18.2536L2.00484 18.4661C2.1141 20.861 4.06029 22.7812 6.45 22.7812H17.56L17.7688 22.7763C20.1221 22.6652 22 20.6853 22 18.2638V13.3089L21.9951 13.0955C21.8853 10.6919 19.93 8.78125 17.55 8.78125H12.77V14.8859L12.7629 14.9932C12.7112 15.3787 12.385 15.6693 12 15.6693C11.57 15.6693 11.23 15.3234 11.23 14.8859V8.78125H6.44L6.23116 8.78617Z"
            fill="currentColor"
        />
    </SvgIcon>
)
