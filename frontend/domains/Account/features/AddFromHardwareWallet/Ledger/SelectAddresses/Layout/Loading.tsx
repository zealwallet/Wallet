import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Avatar } from '@zeal/uikit/Avatar'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { ListItemSkeleton } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { noop } from '@zeal/toolkit'

import { ActionBar, Msg as ActionBarMsg } from './ActionBar'
import { Header, Msg as HeaderMsg } from './Header'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = ActionBarMsg | HeaderMsg

export const Loading = ({ onMsg }: Props) => {
    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar onMsg={onMsg} />
            <Column spacing={24}>
                <Header />
                <Group variant="default">
                    <ListItemSkeleton
                        avatar={({ size }) => (
                            <Avatar size={size} border="borderSecondary">
                                <Text
                                    variant="caption1"
                                    weight="medium"
                                    color="textPrimary"
                                    align="center"
                                >
                                    {1}
                                </Text>
                            </Avatar>
                        )}
                        shortText
                    />
                </Group>
            </Column>
            <Spacer />
            <Actions>
                <Button
                    disabled
                    size="regular"
                    variant="primary"
                    onClick={noop}
                >
                    <FormattedMessage
                        id="ledger.select_account.path_settings"
                        defaultMessage={`{count, plural,
              =0 {No wallets selected}
              one {Import wallet}
              other {Import {count} wallets}}`}
                        values={{
                            count: 0,
                        }}
                    />
                </Button>
            </Actions>
        </Screen>
    )
}
