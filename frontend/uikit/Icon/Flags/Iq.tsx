import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgIq = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7183)">
            <Path
                d="M256 512C397.385 512 512 397.385 512 256C512 114.615 397.385 0 256 0C114.615 0 0 114.615 0 256C0 397.385 114.615 512 256 512Z"
                fill="#F0F0F0"
            />
            <Path
                d="M256 0C145.929 0 52.0939 69.472 15.9229 166.957H496.078C459.906 69.472 366.071 0 256 0Z"
                fill="#A2001D"
            />
            <Path
                d="M256 512C366.071 512 459.906 442.528 496.077 345.043H15.9229C52.0939 442.528 145.929 512 256 512Z"
                fill="black"
            />
            <Path
                d="M194.783 239.304C194.643 239.304 194.506 239.313 194.366 239.315V239.304H145.429C147.91 229.718 156.608 222.608 166.957 222.608V189.217C136.27 189.217 111.305 214.183 111.305 244.869V272.139V272.696H194.366H194.783C197.852 272.696 200.348 275.193 200.348 278.261V289.391H89.043V322.782H233.739V278.26C233.739 256.78 216.263 239.304 194.783 239.304Z"
                fill="#496E2D"
            />
            <Path
                d="M278.261 289.391V189.217H244.87V322.783H300.522V289.391H278.261Z"
                fill="#496E2D"
            />
            <Path
                d="M389.565 289.392V189.217H356.174V289.392H345.043V256.001H311.652V322.784H411.826V289.392H389.565Z"
                fill="#496E2D"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7183">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgIq
