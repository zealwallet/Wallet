import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgAe = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7320)">
            <Path
                d="M256 511.999C397.385 511.999 512 397.384 512 255.999C512 114.614 397.385 -0.000976562 256 -0.000976562C114.615 -0.000976562 0 114.614 0 255.999C0 397.384 114.615 511.999 256 511.999Z"
                fill="#F0F0F0"
            />
            <Path
                d="M144.696 345.042L166.957 496.078C194.689 506.369 224.686 511.999 256 511.999C366.07 511.999 459.906 442.527 496.076 345.042H144.696Z"
                fill="black"
            />
            <Path
                d="M144.696 166.956L166.957 15.92C194.689 5.62902 224.686 -0.000976562 256 -0.000976562C366.07 -0.000976562 459.906 69.471 496.076 166.956H144.696Z"
                fill="#6DA544"
            />
            <Path
                d="M0 255.999C0 366.07 69.473 459.905 166.957 496.076V15.9221C69.473 52.0931 0 145.928 0 255.999Z"
                fill="#A2001D"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7320">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 -0.000976562)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgAe
