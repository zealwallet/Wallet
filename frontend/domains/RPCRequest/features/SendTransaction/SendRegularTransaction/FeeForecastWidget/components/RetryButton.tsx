import { FormattedMessage } from 'react-intl'

import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

type Props = {
    onClick: () => void
}

export const RetryButton = ({ onClick }: Props) => {
    return (
        <Tertiary size="small" color="on_light" onClick={onClick}>
            {({ color, textVariant, textWeight }) => (
                <Text color={color} variant={textVariant} weight={textWeight}>
                    <FormattedMessage
                        id="action.retry"
                        defaultMessage="Retry"
                    />
                </Text>
            )}
        </Tertiary>
    )
}
