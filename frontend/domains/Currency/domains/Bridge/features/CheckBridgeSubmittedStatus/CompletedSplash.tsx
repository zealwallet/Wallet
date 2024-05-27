import { FormattedMessage } from 'react-intl'

import { Content } from '@zeal/uikit/Content'
import { Screen } from '@zeal/uikit/Screen'

import { Account } from '@zeal/domains/Account'
import { ActionBar as AccountActionBar } from '@zeal/domains/Account/components/ActionBar'
import { BridgeSubmitted } from '@zeal/domains/Currency/domains/Bridge'
import {
    HeaderSubtitle,
    HeaderTitle,
} from '@zeal/domains/Currency/domains/Bridge/components/BridgeRouteHeader'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

type Props = {
    account: Account
    keystoreMap: KeyStoreMap
    bridgeSubmitted: BridgeSubmitted
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'splash_screen_completed' }

export const CompletedSplash = ({
    bridgeSubmitted,
    keystoreMap,
    account,
    onMsg,
}: Props) => {
    return (
        <Screen padding="form" background="light" onNavigateBack={null}>
            <AccountActionBar
                keystore={getKeyStore({
                    keyStoreMap: keystoreMap,
                    address: account.address,
                })}
                network={null}
                account={account}
                right={null}
            />
            <Content
                header={
                    <Content.Header
                        title={<HeaderTitle />}
                        subtitle={
                            <HeaderSubtitle
                                bridgeRoute={bridgeSubmitted.route}
                            />
                        }
                    />
                }
            >
                <Content.Splash
                    variant="success"
                    title={
                        <FormattedMessage
                            id="currency.bridge.success"
                            defaultMessage="Complete"
                        />
                    }
                    onAnimationComplete={() => {
                        onMsg({ type: 'splash_screen_completed' })
                    }}
                />
            </Content>
        </Screen>
    )
}
