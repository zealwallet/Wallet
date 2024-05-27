import React from 'react'

import { Column } from '@zeal/uikit/Column'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'
import { Spinner } from '@zeal/uikit/Spinner'

type Props = {
    actionBar: React.ReactNode
    onClose: (() => void) | null
}

export const LoadingLayout = ({ actionBar, onClose }: Props) => (
    <Screen background="light" padding="form" onNavigateBack={onClose}>
        {actionBar}

        <Spacer />

        <Column alignX="center" spacing={0}>
            <Spinner size={72} color="iconStatusNeutral" />
        </Column>

        <Spacer />
    </Screen>
)
