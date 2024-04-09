import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgGm = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 513" fill="none">
        <G clipPath="url(#clip0_4_7160)">
            <Path
                d="M256 512.989C397.385 512.989 512 398.374 512 256.989C512 115.604 397.385 0.989258 256 0.989258C114.615 0.989258 0 115.604 0 256.989C0 398.374 114.615 512.989 256 512.989Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0.989258C150.165 0.989258 59.3367 65.2153 20.3477 156.815H491.653C452.664 65.2153 361.835 0.989258 256 0.989258Z"
                fill="#A2001D"
            />
            <Path
                d="M256 512.989C361.835 512.989 452.664 448.763 491.652 357.163H20.3477C59.3367 448.763 150.165 512.989 256 512.989Z"
                fill="#496E2D"
            />
            <Path
                d="M503.181 190.206H8.819C3.08 211.499 0 233.882 0 256.989C0 280.096 3.08 302.479 8.819 323.772H503.182C508.92 302.479 512 280.096 512 256.989C512 233.882 508.92 211.499 503.181 190.206Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7160">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 0.989258)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgGm
