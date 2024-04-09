import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const ApprovalInfo = ({ onMsg }: Props) => (
    <Popup.Layout aria-labelledby="what-are-approvals" onMsg={onMsg}>
        <Header
            titleId="what-are-approvals"
            title={
                <FormattedMessage
                    id="simulation.approval.modal.title"
                    defaultMessage="What are Approvals?"
                />
            }
            subtitle={
                <FormattedMessage
                    id="simulation.approval.modal.text"
                    defaultMessage="When you accept an approval you are giving permission for or a specific app/smart contract to use your tokens or NFTs in future transactions."
                />
            }
        />
    </Popup.Layout>
)
