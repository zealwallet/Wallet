import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Popup } from '@zeal/uikit/Popup'

import { SigningKeyStore } from '@zeal/domains/KeyStore'
import { Simulated } from '@zeal/domains/TransactionRequest'

import { TrxMayTakeLongToProceedBaseFeeLow } from '../FeeForecastWidget/helpers/validation'

type Props = {
    error: TrxMayTakeLongToProceedBaseFeeLow<SigningKeyStore>
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'user_confirmed_transaction_for_signing'
          transactionRequest: Simulated
          keyStore: SigningKeyStore
      }

export const TrxMayTakeLongToProceedBaseFeeLowPopup = ({
    error,
    onMsg,
}: Props) => {
    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="TrxMayTakeLongToProceedBaseFeeLowPopupTitle"
            aria-describedby="TrxMayTakeLongToProceedBaseFeeLowPopupSubtitle"
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
                        id="TrxMayTakeLongToProceedBaseFeeLowPopup.title"
                        defaultMessage="Transaction will get stuck"
                    />
                }
                titleId="TrxMayTakeLongToProceedBaseFeeLowPopupTitle"
                subtitle={
                    <FormattedMessage
                        id="TrxMayTakeLongToProceedBaseFeeLowPopup.subtitle"
                        defaultMessage="Max Base Fee is lower than current base fee. Increase Max Base Fee to prevent transaction from getting stuck."
                    />
                }
                subtitleId="TrxMayTakeLongToProceedBaseFeeLowPopupSubtitle"
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
