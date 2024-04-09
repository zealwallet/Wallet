import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgLk = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7293)">
            <Path
                d="M0.001 44.522H0V467.477H0.001V256.001V44.522Z"
                fill="#FF9811"
            />
            <Path
                d="M255.999 511.998C397.383 511.998 511.998 397.383 511.998 255.999C511.998 114.615 397.383 0 255.999 0C114.615 0 0 114.615 0 255.999C0 397.383 114.615 511.998 255.999 511.998Z"
                fill="#FFDA44"
            />
            <Path
                d="M200.349 44.522H111.714C107.786 47.207 103.942 50.002 100.175 52.895L77.9141 255.999L100.175 459.103C103.942 461.997 107.786 464.792 111.714 467.476H200.349V44.522Z"
                fill="#FF9811"
            />
            <Path
                d="M0.000976562 256.001C0.000976562 338.746 39.269 412.308 100.175 459.105V52.896C39.269 99.694 0.000976562 173.256 0.000976562 256.001Z"
                fill="#6DA544"
            />
            <Path
                d="M411.826 156.064V162.469L412.064 162.505L411.826 156.064Z"
                fill="#FFDA44"
            />
            <Path
                d="M491.595 322.782H443.362L422.957 345.043V389.565H378.435V367.304H400.696V322.782H300.522V350.608H278.261V297.577C271.431 291.463 267.131 282.582 267.131 272.695V128C267.131 109.559 282.081 94.609 300.522 94.609V300.522H345.044L360.32 287.791C357.652 281.436 356.174 274.457 356.174 267.131V233.74H322.783V166.958H389.565C389.565 155.828 406.261 144.697 406.261 144.697C406.261 144.697 422.957 155.827 422.957 166.958V183.654V233.741C435.34 233.888 455.014 233.567 476.269 233.741C470.685 223.981 467.478 212.4 467.478 200.35C467.478 180.709 475.958 163.051 489.456 150.831C470 107.716 438.954 70.954 400.287 44.522H233.74V467.478H400.288C447.307 435.337 483.056 387.926 500.4 332.388L491.595 322.782Z"
                fill="#A2001D"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7293">
                <Rect width={511.999} height={511.999} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgLk
