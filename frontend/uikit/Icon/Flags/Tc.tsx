import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgTc = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7316)">
            <Path
                d="M512 256.001C512 397.385 397.384 512.001 256 512.001C114.616 512.001 0 397.385 0 256.001C0 256.062 256 0.0289766 256 0.000976562C397.384 0.000976562 512 114.617 512 256.001Z"
                fill="#0052B4"
            />
            <Path
                d="M255.315 256.001H256C256 255.771 256 255.547 256 255.316C255.772 255.545 255.544 255.773 255.315 256.001Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 133.566C256 88.521 256 59.006 256 0.000976562H255.957C114.591 0.0249766 0 114.63 0 256.001H133.565V180.79L208.776 256.001H255.316C255.544 255.773 255.772 255.545 256.001 255.316C256.001 238.069 256.001 222.68 256.001 208.779L180.788 133.566H256Z"
                fill="#F0F0F0"
            />
            <Path
                d="M129.515 33.3921C89.4761 56.1911 56.1891 89.4771 33.3911 129.516V256.001H100.174V100.177V100.175H256C256 79.1121 256 59.0461 256 33.3921H129.515Z"
                fill="#D80027"
            />
            <Path
                d="M256 224.52L165.045 133.567H133.565V133.569L255.998 256.001H256C256 256.001 256 234.294 256 224.52Z"
                fill="#D80027"
            />
            <Path
                d="M289.391 133.566V256C289.391 315.64 367.304 333.914 367.304 333.914C367.304 333.914 445.217 315.64 445.217 256V133.566H289.391Z"
                fill="#FFDA44"
            />
            <Path
                d="M356.174 178.088C356.174 190.383 346.208 222.61 333.913 222.61C321.618 222.61 311.652 190.383 311.652 178.088C311.652 165.793 333.913 155.827 333.913 155.827C333.913 155.827 356.174 165.793 356.174 178.088Z"
                fill="#FF9811"
            />
            <Path
                d="M415.245 202.333C418.837 193.568 421.631 180.756 421.631 174.378C421.631 164.132 408.274 155.827 408.274 155.827C408.274 155.827 394.917 164.133 394.917 174.378C394.917 180.756 397.711 193.568 401.303 202.333L393.592 219.743C398.124 221.585 403.078 222.609 408.273 222.609C413.468 222.609 418.422 221.585 422.954 219.743L415.245 202.333Z"
                fill="#A2001D"
            />
            <Path
                d="M350.609 256.001C350.609 256.001 339.479 278.262 339.479 300.523H395.131C395.13 278.262 384 256.001 384 256.001L367.304 244.871L350.609 256.001Z"
                fill="#6DA544"
            />
            <Path
                d="M384 256.001V250.436C384 241.216 376.525 233.74 367.304 233.74C358.084 233.74 350.608 241.215 350.608 250.436V256.001H384Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7316">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 0.000976562)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgTc
