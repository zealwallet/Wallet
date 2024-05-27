import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Flights = ({ size, color }: Props) => {
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
                d="M11.5 18L15.6591 13.8409L8.94667 10.7085C8.70058 10.5936 8.65573 10.3443 8.84787 10.1521L9.65207 9.34792C9.83944 9.16055 10.2166 9.04816 10.4838 9.10755L18.5909 10.9091L20 9.50002C20.8404 8.66244 22.5706 7.50002 23.483 8.50002C24.3954 9.50002 23.411 11.1628 22.5706 12L21.1017 13.458L22.8924 21.5161C22.9518 21.7834 22.8394 22.1605 22.6521 22.3479L21.8479 23.1521C21.6557 23.3443 21.4064 23.2994 21.2915 23.0533L18.1712 16.3669L14 20.5074V22.5023C14 22.7772 13.8006 23.0781 13.5393 23.1805L13.1847 23.3195C12.9302 23.4192 12.636 23.2843 12.5327 23.0313L11.5 20.5L8.96872 19.6563C8.71572 19.5719 8.5708 19.2875 8.65817 19.0254L8.84177 18.4746C8.93045 18.2086 9.2228 18 9.49767 18H11.5Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
