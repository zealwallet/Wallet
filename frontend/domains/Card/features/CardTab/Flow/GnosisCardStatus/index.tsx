import { useEffect } from 'react'

import { ActionBar as UIActionBar } from '@zeal/uikit/ActionBar'
import { CardWidget } from '@zeal/uikit/CardWidget'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { AvatarWithoutBadge as AccountAvatar } from '@zeal/domains/Account/components/Avatar'
import { Address } from '@zeal/domains/Address'
import { format as formatAddress } from '@zeal/domains/Address/helpers/format'
import {
    GnosisPayAccountState,
    GnosisPayLoginSignature,
} from '@zeal/domains/Card'
import { fetchGnosisPayAccountState } from '@zeal/domains/Card/api/fetchGnosisPayAccountState'
import { login } from '@zeal/domains/Card/api/login'
import { CardLoadingScreen } from '@zeal/domains/Card/components/CardLoadingScreen'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { AppErrorBanner } from '@zeal/domains/Error/components/AppErrorBanner'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'

import { NotOnboarded } from './NotOnboarded'
import { Onboarded } from './Onboarded'

type Props = {
    gnosisPayLoginSignature: GnosisPayLoginSignature
    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    keyStore: SigningKeyStore
    installationId: string
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

const fetch = async ({
    gnosisPayLoginSignature,
}: {
    gnosisPayLoginSignature: GnosisPayLoginSignature
}): Promise<GnosisPayAccountState> => {
    const gnosisPayLoginInfo = await login({ gnosisPayLoginSignature })

    return fetchGnosisPayAccountState({ gnosisPayLoginInfo })
}

type Msg =
    | {
          type: 'on_card_onboarded_account_state_received'
          address: Address
      }
    | { type: 'on_login_failure_retry_button_clicked' }
    | MsgOf<typeof NotOnboarded>

export const GnosisCardStatus = ({
    gnosisPayLoginSignature,
    account,
    accountsMap,
    keyStore,
    keyStoreMap,
    installationId,
    portfolioMap,
    currencyHiddenMap,
    encryptedPassword,
    onMsg,
}: Props) => {
    const [loadable] = useLoadableData(fetch, {
        type: 'loading',
        params: { gnosisPayLoginSignature },
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loading':
            case 'loaded':
                break
            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable])

    useEffect(() => {
        // FIXME @resetko-zeal low prio last thing to do we need to reload loadable once we back from background (tab activation on web / app activation on mobile)
    }, [])

    switch (loadable.type) {
        case 'loading':
            return <CardLoadingScreen account={account} />

        case 'error':
            const error = parseAppError(loadable.error)
            return (
                <Screen
                    padding="controller_tabs_fullscreen"
                    background="light"
                    onNavigateBack={null}
                >
                    <UIActionBar
                        left={
                            <Row spacing={8}>
                                <AccountAvatar size={24} account={account} />
                                <Text
                                    variant="footnote"
                                    color="textSecondary"
                                    weight="regular"
                                    ellipsis
                                >
                                    {account.label}
                                </Text>

                                <Text
                                    variant="footnote"
                                    color="textSecondary"
                                    weight="regular"
                                >
                                    {formatAddress(account.address)}
                                </Text>
                            </Row>
                        }
                    />
                    <Column spacing={8}>
                        <CardWidget side="front" />

                        <AppErrorBanner
                            error={error}
                            onMsg={(msg) => {
                                switch (msg.type) {
                                    case 'try_again_clicked':
                                        onMsg({
                                            type: 'on_login_failure_retry_button_clicked',
                                        })
                                        break
                                    /* istanbul ignore next */
                                    default:
                                        return notReachable(msg.type)
                                }
                            }}
                        />
                    </Column>
                </Screen>
            )

        case 'loaded': {
            switch (loadable.data.type) {
                case 'not_onboarded':
                    return (
                        <NotOnboarded
                            keyStore={keyStore}
                            portfolioMap={portfolioMap}
                            installationId={installationId}
                            keyStoreMap={keyStoreMap}
                            currencyHiddenMap={currencyHiddenMap}
                            account={account}
                            accountsMap={accountsMap}
                            gnosisPayAccountNotOnboardedState={loadable.data}
                            onMsg={onMsg}
                        />
                    )

                case 'onboarded':
                    return (
                        <Onboarded
                            accountsMap={accountsMap}
                            installationId={installationId}
                            encryptedPassword={encryptedPassword}
                            account={account}
                            gnosisPayAccountOnboardedState={loadable.data}
                        />
                    )

                default:
                    return notReachable(loadable.data)
            }
        }

        default:
            return notReachable(loadable)
    }
}
