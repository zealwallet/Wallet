import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgLv = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 513" fill="none">
        <G clipPath="url(#clip0_4_7200)">
            <Path
                d="M256 512.989C397.385 512.989 512 398.374 512 256.989C512 115.604 397.385 0.989258 256 0.989258C114.615 0.989258 0 115.604 0 256.989C0 398.374 114.615 512.989 256 512.989Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0.989258C137.721 0.989258 38.1953 81.2103 8.81934 190.206H503.182C473.805 81.2103 374.279 0.989258 256 0.989258Z"
                fill="#A2001D"
            />
            <Path
                d="M256 512.989C374.279 512.989 473.805 432.768 503.181 323.772H8.81934C38.1953 432.767 137.721 512.989 256 512.989Z"
                fill="#A2001D"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7200">
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
export default SvgLv
