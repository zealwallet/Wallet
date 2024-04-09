import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { CloseCross } from '@zeal/uikit/Icon/Actions/CloseCross'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal } from '@zeal/uikit/Modal'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Spinner } from '@zeal/uikit/Spinner'
import { Text } from '@zeal/uikit/Text'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const LoadingLayout = ({ onMsg }: Props) => (
    <Modal>
        <Screen background="light" padding="form">
            <ActionBar
                right={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <CloseCross size={24} color={color} />}
                    </IconButton>
                }
            />
            <Spacer />

            <Column alignX="center" spacing={16}>
                <Spinner size={72} color="iconStatusNeutral" />

                <Text variant="callout" weight="medium" color="textPrimary">
                    <FormattedMessage
                        id="currency.add_custom.token_removed"
                        defaultMessage="Verifying RPC"
                    />
                </Text>
            </Column>

            <Spacer />
        </Screen>
    </Modal>
)
