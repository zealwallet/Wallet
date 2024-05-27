import React from 'react'
import { StyleSheet } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { Header } from '@zeal/uikit/Header'
import { Screen } from '@zeal/uikit/Screen'
import { Spacer } from '@zeal/uikit/Spacer'

import { captureAppError } from '@zeal/domains/Error/helpers/captureAppError'
import { parseAppError } from '@zeal/domains/Error/parsers/parseAppError'

type Props = {
    children: React.ReactNode
}

type State = {
    hasError: boolean
}

const styles = StyleSheet.create({
    safeAreaProvider: {
        width: '100%',
        height: '100%',
        minWidth: 360,
        flexDirection: 'row',
    },
})

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props)
        this.state = { hasError: false }
    }

    static getDerivedStateFromError() {
        return { hasError: true }
    }

    componentDidCatch(error: unknown, errorInfo: React.ErrorInfo) {
        captureAppError(parseAppError(error), {
            source: 'error_boundary',
            extra: { ...errorInfo },
        })
    }

    onRetry() {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            return (
                <SafeAreaProvider style={styles.safeAreaProvider}>
                    <Screen
                        background="default"
                        padding="form"
                        onNavigateBack={null}
                    >
                        <Header title="Something went wrong" />

                        <Spacer />

                        <Actions>
                            <Button
                                size="regular"
                                variant="primary"
                                onClick={this.onRetry}
                            >
                                Reload extension
                            </Button>
                        </Actions>
                    </Screen>
                </SafeAreaProvider>
            )
        }

        return this.props.children
    }
}
