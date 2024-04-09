import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgAr = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7083)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C154.506 0 66.8103 59.065 25.4023 144.696H486.597C445.19 59.065 357.493 0 256 0Z"
                fill="#338AF3"
            />
            <Path
                d="M256 512C357.493 512 445.19 452.935 486.598 367.304H25.4023C66.8103 452.935 154.506 512 256 512Z"
                fill="#338AF3"
            />
            <Path
                d="M332.515 256L301.25 270.707L317.899 300.986L283.949 294.491L279.647 328.787L256 303.563L232.352 328.787L228.051 294.491L194.101 300.985L210.749 270.706L179.485 256L210.75 241.293L194.101 211.015L228.05 217.509L232.353 183.213L256 208.437L279.648 183.213L283.949 217.509L317.9 211.015L301.251 241.294L332.515 256Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7083">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgAr
