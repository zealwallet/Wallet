import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { ShieldFail } from '@zeal/uikit/Icon/ShieldFail'
import { Modal } from '@zeal/uikit/Modal'
import { Popup } from '@zeal/uikit/Popup'
import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { notReachable } from '@zeal/toolkit'

import { Network } from '@zeal/domains/Network'

export type Props = {
    initialRPCUrl: string | null
    rpcUrl: string
    network: Network
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | {
          type: 'on_rpc_change_confirmed'
          network: Network
          initialRPCUrl: string | null
          rpcUrl: string
      }

type State = { type: 'safety_warning' } | { type: 'animation' }

export const SafetyWarning = ({
    initialRPCUrl,
    rpcUrl,
    network,
    onMsg,
}: Props) => {
    const [state, setState] = useState<State>({ type: 'safety_warning' })

    switch (state.type) {
        case 'safety_warning':
            return (
                <Popup.Layout onMsg={onMsg}>
                    <Header
                        icon={({ size }) => (
                            <ShieldFail size={size} color="statusWarning" />
                        )}
                        title={
                            <FormattedMessage
                                id="editNetwork.safetyWarning.title"
                                defaultMessage="Custom RPCs can be unsafe"
                            />
                        }
                        subtitle={
                            <FormattedMessage
                                id="editNetwork.safetyWarning.subtitle"
                                defaultMessage="Zeal can’t ensure the privacy, reliability and safety of custom RPCs. Are you sure you want to use a custom RPC node?"
                            />
                        }
                    />
                    <Popup.Actions>
                        <Button
                            variant="secondary"
                            size="regular"
                            onClick={() => {
                                onMsg({ type: 'close' })
                            }}
                        >
                            <FormattedMessage
                                id="action.cancel"
                                defaultMessage="Cancel"
                            />
                        </Button>

                        <Button
                            variant="primary"
                            size="regular"
                            onClick={() => setState({ type: 'animation' })}
                        >
                            <FormattedMessage
                                id="action.continue"
                                defaultMessage="Continue"
                            />
                        </Button>
                    </Popup.Actions>
                </Popup.Layout>
            )

        case 'animation':
            return (
                <Modal>
                    <SuccessLayout
                        title={
                            <FormattedMessage
                                id="network.filter.update_rpc_success"
                                defaultMessage="RPC Node saved"
                            />
                        }
                        onAnimationComplete={() => {
                            onMsg({
                                type: 'on_rpc_change_confirmed',
                                initialRPCUrl,
                                rpcUrl,
                                network,
                            })
                        }}
                    />
                </Modal>
            )

        default:
            return notReachable(state)
    }
}
