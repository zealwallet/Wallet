import React from 'react'

import { Input } from '@zeal/uikit/Input'

import { noop } from '@zeal/toolkit'

type Descendant = string

type Props = {
    errorWordsIndexes: number[] | null
    hidden: boolean
    value: Descendant[] | null
    autoFocus?: boolean
    readOnly?: boolean
    'data-testid'?: string
    onChange: (value: Descendant[]) => void
    onError: (error: unknown) => void
}

export const getPhraseString = (value: Descendant[] | null): string =>
    (value || []).flatMap((text) => text.toLowerCase()).join(' ')

export const getDescendantsFromString = (input: string): Descendant[] => {
    return input.split(' ')
}

export const SecretPhraseInput = ({
    value,
    errorWordsIndexes,
    hidden,
    autoFocus,
    readOnly,
    'data-testid': _,
    onChange,
}: Props) => {
    return (
        <Input
            keyboardType="default"
            autoFocus={autoFocus}
            type={hidden ? 'password' : 'multiline'}
            disabled={readOnly}
            variant="regular"
            value={getPhraseString(value)}
            onChange={(e) => {
                onChange(getDescendantsFromString(e.nativeEvent.text))
            }}
            onSubmitEditing={noop}
            state={
                errorWordsIndexes && errorWordsIndexes.length > 0
                    ? 'error'
                    : 'normal'
            }
            placeholder="phrase"
        />
    )
}
