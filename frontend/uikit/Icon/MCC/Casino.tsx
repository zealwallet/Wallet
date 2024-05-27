import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Casino = ({ size, color }: Props) => {
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
                d="M12 20.7905C9.5 20.7905 8 18.7905 8 16.7905C8 14.7905 10 12.7905 10 12.7905L15.6426 7.14784C15.84 6.95048 16.1605 6.95097 16.3574 7.14784L22 12.7905C22 12.7905 24 14.7905 24 16.7905C24 18.7905 22.5 20.7905 20 20.7905C18.6081 20.7905 17.5262 20.0156 16.8406 19.3286C16.8573 20.4829 17.2414 22.2414 19 24H13C14.7586 22.2414 15.1427 20.4829 15.1594 19.3286C14.4738 20.0156 13.3919 20.7905 12 20.7905Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
