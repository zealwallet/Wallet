import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgPw = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7250)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#338AF3"
            />
            <Path
                d="M200.348 367.304C261.82 367.304 311.652 317.472 311.652 256C311.652 194.529 261.82 144.696 200.348 144.696C138.877 144.696 89.044 194.529 89.044 256C89.044 317.472 138.877 367.304 200.348 367.304Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7250">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgPw
