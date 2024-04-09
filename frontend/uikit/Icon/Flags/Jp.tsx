import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgJp = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 513" fill="none">
        <G clipPath="url(#clip0_4_7189)">
            <Path
                d="M256 512.989C397.385 512.989 512 398.374 512 256.989C512 115.604 397.385 0.989258 256 0.989258C114.615 0.989258 0 115.604 0 256.989C0 398.374 114.615 512.989 256 512.989Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 368.293C317.472 368.293 367.304 318.461 367.304 256.989C367.304 195.518 317.472 145.685 256 145.685C194.529 145.685 144.696 195.518 144.696 256.989C144.696 318.461 194.529 368.293 256 368.293Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7189">
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
export default SvgJp
