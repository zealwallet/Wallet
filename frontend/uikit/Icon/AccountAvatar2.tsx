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

export const AccountAvatar2 = ({ size }: Props) => (
    <Svg
        style={{ flexShrink: 0 }}
        viewBox="0 0 28 28"
        width={size}
        height={size}
        fill="none"
    >
        <G clipPath="url(#avatar_2_svg__a)">
            <Path fill="url(#avatar_2_svg__b)" d="M0 0h28v28H0z" />
        </G>
        <Defs>
            <ClipPath id="avatar_2_svg__a">
                <Rect width={28} height={28} fill="#fff" rx={14} />
            </ClipPath>
            <Pattern
                id="avatar_2_svg__b"
                width={1}
                height={1}
                patternContentUnits="objectBoundingBox"
            >
                <Use xlinkHref="#avatar_2_svg__c" transform="scale(.01786)" />
            </Pattern>
            <Image
                xlinkHref="data:image/png;base64,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"
                id="avatar_2_svg__c"
                width={56}
                height={56}
            />
        </Defs>
    </Svg>
)