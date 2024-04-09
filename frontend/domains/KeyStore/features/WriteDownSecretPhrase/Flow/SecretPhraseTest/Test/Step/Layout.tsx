import React from 'react'
import { FormattedMessage } from 'react-intl'

import { ActionBar } from '@zeal/uikit/ActionBar'
import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Column } from '@zeal/uikit/Column'
import { Header } from '@zeal/uikit/Header'
import { BackIcon } from '@zeal/uikit/Icon/BackIcon'
import { ProgressShield } from '@zeal/uikit/Icon/ProgressShield'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { randomize } from '@zeal/toolkit/Array/helpers/randomaize'
import { values } from '@zeal/toolkit/Object'

export type SecretPhraseTestStep = {
    currentWordsIndexes: [number, number, number, number]
    correctIndex: number
    remainingWordsIndexes: number[]
}

export const generateSecretPhraseTestSteps = (
    steps: SecretPhraseTestStep[],
    remainingIndexes: number[],
    secretPhraseArray: string[],
    stepsCount: number
): SecretPhraseTestStep[] => {
    const randomIndexes = randomize(remainingIndexes)

    const [correctIndex, ...remainingWordsIndexes] = randomIndexes

    const headWord = secretPhraseArray[correctIndex]

    const uniqWordsRemainingIndexes = values(
        remainingWordsIndexes
            .map(
                (index) => [index, secretPhraseArray[index]] as [number, string]
            )
            .reduce(
                (acc, [index, word]) => ({ ...acc, [word]: index }),
                {} as Record<string, number>
            )
    )

    const filteredRestIndexes = uniqWordsRemainingIndexes.filter((index) => {
        const word = secretPhraseArray[index]
        return word !== headWord
    })

    const currentWordsIndexes = randomize([
        ...filteredRestIndexes.slice(0, 3),
        correctIndex,
    ]) as [number, number, number, number]

    const newStep: SecretPhraseTestStep = {
        currentWordsIndexes,
        remainingWordsIndexes,
        correctIndex,
    }

    const newSteps: SecretPhraseTestStep[] = [...steps, newStep]

    if (newSteps.length < stepsCount) {
        return generateSecretPhraseTestSteps(
            newSteps,
            remainingWordsIndexes,
            secretPhraseArray,
            stepsCount
        )
    } else {
        return newSteps
    }
}

type Props = {
    secretPhraseArray: string[]
    step: SecretPhraseTestStep
    totalSteps: number
    remainingSteps: number
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_correct_answer_click' }
    | { type: 'on_wrong_answer_click' }
    | { type: 'on_step_back_button_click' }

export const Layout = ({
    onMsg,
    secretPhraseArray,
    remainingSteps,
    step,
    totalSteps,
}: Props) => {
    const completed = new Array(totalSteps - remainingSteps - 1)
        .fill(true)
        .map((_, index) => (
            <React.Fragment key={`completed-${index}`}>
                <ProgressShield size={24} color="iconAccent2" />
            </React.Fragment>
        ))

    const remaining = new Array(remainingSteps + 1)
        .fill(true)
        .map((_, index) => (
            <React.Fragment key={`remaining-${index}`}>
                <ProgressShield size={24} color="iconDefault" />
            </React.Fragment>
        ))

    return (
        <Screen padding="form" background="light">
            <ActionBar
                left={
                    <IconButton
                        variant="on_light"
                        onClick={() =>
                            onMsg({ type: 'on_step_back_button_click' })
                        }
                    >
                        {({ color }) => <BackIcon size={24} color={color} />}
                    </IconButton>
                }
            />
            <Column spacing={24}>
                <Row spacing={8} alignX="center">
                    {completed}
                    {remaining}
                </Row>
                <Header
                    title={
                        <FormattedMessage
                            id="keystore.write_secret_phrase.secret_phrase_test.title"
                            defaultMessage="What is word {count} in your Secret Phrase?"
                            values={{
                                count: (
                                    <Text color="textAccent2">
                                        #{step.correctIndex + 1}
                                    </Text>
                                ),
                            }}
                        />
                    }
                />
                <Actions variant="column">
                    {step.currentWordsIndexes.map((value) => {
                        return (
                            <Button
                                key={secretPhraseArray[value]}
                                variant="secondary"
                                size="small"
                                onClick={() => {
                                    onMsg(
                                        value === step.correctIndex
                                            ? {
                                                  type: 'on_correct_answer_click',
                                              }
                                            : { type: 'on_wrong_answer_click' }
                                    )
                                }}
                            >
                                {secretPhraseArray[value]}
                            </Button>
                        )
                    })}
                </Actions>
            </Column>
        </Screen>
    )
}
