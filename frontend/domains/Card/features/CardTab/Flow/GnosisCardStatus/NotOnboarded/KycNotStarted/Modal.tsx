import { Modal as UIModal } from '@zeal/uikit/Modal'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'

import { ChooseWallet } from '../../../../ChooseWallet'

type Props = {
    state: State
    accountsMap: AccountsMap
    account: Account
    keyStore: SigningKeyStore
    keyStoreMap: KeyStoreMap
    installationId: string
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type State = { type: 'closed' } | { type: 'account_selector' }

type Msg =
    | { type: 'close' }
    | { type: 'on_card_owner_address_selected'; address: Address }
    | Extract<
          MsgOf<typeof ChooseWallet>,
          { type: 'card_tab_choose_wallet_on_import_new_wallet_clicked' }
      >

export const Modal = ({
    state,
    accountsMap,
    account,
    portfolioMap,
    currencyHiddenMap,
    keyStoreMap,
    installationId,
    keyStore,
    onMsg,
}: Props) => {
    switch (state.type) {
        case 'closed':
            return null

        case 'account_selector':
            return (
                <UIModal>
                    <ChooseWallet
                        installationId={installationId}
                        accountsMap={accountsMap}
                        keystoreMap={keyStoreMap}
                        portfolioMap={portfolioMap}
                        currencyHiddenMap={currencyHiddenMap}
                        accountWithKeystore={{
                            account,
                            keystore: keyStore,
                        }}
                        onMsg={(msg) => {
                            switch (msg.type) {
                                case 'close':
                                case 'card_tab_choose_wallet_on_import_new_wallet_clicked':
                                    onMsg(msg)
                                    break
                                case 'on_continue_click':
                                    onMsg({
                                        type: 'on_card_owner_address_selected',
                                        address: msg.account.address,
                                    })
                                    break
                                /* istanbul ignore next */
                                default:
                                    return notReachable(msg)
                            }
                        }}
                    />
                </UIModal>
            )

        default:
            return notReachable(state)
    }
}
