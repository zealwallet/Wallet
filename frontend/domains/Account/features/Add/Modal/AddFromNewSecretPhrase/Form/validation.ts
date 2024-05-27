import * as bip39 from '@scure/bip39'
import { wordlist } from '@scure/bip39/wordlists/english'

import {
    EmptyStringError,
    failure,
    nonEmptyString,
    Result,
    shape,
    success,
} from '@zeal/toolkit/Result'

export const MAX_WORD_COUNT = 24
export const MIN_WORD_COUNT = 12
const ENGLISH_BIP39_WORDS_SET = new Set<string>(wordlist)

type WordsMispelledOrInvalid = {
    type: 'word_misspelled_or_invalid'
    wordsIndexes: number[]
}

type MoreThanMaximumWords = {
    type: 'more_than_maximum_words'
}

type LessThanMinimumWords = {
    type: 'less_than_minimum_words'
}

type SecretPhraseIsInvalid = {
    type: 'secret_phrase_is_invalid'
}

const validateMinimumWords = (
    phrase: string
): Result<LessThanMinimumWords, string> => {
    const words = phrase.trim().split(' ')

    return words.length < MIN_WORD_COUNT
        ? failure({ type: 'less_than_minimum_words' })
        : success(phrase)
}

const validateMispelledWords = (
    phrase: string
): Result<WordsMispelledOrInvalid, string> => {
    const invalidWordsIndexes = phrase
        .trim()
        .split(' ')
        .reduce(
            (acc, word, index) =>
                !ENGLISH_BIP39_WORDS_SET.has(word) ? [...acc, index] : acc,
            [] as number[]
        )

    return invalidWordsIndexes.length > 0
        ? failure({
              type: 'word_misspelled_or_invalid',
              wordsIndexes: invalidWordsIndexes,
          })
        : success(phrase)
}

const validateMaximumWords = (
    phrase: string
): Result<MoreThanMaximumWords, string> => {
    const words = phrase.trim().split(' ')
    return words.length > MAX_WORD_COUNT
        ? failure({ type: 'more_than_maximum_words' })
        : success(phrase)
}

const validatePhraseIsValid = (
    phrase: string
): Result<SecretPhraseIsInvalid, string> => {
    try {
        bip39.mnemonicToEntropy(phrase, wordlist)
        return success(phrase)
    } catch {
        return failure({ type: 'secret_phrase_is_invalid' })
    }
}

const normalizeSecretPhrase = (phrase: string): string => phrase.toLowerCase()

export type ValidationError = {
    inputMessage?:
        | WordsMispelledOrInvalid
        | MoreThanMaximumWords
        | SecretPhraseIsInvalid
    submitEnabled?: EmptyStringError | LessThanMinimumWords
    submit?:
        | EmptyStringError
        | LessThanMinimumWords
        | MoreThanMaximumWords
        | SecretPhraseIsInvalid
        | WordsMispelledOrInvalid
}

export const validateAsYouType = (
    input: string
): Result<ValidationError, unknown> =>
    success(normalizeSecretPhrase(input)).andThen((normalised) =>
        shape({
            inputMessage:
                validateMispelledWords(normalised).andThen(
                    validateMaximumWords
                ),
            submitEnabled:
                nonEmptyString(normalised).andThen(validateMinimumWords),
        })
    )

export const validateSubmit = (
    input: string
): Result<ValidationError, string> =>
    success(normalizeSecretPhrase(input)).andThen((normalised) =>
        shape({
            inputMessage: validateMispelledWords(normalised)
                .andThen(validateMaximumWords)
                .andThen(validatePhraseIsValid),
            submitEnabled:
                nonEmptyString(normalised).andThen(validateMinimumWords),
            submit: nonEmptyString(normalised)
                .andThen(validateMaximumWords)
                .andThen(validateMinimumWords)
                .andThen(validateMispelledWords)
                .andThen(validatePhraseIsValid),
        }).map(({ submit }) => submit)
    )
