import { ReactNode } from 'react'

import { ExternalLink } from '@zeal/uikit/Icon/ExternalLink'
import { IconButton } from '@zeal/uikit/IconButton'
import { Row } from '@zeal/uikit/Row'
import { Spacer } from '@zeal/uikit/Spacer'
import { Text } from '@zeal/uikit/Text'

import { openExternalURL } from '@zeal/toolkit/Window'

type Props = {
    label: ReactNode
    value: ReactNode
    explorerLink: string | null
}

export const DetailItem = ({ label, value, explorerLink }: Props) => (
    <Row spacing={2}>
        <Text variant="paragraph" weight="regular" color="textSecondary">
            {label}
        </Text>
        <Spacer />
        <Text variant="paragraph" weight="regular" color="textPrimary">
            {value}
        </Text>
        {explorerLink && (
            <IconButton
                variant="on_light"
                onClick={() => openExternalURL(explorerLink)}
            >
                {({ color }) => <ExternalLink size={16} color={color} />}
            </IconButton>
        )}
    </Row>
)
