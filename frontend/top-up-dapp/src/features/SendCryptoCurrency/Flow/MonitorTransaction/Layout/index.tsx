import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { format } from '@zeal/domains/Address/helpers/format'
import { CryptoCurrency, KnownCurrencies } from '@zeal/domains/Currency'
import { ImperativeError } from '@zeal/domains/Error'
import { SubmitedTransaction } from '@zeal/domains/TransactionRequest/domains/SubmitedTransaction'

import { TransactionProgress } from 'src/features/SendCryptoCurrency/Flow/MonitorTransaction/Layout/TransactionProgress'

import { SuccessSplash } from './SuccessSplash'
import { TransactionContent } from './TransactionContent'

import { ExternalWalletAvatar } from '../../../components/ExternalWalletAvatar'
import { TopUpRequest } from '../../TopUpRequest'

type Props = {
    submittedTransaction: SubmitedTransaction
    knownCurrencies: KnownCurrencies | null
    topUpCurrencies: CryptoCurrency[]
    topUpRequest: TopUpRequest
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_transaction_failed_try_again_clicked' }
    | { type: 'on_transaction_complete_close' }

export const Layout = ({
    topUpRequest,
    knownCurrencies,
    submittedTransaction,
    topUpCurrencies,
    onMsg,
}: Props) => {
    const currency = topUpCurrencies.find(
        (currency) => currency.id === topUpRequest.amount.currencyId
    )

    if (!currency) {
        throw new ImperativeError(
            `Currency ${topUpRequest.amount.currencyId} not found in transaction content`
        )
    }

    return (
        <Screen padding="form" background="light" onNavigateBack={null}>
            <UIActionBar
                left={
                    <Row spacing={8}>
                        <ExternalWalletAvatar
                            fromAccount={topUpRequest.fromAccount}
                            size={24}
                        />

                        <Text
                            variant="paragraph"
                            weight="medium"
                            color="textSecondary"
                        >
                            {format(topUpRequest.fromAccount.address)}
                        </Text>
                    </Row>
                }
            />
            <Column spacing={12} fill>
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="topup.addFundsToZeal"
                                    defaultMessage="Add funds to Zeal"
                                />
                            }
                        />
                    }
                    footer={
                        <TransactionProgress
                            submitedTransaction={submittedTransaction}
                            currency={currency}
                            network={topUpRequest.network}
                            networkRPCMap={{}}
                        />
                    }
                >
                    {(() => {
                        switch (submittedTransaction.state) {
                            case 'queued':
                            case 'included_in_block':
                            case 'replaced':
                                return (
                                    <TransactionContent
                                        knownCurrencies={knownCurrencies}
                                        currency={currency}
                                        topUpRequest={topUpRequest}
                                    />
                                )
                            case 'completed':
                                return (
                                    <SuccessSplash
                                        knownCurrencies={knownCurrencies}
                                        topUpRequest={topUpRequest}
                                        currency={currency}
                                    />
                                )
                            case 'failed':
                                return (
                                    <Content.Splash
                                        onAnimationComplete={null}
                                        variant="error"
                                        title={
                                            <FormattedMessage
                                                id="submittedTransaction.failed.title"
                                                defaultMessage="Transaction failed"
                                            />
                                        }
                                    />
                                )
                            /* istanbul ignore next */
                            default:
                                return notReachable(submittedTransaction)
                        }
                    })()}
                </Content>
                <Actions>
                    <MainCTA
                        submittedTransaction={submittedTransaction}
                        onMsg={onMsg}
                    />
                </Actions>
            </Column>
        </Screen>
    )
}

const MainCTA = ({
    submittedTransaction,
    onMsg,
}: {
    submittedTransaction: SubmitedTransaction
    onMsg: (msg: Msg) => void
}) => {
    switch (submittedTransaction.state) {
        case 'queued':
        case 'included_in_block':
        case 'replaced':
            return null
        case 'completed':
            return (
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({ type: 'on_transaction_complete_close' })
                    }
                >
                    <FormattedMessage
                        id="topup.transaction.complete.close"
                        defaultMessage="Close"
                    />
                </Button>
            )
        case 'failed':
            return (
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({
                            type: 'on_transaction_failed_try_again_clicked',
                        })
                    }
                >
                    <FormattedMessage
                        id="topup.transaction.complete.try-again"
                        defaultMessage="Try again"
                    />
                </Button>
            )
        /* istanbul ignore next */
        default:
            return notReachable(submittedTransaction)
    }
}
