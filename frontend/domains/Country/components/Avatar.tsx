import React from 'react'

import { Avatar as UIAvatar, AvatarSize } from '@zeal/uikit/Avatar'
import * as Flags from '@zeal/uikit/Icon/Flags'

import { CountryISOCode } from '@zeal/domains/Country'

type Props = {
    countryCode: CountryISOCode
    size: AvatarSize
}

export const Avatar = ({ countryCode, size }: Props) => {
    const Flag = Flags[countryCode]
    return (
        <UIAvatar size={size}>
            <Flag size={size} />
        </UIAvatar>
    )
}
