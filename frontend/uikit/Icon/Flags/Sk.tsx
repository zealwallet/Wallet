import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgSk = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7284)">
            <Path
                d="M256 512.001C397.385 512.001 512 397.386 512 256.001C512 114.616 397.385 0.000976562 256 0.000976562C114.615 0.000976562 0 114.616 0 256.001C0 397.386 114.615 512.001 256 512.001Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 512.001C397.384 512.001 512 397.385 512 256.001C512 224.687 506.368 194.69 496.077 166.958H15.923C5.633 194.69 0 224.687 0 256.001C0 397.385 114.616 512.001 256 512.001Z"
                fill="#0052B4"
            />
            <Path
                d="M256 512.001C366.071 512.001 459.906 442.529 496.077 345.044H15.9229C52.0939 442.529 145.929 512.001 256 512.001Z"
                fill="#D80027"
            />
            <Path
                d="M66.1982 144.697V272.403C66.1982 345.047 161.099 367.306 161.099 367.306C161.099 367.306 255.999 345.047 255.999 272.403V144.697H66.1982Z"
                fill="#F0F0F0"
            />
            <Path
                d="M88.459 144.697V272.403C88.459 280.931 90.353 288.985 94.105 296.536H228.092C231.844 288.986 233.738 280.931 233.738 272.403V144.697H88.459Z"
                fill="#D80027"
            />
            <Path
                d="M205.62 233.74H172.23V211.479H194.491V189.218H172.23V166.958H149.969V189.218H127.709V211.479H149.969V233.74H116.577V256.001H149.969V278.262H172.23V256.001H205.62V233.74Z"
                fill="#F0F0F0"
            />
            <Path
                d="M124.471 327.611C138.816 336.626 153.554 341.86 161.099 344.188C168.644 341.861 183.382 336.626 197.727 327.611C212.193 318.519 222.334 308.121 228.092 296.536C221.741 292.043 213.992 289.393 205.621 289.393C202.573 289.393 199.612 289.754 196.765 290.417C190.732 276.709 177.037 267.132 161.1 267.132C145.163 267.132 131.467 276.709 125.435 290.417C122.588 289.754 119.626 289.393 116.579 289.393C108.208 289.393 100.459 292.043 94.1079 296.536C99.8629 308.12 110.004 318.518 124.471 327.611Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7284">
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
export default SvgSk
