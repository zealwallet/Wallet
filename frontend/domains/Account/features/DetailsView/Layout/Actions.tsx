import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { BoldNewWallet } from '@zeal/uikit/Icon/BoldNewWallet'
import { BoldPaper } from '@zeal/uikit/Icon/BoldPaper'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { SolidStatusKey } from '@zeal/uikit/Icon/SolidStatusKey'
import { ListItem } from '@zeal/uikit/ListItem'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KeyStore, PrivateKey, SecretPhrase } from '@zeal/domains/KeyStore'
import { recoveryKitStatus } from '@zeal/domains/KeyStore/helpers/recoveryKitStatus'

type Props = {
    keystore: KeyStore
    account: Account
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_account_delete_click' }
    | { type: 'on_add_private_key_click' }
    | { type: 'on_show_secret_phrase_click'; keystore: SecretPhrase }
    | {
          type: 'on_recovery_kit_setup'
          keystore: SecretPhrase
          address: Address
      }
    | { type: 'on_show_private_key_click'; keystore: PrivateKey | SecretPhrase }

export const Actions = ({ keystore, account, onMsg }: Props) => {
    switch (keystore.type) {
        case 'safe_4337':
            return (
                <Group variant="default">
                    <Column spacing={8}>
                        <ShowPrivateKey
                            onClick={() =>
                                onMsg({
                                    type: 'on_show_private_key_click',
                                    keystore: keystore.localSignerKeyStore,
                                })
                            }
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column>
                </Group>
            )

        case 'track_only':
            return (
                <Group variant="default">
                    <Column spacing={8}>
                        <ListItem
                            size="regular"
                            aria-current={false}
                            onClick={() =>
                                onMsg({ type: 'on_add_private_key_click' })
                            }
                            avatar={({ size }) => (
                                <BoldNewWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="storage.accountDetails.activateWallet"
                                    defaultMessage="Activate wallet"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column>
                </Group>
            )

        case 'private_key_store':
            return (
                <Group variant="default">
                    <Column spacing={8}>
                        <ShowPrivateKey
                            onClick={() =>
                                onMsg({
                                    type: 'on_show_private_key_click',
                                    keystore,
                                })
                            }
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column>
                </Group>
            )

        case 'trezor':
        case 'ledger':
            return (
                <Group variant="default">
                    <Column spacing={8}>
                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column>
                </Group>
            )

        case 'secret_phrase_key':
            return (
                <Group variant="default">
                    <Column spacing={8}>
                        {(() => {
                            switch (ZealPlatform.OS) {
                                case 'ios':
                                case 'android':
                                    return null
                                case 'web':
                                    return (
                                        <ListItem
                                            size="regular"
                                            aria-current={false}
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_recovery_kit_setup',
                                                    keystore,
                                                    address: account.address,
                                                })
                                            }}
                                            avatar={({ size }) => (
                                                <InfoCircle
                                                    size={size}
                                                    color={(() => {
                                                        const status =
                                                            recoveryKitStatus(
                                                                keystore
                                                            )
                                                        switch (status) {
                                                            case 'configured':
                                                                return 'iconAccent2'
                                                            case 'not_configured':
                                                                return 'iconStatusWarning'
                                                            /* istanbul ignore next */
                                                            default:
                                                                return notReachable(
                                                                    status
                                                                )
                                                        }
                                                    })()}
                                                />
                                            )}
                                            primaryText={
                                                <FormattedMessage
                                                    id="storage.accountDetails.setup_recovery_kit"
                                                    defaultMessage="Recovery Kit"
                                                />
                                            }
                                            side={{
                                                rightIcon: ({ size }) => (
                                                    <ForwardIcon
                                                        size={size}
                                                        color="iconDefault"
                                                    />
                                                ),
                                            }}
                                        />
                                    )
                                /* istanbul ignore next */
                                default:
                                    return notReachable(ZealPlatform.OS)
                            }
                        })()}

                        <ListItem
                            size="regular"
                            aria-current={false}
                            onClick={() => {
                                onMsg({
                                    type: 'on_show_secret_phrase_click',
                                    keystore,
                                })
                            }}
                            avatar={({ size }) => (
                                <BoldPaper size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="storage.accountDetails.viewSsecretPhrase"
                                    defaultMessage="View Secret Phrase"
                                />
                            }
                            side={{
                                rightIcon: ({ size }) => (
                                    <ForwardIcon
                                        size={size}
                                        color="iconDefault"
                                    />
                                ),
                            }}
                        />

                        <ShowPrivateKey
                            onClick={() =>
                                onMsg({
                                    type: 'on_show_private_key_click',
                                    keystore,
                                })
                            }
                        />

                        <Delete
                            onClick={() =>
                                onMsg({ type: 'on_account_delete_click' })
                            }
                        />
                    </Column>
                </Group>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

const Delete = ({ onClick }: { onClick: () => void }) => (
    <ListItem
        size="regular"
        aria-current={false}
        onClick={onClick}
        avatar={({ size }) => <ShieldFail size={size} color="iconAccent2" />}
        primaryText={
            <FormattedMessage
                id="storage.accountDetails.deleteWallet"
                defaultMessage="Remove wallet"
            />
        }
        side={{
            rightIcon: ({ size }) => (
                <ForwardIcon size={size} color="iconDefault" />
            ),
        }}
    />
)

const ShowPrivateKey = ({ onClick }: { onClick: () => void }) => (
    <ListItem
        size="regular"
        aria-current={false}
        onClick={onClick}
        avatar={({ size }) => (
            <SolidStatusKey size={size} color="iconAccent2" />
        )}
        primaryText={
            <FormattedMessage
                id="storage.accountDetails.privateKey"
                defaultMessage="Private Key"
            />
        }
        side={{
            rightIcon: ({ size }) => (
                <ForwardIcon size={size} color="iconDefault" />
            ),
        }}
    />
)
