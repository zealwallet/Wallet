import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgIm = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7185)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M350.787 171.612L332.693 236.183L278.403 226.158L243.457 154.123L149.05 187.624L141.605 166.644L116.905 163.601L135.516 216.05L200.485 199.435L218.948 251.464L174.036 317.746L250.253 382.752L235.807 399.689L245.521 422.603L281.639 380.259L234.765 332.302L270.592 290.299L350.45 296.053L368.639 197.543L390.53 201.586L405.519 181.716L350.787 171.612Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7185">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgIm