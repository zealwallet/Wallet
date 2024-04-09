import { FormattedMessage } from 'react-intl'

import { Button } from '@zeal/uikit/Button'

import { notReachable } from '@zeal/toolkit'

import { KeyStore, SigningKeyStore } from '@zeal/domains/KeyStore'
import { SignMessageRequest } from '@zeal/domains/RPCRequest'

type Props = {
    keyStore: KeyStore
    request: SignMessageRequest
    isLoading: boolean
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'import_keys_button_clicked' }
    | {
          type: 'sign_click'
          keyStore: SigningKeyStore
          request: SignMessageRequest
      }

export const MainCTA = ({ keyStore, isLoading, onMsg, request }: Props) => {
    switch (keyStore.type) {
        case 'track_only':
            return (
                <Button
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'import_keys_button_clicked' })
                    }}
                >
                    <FormattedMessage
                        id="rpc.sign.import_private_key"
                        defaultMessage="Import keys"
                    />
                </Button>
            )
        case 'private_key_store':
        case 'ledger':
        case 'secret_phrase_key':
        case 'trezor':
        case 'safe_4337':
            return (
                <Button
                    disabled={isLoading}
                    variant="primary"
                    size="regular"
                    onClick={() => {
                        onMsg({ type: 'sign_click', keyStore, request })
                    }}
                >
                    <FormattedMessage
                        id="rpc.sign.accept"
                        defaultMessage="Accept"
                    />
                </Button>
            )

        /* istanbul ignore next */
        default:
            return notReachable(keyStore)
    }
}
