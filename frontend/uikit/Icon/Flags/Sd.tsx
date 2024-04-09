import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgSd = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7297)">
            <Path
                d="M25.9801 144.696C9.70613 178.352 0.578125 216.109 0.578125 256C0.578125 295.891 9.70613 333.648 25.9801 367.304L256.578 389.565L487.176 367.304C503.45 333.648 512.578 295.891 512.578 256C512.578 216.109 503.45 178.352 487.176 144.696L256.578 122.435L25.9801 144.696Z"
                fill="#F0F0F0"
            />
            <Path
                d="M25.989 367.304C67.395 452.935 155.084 512 256.578 512C358.072 512 445.761 452.935 487.167 367.304H25.989Z"
                fill="black"
            />
            <Path
                d="M25.989 144.696H487.167C445.761 59.065 358.072 0 256.578 0C155.084 0 67.395 59.065 25.989 144.696Z"
                fill="#D80027"
            />
            <Path
                d="M75.5581 74.98C-24.4159 174.954 -24.4159 337.045 75.5581 437.02C116.871 395.707 156.604 355.974 256.578 256L75.5581 74.98Z"
                fill="#496E2D"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7297">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.578125)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgSd
