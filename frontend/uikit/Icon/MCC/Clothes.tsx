import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Clothes = ({ size, color }: Props) => {
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
                d="M11 13.3595V23.4966C11 23.7671 11.2282 24 11.5096 24H20.4903C20.7723 24 21 23.7746 21 23.4966V13.3595C21 13.0846 21.2213 12.8618 21.5078 12.8618H21.9921C22.2726 12.8618 22.5 13.0767 22.5 13.3595V16.25L24.5566 15.2217C24.807 15.0965 24.9297 14.7892 24.843 14.5292L23.3169 9.95072C23.1438 9.43151 22.5994 8.79971 22.1053 8.55265L21.8947 8.44735C21.4047 8.20236 20.5543 8 20.0046 8H19C19 9.10457 17.6568 10 16 10C14.3431 10 13 9.10457 13 8L11.9954 8C11.4556 8 10.5994 8.20029 10.1053 8.44735L9.89468 8.55265C9.4047 8.79764 8.85809 9.42565 8.68307 9.95072L7.15691 14.5292C7.07115 14.7865 7.19847 15.0992 7.44333 15.2217L9.49997 16.25V13.3595C9.49997 13.0846 9.7213 12.8618 10.0078 12.8618H10.4921C10.7726 12.8618 11 13.0767 11 13.3595Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
