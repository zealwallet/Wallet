import React from 'react'
import { Circle, Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
}

export const LidoLogo = ({ size }: Props) => {
    return (
        <SvgIcon viewBox="0 0 32 32" width={size} height={size} fill="none">
            <Circle cx="16" cy="16" r="16" fill="#EDF0F4" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.1245 18.5042L10.013 15.0127C9.0833 16.2159 8.53345 17.7052 8.53345 19.3176C8.53345 23.3156 11.9138 26.5565 16.0837 26.5565C16.0973 26.5565 16.1109 26.5565 16.1245 26.5564V18.5042Z"
                fill="#47A2F8"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M16.1245 18.5042L22.236 15.0127C23.1657 16.2159 23.7156 17.7052 23.7156 19.3176C23.7156 23.3156 20.3352 26.5565 16.1653 26.5565C16.1517 26.5565 16.1381 26.5565 16.1245 26.5565V18.5042Z"
                fill="#7EC6F9"
            />
            <Path
                d="M16.1245 5.59961L10.8394 13.7008L16.1245 10.7011V5.59961Z"
                fill="#47A2F8"
            />
            <Path
                d="M16.1245 5.59961L21.4097 13.7008L16.1245 10.7011V5.59961Z"
                fill="#7EC6F9"
            />
            <Path
                d="M16.1245 16.7618L10.8394 13.7009L16.1245 10.7012V16.7618Z"
                fill="#7EC6F9"
            />
            <Path
                d="M16.1245 16.7618L21.4097 13.7009L16.1245 10.7012V16.7618Z"
                fill="#D2ECFD"
            />
            <Path
                d="M16.1245 18.5167L22.2463 15.0068L16.1245 26.5566V18.5167Z"
                fill="#D2ECFD"
            />
            <Path
                d="M16.1245 18.5167L10.0027 15.0068L16.1245 26.5566V18.5167Z"
                fill="#7EC6F9"
            />
        </SvgIcon>
    )
}
