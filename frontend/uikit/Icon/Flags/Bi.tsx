import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgBi = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7113)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M411.876 52.902C320.224 -17.6241 191.776 -17.6241 100.124 52.901L256 208.777L411.876 52.902Z"
                fill="#D80027"
            />
            <Path
                d="M255.998 303.224L100.124 459.098C191.776 529.624 320.224 529.624 411.876 459.098L256 303.222L255.998 303.224Z"
                fill="#D80027"
            />
            <Path
                d="M208.777 256L52.9023 100.124C-17.6237 191.776 -17.6237 320.224 52.9023 411.876L208.777 256Z"
                fill="#6DA544"
            />
            <Path
                d="M303.225 256L459.099 411.876C529.625 320.224 529.625 191.776 459.099 100.124L303.225 256Z"
                fill="#6DA544"
            />
            <Path
                d="M256 367.304C317.472 367.304 367.304 317.472 367.304 256C367.304 194.529 317.472 144.696 256 144.696C194.529 144.696 144.696 194.529 144.696 256C144.696 317.472 194.529 367.304 256 367.304Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 178.087L265.639 194.783H284.918L275.278 211.478L284.918 228.174H265.639L256 244.87L246.361 228.174H227.083L236.722 211.478L227.083 194.783H246.361L256 178.087Z"
                fill="#D80027"
            />
            <Path
                d="M207.005 256L216.644 272.696H235.922L226.283 289.391L235.922 306.087H216.644L207.005 322.783L197.365 306.087H178.087L187.726 289.391L178.087 272.696H197.365L207.005 256Z"
                fill="#D80027"
            />
            <Path
                d="M304.996 256L314.635 272.696H333.913L324.274 289.391L333.913 306.087H314.635L304.996 322.783L295.356 306.087H276.078L285.717 289.391L276.078 272.696H295.356L304.996 256Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7113">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgBi