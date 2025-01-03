import * as React from 'react'
import { ClipPath, Defs, G, Path, Rect } from 'react-native-svg'

import { Color, colors } from '@zeal/uikit/colors'
import { SvgIcon } from '@zeal/uikit/SvgIcon'

type Props = {
    color?: Color
}

export const RaribleSafetyCheckSource = ({ color }: Props) => (
    <SvgIcon
        color={color && colors[color]}
        viewBox="0 0 55 12"
        width={55}
        height={12}
        fill="none"
    >
        <G clipPath="url(#clip0_1623_8441)">
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M2.63158 0C1.1782 0 0 1.1782 0 2.63158V9.36842C0 10.8218 1.1782 12 2.63158 12H9.36842C10.8218 12 12 10.8218 12 9.36842V2.63158C12 1.1782 10.8218 0 9.36842 0H2.63158ZM8.32549 5.98488C8.70344 5.88541 9.03975 5.59909 9.03975 5.02346C9.03975 4.06506 8.23617 3.84204 7.20644 3.84204H3.10522V8.15783H4.83141V6.69309H6.87901C7.19449 6.69309 7.37901 6.81967 7.37901 7.13315V8.15783H9.10522V7.07888C9.10522 6.4912 8.77786 6.12046 8.32549 5.98488ZM7.1658 5.04782H4.83218V5.63625L7.1658 5.63609L7.17628 5.63625C7.33675 5.63625 7.46686 5.50451 7.46686 5.34204C7.46686 5.17955 7.33675 5.04782 7.17628 5.04782C7.1728 5.04782 7.16928 5.0477 7.1658 5.04782Z"
                fill="currentColor"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M45 6.73185C45 8.66758 43.953 10 42.1765 10C41.4471 10 40.7765 9.67319 40.4824 9.17038V9.89942H39V1H40.4824V4.26816C40.8236 3.79051 41.4588 3.46369 42.2 3.46369C43.953 3.46369 45 4.79613 45 6.73185ZM40.3882 6.73185C40.3882 7.87566 41.0118 8.62987 41.9647 8.62987C42.9059 8.62987 43.5294 7.87566 43.5294 6.73185C43.5294 5.58796 42.9059 4.83384 41.9647 4.83384C41.0118 4.83384 40.3882 5.58796 40.3882 6.73185Z"
                fill="currentColor"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M23 10L21.2166 5.97575C22.0162 5.53859 22.4912 4.67718 22.4912 3.66144C22.4912 2.04144 21.4599 1 19.8724 1H16L16.0116 10H17.5875V6.31004H19.6059L21.1692 10H23ZM17.5875 2.50429H19.6291C20.4402 2.50429 20.9037 2.94144 20.9037 3.66144C20.9037 4.38146 20.4402 4.80571 19.6291 4.80571H17.5875V2.50429Z"
                fill="currentColor"
            />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M28.2706 4.09231H30V9.90768H28.2706V9.23845C27.9275 9.7 27.1589 10 26.2941 10C24.2216 10 23 8.7769 23 7.00001C23 5.22311 24.2216 4 26.2666 4C27.1314 4 27.8725 4.3 28.2706 4.73846V4.09231ZM24.7157 7.00001C24.7157 8.04997 25.4431 8.74229 26.5411 8.74229C27.653 8.74229 28.3804 8.04997 28.3804 7.00001C28.3804 5.94997 27.653 5.25772 26.5411 5.25772C25.4431 5.25772 24.7157 5.94997 24.7157 7.00001Z"
                fill="currentColor"
            />
            <Path
                d="M35 4.09375L34.9039 5.52345C34.6878 5.42969 34.3994 5.38284 34.1352 5.38284C33.2823 5.38284 32.5135 6.07421 32.5135 7.83203V10H31V4.09375H32.5135V5.17184C32.8138 4.50391 33.6066 4 34.3393 4C34.5556 4 34.8198 4.03515 35 4.09375Z"
                fill="currentColor"
            />
            <Path d="M38 10H36V4H38V10Z" fill="currentColor" />
            <Path d="M46 10H48V1H46V10Z" fill="currentColor" />
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M55 6.80384C55 5.45381 54.008 4 51.9761 4C49.9801 4 49 5.4885 49 7.00001C49 8.51152 50.0638 10 52.0598 10C53.4702 10 54.5219 9.35388 54.8566 8.25772L53.4462 7.88849C53.2909 8.45388 52.7889 8.7769 52.0837 8.7769C51.2232 8.7769 50.6374 8.25772 50.506 7.38074H54.9761C54.9881 7.26539 55 7.01152 55 6.80384ZM50.5419 6.3192C50.7092 5.53462 51.235 5.10769 51.9761 5.10769C52.8486 5.10769 53.3148 5.62695 53.3865 6.3192H50.5419Z"
                fill="currentColor"
            />
            <Path
                d="M36.7558 1C36.3384 1 36 1.33593 36 1.75031V2.24969C36 2.66408 36.3384 3 36.7558 3H37.2442C37.6616 3 38 2.66408 38 2.24969V1.75031C38 1.33593 37.6616 1 37.2442 1H36.7558Z"
                fill="currentColor"
            />
        </G>
        <Defs>
            <ClipPath id="clip0_1623_8441">
                <Rect width="55" height="12" fill="white" />
            </ClipPath>
        </Defs>
    </SvgIcon>
)
