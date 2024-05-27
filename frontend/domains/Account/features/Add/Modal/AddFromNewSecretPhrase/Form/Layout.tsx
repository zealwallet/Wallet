import { useState } from 'react'
import { FormattedMessage } from 'react-intl'

import { Descendant } from 'slate'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldEyeClosed } from '@zeal/uikit/Icon/BoldEyeClosed'
import { Shield } from '@zeal/uikit/Icon/Shield'
import { IconButton } from '@zeal/uikit/IconButton'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import {
    getDescendantsFromString,
    getPhraseString,
    SecretPhraseInput,
} from '@zeal/uikit/SecretPhraseInput'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { encryptSecretPhrase } from '@zeal/domains/KeyStore/helpers/encryptSecretPhrase'

import {
    MAX_WORD_COUNT,
    validateAsYouType,
    validateSubmit,
    ValidationError,
} from './validation'

type Props = {
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_encrypted_secret_phrase_submitted'
          encryptedPhrase: string
      }

type InputState = 'hidden' | 'revealed'

const getErroredWordsIndexes = (
    error: ValidationError['inputMessage']
): number[] | null => {
    if (!error) {
        return null
    }

    switch (error.type) {
        case 'word_misspelled_or_invalid':
            return error.wordsIndexes

        case 'more_than_maximum_words':
        case 'secret_phrase_is_invalid':
            return null

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}

export const Layout = ({ sessionPassword, onMsg }: Props) => {
    const [inputState, setInputState] = useState<InputState>('hidden')
    const [submitted, setSubmitted] = useState<boolean>(false)

    const [secretPhraseInput, setSecretPhraseInput] = useState<Descendant[]>(
        getDescendantsFromString('')
    )

    const secretPhrase = getPhraseString(secretPhraseInput)

    const validationError = submitted
        ? validateSubmit(secretPhrase).getFailureReason() || {}
        : validateAsYouType(secretPhrase).getFailureReason() || {}

    const onSubmit = async () => {
        setSubmitted(true)

        const validation = validateSubmit(secretPhrase)

        switch (validation.type) {
            case 'Failure':
                break

            case 'Success': {
                const encryptedPhrase = await encryptSecretPhrase({
                    sessionPassword,
                    mnemonic: validation.data,
                })

                onMsg({
                    type: 'on_encrypted_secret_phrase_submitted',
                    encryptedPhrase,
                })
                break
            }

            default:
                notReachable(validation)
        }
    }

    return (
        <Screen
            padding="form"
            background="light"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
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
                            id="AddFromPrivateKey.title"
                            defaultMessage="Restore wallet"
                        />
                    }
                    subtitle={
                        <FormattedMessage
                            id="AddFromPrivateKey.subtitle"
                            defaultMessage="Enter your Private Key or Secret Phrase separated by spaces"
                        />
                    }
                />

                <Column spacing={8}>
                    <SecretPhraseInput
                        autoFocus
                        hidden={inputState === 'hidden'}
                        errorWordsIndexes={getErroredWordsIndexes(
                            validationError.inputMessage
                        )}
                        onChange={(value) => setSecretPhraseInput(value)}
                        value={secretPhraseInput}
                        onError={(e) => captureError(e)}
                    />
                    <Row spacing={8}>
                        {validationError.inputMessage ? (
                            <Text
                                ellipsis
                                color="textError"
                                variant="caption1"
                                weight="regular"
                            >
                                <ErrorMessage
                                    error={validationError.inputMessage}
                                />
                            </Text>
                        ) : (
                            <Text
                                ellipsis
                                color="textSecondary"
                                variant="caption1"
                                weight="regular"
                            >
                                <WordsCounter phrase={secretPhrase} />
                            </Text>
                        )}

                        <Spacer />

                        <InputStateButton
                            state={inputState}
                            onClick={() => {
                                switch (inputState) {
                                    case 'hidden':
                                        setInputState('revealed')
                                        break

                                    case 'revealed':
                                        setInputState('hidden')
                                        break

                                    default:
                                        notReachable(inputState)
                                }
                            }}
                        />
                    </Row>
                </Column>
            </Column>

            <Spacer />

            <Column spacing={16}>
                <InfoCard
                    variant="security"
                    icon={({ size }) => <Shield size={size} />}
                    subtitle={
                        <FormattedMessage
                            id="RestoreAccount.secretPhraseAndPKNeverLeaveThisDevice"
                            defaultMessage="Secret Phrases and private keys are encrypted and never leave this device"
                        />
                    }
                />
                <Actions>
                    <Button
                        variant="primary"
                        size="regular"
                        disabled={!!validationError.submitEnabled}
                        onClick={onSubmit}
                    >
                        <FormattedMessage
                            id="actions.continue"
                            defaultMessage="Continue"
                        />
                    </Button>
                </Actions>
            </Column>
        </Screen>
    )
}

const InputStateButton = ({
    state,
    onClick,
}: {
    state: InputState
    onClick: () => void
}) => (
    <Tertiary color="on_light" size="small" onClick={onClick}>
        {({ color, textVariant, textWeight }) => (
            <Row spacing={4}>
                {(() => {
                    switch (state) {
                        case 'hidden':
                            return (
                                <>
                                    <BoldEye size={14} color={color} />
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="actions.reveal"
                                            defaultMessage="Reveal"
                                        />
                                    </Text>
                                </>
                            )

                        case 'revealed':
                            return (
                                <>
                                    <BoldEyeClosed size={14} color={color} />
                                    <Text
                                        color={color}
                                        variant={textVariant}
                                        weight={textWeight}
                                    >
                                        <FormattedMessage
                                            id="actions.hide"
                                            defaultMessage="Hide"
                                        />
                                    </Text>
                                </>
                            )

                        default:
                            return notReachable(state)
                    }
                })()}
            </Row>
        )}
    </Tertiary>
)

const WordsCounter = ({ phrase }: { phrase: string }) => {
    const count = phrase.trim().split(' ').length

    if (!count) {
        return null
    }

    return (
        <FormattedMessage
            id="PrivateKeyValidationError.wordsCount"
            defaultMessage="{count, plural,
                =0 {}
                one {{count} word}
                other {{count} words}
              }"
            values={{ count }}
        />
    )
}

const ErrorMessage = ({
    error,
}: {
    error: NonNullable<ValidationError['inputMessage']>
}) => {
    switch (error.type) {
        case 'word_misspelled_or_invalid':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.word_misspelled_or_invalid"
                    defaultMessage="Word #{index} misspelled or invalid"
                    values={{ index: error.wordsIndexes[0] + 1 }}
                />
            )

        case 'more_than_maximum_words':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.more_than_maximum_words"
                    defaultMessage="Max {count} words"
                    values={{ count: MAX_WORD_COUNT }}
                />
            )

        case 'secret_phrase_is_invalid':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.secret_phrase_is_invalid"
                    defaultMessage="Secret phrase is not valid"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error)
    }
}
