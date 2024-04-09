import { FormattedMessage } from 'react-intl'

import { SuccessLayout } from '@zeal/uikit/SuccessLayout'

import { values } from '@zeal/toolkit/Object'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { groupBySecretPhrase } from '@zeal/domains/Account/helpers/groupBySecretPhrase'
import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'

type Props = {
    accounts: AccountsMap
    keystoreMap: KeyStoreMap
    sessionPassword: string

    account: Account
    keystore: SecretPhrase
    onMsg: (msg: Msg) => void
}

type Msg = {
    type: 'on_secret_phrase_verified_success'
    account: Account
    accountsWithKeystores: { account: Account; keystore: SecretPhrase }[]
}

export const SecretPhraseVerified = ({
    account,
    keystore,
    accounts,
    keystoreMap,
    sessionPassword,
    onMsg,
}: Props) => {
    return (
        <SuccessLayout
            title={
                <FormattedMessage
                    id="keystore.SecretPhraseTest.SecretPhraseVerified.title"
                    defaultMessage="Secret Phrase secured 🎉"
                />
            }
            onAnimationComplete={async () => {
                try {
                    const secretPhraseMap = await groupBySecretPhrase(
                        values(accounts),
                        keystoreMap,
                        sessionPassword
                    )

                    const accountKeystorePairs = secretPhraseMap[
                        keystore.encryptedPhrase
                    ].map(({ keystore, account }) => ({
                        account,
                        keystore: { ...keystore, confirmed: true },
                    }))

                    onMsg({
                        type: 'on_secret_phrase_verified_success',
                        account,
                        accountsWithKeystores: accountKeystorePairs,
                    })
                } catch (e) {
                    // we don't report initial error yet to not send sensitive data to Sentry
                    captureError(
                        new ImperativeError(
                            'we got error after phrase success verified'
                        )
                    )
                }
            }}
        />
    )
}
