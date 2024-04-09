import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldDownload } from '@zeal/uikit/Icon/BoldDownload'
import { BoldGeneralBank } from '@zeal/uikit/Icon/BoldGeneralBank'
import { BoldWallet } from '@zeal/uikit/Icon/BoldWallet'
import { ExternalWallets } from '@zeal/uikit/Icon/ExternalWallets'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { Account } from '@zeal/domains/Account'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    account: Account
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | { type: 'bank_transfer_click' }
    | { type: 'receive_click' }
    | { type: 'from_any_wallet_click'; account: Account }

export const Layout = ({ onMsg, account, installationId }: Props) => {
    return (
        <Popup.Layout background="backgroundLight" onMsg={onMsg}>
            <Column spacing={0}>
                <ActionBar
                    right={
                        <IconButton
                            variant="on_light"
                            onClick={() => onMsg({ type: 'close' })}
                        >
                            {({ color }) => (
                                <CloseCross size={24} color={color} />
                            )}
                        </IconButton>
                    }
                />
                <Header
                    title={
                        <FormattedMessage
                            id="add_funds.title"
                            defaultMessage="Add Assets"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="add_funds.subtitle"
                            defaultMessage="Add assets to your wallet so you can make transactions."
                        />
                    }
                />
            </Column>
            <Popup.Content>
                <Column spacing={8}>
                    <Group variant="default">
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
                                            avatar={({ size }) => (
                                                <BoldWallet
                                                    size={size}
                                                    color="iconAccent2"
                                                />
                                            )}
                                            primaryText={
                                                <FormattedMessage
                                                    id="add_funds.any_wallet"
                                                    defaultMessage="From another wallet"
                                                />
                                            }
                                            side={{
                                                rightIcon: () => (
                                                    <ExternalWallets />
                                                ),
                                            }}
                                            onClick={() => {
                                                postUserEvent({
                                                    type: 'AddFundsFromAnyWalletEvent',
                                                    installationId,
                                                })
                                                onMsg({
                                                    type: 'from_any_wallet_click',
                                                    account,
                                                })
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
                            avatar={({ size }) => (
                                <BoldGeneralBank
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="add_funds.bank_transfer"
                                    defaultMessage="From bank account"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="add_funds.bank_transfer_subtitle"
                                    defaultMessage="Free & instant bank transfers"
                                />
                            }
                            onClick={() =>
                                onMsg({ type: 'bank_transfer_click' })
                            }
                        />

                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldDownload size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="add_funds.receive"
                                    defaultMessage="Show your wallet address"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="add_funds.receive_sort_text"
                                    defaultMessage="Receive assets to your address"
                                />
                            }
                            onClick={() => {
                                postUserEvent({
                                    type: 'ReceiveFlowEnteredEvent',
                                    installationId,
                                    location: 'add_funds_modal',
                                })
                                onMsg({ type: 'receive_click' })
                            }}
                        />
                    </Group>
                </Column>
            </Popup.Content>
        </Popup.Layout>
    )
}
