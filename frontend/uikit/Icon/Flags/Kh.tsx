import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgKh = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7114)">
            <Path
                d="M0 256C0 300.35 11.283 342.064 31.127 378.435L256 400.696L480.873 378.435C500.717 342.064 512 300.35 512 256C512 211.65 500.717 169.936 480.873 133.565L256 111.304L31.127 133.565C11.283 169.936 0 211.65 0 256H0Z"
                fill="#D80027"
            />
            <Path
                d="M31.127 133.565H480.872C437.454 53.989 353.035 0 256 0C158.965 0 74.546 53.989 31.127 133.565Z"
                fill="#0052B4"
            />
            <Path
                d="M256 512C353.035 512 437.454 458.011 480.873 378.435H31.127C74.546 458.011 158.965 512 256 512Z"
                fill="#0052B4"
            />
            <Path
                d="M345.043 306.087V272.696H322.783V228.174L300.522 205.913L278.261 228.174V183.652L256 161.391L233.739 183.652V228.174L211.478 205.913L189.217 228.174V272.696H166.957V306.087H144.696V339.478H367.304V306.087H345.043Z"
                fill="#F0F0F0"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7114">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgKh
