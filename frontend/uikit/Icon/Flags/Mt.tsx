import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMt = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7215)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C397.384 0 512 114.616 512 256C512 397.384 397.384 512 256 512"
                fill="#D80027"
            />
            <Path
                d="M178.087 100.174V66.7832H144.696V100.174H111.304V133.565H144.696V166.957H178.087V133.565H211.478V100.174H178.087Z"
                fill="#ACABB1"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7215">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMt
