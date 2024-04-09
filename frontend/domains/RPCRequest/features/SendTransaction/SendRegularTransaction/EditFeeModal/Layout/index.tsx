import React from 'react'
import { useIntl } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { Screen } from '@zeal/uikit/Screen'

import { PollableData } from '@zeal/toolkit/LoadableData/PollableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { NotSigned } from '@zeal/domains/TransactionRequest'
import {
    FeeForecastRequest,
    FeeForecastResponse,
} from '@zeal/domains/Transactions/api/fetchFeeForecast'
import { SimulationResult } from '@zeal/domains/Transactions/domains/SimulatedTransaction/api/fetchSimulation'

import { Custom, Msg as EditCustomPresetMsg } from './Custom'
import { Header } from './Header'
import { Msg as SelectPresetMsg, SelectPreset } from './SelectPreset'

type Props = {
    pollableData: PollableData<FeeForecastResponse, FeeForecastRequest>
    pollingInterval: number
    pollingStartedAt: number
    simulateTransactionResponse: SimulationResult
    nonce: number
    gasEstimate: string
    transactionRequest: NotSigned
    keystoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | SelectPresetMsg
    | EditCustomPresetMsg
    | MsgOf<typeof Header>

export const Layout = ({
    pollableData,
    transactionRequest,
    simulateTransactionResponse,
    nonce,
    gasEstimate,
    onMsg,
    pollingInterval,
    pollingStartedAt,
    keystoreMap,
}: Props) => {
    const { formatMessage } = useIntl()

    return (
        <Screen
            background="light"
            padding="form"
            aria-label={formatMessage({
                id: 'EditFeeModal.ariaLabel',
                defaultMessage: 'Edit network fee',
            })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />

            <Column spacing={16} fill shrink>
                <Header
                    pollableData={pollableData}
                    pollingInterval={pollingInterval}
                    pollingStartedAt={pollingStartedAt}
                    transactionRequest={transactionRequest}
                    onMsg={onMsg}
                />

                <SelectPreset
                    onMsg={onMsg}
                    transactionRequest={transactionRequest}
                    pollableData={pollableData}
                />

                <Custom
                    keyStoreMap={keystoreMap}
                    nonce={nonce}
                    gasEstimate={gasEstimate}
                    transactionRequest={transactionRequest}
                    simulateTransactionResponse={simulateTransactionResponse}
                    pollableData={pollableData}
                    onMsg={onMsg}
                />
            </Column>
        </Screen>
    )
}
