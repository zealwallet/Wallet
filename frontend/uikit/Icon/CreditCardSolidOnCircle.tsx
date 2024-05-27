import React from 'react'
import { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const CreditCardSolidOnCircle = ({ size, color }: Props) => {
    return (
        <SvgIcon
            viewBox="0 0 24 24"
            fill="none"
            width={size}
            height={size}
            color={color && colors[color]}
        >
            <G clipPath="url(#clip0_1390_27841)">
                <Circle cx="12" cy="12" r="12" fill="currentColor" />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M17.3887 6.49973L12.0007 6.375L6.61258 6.49973C5.52377 6.52186 4.6007 7.30675 4.40384 8.37785C3.96369 10.7727 3.96369 13.2276 4.40384 15.6225C4.6007 16.6936 5.52376 17.4785 6.61258 17.5006L12.0007 17.6253L17.3887 17.5006C18.4775 17.4785 19.4006 16.6936 19.5975 15.6225C20.0376 13.2276 20.0376 10.7727 19.5975 8.37785C19.4006 7.30675 18.4775 6.52186 17.3887 6.49973ZM18.7506 11.2501C18.7506 11.6644 18.4149 12.0001 18.0006 12.0001H6.00064C5.58643 12.0001 5.25064 11.6644 5.25064 11.2501C5.25064 10.8359 5.58643 10.5001 6.00064 10.5001H18.0006C18.4149 10.5001 18.7506 10.8359 18.7506 11.2501Z"
                    fill="white"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_1390_27841">
                    <Rect width="24" height="24" fill="currentColor" />
                </ClipPath>
            </Defs>
        </SvgIcon>
    )
}
