import React from 'react'
import Svg, { Path } from 'react-native-svg'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color: Color
}

export const BoldSave = ({ size, color }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 24 24"
        fill="none"
        width={size}
        height={size}
        color={color && colors[color]}
    >
        <Path
            d="M7.25067 7.59998C7.25067 8.56647 8.03417 9.34998 9.00067 9.34998H15.0007C15.9672 9.34998 16.7507 8.56647 16.7507 7.59998V4.27627C16.7507 4.12369 16.8744 4 17.0269 4C17.1729 4 17.3115 4.06373 17.4065 4.17448L20.3691 7.62867C20.7797 8.1074 20.9942 8.72364 20.9696 9.35387L20.628 18.0976C20.5755 19.4393 19.4726 20.5 18.1299 20.5H17.7507C17.4745 20.5 17.2507 20.2761 17.2507 20V15C17.2507 14.0335 16.4672 13.25 15.5007 13.25H8.50067C7.53417 13.25 6.75067 14.0335 6.75067 15V20C6.75067 20.2761 6.52681 20.5 6.25067 20.5H6.11358C4.90975 20.5 3.89343 19.6055 3.74056 18.4114C3.24665 14.5534 3.22537 10.6495 3.6772 6.78632L3.73809 6.26575C3.88918 4.97395 4.98368 4 6.28428 4H6.75067C7.02681 4 7.25067 4.22386 7.25067 4.5V7.59998Z"
            fill="currentColor"
        />
        <Path
            d="M8.25067 20C8.25067 20.2761 8.47453 20.5 8.75067 20.5H15.2507C15.5268 20.5 15.7507 20.2761 15.7507 20V15C15.7507 14.8619 15.6387 14.75 15.5007 14.75H8.50067C8.3626 14.75 8.25067 14.8619 8.25067 15V20Z"
            fill="currentColor"
        />
        <Path
            d="M15.2507 4.5C15.2507 4.22386 15.0268 4 14.7507 4H9.25067C8.97453 4 8.75067 4.22386 8.75067 4.5V7.59998C8.75067 7.73805 8.8626 7.84998 9.00067 7.84998H15.0007C15.1387 7.84998 15.2507 7.73805 15.2507 7.59998V4.5Z"
            fill="currentColor"
        />
    </Svg>
)