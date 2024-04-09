import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgDj = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7139)">
            <Path
                d="M233.739 278.261C233.739 278.261 75.1305 74.945 74.9805 74.981C121.306 28.654 185.307 0 256 0C397.384 0 512 114.616 512 256L233.739 278.261Z"
                fill="#338AF3"
            />
            <Path
                d="M233.739 256C233.739 256 75.1305 437.055 74.9805 437.019C121.306 483.346 185.307 512 256 512C397.384 512 512 397.384 512 256H233.739Z"
                fill="#6DA544"
            />
            <Path
                d="M74.9795 74.98C-24.9945 174.954 -24.9945 337.045 74.9795 437.02C116.293 395.707 156.026 355.974 256 256L74.9795 74.98Z"
                fill="#F0F0F0"
            />
            <Path
                d="M103.61 189.217L120.185 240.233H173.831L130.433 271.765L147.007 322.783L103.61 291.252L60.2106 322.783L76.7886 271.765L33.3906 240.233H87.0326L103.61 189.217Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7139">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgDj
