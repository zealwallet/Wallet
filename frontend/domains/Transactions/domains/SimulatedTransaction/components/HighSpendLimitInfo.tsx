import { FormattedMessage } from 'react-intl'

import { Avatar } from '@zeal/uikit/Avatar'
import { Header } from '@zeal/uikit/Header'
import { BoldShieldCaution } from '@zeal/uikit/Icon/BoldShieldCaution'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const HighSpendLimitInfo = ({ onMsg }: Props) => (
    <Popup.Layout aria-labelledby="high-spend-limit-info" onMsg={onMsg}>
        <Header
            icon={({ size }) => (
                <Avatar
                    size={72}
                    variant="round"
                    backgroundColor="surfaceDefault"
                >
                    <BoldShieldCaution size={size} color="iconStatusWarning" />
                </Avatar>
            )}
            titleId="high-spend-limit-info"
            title={
                <FormattedMessage
                    id="spend-limits.high.modal.title"
                    defaultMessage="High spend limit"
                />
            }
            subtitle={
                <FormattedMessage
                    id="spend-limits.high.modal.text"
                    defaultMessage="Set a spend limit close to the amount of tokens you'll actually use with an app or smart contract. High limits are risky and can make it easier for scammers to steal your tokens."
                />
            }
        />
    </Popup.Layout>
)
