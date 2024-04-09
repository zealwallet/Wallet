import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgBj = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7099)">
            <Path
                d="M166.957 233.739L189.218 503.181C210.511 508.92 232.893 512 256 512C397.384 512 512 397.384 512 256L166.957 233.739Z"
                fill="#D80027"
            />
            <Path
                d="M166.957 256L189.217 8.819C210.511 3.08 232.893 0 256 0C397.384 0 512 114.616 512 256H166.957Z"
                fill="#FFDA44"
            />
            <Path
                d="M0 256C0 374.279 80.221 473.805 189.217 503.181V8.81885C80.221 38.1948 0 137.721 0 256Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7099">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgBj
