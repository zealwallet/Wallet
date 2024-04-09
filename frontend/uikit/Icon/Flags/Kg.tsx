import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgKg = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7198)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#D80027"
            />
            <Path
                d="M381.197 256L330.042 280.062L357.283 329.609L301.73 318.98L294.694 375.096L255.999 333.826L217.307 375.096L210.268 318.98L154.72 329.607L181.96 280.06L130.803 256L181.96 231.939L154.72 182.391L210.266 193.021L217.309 136.904L255.999 178.175L294.696 136.904L301.73 193.021L357.285 182.391L330.043 231.942L381.197 256Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 333.913C299.03 333.913 333.913 299.03 333.913 256C333.913 212.97 299.03 178.087 256 178.087C212.97 178.087 178.087 212.97 178.087 256C178.087 299.03 212.97 333.913 256 333.913Z"
                fill="#D80027"
            />
            <Path
                d="M217.043 256C215.166 256 213.313 256.096 211.484 256.278C211.551 267.069 215.455 276.946 221.903 284.619C225.343 275.362 230.479 266.921 236.956 259.697C230.77 257.318 224.059 256 217.043 256Z"
                fill="#FFDA44"
            />
            <Path
                d="M241.025 297.933C245.705 299.605 250.744 300.522 256 300.522C261.256 300.522 266.295 299.605 270.975 297.933C268.424 287.921 263.157 278.983 256 271.959C248.843 278.982 243.576 287.921 241.025 297.933Z"
                fill="#FFDA44"
            />
            <Path
                d="M294.555 233.746C286.857 220.44 272.48 211.478 256 211.478C239.52 211.478 225.143 220.439 217.445 233.746C231.479 233.817 244.639 237.633 256 244.222C267.361 237.633 280.519 233.817 294.555 233.746Z"
                fill="#FFDA44"
            />
            <Path
                d="M275.042 259.698C281.519 266.921 286.655 275.362 290.095 284.62C296.543 276.947 300.447 267.07 300.514 256.279C298.684 256.096 296.831 256.001 294.955 256.001C287.941 256 281.23 257.318 275.042 259.698Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7198">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgKg