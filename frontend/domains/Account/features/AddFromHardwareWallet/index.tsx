import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { CustomLedger } from '@zeal/uikit/Icon/CustomLedger'
import { CustomTrezor } from '@zeal/uikit/Icon/CustomTrezor'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { values } from '@zeal/toolkit/Object'

import { AccountsMap } from '@zeal/domains/Account'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NetworkMap, NetworkRPCMap } from '@zeal/domains/Network'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

import { AddFromTrezor } from './AddFromTrezor'
import { Ledger } from './Ledger'

type Props = {
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string
    customCurrencies: CustomCurrencyMap
    networkMap: NetworkMap
    networkRPCMap: NetworkRPCMap
    currencyHiddenMap: CurrencyHiddenMap
    closable: boolean
    onMsg: (msg: Msg) => void
}

type State =
    | { type: 'select_type_of_wallet' }
    | { type: 'ledger_flow' }
    | { type: 'trezor_flow' }

export type Msg =
    | { type: 'close' }
    | Extract<
          MsgOf<typeof Ledger>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >
    | Extract<
          MsgOf<typeof AddFromTrezor>,
          {
              type:
                  | 'on_account_create_request'
                  | 'on_accounts_create_success_animation_finished'
          }
      >

export const AddFromHardwareWallet = ({
    accounts,
    keystoreMap,
    customCurrencies,
    sessionPassword,
    networkMap,
    networkRPCMap,
    closable,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'select_type_of_wallet' })

    switch (state.type) {
        case 'select_type_of_wallet':
            return (
                <Screen background="light" padding="form">
                    <ActionBar
                        left={
                            closable && (
                                <IconButton
                                    variant="on_light"
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            )
                        }
                    />

                    <Column spacing={24}>
                        <Header
                            title={
                                <FormattedMessage
                                    id="AddFromHardwareWallet.title"
                                    defaultMessage="Hardware Wallet"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="AddFromHardwareWallet.subtitle"
                                    defaultMessage="Select your hardware wallet to connect to Zeal"
                                />
                            }
                        />

                        <Group variant="default">
                            <ListItem
                                size="regular"
                                aria-current={false}
                                avatar={({ size }) => (
                                    <CustomLedger
                                        color="iconAccent2"
                                        size={size}
                                    />
                                )}
                                onClick={() =>
                                    setState({ type: 'ledger_flow' })
                                }
                                primaryText="Ledger"
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                            />

                            <ListItem
                                size="regular"
                                aria-current={false}
                                avatar={({ size }) => (
                                    <CustomTrezor
                                        color="iconAccent2"
                                        size={size}
                                    />
                                )}
                                onClick={() =>
                                    setState({ type: 'trezor_flow' })
                                }
                                primaryText="Trezor"
                                side={{
                                    rightIcon: ({ size }) => (
                                        <ForwardIcon
                                            size={size}
                                            color="iconDefault"
                                        />
                                    ),
                                }}
                            />
                        </Group>
                    </Column>
                </Screen>
            )

        case 'ledger_flow':
            return (
                <Ledger
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    sessionPassword={sessionPassword}
                    accounts={values(accounts)}
                    keystoreMap={keystoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'close':
                                setState({ type: 'select_type_of_wallet' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        case 'trezor_flow':
            return (
                <AddFromTrezor
                    currencyHiddenMap={currencyHiddenMap}
                    networkMap={networkMap}
                    networkRPCMap={networkRPCMap}
                    customCurrencies={customCurrencies}
                    accounts={values(accounts)}
                    keystoreMap={keystoreMap}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'on_account_create_request':
                            case 'on_accounts_create_success_animation_finished':
                                onMsg(msg)
                                break

                            case 'close':
                                setState({ type: 'select_type_of_wallet' })
                                break

                            /* istanbul ignore next */
                            default:
                                notReachable(msg)
                        }
                    }}
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
