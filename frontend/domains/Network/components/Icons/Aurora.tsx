import React from 'react'
import Svg, { Circle, ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

type Props = {
    size: number
}

export const Aurora = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle cx="60" cy="60" r="60" fill="#050505" />
            <G clipPath="url(#clip0_936_5594)">
                <Path
                    d="M59.9997 27.1944C61.4035 27.19 62.7805 27.5786 63.9748 28.3164C65.1691 29.0541 66.133 30.1116 66.7572 31.3689L88.0072 73.8689C88.5837 75.0209 88.856 76.3011 88.7984 77.588C88.7408 78.8748 88.3551 80.1256 87.678 81.2215C87.0009 82.3173 86.0549 83.2218 84.9298 83.8491C83.8047 84.4764 82.5379 84.8057 81.2497 84.8056H38.7497C37.4616 84.8057 36.1948 84.4764 35.0697 83.8491C33.9446 83.2218 32.9986 82.3173 32.3215 81.2215C31.6444 80.1256 31.2587 78.8748 31.2011 77.588C31.1434 76.3011 31.4158 75.0209 31.9923 73.8689L53.2422 31.3689C53.8665 30.1116 54.8304 29.0541 56.0247 28.3164C57.219 27.5786 58.596 27.19 59.9997 27.1944ZM59.9997 22C57.6321 21.9997 55.3112 22.6587 53.297 23.9031C51.2828 25.1475 49.6549 26.9281 48.5956 29.0456L27.3456 71.5456C26.3731 73.4895 25.9137 75.6499 26.0111 77.8214C26.1085 79.9929 26.7595 82.1034 27.9022 83.9525C29.0448 85.8016 30.6413 87.3279 32.5398 88.3863C34.4384 89.4448 36.5761 90.0002 38.7497 90H81.2497C83.4234 90.0002 85.5611 89.4448 87.4596 88.3863C89.3582 87.3279 90.9547 85.8016 92.0973 83.9525C93.24 82.1034 93.891 79.9929 93.9884 77.8214C94.0858 75.6499 93.6264 73.4895 92.6539 71.5456L71.4039 29.0456C70.3446 26.9281 68.7167 25.1475 66.7025 23.9031C64.6883 22.6587 62.3674 21.9997 59.9997 22Z"
                    fill="#70D44B"
                />
            </G>
            <Defs>
                <ClipPath id="clip0_936_5594">
                    <Rect
                        width="68"
                        height="68"
                        fill="white"
                        transform="translate(26 22)"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
