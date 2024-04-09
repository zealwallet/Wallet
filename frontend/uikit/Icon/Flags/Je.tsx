import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgJe = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7191)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M459.098 411.875L303.223 256.001H303.222L459.098 100.124C452.375 91.3881 445.021 82.9831 437.02 74.9801C429.017 66.9781 420.613 59.6231 411.876 52.9021L256.001 208.777L256 208.778L100.125 52.9021C91.3903 59.6241 82.9843 66.9771 74.9813 74.9801C66.9783 82.9831 59.6243 91.3881 52.9033 100.124L208.778 255.998L208.779 255.999L52.9023 411.876C59.6253 420.612 66.9793 429.017 74.9803 437.02C82.9833 445.022 91.3873 452.377 100.124 459.098L256 303.223L256.001 303.222L411.876 459.097C420.611 452.375 429.017 445.021 437.02 437.019C445.023 429.016 452.376 420.611 459.098 411.875Z"
                fill="#D80027"
            />
            <Path
                d="M211.478 77.913L256 89.043L300.522 77.913V40.07L282.713 48.974L256 22.261L229.287 48.974L211.478 40.07V77.913Z"
                fill="#FFDA44"
            />
            <Path
                d="M211.478 77.9131V105.741C211.478 139.821 256 150.263 256 150.263C256 150.263 300.522 139.82 300.522 105.741V77.9131H211.478Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7191">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgJe
