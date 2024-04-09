import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'

import { TrxMayTakeLongToProceedPriorityFeeLow } from '../FeeForecastWidget/helpers/validation'

type Props = {
    error: TrxMayTakeLongToProceedPriorityFeeLow<SigningKeyStore>
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

export const TrxMayTakeLongToProceedPriorityFeeLowPopup = ({
    error,
    onMsg,
}: Props) => {
    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="TrxMayTakeLongToProceedPriorityFeeLowPopupTitle"
            aria-describedby="TrxMayTakeLongToProceedPriorityFeeLowPopupSubtitle"
        >
            <Header
                icon={({ size }) => (
                    <BoldDangerTriangle
                        size={size}
                        color="iconStatusCritical"
                    />
                )}
                title={
                    <FormattedMessage
                        id="TrxMayTakeLongToProceedPriorityFeeLowPopup.title"
                        defaultMessage="Transaction might take long to complete"
                    />
                }
                titleId="TrxMayTakeLongToProceedPriorityFeeLowPopupTitle"
                subtitle={
                    <FormattedMessage
                        id="TrxMayTakeLongToProceedPriorityFeeLowPopup.subtitle"
                        defaultMessage="Priority Fee is lower than recommended. Increase Priority Fee to speed up transaction."
                    />
                }
                subtitleId="TrxMayTakeLongToProceedPriorityFeeLowPopupSubtitle"
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
