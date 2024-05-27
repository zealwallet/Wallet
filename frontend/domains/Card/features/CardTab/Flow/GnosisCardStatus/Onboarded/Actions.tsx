import { FormattedMessage, useIntl } from 'react-intl'

import { ActionButton } from '@zeal/uikit/ActionButton'
import { BoldAdd } from '@zeal/uikit/Icon/BoldAdd'
import { EyeOutline } from '@zeal/uikit/Icon/EyeOutline'
import { Freeze } from '@zeal/uikit/Icon/Freeze'
import { Row } from '@zeal/uikit/Row'

import { openGnosisPayDashboard } from '@zeal/domains/Card/helpers/openGnosisPayDashboard'
import { postUserEvent } from '@zeal/domains/UserEvents/api/postUserEvent'

type Props = {
    installationId: string
    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_add_cash_to_card_click' }
    | { type: 'on_show_card_details_click' }

export const Actions = ({ installationId, onMsg }: Props) => {
    const { formatMessage } = useIntl()
    return (
        <Row spacing={8}>
            <ActionButton
                onClick={() => {
                    postUserEvent({
                        type: 'ClickCardQuickActionsButtonEvent',
                        action: 'add_cash',
                        installationId,
                    })
                    onMsg({ type: 'on_add_cash_to_card_click' })
                }}
                title={
                    <FormattedMessage
                        id="card.quick-actions.add-cash"
                        defaultMessage="Add cash"
                    />
                }
                aria-label={formatMessage({
                    id: 'card.quick-actions.add-assets',
                    defaultMessage: 'Add cash',
                })}
            >
                {({ color, size }) => <BoldAdd color={color} size={size} />}
            </ActionButton>

            <ActionButton
                onClick={() => {
                    postUserEvent({
                        type: 'ClickCardQuickActionsButtonEvent',
                        action: 'details',
                        installationId: installationId,
                    })
                    onMsg({ type: 'on_show_card_details_click' })
                }}
                title={
                    <FormattedMessage
                        id="card.quick-actions.details"
                        defaultMessage="Details"
                    />
                }
                aria-label={formatMessage({
                    id: 'card.quick-actions.details',
                    defaultMessage: 'Details',
                })}
            >
                {({ color, size }) => <EyeOutline color={color} size={size} />}
            </ActionButton>

            <ActionButton
                onClick={() => {
                    postUserEvent({
                        type: 'ClickCardQuickActionsButtonEvent',
                        action: 'freeze',
                        installationId: installationId,
                    })
                    openGnosisPayDashboard()
                }}
                title={
                    <FormattedMessage
                        id="card.quick-actions.freeze"
                        defaultMessage="Freeze"
                    />
                }
                aria-label={formatMessage({
                    id: 'card.quick-actions.freeze',
                    defaultMessage: 'Freeze',
                })}
            >
                {({ color, size }) => <Freeze color={color} size={size} />}
            </ActionButton>
        </Row>
    )
}
