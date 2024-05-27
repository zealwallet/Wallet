import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { LoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { InputButton as AccountInputButton } from '@zeal/domains/Account/components/InputButton'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { DAppSiteInfo } from '@zeal/domains/DApp'
import { Content as DAppContent } from '@zeal/domains/DApp/components/Content'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'
import { ConnectionSafetyChecksResponse } from '@zeal/domains/SafetyCheck/api/fetchConnectionSafetyChecks'
import { ConnectionBadge } from '@zeal/domains/SafetyCheck/components/ConnectionBadge'
import { ConnectionSafetyChecksFooter } from '@zeal/domains/SafetyCheck/components/ConnectionSafetyChecksFooter'
import { getHighlighting } from '@zeal/domains/SafetyCheck/helpers/getTextHighlighting'
import { keystoreToUserEventType } from '@zeal/domains/UserEvents'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    safetyChecksLoadable: LoadableData<ConnectionSafetyChecksResponse, unknown>
    account: Account
    dAppSiteInfo: DAppSiteInfo
    portfolioMap: PortfolioMap
    keyStoreMap: KeyStoreMap
    currencyHiddenMap: CurrencyHiddenMap
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | MsgOf<typeof ConnectionSafetyChecksFooter>
    | { type: 'on_account_selector_clicked' }
    | { type: 'on_reject'; account: Account }
    | { type: 'on_approve'; account: Account }

export const Layout = ({
    onMsg,
    safetyChecksLoadable,
    account,
    portfolioMap,
    dAppSiteInfo,
    keyStoreMap,
    currencyHiddenMap,
    installationId,
}: Props) => {
    const keyStore = getKeyStore({ address: account.address, keyStoreMap })
    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'on_reject', account })}
        >
            <ActionBar
                left={
                    <Text variant="title3" weight="medium" color="textPrimary">
                        <FormattedMessage
                            id="wallet_connect.connect.title"
                            defaultMessage="Connect"
                        />
                    </Text>
                }
            />

            <Column spacing={12} alignY="stretch">
                <Content
                    footer={
                        <ConnectionSafetyChecksFooter
                            safetyChecksLoadable={safetyChecksLoadable}
                            onMsg={onMsg}
                        />
                    }
                >
                    <DAppContent
                        highlightHostName={getHighlighting(
                            safetyChecksLoadable
                        )}
                        dApp={dAppSiteInfo}
                        avatarBadge={({ size }) => (
                            <ConnectionBadge
                                size={size}
                                safetyChecksLoadable={safetyChecksLoadable}
                            />
                        )}
                    />
                </Content>

                <Column spacing={12}>
                    <AccountInputButton
                        currencyHiddenMap={currencyHiddenMap}
                        account={account}
                        onClick={() =>
                            onMsg({ type: 'on_account_selector_clicked' })
                        }
                        portfolio={getPortfolio({
                            address: account.address,
                            portfolioMap: portfolioMap,
                        })}
                    />
                </Column>

                <Actions>
                    <Button
                        size="regular"
                        variant="secondary"
                        onClick={() => onMsg({ type: 'on_reject', account })}
                    >
                        <FormattedMessage
                            id="wallet_connect.connect.cancel"
                            defaultMessage="Cancel"
                        />
                    </Button>

                    <Button
                        size="regular"
                        variant="primary"
                        onClick={() => {
                            postUserEvent({
                                type: 'ConnectionAcceptedEvent',
                                keystoreType: keystoreToUserEventType(keyStore),
                                installationId,
                                keystoreId: keyStore.id,
                                network: null,
                            })
                            onMsg({
                                type: 'on_approve',
                                account,
                            })
                        }}
                    >
                        <FormattedMessage
                            id="wallet_connect.connect.connect_button"
                            defaultMessage="Connect Zeal"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}
