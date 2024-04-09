import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgHk = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7177)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M282.429 193.668C276.611 217.867 266.274 213.252 261.201 234.356C231.318 227.171 212.915 197.121 220.1 167.236C227.282 137.353 257.334 118.949 287.218 126.134C277.071 168.341 287.634 172.025 282.429 193.668Z"
                fill="#F0F0F0"
            />
            <Path
                d="M204.887 211.6C226.104 224.61 218.52 233.017 237.022 244.364C220.954 270.565 186.689 278.78 160.487 262.713C134.286 246.646 126.069 212.379 142.137 186.178C179.143 208.87 185.908 199.963 204.887 211.6Z"
                fill="#F0F0F0"
            />
            <Path
                d="M197.978 290.892C216.909 274.734 222.558 284.544 239.067 270.454C259.022 293.831 256.246 328.959 232.87 348.914C209.492 368.869 174.364 366.09 154.412 342.715C187.426 314.532 181.045 305.343 197.978 290.892Z"
                fill="#F0F0F0"
            />
            <Path
                d="M271.254 321.965C261.734 298.968 272.81 296.624 264.511 276.571C292.91 264.818 325.462 278.312 337.216 306.711C348.969 335.11 335.473 367.661 307.074 379.415C290.477 339.306 279.768 342.535 271.254 321.965Z"
                fill="#F0F0F0"
            />
            <Path
                d="M323.45 261.876C298.637 263.823 299.828 252.563 278.193 254.261C275.79 223.622 298.684 196.831 329.325 194.426C359.965 192.027 386.755 214.919 389.157 245.561C345.88 248.954 345.641 260.137 323.45 261.876Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7177">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgHk
