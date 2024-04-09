import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

type Props = {
    onSuccess: () => void
}

export const Success = ({ onSuccess }: Props) => {
    return (
        <SuccessLayout
            onAnimationComplete={onSuccess}
            title={
                <FormattedMessage
                    id="password.add.success.title"
                    defaultMessage="Password created 🔥"
                />
            }
        />
    )
}
