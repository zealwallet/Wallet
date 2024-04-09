import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMr = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7218)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#496E2D"
            />
            <Path
                d="M256 295.751C213.374 295.751 177.764 265.793 169.027 225.788C167.685 231.938 166.957 238.315 166.957 244.869C166.957 294.048 206.822 333.912 256 333.912C305.178 333.912 345.043 294.047 345.043 244.869C345.043 238.315 344.315 231.938 342.973 225.787C334.236 265.794 298.626 295.751 256 295.751Z"
                fill="#FFDA44"
            />
            <Path
                d="M255.999 178.087L264.287 203.596H291.11L269.411 219.361L277.699 244.87L255.999 229.104L234.3 244.87L242.589 219.361L220.89 203.596H247.711L255.999 178.087Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7218">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMr