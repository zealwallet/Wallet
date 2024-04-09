import { Avatar, AvatarSize } from '@zeal/uikit/Avatar'
import { LightWallet } from '@zeal/uikit/Icon/LightWallet'
import { Img } from '@zeal/uikit/Img'

import { Account } from '@zeal/domains/Account'

type Props = {
    size: AvatarSize
    fromAccount: Account
}

export const ExternalWalletAvatar = ({ fromAccount, size }: Props) => {
    return (
        <Avatar size={size} variant="rounded">
            {fromAccount.avatarSrc ? (
                <Img src={fromAccount.avatarSrc} size={size} />
            ) : (
                <LightWallet size={size} color="textSecondary" />
            )}
        </Avatar>
    )
}
