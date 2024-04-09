import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { ExpandOutline } from '@zeal/uikit/Icon/ExpandOutline'
import { IconButton } from '@zeal/uikit/IconButton'
import { Drawer, Screen } from '@zeal/uikit/Screen'

import { noop, notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { Widget } from '@zeal/domains/Account/components/Widget'
import { CurrencyHiddenMap, CurrencyPinMap } from '@zeal/domains/Currency'
import { Actions } from '@zeal/domains/Currency/features/Actions'
import { Manager } from '@zeal/domains/DApp/domains/ConnectionState/features/Manager'
import { KeyStore } from '@zeal/domains/KeyStore'
import { Mode } from '@zeal/domains/Main'
import { CurrentNetwork, NetworkMap } from '@zeal/domains/Network'
import { Portfolio } from '@zeal/domains/Portfolio'
import { CustomCurrencyMap } from '@zeal/domains/Storage'

type Props = {
    portfolio: Portfolio | null
    installationId: string
    currentAccount: Account
    currentNetwork: CurrentNetwork
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    networkMap: NetworkMap
    customCurrencyMap: CustomCurrencyMap
    currencyPinMap: CurrencyPinMap
    mode: Mode

    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | MsgOf<typeof Widget> | MsgOf<typeof Actions>

const getScreenPadding = (
    mode: Mode
): React.ComponentProps<typeof Screen>['padding'] => {
    switch (mode) {
        case 'fullscreen':
            return 'form'
        case 'popup':
            return 'extension_connection_manager'
        default:
            return notReachable(mode)
    }
}

export const ActionsTab = ({
    currentNetwork,
    currencyHiddenMap,
    currentAccount,
    keystore,
    portfolio,
    currencyPinMap,
    customCurrencyMap,
    installationId,
    networkMap,
    mode,
    onMsg,
}: Props) => {
    return (
        <>
            <Screen padding={getScreenPadding(mode)} background="light">
                <Column spacing={0}>
                    {(() => {
                        switch (mode) {
                            case 'fullscreen':
                                return null
                            case 'popup':
                                return (
                                    <ActionBar
                                        left={
                                            <IconButton
                                                variant="on_light"
                                                onClick={noop}
                                            >
                                                {({ color }) => (
                                                    <ExpandOutline
                                                        size={24}
                                                        color={color}
                                                    />
                                                )}
                                            </IconButton>
                                        }
                                        right={
                                            <Manager
                                                installationId={installationId}
                                                networkMap={networkMap}
                                                onMsg={noop}
                                            />
                                        }
                                    />
                                )

                            default:
                                return notReachable(mode)
                        }
                    })()}

                    <Widget
                        installationId={installationId}
                        currencyHiddenMap={currencyHiddenMap}
                        keystore={keystore}
                        currentNetwork={currentNetwork}
                        portfolio={portfolio}
                        currentAccount={currentAccount}
                        onMsg={onMsg}
                    />
                </Column>
            </Screen>

            <Drawer onClose={() => onMsg({ type: 'close' })}>
                <Actions
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    currencyId={null}
                    currencyPinMap={currencyPinMap}
                    customCurrencyMap={customCurrencyMap}
                    fromAccount={currentAccount}
                    networkMap={networkMap}
                    onMsg={onMsg}
                    portfolio={portfolio}
                />
            </Drawer>
        </>
    )
}
