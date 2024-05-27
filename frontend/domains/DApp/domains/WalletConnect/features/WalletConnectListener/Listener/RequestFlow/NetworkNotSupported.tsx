import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { NetworkHexId } from '@zeal/domains/Network'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

type Props = {
    account: Account
    networkHexId: NetworkHexId
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof ActionBar> | { type: 'on_wrong_network_accepted' }

export const NetworkNotSupported = ({
    account,
    networkHexId,
    onMsg,
}: Props) => {
    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
        >
            <ActionBar
                title={null}
                account={account}
                actionSource="extension"
                network={null}
                onMsg={onMsg}
            />

            <Column spacing={12} fill>
                <Header
                    title={
                        <FormattedMessage
                            id="UnsupportedMobileNetworkLayout.title"
                            defaultMessage="Network is not supported for mobile version of Zeal"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="UnsupportedMobileNetworkLayout.subtitle"
                            defaultMessage="You can’t make transactions or sign messages on network with id {networkHexId} with mobile version of Zeal yet{br}{br}Switch to browser extension to be able to transact on this network, while we're working hard on adding support for this network 🚀"
                            values={{ networkHexId, br: '\n' }}
                        />
                    }
                    icon={({ size }) => (
                        <BoldDangerTriangle
                            size={size}
                            color="iconStatusWarning"
                        />
                    )}
                />

                <Spacer />

                <Actions>
                    <Button
                        onClick={() =>
                            onMsg({ type: 'on_wrong_network_accepted' })
                        }
                        size="regular"
                        variant="primary"
                    >
                        <FormattedMessage
                            id="UnsupportedMobileNetworkLayout.gotIt"
                            defaultMessage="Got it!"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
