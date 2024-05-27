import React from 'react'
import { G, Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    color?: Color
    size: number
}

export const BoldShieldDangerWithBorder = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            viewBox="0 0 18 18"
            width={size}
            height={size}
            fill="none"
        >
            <G transform="translate(1 0)">
                <Path
                    d="M8.0577 15.6666C7.97515 15.6673 7.8926 15.6477 7.81877 15.6091L5.41804 14.367C4.73614 14.0133 4.20324 13.6172 3.78712 13.1556C2.87636 12.1462 2.3703 10.8505 2.36158 9.50646L2.33339 5.08262C2.33071 4.57206 2.65957 4.11379 3.1522 3.94185L7.56037 2.40427C7.82213 2.31143 8.11408 2.30947 8.38053 2.39969L12.8055 3.88432C13.3008 4.04972 13.6357 4.50472 13.6384 5.01463L13.6666 9.44174C13.6753 10.7839 13.186 12.0854 12.29 13.1053C11.8779 13.5734 11.3497 13.9754 10.6752 14.335L8.29664 15.6065C8.22214 15.6457 8.14026 15.666 8.0577 15.6666Z"
                    fill="white"
                />
                <Path
                    d="M8.0577 15.6666C7.97515 15.6673 7.8926 15.6477 7.81877 15.6091L5.41804 14.367C4.73614 14.0133 4.20324 13.6172 3.78712 13.1556C2.87636 12.1462 2.3703 10.8505 2.36158 9.50646L2.33339 5.08262C2.33071 4.57206 2.65957 4.11379 3.1522 3.94185L7.56037 2.40427C7.82213 2.31143 8.11408 2.30947 8.38053 2.39969L12.8055 3.88432C13.3008 4.04972 13.6357 4.50472 13.6384 5.01463L13.6666 9.44174C13.6753 10.7839 13.186 12.0854 12.29 13.1053C11.8779 13.5734 11.3497 13.9754 10.6752 14.335L8.29664 15.6065C8.22214 15.6457 8.14026 15.666 8.0577 15.6666"
                    stroke="white"
                    strokeWidth="4"
                    fill="white"
                />
                <Path
                    fillRule="evenodd"
                    clipRule="evenodd"
                    d="M13.6329 5.01739C13.6329 4.50748 13.2974 4.04922 12.8009 3.88578L8.37908 2.40247C8.11069 2.31029 7.82216 2.31029 7.56048 2.40247L3.15208 3.94462C2.66226 4.11524 2.32676 4.5722 2.33347 5.08211L2.36031 9.50852C2.36702 10.8487 2.87697 12.1496 3.78952 13.1563C4.20553 13.6205 4.73561 14.0127 5.41331 14.3657L7.81545 15.6078C7.88926 15.6471 7.97649 15.6667 8.05701 15.6667C8.13753 15.6667 8.21805 15.6471 8.29185 15.6078L10.6739 14.3331C11.3449 13.9735 11.8749 13.5747 12.2842 13.104C13.1834 12.0836 13.6732 10.7826 13.6665 9.4425L13.6329 5.01739ZM8.00329 12.1172C7.67663 12.1172 7.41663 11.8505 7.41663 11.5305C7.41663 11.2105 7.67663 10.9505 7.99663 10.9505C8.32329 10.9505 8.58329 11.2105 8.58329 11.5305C8.58329 11.8505 8.32329 12.1172 8.00329 12.1172ZM8.00329 5.88281C7.68329 5.88281 7.41663 6.15015 7.41663 6.46948V9.41615C7.41663 9.73682 7.68329 9.99615 8.00329 9.99615C8.32329 9.99615 8.58329 9.73682 8.58329 9.41615V6.46948C8.58329 6.15015 8.32329 5.88281 8.00329 5.88281Z"
                    fill="currentColor"
                />
            </G>
        </SvgIcon>
    )
}
