import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { ArrowLeftSquared } from '@zeal/uikit/Icon/ArrowLeftSquared'
import { ArrowRightSquared } from '@zeal/uikit/Icon/ArrowRightSquared'
import { BoldGeneralBank } from '@zeal/uikit/Icon/BoldGeneralBank'
import { BoldStar } from '@zeal/uikit/Icon/BoldStar'
import { BoldSwap } from '@zeal/uikit/Icon/BoldSwap'
import { Bridge as BridgeIcon } from '@zeal/uikit/Icon/Bridge'
import { ForwardIcon } from '@zeal/uikit/Icon/ForwardIcon'
import { Setting } from '@zeal/uikit/Icon/Setting'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import {
    CryptoCurrency,
    CurrencyHiddenMap,
    CurrencyId,
    CurrencyPinMap,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { Network, NetworkMap } from '@zeal/domains/Network'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'
import { Portfolio } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'
import { Token } from '@zeal/domains/Token'
import { ListItem as TokenListItem } from '@zeal/domains/Token/components/ListItem'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

import { HideUnHideButton } from './HideUnHideButton'

type Props = {
    currencyId: CurrencyId | null
    fromAccount: Account
    portfolio: Portfolio | null
    networkMap: NetworkMap
    installationId: string
    customCurrencyMap: CustomCurrencyMap
    currencyHiddenMap: CurrencyHiddenMap
    currencyPinMap: CurrencyPinMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_send_clicked'
          fromAddress: Address
          currencyId: CurrencyId | null
      }
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
    | { type: 'on_receive_selected' }
    | { type: 'on_bank_transfer_selected' }
    | {
          type: 'on_token_settings_click'
          currency: CryptoCurrency
      }
    | { type: 'on_token_pin_click'; currency: CryptoCurrency }
    | { type: 'on_token_un_pin_click'; currency: CryptoCurrency }
    | { type: 'on_token_hide_click'; token: Token }
    | { type: 'on_token_un_hide_click'; token: Token }

type State =
    | { type: 'no_currency_selected' }
    | {
          type: 'currency_selected'
          currency: CryptoCurrency
          network: Network
          portfolioToken: Token | null
      }

const calculateState = ({
    currencyId,
    knownCurrencies,
    networkMap,
    portfolio,
}: {
    currencyId: CurrencyId | null
    knownCurrencies: KnownCurrencies
    networkMap: NetworkMap
    portfolio: Portfolio | null
}): State => {
    if (!currencyId) {
        return { type: 'no_currency_selected' }
    }

    const currency = (currencyId && knownCurrencies[currencyId]) || null

    if (!currency) {
        return { type: 'no_currency_selected' }
    }

    switch (currency.type) {
        case 'FiatCurrency':
            return { type: 'no_currency_selected' }

        case 'CryptoCurrency':
            return {
                type: 'currency_selected',
                currency,
                network: findNetworkByHexChainId(
                    currency.networkHexChainId,
                    networkMap
                ),
                portfolioToken:
                    (portfolio &&
                        portfolio.tokens.find(
                            (portfolioToken) =>
                                portfolioToken.balance.currencyId === currencyId
                        )) ||
                    null,
            }

        default:
            return notReachable(currency)
    }
}

export const Actions = ({
    currencyId,
    portfolio,
    fromAccount,
    networkMap,
    customCurrencyMap,
    currencyHiddenMap,
    currencyPinMap,
    installationId,
    onMsg,
}: Props) => {
    const knownCurrencies = portfolio?.currencies || {}

    const state = calculateState({
        currencyId,
        knownCurrencies,
        networkMap,
        portfolio,
    })

    switch (state.type) {
        case 'no_currency_selected':
            return (
                <Column spacing={12}>
                    <BankTransfer
                        onClick={() =>
                            onMsg({ type: 'on_bank_transfer_selected' })
                        }
                    />

                    <Send
                        onClick={() => {
                            postUserEvent({
                                type: 'SendFlowEnteredEvent',
                                location: 'actions_modal',
                                installationId,
                                asset: 'token',
                            })
                            onMsg({
                                type: 'on_send_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: null,
                            })
                        }}
                    />

                    <Receive
                        onClick={() => {
                            postUserEvent({
                                type: 'ReceiveFlowEnteredEvent',
                                installationId,
                                location: 'actions_modal',
                            })
                            onMsg({ type: 'on_receive_selected' })
                        }}
                    />

                    <Swap
                        onClick={() => {
                            postUserEvent({
                                type: 'SwapFlowEnteredEvent',
                                installationId,
                                location: 'actions_modal',
                            })
                            onMsg({
                                type: 'on_swap_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: null,
                            })
                        }}
                    />

                    <Bridge
                        onClick={() => {
                            postUserEvent({
                                type: 'BridgeFlowEnteredEvent',
                                location: 'actions_modal',
                                installationId,
                            })
                            onMsg({
                                type: 'on_bridge_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: null,
                            })
                        }}
                    />
                </Column>
            )

        case 'currency_selected':
            return (
                <Column spacing={12}>
                    <Column spacing={0}>
                        <ActionBar
                            right={
                                <>
                                    {currencyPinMap[state.currency.id] ? (
                                        <IconButton
                                            variant="on_light"
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_token_un_pin_click',
                                                    currency: state.currency,
                                                })
                                            }}
                                        >
                                            {() => (
                                                <BoldStar
                                                    color="iconStatusWarning"
                                                    size={24}
                                                />
                                            )}
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            variant="on_light"
                                            onClick={() => {
                                                onMsg({
                                                    type: 'on_token_pin_click',
                                                    currency: state.currency,
                                                })
                                            }}
                                        >
                                            {({ color }) => (
                                                <BoldStar
                                                    size={24}
                                                    color={color}
                                                />
                                            )}
                                        </IconButton>
                                    )}
                                    {state.portfolioToken && (
                                        <HideUnHideButton
                                            token={state.portfolioToken}
                                            currencyHiddenMap={
                                                currencyHiddenMap
                                            }
                                            onMsg={onMsg}
                                        />
                                    )}
                                    <IconButton
                                        variant="on_light"
                                        onClick={() => {
                                            onMsg({ type: 'close' })
                                        }}
                                    >
                                        {({ color }) => (
                                            <CloseCross
                                                size={24}
                                                color={color}
                                            />
                                        )}
                                    </IconButton>
                                </>
                            }
                        />
                        {state.portfolioToken && (
                            <Group variant="default">
                                <TokenListItem
                                    currencyHiddenMap={currencyHiddenMap}
                                    currencyPinMap={currencyPinMap}
                                    networkMap={networkMap}
                                    aria-current={false}
                                    token={state.portfolioToken}
                                    knownCurrencies={knownCurrencies}
                                />
                            </Group>
                        )}
                    </Column>

                    <Send
                        onClick={() => {
                            postUserEvent({
                                type: 'SendFlowEnteredEvent',
                                location: 'token_actions_modal',
                                installationId,
                                asset: 'token',
                            })
                            onMsg({
                                type: 'on_send_clicked',
                                fromAddress: fromAccount.address,
                                currencyId: state.currency.id,
                            })
                        }}
                    />

                    <Receive
                        onClick={() => {
                            postUserEvent({
                                type: 'ReceiveFlowEnteredEvent',
                                installationId,
                                location: 'token_actions_modal',
                            })
                            onMsg({ type: 'on_receive_selected' })
                        }}
                    />

                    {(() => {
                        switch (state.network.type) {
                            case 'predefined':
                                return (
                                    <>
                                        <Swap
                                            onClick={() => {
                                                postUserEvent({
                                                    type: 'SwapFlowEnteredEvent',
                                                    installationId,
                                                    location:
                                                        'token_actions_modal',
                                                })
                                                onMsg({
                                                    type: 'on_swap_clicked',
                                                    fromAddress:
                                                        fromAccount.address,
                                                    currencyId:
                                                        state.currency.id,
                                                })
                                            }}
                                        />

                                        <Bridge
                                            onClick={() => {
                                                postUserEvent({
                                                    type: 'BridgeFlowEnteredEvent',
                                                    location:
                                                        'token_actions_modal',
                                                    installationId,
                                                })
                                                onMsg({
                                                    type: 'on_bridge_clicked',
                                                    fromAddress:
                                                        fromAccount.address,
                                                    currencyId:
                                                        state.currency.id,
                                                })
                                            }}
                                        />
                                    </>
                                )

                            case 'custom':
                            case 'testnet':
                                return (
                                    <>
                                        {customCurrencyMap[
                                            state.currency.id
                                        ] && (
                                            <Group variant="default">
                                                <ListItem
                                                    size="regular"
                                                    aria-current={false}
                                                    onClick={() =>
                                                        onMsg({
                                                            type: 'on_token_settings_click',
                                                            currency:
                                                                state.currency,
                                                        })
                                                    }
                                                    avatar={({ size }) => (
                                                        <Setting
                                                            color="iconAccent2"
                                                            size={size}
                                                        />
                                                    )}
                                                    primaryText={
                                                        <FormattedMessage
                                                            id="rpc.send_token.send_or_receive.settings"
                                                            defaultMessage="Settings"
                                                        />
                                                    }
                                                    side={{
                                                        rightIcon: ({
                                                            size,
                                                        }) => (
                                                            <ForwardIcon
                                                                size={size}
                                                                color="iconDefault"
                                                            />
                                                        ),
                                                    }}
                                                />
                                            </Group>
                                        )}
                                    </>
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(state.network)
                        }
                    })()}
                </Column>
            )

        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}

const BankTransfer = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default">
        <ListItem
            size="regular"
            aria-current={false}
            onClick={onClick}
            avatar={({ size }) => (
                <BoldGeneralBank color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.bankTransfer.primaryText"
                    defaultMessage="Bank Transfer"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.bankTransfer.shortText"
                    defaultMessage="Free, instant on-ramp and off-ramp"
                />
            }
        />
    </Group>
)

const Send = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default">
        <ListItem
            size="regular"
            aria-current={false}
            onClick={onClick}
            avatar={({ size }) => (
                <ArrowLeftSquared color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.send.primaryText"
                    defaultMessage="Send"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.send.shortText"
                    defaultMessage="Send tokens or NFTs to any address"
                />
            }
        />
    </Group>
)

const Receive = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default">
        <ListItem
            size="regular"
            aria-current={false}
            onClick={onClick}
            avatar={({ size }) => (
                <ArrowRightSquared color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.receive.primaryText"
                    defaultMessage="Receive"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.receive.shortText"
                    defaultMessage="Receive tokens or NFTs"
                />
            }
        />
    </Group>
)

const Swap = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default">
        <ListItem
            size="regular"
            aria-current={false}
            onClick={onClick}
            avatar={({ size }) => <BoldSwap color="iconAccent2" size={size} />}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.swap.primaryText"
                    defaultMessage="Swap"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.swap.shortText"
                    defaultMessage="Swap between tokens"
                />
            }
        />
    </Group>
)

const Bridge = ({ onClick }: { onClick: () => void }) => (
    <Group variant="default">
        <ListItem
            size="regular"
            aria-current={false}
            onClick={onClick}
            avatar={({ size }) => (
                <BridgeIcon color="iconAccent2" size={size} />
            )}
            primaryText={
                <FormattedMessage
                    id="SendOrReceive.bridge.primaryText"
                    defaultMessage="Bridge"
                />
            }
            shortText={
                <FormattedMessage
                    id="SendOrReceive.bridge.shortText"
                    defaultMessage="Swap between networks or tokens"
                />
            }
        />
    </Group>
)
