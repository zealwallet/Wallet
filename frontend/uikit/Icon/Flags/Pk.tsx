import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgPk = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7249)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M0 256C0 353.035 53.989 437.454 133.565 480.873V31.127C53.989 74.546 0 158.965 0 256Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C211.65 0 169.936 11.283 133.565 31.127V480.872C169.936 500.717 211.65 512 256 512C397.384 512 512 397.384 512 256C512 114.616 397.384 0 256 0Z"
                fill="#496E2D"
            />
            <Path
                d="M365.453 298.337C333.066 321.738 287.84 314.454 264.44 282.068C241.038 249.68 248.323 204.455 280.71 181.055C290.808 173.759 302.154 169.446 313.697 167.947C291.49 164.626 268.015 169.63 248.378 183.819C208.518 212.621 199.551 268.282 228.352 308.144C257.153 348.003 312.815 356.971 352.677 328.167C372.316 313.978 384.437 293.265 388.255 271.136C383.209 281.622 375.552 291.04 365.453 298.337Z"
                fill="#F0F0F0"
            />
            <Path
                d="M364.066 166.959L382.31 186.62L406.646 175.348L393.583 198.772L411.826 218.435L385.51 213.25L372.448 236.676L369.247 210.046L342.931 204.861L367.268 193.589L364.066 166.959Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7249">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgPk