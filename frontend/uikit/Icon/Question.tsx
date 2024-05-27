import React from 'react'
import { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const Question = ({ size, color }: Props) => (
    <SvgIcon
        viewBox="0 0 72 72"
        width={size}
        height={size}
        fill="none"
        color={color && colors[color]}
    >
        <G clipPath="url(#clip0_1374_18899)">
            <Circle cx="36" cy="36" r="36" fill="#F8F8F8" />
            <Path
                d="M35.7022 52C34.321 52 33.2022 50.8453 33.2022 49.4197C33.2022 47.994 34.321 46.8393 35.7022 46.8393C37.0835 46.8393 38.2022 47.994 38.2022 49.4197C38.2022 50.8453 37.0835 52 35.7022 52Z"
                fill="#01C9C9"
            />
            <Path
                d="M38.2359 38.974C38.5804 38.4585 39.0674 38.0621 39.6334 37.8365C43.3209 36.3722 45.7021 33.0178 45.7021 29.2892C45.7021 26.754 44.6271 24.3866 42.6771 22.6255C40.8021 20.9354 38.3271 20 35.7021 20C33.0771 20 30.6021 20.9289 28.7271 22.6255C26.7771 24.3866 25.7021 26.754 25.7021 29.2892C25.7021 29.845 26.1374 30.2955 26.6743 30.2955H28.73C29.2669 30.2955 29.7021 29.845 29.7021 29.2892C29.7021 26.4444 32.3959 24.1285 35.7021 24.1285C39.0084 24.1285 41.7021 26.4444 41.7021 29.2892C41.7021 31.2954 40.3271 33.1339 38.2021 33.9789C36.8771 34.5014 35.7521 35.4175 34.9459 36.6173C34.1209 37.843 33.7021 39.3138 33.7021 40.8039C33.7021 41.8549 34.5252 42.7069 35.5405 42.7069H35.789C36.8456 42.7069 37.7021 41.8202 37.7021 40.7265C37.7054 40.1003 37.8914 39.4896 38.2359 38.974Z"
                fill="#01C9C9"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_1374_18899">
                <Rect width="72" height="72" fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
