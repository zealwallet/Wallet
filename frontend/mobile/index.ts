import 'src/polyfills'
import 'react-native-get-random-values'
import * as Sentry from '@sentry/react-native'
import { registerRootComponent } from 'expo'

import {
    getEnvironment,
    isLocal,
    isProduction,
} from '@zeal/toolkit/Environment'

import { RootComponent } from 'src/entrypoint/RootComponent'

if (!isLocal()) {
    Sentry.init({
        dsn: 'https://963ae25e73324b42e807985b512a36ba@o1301891.ingest.us.sentry.io/4506989937491968',
        debug: !isProduction(),
        environment: getEnvironment(),
    })

    registerRootComponent(Sentry.wrap(RootComponent))
} else {
    registerRootComponent(RootComponent)
}
