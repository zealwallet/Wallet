import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgTw = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7303)">
            <Path
                d="M512 255.999C512 397.383 397.384 511.999 256 511.999C114.616 511.999 0 397.383 0 255.999C87.93 168.069 162.504 93.495 256 -0.000976562C397.384 -0.000976562 512 114.615 512 255.999Z"
                fill="#D80027"
            />
            <Path
                d="M256 255.999C256 114.615 256 97.947 256 -0.000976562C114.616 -0.000976562 0 114.615 0 255.999H256Z"
                fill="#0052B4"
            />
            <Path
                d="M222.609 149.82L191.344 164.528L207.992 194.807L174.043 188.311L169.74 222.608L146.094 197.384L122.446 222.608L118.145 188.311L84.1951 194.805L100.843 164.526L69.5791 149.82L100.844 135.115L84.1951 104.835L118.144 111.33L122.447 77.0339L146.094 102.258L169.741 77.0339L174.043 111.33L207.993 104.835L191.344 135.116L222.609 149.82Z"
                fill="#F0F0F0"
            />
            <Path
                d="M146.098 197.468C172.416 197.468 193.751 176.133 193.751 149.815C193.751 123.497 172.416 102.162 146.098 102.162C119.78 102.162 98.4448 123.497 98.4448 149.815C98.4448 176.133 119.78 197.468 146.098 197.468Z"
                fill="#0052B4"
            />
            <Path
                d="M146.094 175.212C132.093 175.212 120.703 163.821 120.703 149.82C120.703 135.819 132.094 124.428 146.094 124.428C160.095 124.428 171.486 135.819 171.486 149.82C171.485 163.821 160.093 175.212 146.094 175.212Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7303">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 -0.000976562)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgTw