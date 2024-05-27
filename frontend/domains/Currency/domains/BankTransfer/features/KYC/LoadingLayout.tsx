import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { IconButton } from '@zeal/uikit/IconButton'
import { LoadingLayout as UILoadingLayout } from '@zeal/uikit/LoadingLayout'

import { Account } from '@zeal/domains/Account'
import { ActionBar } from '@zeal/domains/Account/components/ActionBar'
import { KeyStoreMap } from '@zeal/domains/KeyStore'
import { getKeyStore } from '@zeal/domains/KeyStore/helpers/getKeyStore'
import { Network } from '@zeal/domains/Network'

type Props = {
    account: Account
    network: Network
    keyStoreMap: KeyStoreMap
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const LoadingLayout = ({
    account,
    keyStoreMap,
    network,
    onMsg,
}: Props) => (
    <UILoadingLayout
        onClose={() => onMsg({ type: 'close' })}
        actionBar={
            <ActionBar
                account={account}
                keystore={getKeyStore({
                    keyStoreMap,
                    address: account.address,
                })}
                network={network}
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
        }
    />
)
