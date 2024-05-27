import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgVi = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7330)">
            <Path
                d="M256 511.999C397.385 511.999 512 397.384 512 255.999C512 114.614 397.385 -0.000976562 256 -0.000976562C114.615 -0.000976562 0 114.614 0 255.999C0 397.384 114.615 511.999 256 511.999Z"
                fill="#FCFCFC"
            />
            <Path
                d="M299.479 178.845C299.479 154.833 280.013 135.367 256 135.367C231.987 135.367 212.521 154.833 212.521 178.845H116.87C116.87 202.486 137.464 221.653 161.105 221.653H159.681C159.681 245.296 178.845 264.464 202.49 264.464C202.49 285.397 217.524 302.791 237.379 306.509L237.268 306.759H274.733L274.622 306.509C294.478 302.789 309.511 285.396 309.511 264.464C333.155 264.464 352.32 245.296 352.32 221.653H350.894C374.535 221.653 395.13 202.486 395.13 178.845H299.479Z"
                fill="#FFDA44"
            />
            <Path
                d="M236.887 302.323L209.929 363.186C224.153 368.968 239.7 372.182 256.001 372.182C272.302 372.182 287.849 368.969 302.072 363.186L275.115 302.323H236.887Z"
                fill="#FFDA44"
            />
            <Path
                d="M200.348 200.226V275.117C200.348 317.715 256 330.769 256 330.769C256 330.769 311.652 317.715 311.652 275.117V200.226H200.348Z"
                fill="#F0F0F0"
            />
            <Path
                d="M62.079 257.801L92.178 341.985L121.964 257.801H144.696L101.27 369.105H83.085L39.348 257.801H62.079Z"
                fill="#338AF3"
            />
            <Path
                d="M411.826 369.105V257.801H433.459V369.105H411.826Z"
                fill="#338AF3"
            />
            <Path
                d="M222.609 224.41V315.164C230.26 320.795 238.492 324.668 244.87 327.148V224.41H222.609Z"
                fill="#D80027"
            />
            <Path
                d="M289.391 224.41V315.164C281.74 320.795 273.508 324.668 267.13 327.148V224.41H289.391Z"
                fill="#D80027"
            />
            <Path
                d="M200.348 200.224H311.652V235.54H200.348V200.224Z"
                fill="#0052B4"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7330">
                <Rect
                    width={512}
                    height={512}
                    fill="white"
                    transform="translate(0 -0.000976562)"
                />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgVi
