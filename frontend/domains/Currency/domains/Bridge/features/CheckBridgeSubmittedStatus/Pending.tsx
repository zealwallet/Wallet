import { useEffect } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { GroupHeader, Section } from '@zeal/uikit/Group'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { Progress } from '@zeal/uikit/Progress'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { useCurrentTimestamp } from '@zeal/toolkit/Date/useCurrentTimestamp'
import { useReadableDuration } from '@zeal/toolkit/Date/useReadableDuration'
import { usePollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { RangeInt } from '@zeal/toolkit/Range'

import { Account } from '@zeal/domains/Account'
import { ActionBar as AccountActionBar } from '@zeal/domains/Account/components/ActionBar'
import {
    CryptoCurrency,
    CurrencyId,
    KnownCurrencies,
} from '@zeal/domains/Currency'
import {
    BridgeSubmitted,
    BridgeSubmittedPollable,
    RequestState,
} from '@zeal/domains/Currency/domains/Bridge'
import { fetchBridgeRequestStatus } from '@zeal/domains/Currency/domains/Bridge/api/fetchBridgeRequestStatus'
import { BridgeRouteFromListItem } from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteFromListItem'
import {
    HeaderSubtitle,
    HeaderTitle,
} from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteHeader'
import { BridgeRouteToListItem } from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteToListItem'
import { openExplorerLink } from '@zeal/domains/Currency/domains/Bridge/helpers/openExplorerLink'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { NetworkMap } from '@zeal/domains/Network'
import { FancyButton } from '@zeal/domains/Network/components/FancyButton'
import { findNetworkByHexChainId } from '@zeal/domains/Network/constants'

type Props = {
    networkMap: NetworkMap
    account: Account
    keystoreMap: KeyStoreMap
    bridgeSubmitted: BridgeSubmitted
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' } | { type: 'bridge_completed' }

export const Pending = ({
    bridgeSubmitted,
    keystoreMap,
    account,
    networkMap,
    onMsg,
}: Props) => {
    const { formatMessage } = useIntl()
    const formatHumanReadableDuration = useReadableDuration()
    const useLiveMsg = useLiveRef(onMsg)
    const [pollable] = usePollableData(
        fetchBridgeRequestStatus,
        {
            type: 'loaded',
            params: {
                request: bridgeSubmitted,
            },
            data: {
                refuel: bridgeSubmitted.route.refuel
                    ? { type: 'pending' as const }
                    : null,
                targetTransaction: { type: 'pending' as const },
            },
        },
        {
            pollIntervalMilliseconds: 10_000,
        }
    )

    const now = useCurrentTimestamp({ refreshIntervalMs: 1000 })

    const timePassed = now - bridgeSubmitted.submittedAtMS
    const progressPercentage =
        (timePassed / bridgeSubmitted.route.serviceTimeMs) * 100

    const roundedProgressPercentage = Math.round(progressPercentage)

    const timePassedPercentage: RangeInt<0, 100> = Math.min(
        100,
        Math.max(0, roundedProgressPercentage)
    ) as RangeInt<0, 100>

    useEffect(() => {
        switch (pollable.type) {
            case 'loading':
                return
            case 'error':
                captureError(pollable.error)
                return
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
                switch (pollable.data.targetTransaction.type) {
                    case 'pending':
                    case 'not_started':
                        return
                    case 'completed':
                        if (!bridgeSubmitted.route.refuel) {
                            useLiveMsg.current({ type: 'bridge_completed' })
                            return
                        }
                        if (!pollable.data.refuel) {
                            return
                        }

                        switch (pollable.data.refuel.type) {
                            case 'pending':
                            case 'not_started':
                                return
                            case 'completed':
                                useLiveMsg.current({ type: 'bridge_completed' })
                                return
                            /* istanbul ignore next */
                            default:
                                return notReachable(pollable.data.refuel.type)
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(
                            pollable.data.targetTransaction.type
                        )
                }
            /* istanbul ignore next */
            default:
                return notReachable(pollable)
        }
    }, [pollable, bridgeSubmitted, useLiveMsg])

    const toCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.to.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    const fromCurrency = getCryptoCurrency({
        cryptoCurrencyId: bridgeSubmitted.route.from.currencyId,
        knownCurrencies: bridgeSubmitted.knownCurrencies,
    })

    switch (pollable.type) {
        case 'loading':
        case 'error':
            throw new ImperativeError('impossible loading state')
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return (
                <Screen
                    padding="form"
                    background="light"
                    onNavigateBack={() => onMsg({ type: 'close' })}
                >
                    <AccountActionBar
                        keystore={getKeyStore({
                            keyStoreMap: keystoreMap,
                            address: account.address,
                        })}
                        network={null}
                        account={account}
                        left={
                            <IconButton
                                variant="on_light"
                                onClick={() => onMsg({ type: 'close' })}
                                aria-label={formatMessage({
                                    id: 'actions.close',
                                    defaultMessage: 'Close',
                                })}
                            >
                                {({ color }) => (
                                    <BackIcon size={24} color={color} />
                                )}
                            </IconButton>
                        }
                    />
                    <Content
                        header={
                            <Content.Header
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
                                variant="neutral"
                                title={
                                    <FormattedMessage
                                        id="bridge.check_status.progress_text"
                                        defaultMessage="Bridging {from} to {to}"
                                        values={{
                                            from: fromCurrency.symbol,
                                            to: toCurrency.symbol,
                                        }}
                                    />
                                }
                                right={
                                    <Row spacing={4} alignX="center">
                                        <Text
                                            variant="paragraph"
                                            weight="regular"
                                            color="textStatusNeutralOnColor"
                                        >
                                            {`${formatHumanReadableDuration(
                                                now -
                                                    bridgeSubmitted.submittedAtMS,
                                                'floor'
                                            )} / ${formatHumanReadableDuration(
                                                bridgeSubmitted.route
                                                    .serviceTimeMs
                                            )}`}
                                        </Text>

                                        <IconButton
                                            variant="on_light"
                                            size="small"
                                            onClick={() =>
                                                openExplorerLink(
                                                    bridgeSubmitted
                                                )
                                            }
                                        >
                                            {({ color }) => (
                                                <Row
                                                    spacing={4}
                                                    alignX="center"
                                                >
                                                    <Text
                                                        variant="paragraph"
                                                        weight="regular"
                                                        color="textStatusNeutralOnColor"
                                                    >
                                                        0x
                                                    </Text>

                                                    <ExternalLink
                                                        size={14}
                                                        color="textStatusNeutralOnColor"
                                                    />
                                                </Row>
                                            )}
                                        </IconButton>
                                    </Row>
                                }
                                initialProgress={0}
                                progress={timePassedPercentage}
                            />
                        }
                    >
                        <Column spacing={16}>
                            <Section>
                                <GroupHeader
                                    left={({
                                        color,
                                        textVariant,
                                        textWeight,
                                    }) => (
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
                                            network={findNetworkByHexChainId(
                                                fromCurrency.networkHexChainId,
                                                networkMap
                                            )}
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
                                    left={({
                                        color,
                                        textVariant,
                                        textWeight,
                                    }) => (
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
                                            network={findNetworkByHexChainId(
                                                toCurrency.networkHexChainId,
                                                networkMap
                                            )}
                                            onClick={null}
                                        />
                                    )}
                                />
                                <BridgeRouteToListItem
                                    bridgeRoute={bridgeSubmitted.route}
                                    bridgeStatus={{
                                        targetTransaction:
                                            getRequestStatus(pollable),
                                        refuel:
                                            bridgeSubmitted.route.refuel &&
                                            getRefuelStatus(pollable),
                                    }}
                                    knownCurrencies={
                                        bridgeSubmitted.knownCurrencies
                                    }
                                />
                            </Section>
                        </Column>
                    </Content>
                </Screen>
            )

        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const getRequestStatus = (pollable: BridgeSubmittedPollable): RequestState => {
    switch (pollable.type) {
        case 'loading':
        case 'error':
            return { type: 'pending' }
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            return pollable.data.targetTransaction
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
}

const getRefuelStatus = (pollable: BridgeSubmittedPollable): RequestState => {
    switch (pollable.type) {
        case 'loading':
        case 'error':
            return { type: 'pending' }
        case 'loaded':
        case 'reloading':
        case 'subsequent_failed':
            if (!pollable.data.refuel) {
                return { type: 'pending' }
            }
            return pollable.data.refuel
        /* istanbul ignore next */
        default:
            return notReachable(pollable)
    }
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
