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

export const AccountAvatar4 = ({ size }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 28 28"
        width={size}
        height={size}
        fill="none"
    >
        <G clipPath="url(#avatar_4_svg__a)">
            <Path fill="url(#avatar_4_svg__b)" d="M0 0h28v28H0z" />
        </G>
        <Defs>
            <ClipPath id="avatar_4_svg__a">
                <Rect width={28} height={28} fill="#fff" rx={14} />
            </ClipPath>
            <Pattern
                id="avatar_4_svg__b"
                width={1}
                height={1}
                patternContentUnits="objectBoundingBox"
            >
                <Use xlinkHref="#avatar_4_svg__c" transform="scale(.01786)" />
            </Pattern>
            <Image
                xlinkHref="data:image/png;base64,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"
                id="avatar_4_svg__c"
                width={56}
                height={56}
            />
        </Defs>
    </Svg>
)