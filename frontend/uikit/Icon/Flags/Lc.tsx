import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgLc = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7295)">
            <Path
                d="M256.578 512C397.963 512 512.578 397.385 512.578 256C512.578 114.615 397.963 0 256.578 0C115.193 0 0.578125 114.615 0.578125 256C0.578125 397.385 115.193 512 256.578 512Z"
                fill="#338AF3"
            />
            <Path
                d="M161.969 345.043H351.187L256.578 122.435L161.969 345.043Z"
                fill="#F3F3F3"
            />
            <Path
                d="M194.849 322.783L256.578 182.374L318.307 322.783H194.849Z"
                fill="#333333"
            />
            <Path
                d="M161.969 345.043H351.187L256.578 256L161.969 345.043Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7295">
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
export default SvgLc
