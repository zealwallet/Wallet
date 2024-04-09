import { FormattedMessage } from 'react-intl'

import { formatDistanceToNowStrict } from 'date-fns'

import { Refresh } from '@zeal/uikit/Icon/Refresh'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

type Props = {
    onClick: () => void
    fetchedAt: Date
}

export const LastRefreshed = ({ onClick, fetchedAt }: Props) => {
    return (
        <Row spacing={4}>
            <Text variant="paragraph" weight="regular" color="textSecondary">
                <FormattedMessage
                    id="portfolio.view.lastRefreshed"
                    defaultMessage="Refreshed {date}"
                    values={{
                        date: formatDistanceToNowStrict(fetchedAt, {
                            addSuffix: true,
                            roundingMethod: 'floor',
                        }),
                    }}
                />
            </Text>

            <Spacer />

            <Tertiary color="on_light" size="regular" onClick={onClick}>
                {({ color, textVariant, textWeight }) => (
                    <>
                        <Refresh size={16} color={color} />
                        <Text
                            color={color}
                            variant={textVariant}
                            weight={textWeight}
                        >
                            <FormattedMessage
                                id="account.view.error.refreshAssets"
                                defaultMessage="Refresh"
                            />
                        </Text>
                    </>
                )}
            </Tertiary>
        </Row>
    )
}
