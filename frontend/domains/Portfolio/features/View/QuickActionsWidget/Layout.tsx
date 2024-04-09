import React from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { ActionButton } from '@zeal/uikit/ActionButton'
import { BoldAdd } from '@zeal/uikit/Icon/BoldAdd'
import { BoldGeneralBank } from '@zeal/uikit/Icon/BoldGeneralBank'
import { Bridge } from '@zeal/uikit/Icon/Bridge'
import { LightSend } from '@zeal/uikit/Icon/LightSend'
import { Row } from '@zeal/uikit/Row'

import { Address } from '@zeal/domains/Address'

type Props = {
    address: Address
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_add_funds_click' }
    | {
          type: 'on_send_clicked'
          currencyId: string | null
          fromAddress: string
      }
    | { type: 'on_bank_clicked' }
    | {
          type: 'on_exchange_clicked'
          currencyId: string | null
          fromAddress: string
      }

export const Layout = ({ onMsg, address }: Props) => {
    const { formatMessage } = useIntl()
    return (
        <Row spacing={8}>
            <ActionButton
                onClick={() =>
                    onMsg({
                        type: 'on_add_funds_click',
                    })
                }
                title={
                    <FormattedMessage
                        id="portfolio.quick-actions.add_assets"
                        defaultMessage="Add assets"
                    />
                }
                aria-label={formatMessage({
                    id: 'portfolio.quick-actions.add_assets',
                    defaultMessage: 'Add assets',
                })}
            >
                {({ color, size }) => <BoldAdd color={color} size={size} />}
            </ActionButton>
            <ActionButton
                onClick={() => {
                    onMsg({
                        type: 'on_send_clicked',
                        fromAddress: address,
                        currencyId: null,
                    })
                }}
                title={
                    <FormattedMessage
                        id="portfolio.quick-actions.send"
                        defaultMessage="Send"
                    />
                }
                aria-label={formatMessage({
                    id: 'portfolio.quick-actions.send',
                    defaultMessage: 'Send',
                })}
            >
                {({ color, size }) => <LightSend color={color} size={size} />}
            </ActionButton>
            <ActionButton
                onClick={() => {
                    onMsg({
                        type: 'on_exchange_clicked',
                        fromAddress: address,
                        currencyId: null,
                    })
                }}
                title={
                    <FormattedMessage
                        id="portfolio.quick-actions.exchange"
                        defaultMessage="Exchange"
                    />
                }
                aria-label={formatMessage({
                    id: 'portfolio.quick-actions.exchange',
                    defaultMessage: 'Exchange',
                })}
            >
                {({ color, size }) => <Bridge color={color} size={size} />}
            </ActionButton>

            <ActionButton
                onClick={() => {
                    onMsg({ type: 'on_bank_clicked' })
                }}
                title={
                    <FormattedMessage
                        id="portfolio.quick-actions.bank"
                        defaultMessage="Bank"
                    />
                }
                aria-label={formatMessage({
                    id: 'portfolio.quick-actions.bank',
                    defaultMessage: 'Bank',
                })}
            >
                {({ color, size }) => (
                    <BoldGeneralBank color={color} size={size} />
                )}
            </ActionButton>
        </Row>
    )
}
