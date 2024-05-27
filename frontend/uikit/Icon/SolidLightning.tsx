import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const SolidLightning = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 20 20"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M11.5167 2.50017C11.5167 2.33313 11.4169 2.18224 11.2632 2.1168C11.1095 2.05137 10.9316 2.08405 10.8112 2.19983L9.32958 3.62447C7.12356 5.74564 5.25953 8.19582 3.80384 10.8878C3.76956 10.9483 3.75 11.0183 3.75 11.0928C3.75 11.3229 3.93655 11.5095 4.16667 11.5095H7.75833V17.5002C7.75833 17.6652 7.8557 17.8146 8.00663 17.8813C8.15756 17.948 8.33361 17.9193 8.45559 17.8082L9.11852 17.2043C11.4391 15.0904 13.4085 12.6206 14.9527 9.88768L15.3628 9.16197C15.4357 9.03297 15.4346 8.87496 15.3599 8.74699C15.2852 8.61902 15.1482 8.54033 15 8.54033H11.5167V2.50017Z"
            fill="currentColor"
        />
    </SvgIcon>
)
