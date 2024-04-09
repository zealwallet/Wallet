import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { PinLockScreen } from '@zeal/domains/Password/features/PinLockScreen'

import { PasswordLockScreen } from './PasswordLockScreen'

type Props = {
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof PasswordLockScreen>

export const LockScreen = ({ encryptedPassword, onMsg }: Props) => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return (
                <PinLockScreen
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        case 'web':
            return (
                <PasswordLockScreen
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
