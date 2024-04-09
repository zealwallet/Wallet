import { useEffect } from 'react'
import { useIntl } from 'react-intl'
import { FormattedMessage } from 'react-intl'

import { Copy } from '@zeal/uikit/Icon/Copy'
import { TickSquare } from '@zeal/uikit/Icon/TickSquare'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Text } from '@zeal/uikit/Text'

import { notReachable } from '@zeal/toolkit'
import { useCopyTextToClipboard } from '@zeal/toolkit/Clipboard/hooks/useCopyTextToClipboard'

import { captureError } from '@zeal/domains/Error/helpers/captureError'

type Props = {
    'aria-labelledby'?: string
    text: string
}

export const CopyAccountProperty = ({
    text,
    'aria-labelledby': ariaLabeledBy,
}: Props) => {
    const { formatMessage } = useIntl()
    const [state, setState] = useCopyTextToClipboard()

    useEffect(() => {
        switch (state.type) {
            case 'loaded':
            case 'not_asked':
            case 'loading':
                break

            case 'error':
                captureError(state.error)
                break
            default:
                notReachable(state)
        }
    }, [state])

    switch (state.type) {
        case 'not_asked':
            return (
                <Row spacing={4} aria-labelledby={ariaLabeledBy}>
                    <Text
                        variant="paragraph"
                        color="textPrimary"
                        weight="medium"
                    >
                        {text}
                    </Text>
                    <IconButton
                        variant="on_light"
                        aria-label={formatMessage({
                            id: 'bank_transfers.deposit.copy',
                            defaultMessage: 'Copy',
                        })}
                        onClick={() =>
                            setState({
                                type: 'loading',
                                params: { stringToCopy: text },
                            })
                        }
                    >
                        {({ color }) => <Copy size={14} color={color} />}
                    </IconButton>
                </Row>
            )
        case 'loading':
            return (
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        color="textPrimary"
                        weight="medium"
                    >
                        {text}
                    </Text>
                    <Copy size={14} color="textPrimary" />
                </Row>
            )
        case 'loaded':
            return (
                <Row spacing={4}>
                    <Text
                        variant="paragraph"
                        color="textPrimary"
                        weight="medium"
                    >
                        <FormattedMessage
                            id="bank_transfers.deposit.account-property-copied"
                            defaultMessage="Copied"
                        />
                    </Text>
                    <TickSquare color="iconAccent1" size={14} />
                </Row>
            )
        case 'error':
            return null
        /* istanbul ignore next */
        default:
            return notReachable(state)
    }
}
