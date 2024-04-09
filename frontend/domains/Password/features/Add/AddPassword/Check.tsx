import { ReactNode } from 'react'

import { Checkbox } from '@zeal/uikit/Icon/Checkbox'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { Result } from '@zeal/toolkit/Result'

type Props = {
    result: Result<unknown, unknown>
    text: ReactNode
}

export const Check = ({ result, text }: Props) => {
    const color = (() => {
        switch (result.type) {
            case 'Failure':
                return 'iconDefault'
            case 'Success':
                return 'iconAccent2'
            /* istanbul ignore next */
            default:
                return notReachable(result)
        }
    })()

    return (
        <Row spacing={8}>
            <Checkbox size={18} color={color} />
            <Text variant="caption1" weight="regular" color="textSecondary">
                {text}
            </Text>
        </Row>
    )
}
