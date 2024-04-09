import * as React from 'react'

import { Big } from 'big.js'

import { RenderProps, Rifm } from './Rifm'

type Props = {
    integerString: string
    onChange: (hex: string) => void
    children: (args: RenderProps) => React.ReactNode
}

const integerAccept = /\d+/g

const parseInteger = (string: string): string =>
    (string.match(integerAccept) || []).join('')

const formatInteger = (string: string): string => {
    try {
        const parsed = parseInteger(string)
        if (parsed === '0') {
            return ''
        }
        return new Big(parsed).toFixed(0).substring(0, 30)
    } catch (e) {
        return ''
    }
}

export const IntegerInput = ({ integerString, onChange, children }: Props) => {
    const value = new Big(integerString)
        .round(undefined, Big.roundUp)
        .toFixed(0)

    return (
        <Rifm
            accept={/\d/g}
            format={(string) => {
                return formatInteger(string)
            }}
            value={value}
            onChange={(s) => {
                onChange(parseInteger(s) || '0')
            }}
        >
            {children}
        </Rifm>
    )
}
