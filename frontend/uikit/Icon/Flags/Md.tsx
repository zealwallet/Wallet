import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgMd = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7223)">
            <Path
                d="M367.304 25.402C333.648 9.128 295.89 0 256 0C216.11 0 178.352 9.128 144.696 25.402L122.435 256L144.696 486.598C178.352 502.872 216.11 512 256 512C295.89 512 333.648 502.872 367.304 486.598L389.565 256L367.304 25.402Z"
                fill="#FFDA44"
            />
            <Path
                d="M144.696 25.4111C59.066 66.8181 0 154.507 0 256C0 357.493 59.066 445.182 144.696 486.589V25.4111Z"
                fill="#0052B4"
            />
            <Path
                d="M367.304 25.4111V486.589C452.934 445.182 512 357.493 512 256C512 154.507 452.934 66.8181 367.304 25.4111Z"
                fill="#D80027"
            />
            <Path
                d="M345.043 201.419H283.826C283.826 186.051 271.368 173.593 256 173.593C240.632 173.593 228.174 186.051 228.174 201.419H166.957C166.957 216.55 180.138 228.815 195.267 228.815H194.355C194.355 243.947 206.621 256.214 221.753 256.214C221.753 269.611 231.375 280.743 244.083 283.123L222.493 331.865C232.838 336.07 244.144 338.407 256 338.407C267.855 338.407 279.162 336.07 289.506 331.865L267.917 283.123C280.625 280.743 290.247 269.611 290.247 256.214C305.379 256.214 317.645 243.947 317.645 228.815H316.732C331.863 228.815 345.043 216.549 345.043 201.419Z"
                fill="#FF9811"
            />
            <Path
                d="M256 239.304L219.826 256V289.391L256 311.652L292.174 289.391V256L256 239.304Z"
                fill="#0052B4"
            />
            <Path
                d="M219.826 222.609H292.174V256H219.826V222.609Z"
                fill="#D80027"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7223">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgMd
