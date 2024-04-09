import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { BoldSwap } from '@zeal/uikit/Icon/BoldSwap'
import { Bridge } from '@zeal/uikit/Icon/Bridge'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { Address } from '@zeal/domains/Address'
import { CurrencyId } from '@zeal/domains/Currency'

type Props = {
    state: State
    address: Address
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_swap_clicked'
          fromAddress: Address
          currencyId: CurrencyId | null
      }
    | {
          type: 'on_bridge_clicked'
          fromAddress: Address
          currencyId: CurrencyId | null
      }

export type State = { type: 'closed' } | { type: 'choose_swap_bridge' }

export const Modal = ({ onMsg, address, state }: Props) => {
    switch (state.type) {
        case 'closed':
            return null
        case 'choose_swap_bridge':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <ActionBar
                        left={
                            <ActionBar.Header>
                                <FormattedMessage
                                    id="exchange.title"
                                    defaultMessage="Exchange"
                                />
                            </ActionBar.Header>
                        }
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
                    <Popup.Content>
                        <Column spacing={8}>
                            <Group variant="default">
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <BoldSwap
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="add_funds.bank_transfer"
                                            defaultMessage="Swap"
                                        />
                                    }
                                    shortText={
                                        <FormattedMessage
                                            id="SendOrReceive.swap.shortText"
                                            defaultMessage="Swap between tokens"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_swap_clicked',
                                            fromAddress: address,
                                            currencyId: null,
                                        })
                                    }
                                />
                            </Group>
                            <Group variant="default">
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <Bridge
                                            size={size}
                                            color="iconAccent2"
                                        />
                                    )}
                                    primaryText={
                                        <FormattedMessage
                                            id="add_funds.bank_transfer"
                                            defaultMessage="Bridge"
                                        />
                                    }
                                    shortText={
                                        <FormattedMessage
                                            id="SendOrReceive.bridge.shortText"
                                            defaultMessage="Swap between networks or tokens"
                                        />
                                    }
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_bridge_clicked',
                                            fromAddress: address,
                                            currencyId: null,
                                        })
                                    }
                                />
                            </Group>
                        </Column>
                    </Popup.Content>
                </Popup.Layout>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
