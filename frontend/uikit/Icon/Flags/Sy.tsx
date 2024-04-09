import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgSy = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 513 512" fill="none">
        <G clipPath="url(#clip0_4_7302)">
            <Path
                d="M256.578 512C397.963 512 512.578 397.385 512.578 256C512.578 114.615 397.963 0 256.578 0C115.193 0 0.578125 114.615 0.578125 256C0.578125 397.385 115.193 512 256.578 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256.578 0C146.507 0 52.6721 69.472 16.5011 166.957H496.656C460.484 69.472 366.649 0 256.578 0Z"
                fill="#D80027"
            />
            <Path
                d="M256.578 512C366.649 512 460.484 442.528 496.655 345.043H16.5011C52.6721 442.528 146.507 512 256.578 512Z"
                fill="black"
            />
            <Path
                d="M153.54 194.783L167.353 237.295H212.056L175.891 263.573L189.705 306.087L153.54 279.812L117.375 306.087L131.189 263.573L95.0242 237.295H139.727L153.54 194.783Z"
                fill="#6DA544"
            />
            <Path
                d="M359.616 194.783L373.429 237.295H418.133L381.967 263.573L395.781 306.087L359.616 279.812L323.451 306.087L337.265 263.573L301.1 237.295H345.803L359.616 194.783Z"
                fill="#6DA544"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7302">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0.578125)"
                />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgSy
