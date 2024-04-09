import React from 'react'

import { RenderProps, Rifm } from './Rifm'

type Props = {
    value: string | null
    onChange: (value: string | null) => void
    children: (args: RenderProps) => React.ReactNode
}

const parseDigits = (input: string): string =>
    (input.match(/\d+/g) || []).join('')

const formatDate = (input: string): string => {
    const digits = parseDigits(input)
    const chars = digits.split('')
    return chars
        .reduce(
            (r, v, index) =>
                index === 4 || index === 6 ? `${r}-${v}` : `${r}${v}`,
            ''
        )
        .substring(0, 10)
}

export const DateInput = ({ children, onChange, value }: Props) => {
    return (
        <Rifm
            accept={/\d/g}
            mask={10 <= (value?.length ?? 0)}
            format={formatDate}
            value={value ?? ''}
            onChange={onChange}
        >
            {children}
        </Rifm>
    )
}
