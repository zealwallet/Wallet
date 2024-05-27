import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Food = ({ size, color }: Props) => {
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
                d="M11.25 12.509V7.49048C11.25 7.21959 11.4713 7 11.7578 7H12.2422C12.5226 7 12.75 7.21506 12.75 7.49048V12.509C12.75 12.7721 12.9739 13 13.25 13C13.5181 13 13.75 12.7802 13.75 12.509V7.49048C13.75 7.21959 13.9713 7 14.2578 7H14.7422C15.0226 7 15.25 7.21506 15.25 7.49048V13.4902C15.25 14.7933 14.2625 15.8644 13 15.9881V24.4904C13 24.7718 12.786 25 12.4953 25H11.5047C11.226 25 11 24.7723 11 24.4904V15.988C9.73708 15.8639 8.75 14.7887 8.75 13.4902V7.49048C8.75 7.21959 8.97133 7 9.25783 7H9.74217C10.0226 7 10.25 7.21506 10.25 7.49048V12.509C10.25 12.7721 10.4739 13 10.75 13C11.0181 13 11.25 12.7802 11.25 12.509ZM23 7V24.4904C23 24.7718 22.786 25 22.4953 25H21.5047C21.226 25 21 24.7723 21 24.4904V18H19.4905C19.2196 18 19 17.7671 19 17.4966V11C19 7 23 7 23 7Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
