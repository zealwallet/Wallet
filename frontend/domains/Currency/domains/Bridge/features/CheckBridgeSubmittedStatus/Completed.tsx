import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { GroupHeader, Section } from '@zeal/uikit/Group'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { ActionBar as AccountActionBar } from '@zeal/domains/Account/components/ActionBar'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import { BridgeRouteFromListItem } from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteFromListItem'
import {
    HeaderSubtitle,
    HeaderTitle,
} from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteHeader'
import { BridgeRouteToListItem } from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteToListItem'
import { openExplorerLink } from '@zeal/domains/Currency/domains/Bridge/helpers/openExplorerLink'
import { ImperativeError } from '@zeal/domains/Error'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { FancyButton } from '@zeal/domains/Network/components/FancyButton'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

type Props = {
    keystoreMap: KeyStoreMap
    account: Account
    bridgeSubmitted: BridgeSubmitted
    networkMap: NetworkMap
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const Completed = ({
    bridgeSubmitted,
    onMsg,
    account,
    keystoreMap,
    networkMap,
}: Props) => {
    const { formatMessage } = useIntl()
    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.to.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.from.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    const fromNetwork = findNetworkByHexChainId(
        fromCurrency.networkHexChainId,
        networkMap
    )
    const toNetwork = findNetworkByHexChainId(
        toCurrency.networkHexChainId,
        networkMap
    )

    return (
        <Screen padding="form" background="light">
            <AccountActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                network={null}
                account={account}
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                        aria-label={formatMessage({
                            id: 'actions.close',
                            defaultMessage: 'Close',
                        })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={16} fill aria-labelledby="bridge-layout-label">
                <Content
                    header={
                        <Content.Header
                            titleId="bridge-layout-label"
                            title={<HeaderTitle />}
                            subtitle={
                                <HeaderSubtitle
                                    bridgeRoute={bridgeSubmitted.route}
                                />
                            }
                        />
                    }
                    footer={
                        <Progress
                            variant="success"
                            title={
                                <FormattedMessage
                                    id="bridge.check_status.complete"
                                    defaultMessage="Complete"
                                />
                            }
                            right={
                                <IconButton
                                    variant="on_light"
                                    onClick={() =>
                                        openExplorerLink(bridgeSubmitted)
                                    }
                                >
                                    {({ color }) => (
                                        <Row spacing={4} alignX="center">
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textStatusSuccessOnColor"
                                            >
                                                0x
                                            </Text>

                                            <ExternalLink
                                                size={14}
                                                color="textStatusSuccessOnColor"
                                            />
                                        </Row>
                                    )}
                                </IconButton>
                            }
                            initialProgress={100}
                            progress={100}
                        />
                    }
                >
                    <Column spacing={16}>
                        <Section>
                            <GroupHeader
                                left={({ color, textVariant, textWeight }) => (
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="currency.bridge.bridge_from"
                                            defaultMessage="From"
                                        />
                                    </Text>
                                )}
                                right={() => (
                                    <FancyButton
                                        rounded={true}
                                        network={fromNetwork}
                                        onClick={null}
                                    />
                                )}
                            />
                            <BridgeRouteFromListItem
                                bridgeRoute={bridgeSubmitted.route}
                                requestStatus={{ type: 'completed' }}
                                knownCurrencies={
                                    bridgeSubmitted.knownCurrencies
                                }
                            />
                        </Section>
                        <Section>
                            <GroupHeader
                                left={({ color, textVariant, textWeight }) => (
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="currency.bridge.bridge_to"
                                            defaultMessage="To"
                                        />
                                    </Text>
                                )}
                                right={() => (
                                    <FancyButton
                                        rounded={true}
                                        network={toNetwork}
                                        onClick={null}
                                    />
                                )}
                            />
                            <BridgeRouteToListItem
                                bridgeRoute={bridgeSubmitted.route}
                                bridgeStatus={{
                                    refuel: bridgeSubmitted.route.refuel && {
                                        type: 'completed',
                                    },
                                    targetTransaction: { type: 'completed' },
                                }}
                                knownCurrencies={
                                    bridgeSubmitted.knownCurrencies
                                }
                            />
                        </Section>
                    </Column>
                </Content>
                <Actions>
                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        <FormattedMessage
                            id="action.close"
                            defaultMessage="Close"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}

const getCryptoCurrency = ({
    cryptoCurrencyId,
    knownCurrencies,
}: {
    cryptoCurrencyId: CurrencyId
    knownCurrencies: KnownCurrencies
}): CryptoCurrency => {
    const currency = knownCurrencies[cryptoCurrencyId]
    if (!currency) {
        throw new ImperativeError('currency is missing in `knownCurrencies`')
    }

    switch (currency.type) {
        case 'FiatCurrency':
            throw new ImperativeError('Fiat currency can not be here')

        case 'CryptoCurrency':
            return currency
        /* istanbul ignore next */
        default:
            return notReachable(currency)
    }
}
