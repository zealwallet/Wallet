import React from 'react'
import { Path } from 'react-native-svg'

import { SvgIcon } from '@zeal/uikit/SvgIcon'

import { Color, colors } from '../colors'

type Props = {
    size: number
    color?: Color
}

export const MobilePhone = ({ size, color }: Props) => {
    return (
        <SvgIcon
            color={color && colors[color]}
            width={size}
            height={size}
            viewBox="0 0 72 72"
            fill="none"
        >
            <Path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M56.2515 33.0037L56.2329 33.7334L56.2515 34.5036L56.2338 35.2383L56.2513 36.0036L55.6852 60.7634C55.6148 63.8447 53.2712 66.3965 50.207 66.7283C40.7637 67.751 31.2376 67.751 21.7943 66.7283C18.7301 66.3965 16.3866 63.8447 16.3161 60.7634L15.7501 36.0036L15.7677 35.2332L15.7502 34.5036L15.7686 33.7364L15.75 33.0037L16.2561 13.0792C16.2595 12.9476 16.2658 12.8166 16.2752 12.6865L16.3085 11.2999C16.3848 8.12983 18.806 5.51078 21.9604 5.18625C22.2229 5.15924 22.4855 5.13299 22.7482 5.10751C23.1044 5.02472 23.4696 4.96436 23.8424 4.92802C31.9288 4.13988 40.0727 4.13988 48.159 4.92802C48.5318 4.96436 48.897 5.02471 49.2532 5.10748C49.5159 5.13298 49.7786 5.15924 50.0412 5.18625C53.1956 5.51078 55.6168 8.12983 55.6931 11.2999L55.7265 12.6896C55.7357 12.8187 55.742 12.9486 55.7453 13.0793L56.2515 33.0037ZM48.0007 53.2534C49.2434 53.2534 50.2507 52.2461 50.2507 51.0034C50.2507 49.7608 49.2434 48.7534 48.0007 48.7534H24.0007C22.7581 48.7534 21.7507 49.7608 21.7507 51.0034C21.7507 52.2461 22.7581 53.2534 24.0007 53.2534H48.0007ZM36.0007 65.1037C38.486 65.1037 40.5007 63.0889 40.5007 60.6037C40.5007 58.1184 38.486 56.1037 36.0007 56.1037C33.5154 56.1037 31.5007 58.1184 31.5007 60.6037C31.5007 63.0889 33.5154 65.1037 36.0007 65.1037Z"
                fill="currentColor"
            />
        </SvgIcon>
    )
}