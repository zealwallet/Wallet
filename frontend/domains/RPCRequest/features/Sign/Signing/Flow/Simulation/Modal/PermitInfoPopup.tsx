import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const PermitInfoPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout onMsg={onMsg} aria-labelledby="permit-info-title">
            <Header
                titleId="permit-info-title"
                title={
                    <FormattedMessage
                        id="permit-info.modal.title"
                        defaultMessage="What are Permits?"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="permit-info.modal.description"
                        defaultMessage="Permits are requests that if signed, allow apps to move your tokens on your behalf, for example, to make a swap.{br}Permits are similar to Approvals but they don’t cost you any network fees to sign."
                        values={{
                            br: '\n\n',
                        }}
                    />
                }
            />
        </Popup.Layout>
    )
}
