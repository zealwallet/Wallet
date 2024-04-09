import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Column } from '@zeal/uikit/Column'
import { Group, Section } from '@zeal/uikit/Group'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { SolidStatusKey } from '@zeal/uikit/Icon/SolidStatusKey'
import { IconButton } from '@zeal/uikit/IconButton'
import { ListItem } from '@zeal/uikit/ListItem'
import { Screen } from '@zeal/uikit/Screen'

import { keys } from '@zeal/toolkit/Object'

import { Account } from '@zeal/domains/Account'
import { SecretPhrase } from '@zeal/domains/KeyStore'

type Props = {
    secretPhraseMap: Record<
        string,
        { keystore: SecretPhrase; account: Account }[]
    >
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_phrase_selected'
          keystore: SecretPhrase
      }

export const Layout = ({ secretPhraseMap, onMsg }: Props) => {
    const phrases = keys(secretPhraseMap)

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

            <Column spacing={24}>
                <Header
                    title={
                        <FormattedMessage
                            id="AddFromExistingSecretPhrase.SelectPhrase.title"
                            defaultMessage="Pick a Secret Phrase"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="AddFromExistingSecretPhrase.SelectPhrase.subtitle"
                            defaultMessage="Create new wallets from one of your existing Secret Phrases"
                        />
                    }
                />

                <Section>
                    <Group variant="default">
                        <Column spacing={8}>
                            {phrases.map((phrase, index) => (
                                <ListItem
                                    size="regular"
                                    aria-current={false}
                                    avatar={({ size }) => (
                                        <SolidStatusKey
                                            color="iconAccent2"
                                            size={size}
                                        />
                                    )}
                                    key={phrase}
                                    onClick={() =>
                                        onMsg({
                                            type: 'on_phrase_selected',

                                            keystore:
                                                secretPhraseMap[phrase][0]
                                                    .keystore,
                                        })
                                    }
                                    primaryText={
                                        <FormattedMessage
                                            id="AddFromExistingSecretPhrase.SelectPhrase.PhraseItem.title"
                                            defaultMessage="Secret Phrase {index}"
                                            values={{
                                                index: index + 1,
                                            }}
                                        />
                                    }
                                    shortText={
                                        <FormattedMessage
                                            id="AddFromExistingSecretPhrase.SelectPhrase.PhraseItem.subtitle"
                                            defaultMessage="{count, plural, =0 {No wallets} one {{count} Wallet} other {{count} Wallets}}"
                                            values={{
                                                count: secretPhraseMap[phrase]
                                                    .length,
                                            }}
                                        />
                                    }
                                />
                            ))}
                        </Column>
                    </Group>
                </Section>
            </Column>
        </Screen>
    )
}
