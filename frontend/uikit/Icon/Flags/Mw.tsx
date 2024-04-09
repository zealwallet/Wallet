import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMw = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7211)">
            <Path
                d="M0 256C0 287.314 5.633 317.31 15.923 345.043L256 356.174L496.077 345.044C506.368 317.31 512 287.314 512 256C512 224.686 506.368 194.69 496.077 166.957L256 155.826L15.923 166.956C5.633 194.69 0 224.686 0 256H0Z"
                fill="#D80027"
            />
            <Path
                d="M256 0C145.929 0 52.094 69.472 15.923 166.957H496.078C459.906 69.472 366.071 0 256 0Z"
                fill="black"
            />
            <Path
                d="M496.077 345.043H15.923C52.094 442.527 145.929 512 256 512C366.071 512 459.906 442.527 496.077 345.043Z"
                fill="#496E2D"
            />
            <Path
                d="M332.515 122.435L301.251 107.729L317.9 77.45L283.95 83.945L279.648 49.647L256 74.872L232.353 49.647L228.05 83.945L194.101 77.45L210.75 107.729L179.485 122.435H332.515Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7211">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMw
