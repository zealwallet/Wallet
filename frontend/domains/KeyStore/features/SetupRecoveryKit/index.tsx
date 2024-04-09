import React from 'react'

import { notReachable } from '@zeal/toolkit'
import { MsgOf } from '@zeal/toolkit/MsgOf'
import { failure, Result, success } from '@zeal/toolkit/Result'

import { Account, AccountsMap } from '@zeal/domains/Account'
import { Address } from '@zeal/domains/Address'
import { KeyStoreMap, SecretPhrase } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'

import { Flow } from './Flow'

type Props = {
    address: Address
    accountsMap: AccountsMap
    keystoreMap: KeyStoreMap
    installationId: string
    encryptedPassword: string
    onMsg: (msg: Msg) => void
}

type Msg = MsgOf<typeof Flow>

const checkParams = ({
    accountsMap,
    keyStoreMap,
    address,
}: {
    address: Address
    keyStoreMap: KeyStoreMap
    accountsMap: AccountsMap
}): Result<unknown, { account: Account; keystore: SecretPhrase }> => {
    const account = accountsMap[address] || null

    if (!account) {
        return failure('account_not_found')
    }

    const keystore = getKeyStore({ keyStoreMap, address })

    switch (keystore.type) {
        case 'private_key_store':
        case 'ledger':
        case 'trezor':
        case 'track_only':
        case 'safe_4337':
            return failure('wrong_keystore_type')
        case 'secret_phrase_key':
            return success({ account, keystore })

        /* istanbul ignore next */
        default:
            return notReachable(keystore)
    }
}

export const SetupRecoveryKit = ({
    accountsMap,
    address,
    keystoreMap,
    encryptedPassword,
    installationId,
    onMsg,
}: Props) => {
    const { account, keystore } = checkParams({
        accountsMap,
        keyStoreMap: keystoreMap,
        address,
    }).getSuccessResultOrThrow(
        'Failed to parse params for SetupRecoveryKit flow on page'
    )

    return (
        <Flow
            installationId={installationId}
            account={account}
            accounts={accountsMap}
            encryptedPassword={encryptedPassword}
            keystore={keystore}
            keystoreMap={keystoreMap}
            onMsg={onMsg}
        />
    )
}
