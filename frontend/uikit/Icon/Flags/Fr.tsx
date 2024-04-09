import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgFr = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7156)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M512 256C512 145.929 442.528 52.094 345.043 15.923V496.078C442.528 459.906 512 366.071 512 256Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 366.071 69.473 459.906 166.957 496.077V15.923C69.473 52.094 0 145.929 0 256Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7156">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgFr
