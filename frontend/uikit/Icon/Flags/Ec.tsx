import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

const SvgEc = ({ size }: { size: number }) => (
    <SvgIcon width={size} height={size} viewBox="0 0 512 512" fill="none">
        <G clipPath="url(#clip0_4_7143)">
            <Path
                d="M0 256C0 114.616 114.616 0 256 0C397.384 0 512 114.616 512 256L256 278.261L0 256Z"
                fill="#FFDA44"
            />
            <Path
                d="M34.2559 384C78.5209 460.516 161.245 512 256 512C350.755 512 433.479 460.516 477.744 384L256 367.304L34.2559 384Z"
                fill="#D80027"
            />
            <Path
                d="M477.744 384C499.526 346.346 512 302.631 512 256H0C0 302.631 12.474 346.346 34.256 384H477.744Z"
                fill="#0052B4"
            />
            <Path
                d="M256 345.043C305.177 345.043 345.043 305.177 345.043 256C345.043 206.823 305.177 166.957 256 166.957C206.823 166.957 166.957 206.823 166.957 256C166.957 305.177 206.823 345.043 256 345.043Z"
                fill="#FFDA44"
            />
            <Path
                d="M256 311.652C225.313 311.652 200.348 286.686 200.348 256V222.609C200.348 191.922 225.314 166.957 256 166.957C286.686 166.957 311.652 191.923 311.652 222.609V256C311.652 286.687 286.687 311.652 256 311.652Z"
                fill="#338AF3"
            />
            <Path
                d="M345.043 122.435H278.26C278.26 110.141 268.293 100.174 255.999 100.174C243.705 100.174 233.738 110.141 233.738 122.435H166.955C166.955 134.73 177.664 144.696 189.957 144.696H189.216C189.216 156.991 199.182 166.957 211.477 166.957C211.477 179.252 221.443 189.218 233.738 189.218H278.26C290.555 189.218 300.521 179.252 300.521 166.957C312.816 166.957 322.782 156.991 322.782 144.696H322.041C334.335 144.696 345.043 134.729 345.043 122.435Z"
                fill="black"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_4_7143">
                <Rect width={512} height={512} fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
export default SvgEc
