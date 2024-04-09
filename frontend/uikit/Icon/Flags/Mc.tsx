import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMc = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7224)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M0 256C0 114.616 114.616 0 256 0C397.384 0 512 114.616 512 256"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7224">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMc