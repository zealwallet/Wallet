import ReactDOM from 'react-dom/client'

import '../../polyfill'
import * as Sentry from '@sentry/react'

import { getEnvironment } from '@zeal/toolkit/Environment/getEnvironment'
import { isLocal } from '@zeal/toolkit/Environment/isLocal'

import { getManifest } from '@zeal/domains/Manifest/helpers/getManifest'

import { RootComponent } from './RootComponent'

const manifest = getManifest()

if (!isLocal()) {
    Sentry.addTracingExtensions()

    Sentry.init({
        dsn: 'https://078a7d9162734227bf31d89617887291@o1301891.ingest.sentry.io/6776280',
        release: manifest.version,
        environment: getEnvironment(),

        integrations: [],

        tracesSampleRate: 0.05,
    })
}
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement)

root.render(<RootComponent manifest={manifest} />)
