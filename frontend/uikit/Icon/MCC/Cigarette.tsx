import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Cigarette = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            viewBox="0 0 32 32"
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M10.7071 13.7071C9.79573 14.6185 9.87204 15.4578 10.7071 16.2929C11.0976 16.6834 11.0976 17.3166 10.7071 17.7071C10.3166 18.0976 9.68343 18.0976 9.29291 17.7071C7.72799 16.1422 7.53763 14.0482 9.29291 12.2929C10.377 11.2088 10.377 10.4531 9.44531 9.83203C8.98579 9.52568 8.86161 8.90481 9.16796 8.44528C9.47432 7.98576 10.0952 7.86158 10.5547 8.16793C12.623 9.54682 12.623 11.7912 10.7071 13.7071ZM11.6575 23.6321C11.8353 23.8368 12.1438 23.8625 12.353 23.6901L19.9504 17.4279L18.0196 15.1753L10.427 21.4335C10.21 21.6123 10.1832 21.9349 10.3676 22.1472L11.6575 23.6321ZM24.6352 13.5665L21.1081 16.4737L19.1773 14.2211L22.7092 11.3099C22.9184 11.1374 23.2269 11.1631 23.4047 11.3678L24.6946 12.8528C24.879 13.0651 24.8522 13.3876 24.6352 13.5665Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
