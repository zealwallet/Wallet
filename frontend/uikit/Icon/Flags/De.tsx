import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgDe = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7162)">
            <Path
                d="M15.9229 345.044C52.0939 442.528 145.929 512.001 256 512.001C366.071 512.001 459.906 442.528 496.077 345.044L256 322.784L15.9229 345.044Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 0.000976562C145.929 0.000976562 52.0939 69.473 15.9229 166.958L256 189.218L496.077 166.957C459.906 69.473 366.071 0.000976562 256 0.000976562Z"
                fill="black"
            />
            <Path
                d="M15.923 166.958C5.633 194.691 0 224.687 0 256.001C0 287.315 5.633 317.311 15.923 345.044H496.078C506.368 317.311 512 287.315 512 256.001C512 224.687 506.368 194.691 496.077 166.958H15.923Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7162">
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
export default SvgDe
