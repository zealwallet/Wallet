import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgJm = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7190)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#FFDA44"
            />
            <Path
                d="M411.856 52.92C368.689 19.739 314.654 0 256 0C197.346 0 143.31 19.74 100.143 52.92L256 208.776L411.856 52.92Z"
                fill="#6DA544"
            />
            <Path
                d="M52.919 100.144C19.74 143.311 0 197.346 0 256C0 314.654 19.74 368.69 52.92 411.858L208.777 256L52.919 100.144Z"
                fill="black"
            />
            <Path
                d="M100.143 459.08C143.311 492.261 197.346 512 256 512C314.654 512 368.689 492.26 411.857 459.08L256 303.224L100.143 459.08Z"
                fill="#6DA544"
            />
            <Path
                d="M459.08 411.856C492.261 368.689 512 314.654 512 256C512 197.346 492.261 143.311 459.08 100.144L303.224 256L459.08 411.856Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7190">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgJm
