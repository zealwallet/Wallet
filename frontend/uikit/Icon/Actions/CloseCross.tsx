import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'

type Props = {
    size: number
    color?: Color
}

export const CloseCross = ({ size, color }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            fill="none"
            viewBox="0 0 24 24"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <Path
                d="M19.1537 5.82911C19.4001 5.58266 19.4001 5.18307 19.1537 4.93659C18.9072 4.69008 18.5076 4.69006 18.2611 4.93655L11.9999 11.1978L5.73886 4.93656C5.49237 4.69006 5.09272 4.69006 4.84622 4.93655C4.59973 5.18305 4.59973 5.5827 4.84623 5.82919L11.1074 12.0902L4.84622 18.3514C4.59973 18.5979 4.59975 18.9976 4.84626 19.244C5.09274 19.4905 5.49232 19.4904 5.73878 19.244L11.9999 12.9827L18.2612 19.244C18.5076 19.4904 18.9072 19.4904 19.1537 19.244C19.4001 18.9975 19.4001 18.598 19.1537 18.3515L12.8924 12.0902L19.1537 5.82911Z"
                fill="currentColor"
            />
        </Svg>
    )
}
