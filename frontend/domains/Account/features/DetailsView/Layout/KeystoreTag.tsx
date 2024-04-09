import React from 'react'
import { FormattedMessage } from 'react-intl'

import { BoldPaper } from '@zeal/uikit/Icon/BoldPaper'
import { BoldUser } from '@zeal/uikit/Icon/BoldUser'
import { CustomLedger } from '@zeal/uikit/Icon/CustomLedger'
import { CustomTrezor } from '@zeal/uikit/Icon/CustomTrezor'
import { FaceIdLogo } from '@zeal/uikit/Icon/FaceIdLogo'
import { SolidStatusKey } from '@zeal/uikit/Icon/SolidStatusKey'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { KeyStore } from '@zeal/domains/KeyStore'

type Props = { keystore: KeyStore }

export const KeyStoreTag = ({ keystore }: Props) => {
    switch (keystore.type) {
        case 'safe_4337':
            return (
                <Row spacing={4}>
                    <FaceIdLogo size={16} color="backgroundDark" />
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.safe"
                            defaultMessage="Smart"
                        />
                    </Text>
                </Row>
            )

        case 'track_only':
            return (
                <Row spacing={4}>
                    <BoldUser size={15} color="iconAccent2" />
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.viewOnly"
                            defaultMessage="Tracked"
                        />
                    </Text>
                </Row>
            )

        case 'private_key_store':
            return (
                <Row spacing={4}>
                    <SolidStatusKey size={16} color="iconAccent2" />
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.privateKey"
                            defaultMessage="Private Key"
                        />
                    </Text>
                </Row>
            )

        case 'ledger':
            return (
                <Row spacing={4}>
                    <CustomLedger size={16} />
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.hardwareWallet"
                            defaultMessage="Hardware Wallet"
                        />
                    </Text>
                </Row>
            )

        case 'trezor':
            return (
                <Row spacing={4}>
                    <CustomTrezor size={16} />
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.hardwareWallet"
                            defaultMessage="Hardware Wallet"
                        />
                    </Text>
                </Row>
            )

        case 'secret_phrase_key':
            return (
                <Row spacing={4}>
                    <BoldPaper size={16} color="iconAccent2" />
                    <Text
                        variant="caption1"
                        weight="regular"
                        color="textSecondary"
                    >
                        <FormattedMessage
                            id="account.details.keystoreType.secretPhrase"
                            defaultMessage="Secret Phrase"
                        />
                    </Text>
                </Row>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}
