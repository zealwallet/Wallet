import { ArrowUpDownOutline } from '@zeal/uikit/Icon/ArrowUpDownOutline'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { Account } from '@zeal/domains/Account'
import { Avatar } from '@zeal/domains/Account/components/Avatar'
import { CopyAddressIconButton } from '@zeal/domains/Address/components/CopyAddressIconButton'
import { WalletConnectInstanceLoadable } from '@zeal/domains/DApp/domains/WalletConnect/api/fetchWalletConnectInstance'
import { ScanButton } from '@zeal/domains/DApp/domains/WalletConnect/features/ScanButton'
import { KeyStore } from '@zeal/domains/KeyStore'

type Props = {
    currentAccount: Account
    walletConnectInstanceLoadable: WalletConnectInstanceLoadable
    installationId: string
    keystore: KeyStore
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'account_filter_click' }

export const AccountRow = ({
    onMsg,
    keystore,
    currentAccount,
    walletConnectInstanceLoadable,
    installationId,
}: Props) => {
    return (
        <Row spacing={4} shrink>
            <IconButton
                variant="on_color"
                onClick={() => onMsg({ type: 'account_filter_click' })}
            >
                {({ color }) => (
                    <Row spacing={8} shrink>
                        <Avatar
                            account={currentAccount}
                            size={28}
                            keystore={keystore}
                        />

                        <Text
                            color={color}
                            variant="callout"
                            weight="regular"
                            ellipsis
                        >
                            {currentAccount.label}
                        </Text>

                        <ArrowUpDownOutline size={24} color={color} />
                    </Row>
                )}
            </IconButton>

            <Spacer />

            <Row spacing={0}>
                <CopyAddressIconButton
                    size={24}
                    variant="on_color"
                    address={currentAccount.address}
                    installationId={installationId}
                />

                <ScanButton
                    walletConnectInstanceLoadable={
                        walletConnectInstanceLoadable
                    }
                />
            </Row>
        </Row>
    )
}
