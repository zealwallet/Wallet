import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgNl = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7235)">
            <Path
                d="M256.988 512C398.373 512 512.988 397.385 512.988 256C512.988 114.615 398.373 0 256.988 0C115.603 0 0.988281 114.615 0.988281 256C0.988281 397.385 115.603 512 256.988 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256.988 0C146.917 0 53.0821 69.472 16.9111 166.957H497.066C460.894 69.472 367.059 0 256.988 0Z"
                fill="#A2001D"
            />
            <Path
                d="M256.988 512C367.059 512 460.894 442.528 497.065 345.043H16.9111C53.0821 442.528 146.917 512 256.988 512Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7235">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.988281)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgNl
