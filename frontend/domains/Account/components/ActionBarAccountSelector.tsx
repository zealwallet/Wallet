import { ArrowDown } from '@zeal/uikit/Icon/ArrowDown'
import { Row } from '@zeal/uikit/Row'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format } from '@zeal/domains/Address/helpers/format'

type Props = {
    account: Account
    onMsg: (_: Msg) => void
}

type Msg = {
    type: 'account_filter_click'
}

export const ActionBarAccountSelector = ({ account, onMsg }: Props) => (
    <Row grow shrink spacing={8}>
        <Tertiary
            onClick={() => onMsg({ type: 'account_filter_click' })}
            size="regular"
            color="on_light"
        >
            {({ color }) => (
                <>
                    <AccountAvatar size={24} account={account} />
                    <Row spacing={0} shrink>
                        <Text
                            variant="footnote"
                            color="textPrimary"
                            weight="regular"
                            ellipsis
                        >
                            {account.label}
                        </Text>
                    </Row>

                    <Row spacing={0}>
                        <Text
                            variant="footnote"
                            color="textSecondary"
                            weight="regular"
                        >
                            {format(account.address)}
                        </Text>
                    </Row>

                    <ArrowDown size={16} color={color} />
                </>
            )}
        </Tertiary>
    </Row>
)
