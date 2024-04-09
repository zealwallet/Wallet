import * as React from 'react'
import Svg, { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'
const SvgVa = ({ size }: { size: number }) => (
    <Svg width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7327)">
            <Path
                d="M256 0C397.384 0 512 114.616 512 256C512 397.384 397.384 512 256 512C256 500.87 222.609 256 222.609 256L256 0Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 512C114.616 512 0 397.384 0 256C0 114.616 114.616 0 256 0"
                fill="#FFDA44"
            />
            <Path
                d="M354.03 222.765L402.141 286.411C394.561 297.889 394.601 313.353 403.368 324.95C414.488 339.661 435.429 342.573 450.141 331.452C464.852 320.332 467.764 299.391 456.642 284.68C447.877 273.083 433.009 268.827 419.899 272.989L344.918 173.796L327.16 187.22L300.52 207.354L327.368 242.869L354.03 222.765ZM423.293 295.935C428.197 292.227 435.178 293.199 438.885 298.101C442.591 303.005 441.622 309.986 436.718 313.694C431.815 317.399 424.834 316.431 421.128 311.526C417.419 306.622 418.39 299.641 423.293 295.935Z"
                fill="#ACABB1"
            />
            <Path
                d="M436.55 242.868L463.398 207.353L436.76 187.217L419.002 173.793L344.021 272.986C330.913 268.824 316.044 273.081 307.278 284.677C296.156 299.389 299.068 320.329 313.779 331.449C328.491 342.569 349.431 339.658 360.551 324.947C369.317 313.35 369.357 297.886 361.778 286.408L409.889 222.762L436.55 242.868ZM342.793 311.525C339.087 316.43 332.107 317.399 327.203 313.693C322.299 309.985 321.329 303.004 325.036 298.1C328.742 293.198 335.723 292.226 340.628 295.934C345.531 299.641 346.5 306.622 342.793 311.525Z"
                fill="#FFDA44"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7327">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </Svg>
)
export default SvgVa