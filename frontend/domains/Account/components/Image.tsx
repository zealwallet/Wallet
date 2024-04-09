import { AvatarSize } from '@zeal/uikit/Avatar'
import { AccountAvatar0 } from '@zeal/uikit/Icon/AccountAvatar0'
import { AccountAvatar1 } from '@zeal/uikit/Icon/AccountAvatar1'
import { AccountAvatar2 } from '@zeal/uikit/Icon/AccountAvatar2'
import { AccountAvatar3 } from '@zeal/uikit/Icon/AccountAvatar3'
import { AccountAvatar4 } from '@zeal/uikit/Icon/AccountAvatar4'
import { SvgImage } from '@zeal/uikit/SvgImage'

import { Account } from '@zeal/domains/Account'
import { ImperativeError } from '@zeal/domains/Error'

type Props = {
    size: AvatarSize
    account: Account
}

export const Image = ({ size, account }: Props) => {
    if (account.avatarSrc) {
        return <SvgImage size={size} src={account.avatarSrc} />
    }

    const addressNumber = BigInt(account.address) % 5n

    switch (addressNumber) {
        case 0n:
            return <AccountAvatar0 size={size} />
        case 1n:
            return <AccountAvatar1 size={size} />
        case 2n:
            return <AccountAvatar2 size={size} />
        case 3n:
            return <AccountAvatar3 size={size} />
        case 4n:
            return <AccountAvatar4 size={size} />
        default:
            throw new ImperativeError('Reminder operator not working!')
    }
}
