import React from 'react'
import { FormattedMessage } from 'react-intl'

import { GroupHeader as UIGroupHeader } from '@zeal/uikit/Group'
import { Header as UIHeader } from '@zeal/uikit/Header'
import { Setting } from '@zeal/uikit/Icon/Setting'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg = { type: 'change_path_settings_clicked' }

export const Header = () => {
    return (
        <UIHeader
            title={
                <FormattedMessage
                    id="ledger.select_account.title"
                    defaultMessage="Import Ledger wallets"
                />
            }
            subtitle={
                <FormattedMessage
                    id="ledger.select_account.subtitle"
                    defaultMessage="Don’t see the wallets you expect? Try changing the path settings"
                />
            }
        />
    )
}

export const GroupHeader = ({ onMsg }: Props) => {
    return (
        <UIGroupHeader
            left={({ color, textVariant, textWeight }) => (
                <Text color={color} variant={textVariant} weight={textWeight}>
                    <FormattedMessage
                        id="ledger.select_account.subtitle.group_header"
                        defaultMessage="Wallets"
                    />
                </Text>
            )}
            right={() => (
                <Tertiary
                    size="small"
                    color="on_light"
                    onClick={() => {
                        onMsg({ type: 'change_path_settings_clicked' })
                    }}
                >
                    {({ color, textVariant, textWeight }) => (
                        <>
                            <Text
                                color={color}
                                variant={textVariant}
                                weight={textWeight}
                            >
                                <FormattedMessage
                                    id="ledger.select_account.path_settings"
                                    defaultMessage="Path Settings"
                                />
                            </Text>
                            <Setting size={20} color={color} />
                        </>
                    )}
                </Tertiary>
            )}
        />
    )
}
