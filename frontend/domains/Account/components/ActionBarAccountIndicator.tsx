import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { format } from '@zeal/domains/Address/helpers/format'

type Props = {
    account: Account
}

// TODO: maybe this is not needed because we can always switch account?
export const ActionBarAccountIndicator = ({ account }: Props) => (
    <Row grow shrink spacing={8}>
        <AccountAvatar size={24} account={account} />

        <Text variant="footnote" color="textPrimary" weight="regular" ellipsis>
            {account.label}
        </Text>
        <Row spacing={0}>
            <Text variant="footnote" color="textSecondary" weight="regular">
                {format(account.address)}
            </Text>
        </Row>
    </Row>
)
