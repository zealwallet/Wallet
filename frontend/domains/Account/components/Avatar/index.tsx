import React from 'react'

import {
    Avatar as UIAvatar,
    AvatarSize,
    Badge as UIBadge,
    BadgeSize,
} from '@zeal/uikit/Avatar'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { CustomLedger } from '@zeal/uikit/Icon/CustomLedger'
import { CustomTrezor } from '@zeal/uikit/Icon/CustomTrezor'
import { FaceIdLogo } from '@zeal/uikit/Icon/FaceIdLogo'
import { SolidStatusKey } from '@zeal/uikit/Icon/SolidStatusKey'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { KeyStore } from '@zeal/domains/KeyStore'

import { Image } from '../Image'

type Props = {
    account: Account
    keystore: KeyStore
    size: AvatarSize
}

export const AvatarWithoutBadge = ({
    account,
    size,
}: {
    size: AvatarSize
    account: Account
}) => (
    <UIAvatar size={size}>
        <Image size={size} account={account} />
    </UIAvatar>
)

export const Avatar = ({ keystore, size, account }: Props) => {
    return (
        <UIAvatar
            size={size}
            rightBadge={({ size }) => <Badge keystore={keystore} size={size} />}
        >
            <Image size={size} account={account} />
        </UIAvatar>
    )
}

const Badge = ({ keystore, size }: { keystore: KeyStore; size: BadgeSize }) => {
    switch (keystore.type) {
        case 'safe_4337':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <FaceIdLogo size={size} color="backgroundDark" />
                </UIBadge>
            )
        case 'track_only':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <BoldEye size={size} color="iconAccent2" />
                </UIBadge>
            )

        case 'private_key_store':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <SolidStatusKey size={size} color="iconAccent2" />
                </UIBadge>
            )

        case 'ledger':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <CustomLedger size={size} />
                </UIBadge>
            )

        case 'secret_phrase_key':
            return null

        case 'trezor':
            return (
                <UIBadge size={size} backgroundColor="surfaceDefault">
                    <CustomTrezor size={size} />
                </UIBadge>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
