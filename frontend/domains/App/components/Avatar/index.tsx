import React, { ComponentPropsWithoutRef } from 'react'

import { Avatar as UIAvatar, AvatarSize } from '@zeal/uikit/Avatar'
import { Img } from '@zeal/uikit/Img'

import { App } from '@zeal/domains/App'

type Props = {
    app: App
    size: AvatarSize
    badge?: ComponentPropsWithoutRef<typeof UIAvatar>['rightBadge']
}

export const Avatar = ({ app, size, badge }: Props) => {
    return (
        <UIAvatar size={size} rightBadge={badge}>
            <Img size={size} src={app.icon} />
        </UIAvatar>
    )
}
