import React from 'react'
import { Path } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const Car = ({ size, color }: Props) => {
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
                d="M21 22.9906V22H11V22.9906C11 23.5481 10.5573 24 10.001 24H8.99896C8.44725 24 8 23.5566 8 22.9906V15.8824C8 15.6323 8.04258 15.3304 8.1139 15H7.99896C7.44725 15 7 14.5561 7 14C7 13.4477 7.44266 13 7.99896 13H8.72574C9.15448 11.8345 9.61415 10.8358 9.61415 10.8358C10.0482 9.82192 11.2976 9 12.4023 9H19.5977C20.7035 9 21.9593 9.82209 22.3858 10.8354C22.3858 10.8354 22.8457 11.8343 23.2745 13H24.001C24.5528 13 25 13.4439 25 14C25 14.5523 24.5573 15 24.001 15H23.8862C23.9575 15.3303 24 15.6322 24 15.8824V22.9906C24 23.5481 23.5573 24 23.001 24H21.999C21.4472 24 21 23.5566 21 22.9906ZM22 15C21.9453 14.8016 20.8517 11.9268 20.8517 11.9268C20.6574 11.4149 20.0537 11 19.5025 11H12.4975C11.9466 11 11.3393 11.4231 11.1483 11.9268C11.1483 11.9268 10.0547 14.8015 10 15H22ZM18.5 17.5047C18.5 17.226 18.7296 17 19.0015 17H21.4985C21.7755 17 22 17.214 22 17.5047V18.4953C22 18.774 21.7704 19 21.4985 19H19.0015C18.7245 19 18.5 18.786 18.5 18.4953V17.5047ZM10.5015 17C10.2296 17 10 17.226 10 17.5047V18.4953C10 18.786 10.2245 19 10.5015 19H12.9985C13.2704 19 13.5 18.774 13.5 18.4953V17.5047C13.5 17.214 13.2755 17 12.9985 17H10.5015Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}
