import React from 'react'
import { Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
}

export const CustomCoinbase = ({ size }: Props) => (
    <SvgIcon viewBox="0 0 28 28" width={size} height={size}>
        <Rect width="28" height="28" fill="#0052FF" />
        <Path
            id="Subtract"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.0001 5.59961C18.6393 5.59961 22.4001 9.36042 22.4001 13.9996C22.4001 18.6388 18.6393 22.3996 14.0001 22.3996C9.36091 22.3996 5.6001 18.6388 5.6001 13.9996C5.6001 9.36042 9.36091 5.59961 14.0001 5.59961ZM12.1334 11.1996H15.8668C16.3822 11.1996 16.8001 11.6175 16.8001 12.133V15.8663C16.8001 16.3818 16.3822 16.7996 15.8668 16.7996H12.1334C11.618 16.7996 11.2001 16.3818 11.2001 15.8663V12.133C11.2001 11.6175 11.618 11.1996 12.1334 11.1996Z"
            fill="white"
        />
    </SvgIcon>
)
