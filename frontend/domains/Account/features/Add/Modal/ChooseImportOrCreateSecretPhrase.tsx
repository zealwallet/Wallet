import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldNewWallet } from '@zeal/uikit/Icon/BoldNewWallet'
import { BoldUpload } from '@zeal/uikit/Icon/BoldUpload'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

type Props = {
    onMsg: (msg: Msg) => void
}

export type Msg =
    | { type: 'close' }
    | { type: 'on_import_secret_phrase_clicked' }
    | { type: 'on_create_new_secret_phrase_clicked' }

export const ChooseImportOrCreateSecretPhrase = ({ onMsg }: Props) => {
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
            />

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="ChooseImportOrCreateSecretPhrase.title"
                            defaultMessage="Add Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="ChooseImportOrCreateSecretPhrase.subtitle"
                            defaultMessage="Import a Secret Phrase or create a new one"
                        />
                    }
                />

                <Column spacing={8}>
                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldUpload size={size} color="iconAccent2" />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.import_secret_phrase"
                                    defaultMessage="Import Secret Phrase"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.import_secret_phrase.subtext"
                                    defaultMessage="Created on Zeal, Metamask, or others"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_import_secret_phrase_clicked',
                                })
                            }
                        />
                    </Group>

                    <Group variant="default">
                        <ListItem
                            size="regular"
                            aria-current={false}
                            avatar={({ size }) => (
                                <BoldNewWallet
                                    size={size}
                                    color="iconAccent2"
                                />
                            )}
                            primaryText={
                                <FormattedMessage
                                    id="account.add.create_new_secret_phrase"
                                    defaultMessage="Create Secret Phrase"
                                />
                            }
                            shortText={
                                <FormattedMessage
                                    id="account.add.create_new_secret_phrase.subtext"
                                    defaultMessage="A new 12-word secret phrase"
                                />
                            }
                            onClick={() =>
                                onMsg({
                                    type: 'on_create_new_secret_phrase_clicked',
                                })
                            }
                        />
                    </Group>
                </Column>
            </Column>
        </Screen>
    )
}
