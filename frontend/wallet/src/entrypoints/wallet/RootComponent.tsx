import { View } from 'react-native'

import './index.css'

import { ErrorBoundary } from '@zeal/domains/Error/components/ErrorBoundary'
import { WalletWidgetFork } from '@zeal/domains/Main/features/EntryPoint'
import { Manifest } from '@zeal/domains/Manifest'

import { AppProvider } from './AppProvider'

type Props = {
    manifest: Manifest
}

export const RootComponent = ({ manifest }: Props) => (
    <AppProvider>
        <ErrorBoundary>
            <WalletWidgetFork manifest={manifest} />
            <View id="modal" />
        </ErrorBoundary>
    </AppProvider>
)
