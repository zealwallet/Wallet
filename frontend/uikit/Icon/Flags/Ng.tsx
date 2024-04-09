import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgNg = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7239)">
            <Path
                d="M256.988 512C398.373 512 512.988 397.385 512.988 256C512.988 114.615 398.373 0 256.988 0C115.603 0 0.988281 114.615 0.988281 256C0.988281 397.385 115.603 512 256.988 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M0.988281 256C0.988281 366.072 70.4603 459.906 167.945 496.078V15.9241C70.4603 52.0941 0.988281 145.93 0.988281 256Z"
                fill="#6DA544"
            />
            <Path
                d="M512.988 256C512.988 145.93 443.516 52.0941 346.031 15.9241V496.079C443.516 459.906 512.988 366.072 512.988 256Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7239">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.988281)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgNg
