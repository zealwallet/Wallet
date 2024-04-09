import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { Lending } from '@zeal/domains/App'

type Props = {
    protocol: Lending
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'close' }

export const HealthRateInfoPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="app.position_details.health_rate.title"
                        defaultMessage="Health rate?"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="app.position_details.health_rate.description"
                        defaultMessage="The health is calculated by dividing the amount of your loan by the value of your collateral."
                    />
                }
            />
        </Popup.Layout>
    )
}
