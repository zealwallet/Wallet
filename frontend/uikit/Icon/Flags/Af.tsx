import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgAf = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7074)">
            <Path
                d="M367.304 25.402C333.648 9.128 295.89 0 256 0C216.11 0 178.352 9.128 144.696 25.402L122.435 256L144.696 486.598C178.352 502.872 216.11 512 256 512C295.89 512 333.648 502.872 367.304 486.598L389.565 256L367.304 25.402Z"
                fill="#D80027"
            />
            <Path
                d="M144.696 25.4111C59.066 66.8181 0 154.507 0 256C0 357.493 59.066 445.182 144.696 486.589V25.4111Z"
                fill="black"
            />
            <Path
                d="M367.304 25.4111V486.589C452.934 445.182 512 357.493 512 256C512 154.507 452.934 66.8181 367.304 25.4111Z"
                fill="#496E2D"
            />
            <Path
                d="M256 166.957C206.822 166.957 166.957 206.823 166.957 256C166.957 305.177 206.823 345.043 256 345.043C305.177 345.043 345.043 305.177 345.043 256C345.043 206.823 305.178 166.957 256 166.957ZM256 311.652C225.264 311.652 200.348 286.735 200.348 256C200.348 225.265 225.265 200.348 256 200.348C286.735 200.348 311.652 225.265 311.652 256C311.652 286.735 286.736 311.652 256 311.652Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 222.609C243.705 222.609 233.739 232.575 233.739 244.87V278.261H278.261V244.87C278.261 232.575 268.295 222.609 256 222.609Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7074">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgAf