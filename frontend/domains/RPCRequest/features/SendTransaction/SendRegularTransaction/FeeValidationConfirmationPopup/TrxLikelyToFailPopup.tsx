import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'

import { TrxLikelyToFail } from '../FeeForecastWidget/helpers/validation'

type Props = {
    error: TrxLikelyToFail<SigningKeyStore>
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

const Title = ({ reason }: { reason: Props['error']['reason'] }) => {
    switch (reason) {
        case 'less_than_estimated_gas':
            return (
                <FormattedMessage
                    id="TrxLikelyToFailPopup.less_them_estimated_gas.title"
                    defaultMessage="Transaction will fail"
                />
            )

        case 'less_than_suggested_gas':
            return (
                <FormattedMessage
                    id="TrxLikelyToFailPopup.less_than_suggested_gas.title"
                    defaultMessage="Transaction is likely to fail"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(reason)
    }
}

const Subtitle = ({ reason }: { reason: Props['error']['reason'] }) => {
    switch (reason) {
        case 'less_than_suggested_gas':
            return (
                <FormattedMessage
                    id="TrxLikelyToFailPopup.less_than_suggested_gas.subtitle"
                    defaultMessage="Transaction Gas Limit is too low. Increase Gas Limit to suggested limit to prevent failure."
                />
            )

        case 'less_than_estimated_gas':
            return (
                <FormattedMessage
                    id="TrxLikelyToFailPopup.less_them_estimated_gas.subtitle"
                    defaultMessage="Gas Limit is lower than estimated gas. Increase Gas Limit to suggested limit."
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(reason)
    }
}

export const TrxLikelyToFailPopup = ({ error, onMsg }: Props) => {
    const labelId = `${error.type}_${error.reason}_label`
    const descrId = `${error.type}_${error.reason}_descr`
    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby={labelId}
            aria-describedby={descrId}
        >
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle
                        size={size}
                        color="iconStatusCritical"
                    />
                )}
                title={<Title reason={error.reason} />}
                subtitle={<Subtitle reason={error.reason} />}
                titleId={labelId}
                subtitleId={descrId}
            />

            <Popup.Actions>
                <Button
                    size="regular"
                    variant="primary"
                    onClick={() => onMsg({ type: 'close' })}
                >
                    <FormattedMessage
                        id="UserConfirmationPopup.goBack"
                        defaultMessage="Cancel"
                    />
                </Button>

                <Button
                    size="regular"
                    variant="secondary"
                    onClick={() =>
                        onMsg({
                            type: 'user_confirmed_transaction_for_signing',
                            transactionRequest: error.simulated,
                            keyStore: error.keystore,
                        })
                    }
                >
                    <FormattedMessage
                        id="UserConfirmationPopup.submit"
                        defaultMessage="Submit anyway"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
