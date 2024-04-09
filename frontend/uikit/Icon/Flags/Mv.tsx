import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMv = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7213)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M89.043 133.565H422.956V378.435H89.043V133.565Z"
                fill="#6DA544"
            />
            <Path
                d="M297.227 328.348C257.271 328.348 224.879 295.956 224.879 256C224.879 216.044 257.271 183.652 297.227 183.652C309.685 183.652 321.408 186.802 331.642 192.348C315.587 176.647 293.632 166.956 269.401 166.956C220.225 166.956 180.358 206.822 180.358 255.999C180.358 305.176 220.225 345.042 269.401 345.042C293.632 345.042 315.588 335.351 331.642 319.65C321.408 325.198 309.685 328.348 297.227 328.348Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7213">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMv
