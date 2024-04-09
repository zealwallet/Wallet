import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgLs = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7202)">
            <Path
                d="M0 256.001C0 295.891 9.127 333.649 25.402 367.305L256 378.436L486.598 367.306C502.873 333.649 512 295.891 512 256.001C512 216.111 502.873 178.353 486.598 144.697L256 133.566L25.402 144.696C9.127 178.353 0 216.111 0 256.001H0Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 512.001C357.493 512.001 445.19 452.936 486.598 367.305H25.4019C66.8099 452.936 154.506 512.001 256 512.001Z"
                fill="#6DA544"
            />
            <Path
                d="M256 0.000976562C154.506 0.000976562 66.8099 59.066 25.4019 144.697H486.597C445.19 59.066 357.493 0.000976562 256 0.000976562Z"
                fill="#0052B4"
            />
            <Path
                d="M272.696 250.436V189.219H239.305V250.436L198.975 290.767C210.704 309.967 231.855 322.784 256.001 322.784C280.147 322.784 301.297 309.967 313.027 290.767L272.696 250.436Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7202">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgLs