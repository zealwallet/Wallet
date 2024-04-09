import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgAt = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7087)">
            <Path
                d="M496.077 345.043C506.368 317.311 512 287.314 512 256C512 224.686 506.368 194.691 496.077 166.957L256 144.696L15.923 166.957C5.633 194.691 0 224.686 0 256C0 287.314 5.633 317.311 15.923 345.043L256 367.304L496.077 345.043Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 512C366.07 512 459.906 442.528 496.076 345.043H15.9219C52.0939 442.528 145.928 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M256 0C145.928 0 52.0939 69.472 15.9219 166.957H496.077C459.906 69.472 366.07 0 256 0Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7087">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgAt
