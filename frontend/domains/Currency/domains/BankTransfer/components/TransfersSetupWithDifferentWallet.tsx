import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { Popup } from '@zeal/uikit/Popup'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { UnlockedListItem } from '@zeal/domains/Account/components/UnlockedListItem'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'
import { getPortfolio } from '@zeal/domains/Portfolio/helpers/getPortfolio'

type Props = {
    installationId: string
    bankTransferAccount: Account
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_continue_to_bank_transfer_clicked'; account: Account }

export const TransfersSetupWithDifferentWallet = ({
    bankTransferAccount: account,
    installationId,
    keyStoreMap,
    portfolioMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    return (
        <Popup.Layout onMsg={onMsg}>
            <Header
                title={
                    <FormattedMessage
                        id="transfer_setup_with_different_wallet.title"
                        defaultMessage="Switch wallet"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="transfer_setup_with_different_wallet.subtitle"
                        defaultMessage="Bank transfers are setup with a different wallet. You can only have one wallet connected to transfers."
                    />
                }
            />

            <Group variant="default">
                <UnlockedListItem
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    selectionVariant="default"
                    selected={false}
                    account={account}
                    keyStore={getKeyStore({
                        keyStoreMap,
                        address: account.address,
                    })}
                    portfolio={getPortfolio({
                        address: account.address,
                        portfolioMap,
                    })}
                    onMsg={(msg) => {
                        switch (msg.type) {
                            case 'account_item_clicked':
                                onMsg({
                                    type: 'on_continue_to_bank_transfer_clicked',
                                    account,
                                })
                                break

                            default:
                                return notReachable(msg.type)
                        }
                    }}
                />
            </Group>
            <Popup.Actions>
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() =>
                        onMsg({
                            type: 'on_continue_to_bank_transfer_clicked',
                            account,
                        })
                    }
                >
                    <FormattedMessage
                        id="transfer_setup_with_different_wallet.swtich_and_continue"
                        defaultMessage="Switch and continue"
                    />
                </Button>
            </Popup.Actions>
        </Popup.Layout>
    )
}
