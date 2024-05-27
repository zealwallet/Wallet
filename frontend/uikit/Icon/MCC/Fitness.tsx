import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Fitness = ({ size, color }: Props) => {
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
                d="M11 13.7502V10.5003C11 10.224 11.2158 10 11.4954 10H13.5046C13.7782 10 14 10.229 14 10.5003V15H18V10.5003C18 10.224 18.2158 10 18.4954 10H20.5046C20.7782 10 21 10.229 21 10.5003V13.7502V12.5004C21 12.2241 21.2307 12 21.5059 12H22.9941C23.2735 12 23.5 12.2308 23.5 12.5004V15H24.4998C24.776 15 25 15.214 25 15.5047V16.4953C25 16.774 24.7724 17 24.4998 17H23.5V19.4996C23.5 19.7759 23.2693 20 22.9941 20H21.5059C21.2265 20 21 19.7692 21 19.4996V18.2498V21.4997C21 21.776 20.7842 22 20.5046 22H18.4954C18.2218 22 18 21.771 18 21.4997V17H14V21.4997C14 21.776 13.7842 22 13.5046 22H11.4954C11.2218 22 11 21.771 11 21.4997V18.2498V19.4996C11 19.7759 10.7693 20 10.4941 20H9.00591C8.7265 20 8.5 19.7692 8.5 19.4996V17H7.50021C7.22395 17 7 16.786 7 16.4953V15.5047C7 15.226 7.22759 15 7.50021 15H8.5V12.5004C8.5 12.2241 8.73071 12 9.00591 12H10.4941C10.7735 12 11 12.2308 11 12.5004V13.7502Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
