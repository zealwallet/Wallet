import { FormattedMessage } from 'react-intl'

import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { ConnectedMinimized } from '@zeal/domains/DApp/domains/ConnectionState/features/ConnectedMinimized'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

type Props = {
    installationId: string
    actionSource: ActionSource
    account: Account
    keystore: KeyStore
    state: State
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'on_cancel_confirm_transaction_clicked' }
    | MsgOf<typeof ConnectedMinimized>
    | { type: 'on_minimize_click' }

export type State = { type: 'minimised' } | { type: 'maximised' }

export const Skeleton = ({
    account,
    state,
    keystore,
    actionSource,
    installationId,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'minimised':
            return (
                <ConnectedMinimized
                    installationId={installationId}
                    onMsg={onMsg}
                />
            )

        case 'maximised':
            return (
                <Screen
                    background="light"
                    padding="form"
                    onNavigateBack={() => onMsg({ type: 'on_minimize_click' })}
                >
                    <Column spacing={12} fill>
                        <ActionBar
                            title={null}
                            account={account}
                            actionSource={actionSource}
                            network={null}
                            onMsg={onMsg}
                        />

                        <Content>
                            <Content.Splash
                                onAnimationComplete={null}
                                variant="spinner"
                                title={
                                    <FormattedMessage
                                        id="ConfirmTransaction.Simuation.Skeleton.title"
                                        defaultMessage="Doing safety checks…"
                                    />
                                }
                            />
                        </Content>
                    </Column>
                </Screen>
            )
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
