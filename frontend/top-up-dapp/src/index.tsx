import { useLayoutEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { IntlProvider } from 'react-intl'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import './polyfill'
import * as Sentry from '@sentry/react'

import { getEnvironment } from '@zeal/toolkit/Environment/getEnvironment'
import { isLocal } from '@zeal/toolkit/Environment/isLocal'

import { ErrorBoundary } from '@zeal/domains/Error/components/ErrorBoundary'

import { App } from './App'

if (!isLocal()) {
    Sentry.init({
        dsn: 'https://5a06fa32714599f22e845633fd074c2a@o1301891.ingest.sentry.io/4506653980753920',
        release: `${process.env.ZEAL_APP_VERSION}`,
        environment: getEnvironment(),
    })
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

export const RootComponent = () => {
    useLayoutEffect(() => {
        const version = process.env.ZEAL_APP_VERSION
        const div = document.querySelector('.app-version')
        div && (div.innerHTML = `Version ${version}`)
    }, [])

    return (
        <IntlProvider locale="en">
            <ErrorBoundary>
                <SafeAreaProvider>
                    <App />
                </SafeAreaProvider>
            </ErrorBoundary>
        </IntlProvider>
    )
}

root.render(<RootComponent />)
