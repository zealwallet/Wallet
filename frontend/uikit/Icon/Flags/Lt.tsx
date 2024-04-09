import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgLt = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7206)">
            <Path
                d="M496.077 345.043C506.368 317.311 512 287.314 512 256C512 224.686 506.368 194.689 496.077 166.957L256 144.696L15.923 166.957C5.632 194.689 0 224.686 0 256C0 287.314 5.632 317.311 15.923 345.043L256 367.304L496.077 345.043Z"
                fill="#6DA544"
            />
            <Path
                d="M496.077 166.957C459.906 69.472 366.071 0 256 0C145.929 0 52.0941 69.472 15.9231 166.957H496.077Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 512C366.071 512 459.906 442.528 496.077 345.043H15.9231C52.0941 442.528 145.929 512 256 512Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7206">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgLt