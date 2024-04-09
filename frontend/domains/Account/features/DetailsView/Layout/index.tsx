import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { LightEdit } from '@zeal/uikit/Icon/LightEdit'
import { OutlineQRCode } from '@zeal/uikit/Icon/OutlineQRCode'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { MsgOf } from '@zeal/toolkit/MsgOf'

import { Account } from '@zeal/domains/Account'
import { AvatarWithoutBadge } from '@zeal/domains/Account/components/Avatar'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'
import { CurrencyHiddenMap } from '@zeal/domains/Currency'
import { KeyStore } from '@zeal/domains/KeyStore'
import { FormattedTokenBalanceInDefaultCurrency } from '@zeal/domains/Money/components/FormattedTokenBalanceInDefaultCurrency'
import { Portfolio } from '@zeal/domains/Portfolio'
import { sumPortfolio } from '@zeal/domains/Portfolio/helpers/sum'

import { Actions } from './Actions'
import { KeyStoreTag } from './KeystoreTag'

type Props = {
    installationId: string
    account: Account
    portfolio: Portfolio | null
    keystore: KeyStore
    currencyHiddenMap: CurrencyHiddenMap
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_edit_label_click' }
    | { type: 'on_see_qr_code_click'; keystore: KeyStore }
    | MsgOf<typeof Actions>

export const Layout = ({
    portfolio,
    keystore,
    currencyHiddenMap,
    account,
    installationId,
    onMsg,
}: Props) => {
    const sum = portfolio && sumPortfolio(portfolio, currencyHiddenMap)

    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
                right={
                    keystore && (
                        <IconButton
                            variant="on_light"
                            onClick={() =>
                                onMsg({
                                    type: 'on_see_qr_code_click',
                                    keystore,
                                })
                            }
                        >
                            {({ color }) => (
                                <OutlineQRCode size={24} color={color} />
                            )}
                        </IconButton>
                    )
                }
            />

            <Column alignX="center" spacing={24}>
                <Column alignX="center" spacing={16}>
                    <AvatarWithoutBadge size={80} account={account} />

                    <Column alignX="center" spacing={4}>
                        <Row spacing={8} alignX="center">
                            <Text
                                ellipsis
                                variant="title2"
                                weight="bold"
                                color="textPrimary"
                            >
                                {account.label}
                            </Text>

                            <IconButton
                                variant="on_light"
                                onClick={() => {
                                    onMsg({ type: 'on_edit_label_click' })
                                }}
                            >
                                {({ color }) => (
                                    <LightEdit size={16} color={color} />
                                )}
                            </IconButton>
                        </Row>

                        {sum && (
                            <Text
                                variant="title1"
                                weight="bold"
                                color="textPrimary"
                                align="center"
                            >
                                <FormattedTokenBalanceInDefaultCurrency
                                    money={sum}
                                    knownCurrencies={portfolio.currencies}
                                />
                            </Text>
                        )}

                        <Row spacing={16}>
                            <KeyStoreTag keystore={keystore} />
                            <CopyAddress
                                installationId={installationId}
                                size="small"
                                color="on_light"
                                address={account.address}
                            />
                        </Row>
                    </Column>
                </Column>

                <Actions account={account} keystore={keystore} onMsg={onMsg} />
            </Column>
        </Screen>
    )
}
