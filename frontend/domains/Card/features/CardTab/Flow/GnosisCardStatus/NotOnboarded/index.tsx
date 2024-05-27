import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { GnosisPayAccountNotOnboardedState } from '@zeal/domains/Card'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStoreMap, SigningKeyStore } from '@zeal/domains/KeyStore'
import { PortfolioMap } from '@zeal/domains/Portfolio'

import { KycNotStarted } from './KycNotStarted'
import { KycStarted } from './KycStarted'

type Props = {
    gnosisPayAccountNotOnboardedState: GnosisPayAccountNotOnboardedState

    account: Account
    accountsMap: AccountsMap
    keyStoreMap: KeyStoreMap
    portfolioMap: PortfolioMap
    currencyHiddenMap: CurrencyHiddenMap
    keyStore: SigningKeyStore
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof KycNotStarted>

export const NotOnboarded = ({
    gnosisPayAccountNotOnboardedState,
    account,
    accountsMap,
    keyStore,
    keyStoreMap,
    installationId,
    portfolioMap,
    currencyHiddenMap,
    onMsg,
}: Props) => {
    switch (gnosisPayAccountNotOnboardedState.state) {
        case 'kyc_not_started':
            return (
                <KycNotStarted
                    onboardingState={gnosisPayAccountNotOnboardedState.state}
                    keyStore={keyStore}
                    portfolioMap={portfolioMap}
                    keyStoreMap={keyStoreMap}
                    installationId={installationId}
                    currencyHiddenMap={currencyHiddenMap}
                    account={account}
                    accountsMap={accountsMap}
                    onMsg={onMsg}
                />
            )

        case 'kyc_submitted':
        case 'kyc_approved':
        case 'card_shipped':
        case 'card_ready_to_be_shipped':
            return (
                <KycStarted
                    installationId={installationId}
                    account={account}
                    onboardingState={gnosisPayAccountNotOnboardedState.state}
                />
            )

        default:
            return notReachable(gnosisPayAccountNotOnboardedState.state)
    }
}
