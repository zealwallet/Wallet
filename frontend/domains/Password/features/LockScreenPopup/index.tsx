import { FormattedMessage } from 'react-intl'

import { Modal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { PasswordCheckPopup } from '@zeal/domains/Password/features/PasswordCheckPopup'
import { PinLockScreen } from '@zeal/domains/Password/features/PinLockScreen'

type Props = {
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof PasswordCheckPopup> | MsgOf<typeof PinLockScreen>

export const LockScreenPopup = ({ encryptedPassword, onMsg }: Props) => {
    switch (ZealPlatform.OS) {
        case 'ios':
        case 'android':
            return (
                <Modal>
                    <PinLockScreen
                        encryptedPassword={encryptedPassword}
                        onMsg={onMsg}
                    />
                </Modal>
            )
        case 'web':
            return (
                <PasswordCheckPopup
                    subtitle={
                        <FormattedMessage
                            id="PasswordChecker.subtitle"
                            defaultMessage="Please enter your password to verify it’s you"
                        />
                    }
                    encryptedPassword={encryptedPassword}
                    onMsg={onMsg}
                />
            )
        /* istanbul ignore next */
        default:
            return notReachable(ZealPlatform.OS)
    }
}
