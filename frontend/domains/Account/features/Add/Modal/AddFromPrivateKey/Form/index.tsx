import { useState } from 'react'
import { FormattedMessage, useIntl } from 'react-intl'

import { privateKeyToAccount } from 'viem/accounts'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { BoldEye } from '@zeal/uikit/Icon/BoldEye'
import { BoldEyeClosed } from '@zeal/uikit/Icon/BoldEyeClosed'
import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { Shield } from '@zeal/uikit/Icon/Shield'
import { IconButton } from '@zeal/uikit/IconButton'
import { InfoCard } from '@zeal/uikit/InfoCard'
import { Input } from '@zeal/uikit/Input'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Tertiary } from '@zeal/uikit/Tertiary'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'

import { Account } from '@zeal/domains/Account'
import { generateAccountsLabels } from '@zeal/domains/Account/helpers/generateAccountsLabel'
import { PrivateKey } from '@zeal/domains/KeyStore'
import { getKeystoreFromPrivateKey } from '@zeal/domains/KeyStore/helpers/getKeystoreFromPrivateKey'

import {
    validateAsYouType,
    validateOnSubmit,
    ValidationError,
} from './validation'

type Props = {
    accounts: Account[]
    sessionPassword: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'close' }
    | {
          type: 'on_private_key_submitted'
          account: Account
          keystore: PrivateKey
      }

type InputState = 'hidden' | 'revealed'

export const Form = ({ sessionPassword, accounts, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    const [privateKey, setPrivateKey] = useState<string>('')

    const [submitted, setSubmitted] = useState<boolean>(false)
    const [inputState, setInputState] = useState<InputState>('hidden')

    const validationError = submitted
        ? validateOnSubmit(privateKey).getFailureReason() || {}
        : validateAsYouType(privateKey).getFailureReason() || {}

    const onSubmit = async () => {
        setSubmitted(true)
        const validation = validateOnSubmit(privateKey)

        switch (validation.type) {
            case 'Failure':
                break

            case 'Success': {
                const keystore = await getKeystoreFromPrivateKey(
                    validation.data,
                    sessionPassword
                )

                const { address } = privateKeyToAccount(`0x${validation.data}`)

                const [label] = generateAccountsLabels(
                    accounts,
                    'Private Key',
                    1
                )
                const oldAccount = accounts.find(
                    (acc) => acc.address === address
                )

                onMsg({
                    type: 'on_private_key_submitted',
                    account: {
                        address,
                        label: oldAccount?.label || label,
                        avatarSrc: oldAccount?.avatarSrc || null,
                    },
                    keystore,
                })
                break
            }

            /* istanbul ignore next */
            default:
                notReachable(validation)
        }
    }

    return (
        <Screen
            background="light"
            padding="form"
            onNavigateBack={() => onMsg({ type: 'close' })}
        >
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() => onMsg({ type: 'close' })}
                        aria-label={formatMessage({
                            id: 'actions.back',
                            defaultMessage: 'Back',
                        })}
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

                <Input
                    keyboardType="default"
                    onSubmitEditing={onSubmit}
                    autoFocus
                    variant="regular"
                    type={inputState === 'hidden' ? 'password' : 'text'}
                    value={privateKey}
                    onChange={(e) => {
                        setPrivateKey(e.nativeEvent.text)
                    }}
                    state={
                        submitted && validationError.inputMessage
                            ? 'error'
                            : 'normal'
                    }
                    placeholder={formatMessage({
                        id: 'AddFromPrivateKey.typeOrPaste',
                        defaultMessage: 'Type or paste here',
                    })}
                    message={
                        validationError.inputMessage && (
                            <ErrorMessage
                                error={validationError.inputMessage}
                            />
                        )
                    }
                    sideMessage={
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

                                    /* istanbul ignore next */
                                    default:
                                        notReachable(inputState)
                                }
                            }}
                        />
                    }
                    rightIcon={
                        !validationError.inputIcon ? (
                            <Checkbox size={24} color="iconAccent2" />
                        ) : null
                    }
                />
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
                        disabled={!!validationError.submitButton}
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

export const ErrorMessage = ({
    error,
}: {
    error: NonNullable<ValidationError['inputMessage']>
}) => {
    switch (error.type) {
        case 'not_valid_private_key':
            return (
                <FormattedMessage
                    id="PrivateKeyValidationError.not_valid_private_key"
                    defaultMessage="This is not a valid private key"
                />
            )

        /* istanbul ignore next */
        default:
            return notReachable(error.type)
    }
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

                        /* istanbul ignore next */
                        default:
                            return notReachable(state)
                    }
                })()}
            </Row>
        )}
    </Tertiary>
)
