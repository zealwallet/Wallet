import { FormattedMessage } from 'react-intl'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { Account } from '@zeal/domains/Account'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { KeyStore } from '@zeal/domains/KeyStore'
import { ActionSource } from '@zeal/domains/Main'
import { Network } from '@zeal/domains/Network'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'
import { ActionBar } from '@zeal/domains/Transactions/components/ActionBar'

import { MainCTA, Msg as MainCTAMsg } from './MainCTA'

import { Message } from '../../../../Message'

type Props = {
    dApp: DAppSiteInfo
    account: Account
    network: Network
    request: SignMessageRequest
    keyStore: KeyStore
    isLoading: boolean
    actionSource: ActionSource
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'cancel_button_click' }
    | MainCTAMsg
    | { type: 'on_minimize_click' }

export const Layout = ({
    request,
    account,
    network,
    dApp,
    keyStore,
    isLoading,
    actionSource,
    onMsg,
}: Props) => {
    return (
        <Screen background="light" padding="form">
            <ActionBar
                title={null}
                account={account}
                actionSource={actionSource}
                network={null}
                onMsg={onMsg}
            />

            <Column spacing={12} alignY="stretch">
                <Content
                    header={
                        <Content.Header
                            title={
                                <FormattedMessage
                                    id="rpc.sign.title"
                                    defaultMessage="Sign"
                                />
                            }
                            subtitle={
                                <FormattedMessage
                                    id="rpc.sign.subtitle"
                                    defaultMessage="For {name}"
                                    values={{
                                        name: dApp.title || dApp.hostname,
                                    }}
                                />
                            }
                        />
                    }
                >
                    <Message request={request} />
                </Content>

                <Actions>
                    <Button
                        variant="secondary"
                        disabled={isLoading}
                        size="regular"
                        onClick={() => {
                            onMsg({
                                type: 'cancel_button_click',
                            })
                        }}
                    >
                        <FormattedMessage
                            id="action.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <MainCTA
                        request={request}
                        isLoading={isLoading}
                        keyStore={keyStore}
                        onMsg={onMsg}
                    />
                </Actions>
            </Column>
        </Screen>
    )
}
