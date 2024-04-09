import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgGh = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7163)">
            <Path
                d="M0 256C0 287.314 5.633 317.31 15.923 345.043L256 356.174L496.077 345.044C506.368 317.31 512 287.314 512 256C512 224.686 506.368 194.69 496.077 166.957L256 155.826L15.923 166.956C5.633 194.69 0 224.686 0 256H0Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 0C145.929 0 52.0939 69.472 15.9229 166.957H496.078C459.906 69.472 366.071 0 256 0Z"
                fill="#D80027"
            />
            <Path
                d="M496.077 345.043H15.9229C52.0939 442.527 145.929 512 256 512C366.071 512 459.906 442.527 496.077 345.043Z"
                fill="#496E2D"
            />
            <Path
                d="M255.998 166.957L278.098 234.977H349.626L291.763 277.02L313.863 345.043L255.998 303.003L198.133 345.043L220.237 277.02L162.374 234.977H233.898L255.998 166.957Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7163">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgGh
