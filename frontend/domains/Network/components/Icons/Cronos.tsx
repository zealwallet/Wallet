import React from 'react'
import Svg, {
    Circle,
    ClipPath,
    Defs,
    G,
    LinearGradient,
    Path,
    Rect,
    Stop,
} from 'react-native-svg'

type Props = {
    size: number
}

export const Cronos = ({ size }: Props) => {
    return (
        <Svg
            style={{ flexShrink: 0 }}
            viewBox="0 0 120 120"
            width={size}
            height={size}
            fill="none"
        >
            <Circle
                cx="60"
                cy="60"
                r="60"
                fill="url(#paint0_linear_936_5582)"
            />
            <G clipPath="url(#clip0_936_5582)">
                <Path
                    d="M59.7785 18L24 38.6585V79.9615L59.7785 100.606L95.5293 79.9615V38.6585L59.7785 18ZM84.9369 73.8415L59.7785 88.3661L34.6062 73.8415V44.7646L59.7785 30.24L84.9369 44.7646V73.8415Z"
                    fill="white"
                />
                <Path
                    d="M59.7786 100.606L95.5293 79.9615V38.6585L59.7786 18V30.2538L84.937 44.7785V73.8554L59.7786 88.3661V100.606Z"
                    fill="white"
                />
                <Path
                    d="M59.7508 18L24 38.6446V79.9477L59.7508 100.606V88.3523L34.5923 73.8277V44.7508L59.7508 30.24V18Z"
                    fill="white"
                />
                <Path
                    d="M76.463 68.9553L59.7646 78.5922L43.0522 68.9553V49.6676L59.7646 40.0168L76.463 49.6676L69.5122 53.683L59.7646 48.0476L50.0169 53.683V64.9261L59.7646 70.5615L69.5122 64.9261L76.463 68.9553Z"
                    fill="white"
                />
            </G>
            <Defs>
                <LinearGradient
                    id="paint0_linear_936_5582"
                    x1="60"
                    y1="0"
                    x2="60"
                    y2="120"
                    gradientUnits="userSpaceOnUse"
                >
                    <Stop stopColor="#002D74" />
                    <Stop offset="1" stopColor="#000A39" />
                </LinearGradient>
                <ClipPath id="clip0_936_5582">
                    <Rect
                        width="72"
                        height="83.0769"
                        fill="white"
                        transform="translate(24 18)"
                    />
                </ClipPath>
            </Defs>
        </Svg>
    )
}
