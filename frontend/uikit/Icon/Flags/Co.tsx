import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgCo = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7127)">
            <Path
                d="M0 256C0 114.616 114.616 0 256 0C397.384 0 512 114.616 512 256L256 278.261L0 256Z"
                fill="#FFDA44"
            />
            <Path
                d="M34.2559 384C78.5209 460.516 161.245 512 256 512C350.755 512 433.479 460.516 477.744 384L256 367.304L34.2559 384Z"
                fill="#D80027"
            />
            <Path
                d="M477.744 384C499.526 346.346 512 302.631 512 256H0C0 302.631 12.474 346.346 34.256 384H477.744Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7127">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgCo
