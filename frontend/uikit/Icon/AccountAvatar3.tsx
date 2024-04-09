import * as React from 'react'
import Svg, {
    ClipPath,
    Defs,
    G,
    Image,
    Path,
    Pattern,
    Rect,
    Use,
} from 'react-native-svg'

type Props = {
    size: number
}

export const AccountAvatar3 = ({ size }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 28 28"
        width={size}
        height={size}
        fill="none"
    >
        <G clipPath="url(#avatar_3_svg__a)">
            <Path fill="url(#avatar_3_svg__b)" d="M0 0h28v28H0z" />
        </G>
        <Defs>
            <ClipPath id="avatar_3_svg__a">
                <Rect width={28} height={28} fill="#fff" rx={14} />
            </ClipPath>
            <Pattern
                id="avatar_3_svg__b"
                width={1}
                height={1}
                patternContentUnits="objectBoundingBox"
            >
                <Use xlinkHref="#avatar_3_svg__c" transform="scale(.01786)" />
            </Pattern>
            <Image
                xlinkHref="data:image/png;base64,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"
                id="avatar_3_svg__c"
                width={56}
                height={56}
            />
        </Defs>
    </Svg>
)