import React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    size: number
    color?: Color
}

export const MusicalInstruments = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            fill="none"
            viewBox="0 0 32 32"
        >
            <G clipPath="url(#clip0_64_923)">
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M23.4997 6L26 8.5003L23.5 11.0006H22.4136L19.1364 14.2778C20.0196 15.3938 21.2769 17.5365 19.6117 19.2008C19.0295 19.7828 18.5439 20.0051 18.0985 20.209C17.7214 20.3816 17.3732 20.541 17.0197 20.8943C16.6272 21.2867 16.5967 21.6919 16.5609 22.1675C16.5101 22.8431 16.4486 23.6609 15.3237 24.786C12.1691 27.9393 8.03948 23.9526 8.03948 23.9526L8.04008 23.952C7.84738 23.7484 4.14097 19.7506 7.21438 16.6784C8.33958 15.5529 9.15751 15.4906 9.83337 15.4391C10.3089 15.4028 10.7141 15.3719 11.1065 14.9798C11.46 14.6265 11.619 14.2781 11.7912 13.9006C11.9945 13.455 12.2162 12.9689 12.7984 12.387C14.2668 10.9187 16.4915 12.0953 17.6722 12.9136L20.9997 9.58613L20.9994 8.5003L23.4997 6ZM13.686 15.3532C12.8755 16.1681 12.8779 17.4853 13.6913 18.2972C14.5046 19.1092 15.8219 19.1092 16.6353 18.2972C17.4487 17.4853 17.451 16.1681 16.6405 15.3532C16.2495 14.9601 15.7178 14.739 15.1633 14.739C14.6087 14.739 14.0771 14.9601 13.686 15.3532ZM8.85355 19.2071C8.65829 19.4024 8.65829 19.719 8.85355 19.9142L12.1464 23.2071C12.3417 23.4024 12.6583 23.4024 12.8536 23.2071L13.2071 22.8536C13.4024 22.6583 13.4024 22.3417 13.2071 22.1464L9.91421 18.8536C9.71895 18.6583 9.40237 18.6583 9.20711 18.8536L8.85355 19.2071Z"
                    fill="currentColor"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_64_923">
                    <Rect
                        width="20"
                        height="20"
                        fill="white"
                        transform="translate(6 6)"
                    />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}