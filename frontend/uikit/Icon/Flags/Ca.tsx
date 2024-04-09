import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgCa = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7116)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M512 256C512 154.506 452.935 66.8101 367.304 25.4021V486.597C452.935 445.19 512 357.494 512 256Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 357.494 59.065 445.19 144.696 486.598V25.4021C59.065 66.8101 0 154.506 0 256Z"
                fill="#D80027"
            />
            <Path
                d="M300.522 289.391L345.043 267.13L322.783 256V233.739L278.261 256L300.522 211.478H278.261L256 178.087L233.739 211.478H211.478L233.739 256L189.217 233.739V256L166.957 267.13L211.478 289.391L200.348 311.652H244.87V345.043H267.13V311.652H311.652L300.522 289.391Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7116">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgCa
