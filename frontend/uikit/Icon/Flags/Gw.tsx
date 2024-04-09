import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgGw = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7171)">
            <Path
                d="M256 0C232.894 0 210.51 3.08 189.217 8.819L166.957 256L189.218 503.181C210.51 508.92 232.894 512 256 512C397.384 512 512 397.384 512 256C512 114.616 397.384 0 256 0Z"
                fill="#FFDA44"
            />
            <Path
                d="M166.957 256L189.218 503.181C210.51 508.92 232.894 512 256 512C397.384 512 512 397.384 512 256H166.957Z"
                fill="#6DA544"
            />
            <Path
                d="M0 256C0 353.035 53.99 437.455 133.565 480.873V31.127C53.99 74.545 0 158.965 0 256Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 374.279 80.221 473.805 189.217 503.181V8.81897C80.221 38.195 0 137.721 0 256Z"
                fill="#D80027"
            />
            <Path
                d="M96.7356 189.217L113.311 240.233H166.957L123.559 271.765L140.133 322.783L96.7356 291.252L53.3366 322.783L69.9146 271.765L26.5166 240.233H80.1596L96.7356 189.217Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7171">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgGw
