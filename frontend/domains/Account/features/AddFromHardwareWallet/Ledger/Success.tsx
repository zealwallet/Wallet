import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_accounts_create_success_animation_finished'
}

export const Success = ({ onMsg }: Props) => {
    return (
        <SuccessLayout
            onAnimationComplete={() =>
                onMsg({
                    type: 'on_accounts_create_success_animation_finished',
                })
            }
            title={
                <FormattedMessage
                    id="account.add_from_ledger.success"
                    defaultMessage="Wallets added to Zeal"
                />
            }
        />
    )
}
