import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgSe = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7300)">
            <Path
                d="M256.578 511.999C397.963 511.999 512.578 397.384 512.578 255.999C512.578 114.614 397.963 -0.000976562 256.578 -0.000976562C115.193 -0.000976562 0.578125 114.614 0.578125 255.999C0.578125 397.384 115.193 511.999 256.578 511.999Z"
                fill="#FFDA44"
            />
            <Path
                d="M200.927 222.608H510.411C494.048 97.001 386.645 -0.000976562 256.578 -0.000976562C237.464 -0.000976562 218.845 2.11202 200.926 6.08402V222.608H200.927Z"
                fill="#0052B4"
            />
            <Path
                d="M134.143 222.607V31.126C63.8491 69.48 13.5281 139.831 2.74512 222.608H134.143V222.607Z"
                fill="#0052B4"
            />
            <Path
                d="M134.142 289.39H2.74512C13.5281 372.167 63.8491 442.518 134.143 480.871L134.142 289.39Z"
                fill="#0052B4"
            />
            <Path
                d="M200.926 289.391V505.914C218.845 509.886 237.464 511.999 256.578 511.999C386.645 511.999 494.048 414.997 510.411 289.39H200.926V289.391Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7300">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.578125 -0.000976562)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgSe