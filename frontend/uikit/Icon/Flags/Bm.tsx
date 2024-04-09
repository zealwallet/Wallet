import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgBm = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7100)">
            <Path
                d="M512 256C512 397.384 397.384 512 256 512C114.616 512 0 397.384 0 256C0 256.061 256 0.028 256 0C397.384 0 512 114.616 512 256Z"
                fill="#D80027"
            />
            <Path
                d="M256 122.435V208.778L166.957 122.435H256Z"
                fill="#0052B4"
            />
            <Path
                d="M133.565 256H208.776L133.565 155.826L122.435 233.739L133.565 256Z"
                fill="#0052B4"
            />
            <Path
                d="M255.315 256H256C256 255.77 256 255.546 256 255.315C255.772 255.544 255.544 255.772 255.315 256Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 133.565C256 88.52 256 59.005 256 0H255.957C114.591 0.024 0 114.629 0 256H133.565V180.789L208.776 256H255.316C255.544 255.772 255.772 255.544 256.001 255.315C256.001 238.068 256.001 222.679 256.001 208.778L180.788 133.565H256Z"
                fill="#F0F0F0"
            />
            <Path
                d="M129.515 33.3911C89.4756 56.1901 56.1886 89.4761 33.3906 129.515V267.13H100.174V100.176V100.174H267.13C267.13 79.1111 267.13 59.0451 267.13 33.3911H129.515Z"
                fill="#D80027"
            />
            <Path
                d="M266.176 234.694L165.044 133.565H133.564V133.567L266.173 266.176H266.175C266.176 266.177 266.176 244.47 266.176 234.694Z"
                fill="#D80027"
            />
            <Path
                d="M289.391 133.565V255.999C289.391 315.639 445.217 315.639 445.217 255.999V133.565H289.391Z"
                fill="#F3F3F3"
            />
            <Path
                d="M289.391 256V255.999C289.391 315.639 367.304 333.913 367.304 333.913C367.304 333.913 445.217 315.639 445.217 255.999V256H289.391Z"
                fill="#6DA544"
            />
            <Path
                d="M367.304 207.026L331.13 222.609V256L367.304 278.261L403.478 256V222.609L367.304 207.026Z"
                fill="#A2001D"
            />
            <Path
                d="M331.13 189.217H403.478V222.608H331.13V189.217Z"
                fill="#338AF3"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7100">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgBm