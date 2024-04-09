import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldDangerTriangle } from '@zeal/uikit/Icon/BoldDangerTriangle'
import { IconButton } from '@zeal/uikit/IconButton'
import { Modal } from '@zeal/uikit/Modal'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Network } from '@zeal/domains/Network'

import { SafetyWarning } from './SafetyWarning'

export type Props = {
    initialRPCUrl: string | null
    rpcUrl: string
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'try_again_clicked' }
    | MsgOf<typeof SafetyWarning>

export type State = { type: 'cannot_verify' } | { type: 'safety_warning' }

export const CannotVerify = ({
    initialRPCUrl,
    rpcUrl,
    network,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'cannot_verify' })

    switch (state.type) {
        case 'cannot_verify':
            return (
                <Modal>
                    <Screen background="light" padding="form">
                        <ActionBar
                            left={
                                <IconButton
                                    variant="on_light"
                                    onClick={() => onMsg({ type: 'close' })}
                                >
                                    {({ color }) => (
                                        <BackIcon size={24} color={color} />
                                    )}
                                </IconButton>
                            }
                        />

                        <Spacer />

                        <Header
                            icon={({ size }) => (
                                <BoldDangerTriangle
                                    size={size}
                                    color="statusCritical"
                                />
                            )}
                            title={
                                <FormattedMessage
                                    id="editNetwork.cannot_verify.title"
                                    defaultMessage="We can’t verify RPC Node"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="editNetwork.cannot_verify.subtitle"
                                    defaultMessage="The custom RPC node is not responding properly. Check the URL and try again."
                                />
                            }
                        />

                        <Spacer />

                        <Actions>
                            <Button
                                size="regular"
                                variant="primary"
                                onClick={() => {
                                    onMsg({ type: 'try_again_clicked' })
                                }}
                            >
                                <FormattedMessage
                                    id="editNetwork.cannot_verify.try_again"
                                    defaultMessage="Try again"
                                />
                            </Button>

                            <Button
                                size="regular"
                                variant="secondary"
                                onClick={() => {
                                    setState({ type: 'safety_warning' })
                                }}
                            >
                                <FormattedMessage
                                    id="action.continue"
                                    defaultMessage="Continue"
                                />
                            </Button>
                        </Actions>
                    </Screen>
                </Modal>
            )
        case 'safety_warning':
            return (
                <SafetyWarning
                    initialRPCUrl={initialRPCUrl}
                    rpcUrl={rpcUrl}
                    onMsg={onMsg}
                    network={network}
                />
            )

        default:
            return notReachable(state)
    }
}
