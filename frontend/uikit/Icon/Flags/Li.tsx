import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgLi = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7205)">
            <Path
                d="M512 256C512 397.384 397.384 512 256 512C114.616 512 0 397.384 0 256C11.13 256 256 222.609 256 222.609L512 256Z"
                fill="#D80027"
            />
            <Path
                d="M0 256C0 114.616 114.616 0 256 0C397.384 0 512 114.616 512 256"
                fill="#0052B4"
            />
            <Path
                d="M189.217 178.087C189.217 159.646 174.267 144.696 155.826 144.696C147.271 144.696 139.474 147.916 133.565 153.205V133.565H144.695V111.304H133.565V100.174H111.304V111.304H100.174V133.565H111.304V153.205C105.395 147.916 97.5979 144.696 89.0429 144.696C70.6019 144.696 55.6519 159.646 55.6519 178.087C55.6519 187.974 59.9529 196.854 66.7819 202.969V222.609H178.086V202.969C184.917 196.854 189.217 187.974 189.217 178.087Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7205">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgLi
