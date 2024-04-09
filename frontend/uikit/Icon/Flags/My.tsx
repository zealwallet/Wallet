import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgMy = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7212)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M244.87 256H512C512 232.893 508.92 210.511 503.181 189.217H244.87V256Z"
                fill="#D80027"
            />
            <Path
                d="M244.87 122.435H474.426C458.755 96.8629 438.72 74.2599 415.357 55.6519H244.87V122.435Z"
                fill="#D80027"
            />
            <Path
                d="M256 512C316.249 512 371.626 491.176 415.357 456.348H96.6429C140.374 491.176 195.751 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M37.574 389.565H474.426C487.007 369.037 496.763 346.596 503.181 322.782H8.81897C15.236 346.596 24.993 369.037 37.574 389.565Z"
                fill="#D80027"
            />
            <Path
                d="M256 256C256 114.616 256 97.948 256 0C114.616 0 0 114.616 0 256H256Z"
                fill="#0052B4"
            />
            <Path
                d="M170.234 219.13C135.272 219.13 106.93 190.787 106.93 155.826C106.93 120.865 135.273 92.5221 170.234 92.5221C181.135 92.5221 191.392 95.2791 200.347 100.131C186.299 86.3941 167.087 77.9141 145.886 77.9141C102.857 77.9141 67.973 112.797 67.973 155.827C67.973 198.857 102.857 233.74 145.886 233.74C167.087 233.74 186.299 225.26 200.347 211.523C191.392 216.373 181.136 219.13 170.234 219.13Z"
                fill="#FFDA44"
            />
            <Path
                d="M188.073 111.304L199.312 134.806L224.693 128.942L213.327 152.381L233.739 168.568L208.325 174.297L208.396 200.348L188.073 184.05L167.749 200.348L167.819 174.297L142.405 168.568L162.817 152.381L151.45 128.942L176.833 134.806L188.073 111.304Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7212">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgMy
