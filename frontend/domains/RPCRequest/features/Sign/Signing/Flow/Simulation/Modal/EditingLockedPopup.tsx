import React from 'react'
import { FormattedMessage } from 'react-intl'

import { Header } from '@zeal/uikit/Header'
import { BoldLock as Lock } from '@zeal/uikit/Icon/BoldLock'
import { Popup } from '@zeal/uikit/Popup'

type Props = {
    onMsg: (msg: Msg) => void
}

type Msg = { type: 'close' }

export const EditingLockedPopup = ({ onMsg }: Props) => {
    return (
        <Popup.Layout
            onMsg={onMsg}
            aria-labelledby="editing-locked-popup-title"
        >
            <Header
                titleId="editing-locked-popup-title"
                icon={({ size, color }) => <Lock size={size} color={color} />}
                title={
                    <FormattedMessage
                        id="editing-locked.modal.title"
                        defaultMessage="Editing locked"
                    />
                }
                subtitle={
                    <FormattedMessage
                        id="editing-locked.modal.description"
                        defaultMessage="Unlike Approval transactions, Permits do not allow you to edit the Spend Limit or Expiry Time. Make sure you trust a dApp before submitting a Permit."
                    />
                }
            />
        </Popup.Layout>
    )
}
