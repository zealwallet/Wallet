import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgDk = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7138)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M200.349 222.609H509.833C493.47 97.002 386.067 0 256 0C236.885 0 218.268 2.113 200.348 6.085V222.609H200.349Z"
                fill="#D80027"
            />
            <Path
                d="M133.565 222.608V31.127C63.272 69.481 12.95 139.832 2.16699 222.609H133.565V222.608Z"
                fill="#D80027"
            />
            <Path
                d="M133.564 289.391H2.16699C12.95 372.168 63.272 442.519 133.565 480.872L133.564 289.391Z"
                fill="#D80027"
            />
            <Path
                d="M200.348 289.392V505.915C218.268 509.887 236.885 512 256 512C386.067 512 493.47 414.998 509.833 289.391H200.348V289.392Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7138">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgDk
