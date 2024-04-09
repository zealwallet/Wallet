import React, { Children } from 'react'

import { Text } from '@zeal/uikit/Text'

type Props = {
    children: React.ReactNode
}

const content = ' · '

export const Chain = ({ children }: Props) => {
    return (
        <Text>
            {Children.toArray(children)
                .reduce(
                    (a: React.ReactNode[], v, index) => [
                        ...a,
                        v,
                        <Text key={`sep-${index}`}>{content}</Text>,
                    ],
                    []
                )
                .slice(0, -1)}
        </Text>
    )
}
