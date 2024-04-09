import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const PriceInfoPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="nfts.allNfts.pricingPopup.title"
                        defaultMessage="NFT Pricing"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="nfts.allNfts.pricingPopup.description"
                        defaultMessage="We price NFTs according to the collection floor price of the last 30 days."
                    />
                }
            />

            <Popup.Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'close' })
                    }}
                >
                    <FormattedMessage
                        id="action.continue"
                        defaultMessage="Continue"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
