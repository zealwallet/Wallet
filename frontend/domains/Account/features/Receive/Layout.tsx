import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { InfoCircle } from '@zeal/uikit/Icon/InfoCircle'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { IconButton } from '@zeal/uikit/IconButton'
import { QRCode } from '@zeal/uikit/QRCode'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'
import { noop } from '@zeal/toolkit/noop'
import { notReachable } from '@zeal/toolkit/notReachable'

import { Account } from '@zeal/domains/Account'
import { Image } from '@zeal/domains/Account/components/Image'
import { CopyAddress } from '@zeal/domains/Address/components/CopyAddress'

type Props = {
    installationId: string
    account: Account
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' } | { type: 'on_supported_networks_click' }

export const Layout = ({ account, installationId, onMsg }: Props) => {
    const [state, setState] = useCopyTextToClipboard()
    return (
        <Screen background="light" padding="form">
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={16} fill>
                <Group variant="default" fill>
                    <Column spacing={16} fill alignX="center">
                        <Column spacing={8} alignX="center">
                            <Header
                                title={
                                    <FormattedMessage
                                        id="receive_funds.title"
                                        defaultMessage="Receive funds"
                                    />
                                }
                                subtitle={
                                    <FormattedMessage
                                        id="receive_funds.subtitle"
                                        defaultMessage="Scan code or share address. You wallet uses the same code and address on all supported networks"
                                    />
                                }
                            />

                            <QRCode
                                value={account.address}
                                size={200}
                                avatar={<Image size={24} account={account} />}
                            />
                        </Column>

                        <CopyAddress
                            installationId={installationId}
                            size="large"
                            color="on_light"
                            address={account.address}
                        />
                    </Column>
                    <Row spacing={0} alignX="center">
                        <Tertiary
                            color="on_light"
                            size="small"
                            onClick={() =>
                                onMsg({
                                    type: 'on_supported_networks_click',
                                })
                            }
                        >
                            {({ color, textVariant, textWeight }) => (
                                <>
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="receive_funds.only_evm_chains_supported"
                                            defaultMessage="Only EVM chains supported"
                                        />
                                    </Text>
                                    <InfoCircle size={14} color={color} />
                                </>
                            )}
                        </Tertiary>
                    </Row>
                </Group>
                <Actions>
                    {(() => {
                        switch (state.type) {
                            case 'not_asked':
                            case 'loading':
                            case 'error':
                                return (
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={() =>
                                            setState({
                                                type: 'loading',
                                                params: {
                                                    stringToCopy:
                                                        account.address,
                                                },
                                            })
                                        }
                                    >
                                        <FormattedMessage
                                            id="receive_funds.copy_address"
                                            defaultMessage="Copy address"
                                        />
                                    </Button>
                                )
                            case 'loaded':
                                return (
                                    <Button
                                        size="regular"
                                        variant="primary"
                                        onClick={noop}
                                    >
                                        <FormattedMessage
                                            id="receive_funds.copy_address.done"
                                            defaultMessage="Copied"
                                        />
                                        <TickSquare
                                            color="iconAccent1"
                                            size={14}
                                        />
                                    </Button>
                                )

                            /* istanbul ignore next */
                            default:
                                return notReachable(state)
                        }
                    })()}
                </Actions>
            </Column>
        </Screen>
    )
}
