import React from 'react'

import { Screen } from '@zeal/uikit/Screen'

import { ViewFinder } from './ViewFinder'

type Props = {
    actionBar: React.ReactNode
    bottom: React.ReactNode
    content: React.ReactNode
    onClose: () => void
}

export const NoCamLayout = ({ actionBar, bottom, content, onClose }: Props) => {
    return (
        <Screen padding="form" background="dark" onNavigateBack={onClose}>
            {actionBar}

            <ViewFinder
                color="backgroundLight"
                bottom={bottom}
                content={content}
            />
        </Screen>
    )
}
