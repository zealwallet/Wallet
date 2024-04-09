import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMm = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7230)">
            <Path
                d="M496.077 345.043C506.368 317.311 512 287.314 512 256C512 224.686 506.368 194.689 496.077 166.957L256 144.696L15.923 166.957C5.633 194.689 0 224.686 0 256C0 287.314 5.633 317.311 15.923 345.043L256 367.304L496.077 345.043Z"
                fill="#6DA544"
            />
            <Path
                d="M496.077 166.957C459.906 69.472 366.071 0 256 0C145.929 0 52.094 69.472 15.923 166.957H496.077Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 512C366.071 512 459.906 442.528 496.077 345.043H15.923C52.094 442.528 145.929 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M431.549 216.586H297.442L256 89.043L214.558 216.586H80.451L188.946 295.412L147.504 422.957L256 345.043L364.496 422.956L323.055 295.411L431.549 216.586Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7230">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMm