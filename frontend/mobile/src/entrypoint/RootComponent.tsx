import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import * as NavigationBar from 'expo-navigation-bar'
import * as SecureStore from 'expo-secure-store'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { colors } from '@zeal/uikit/colors'
import { Column } from '@zeal/uikit/Column'
import { TextTest } from '@zeal/uikit/Input/RifmTest'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'

import { noop, notReachable } from '@zeal/toolkit'
import { getEnvironment } from '@zeal/toolkit/Environment'
import { values } from '@zeal/toolkit/Object'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

// eslint-disable-next-line zeal-domains/no-feature-deep-import
import { Layout } from '@zeal/domains/Account/features/Add/Modal/RestoreAccount/AddFromNewSecretPhrase/Form/Layout'
import { TrackWallet } from '@zeal/domains/Account/features/TrackWallet'
import { COUNTRIES_MAP } from '@zeal/domains/Country'
import { CountrySelector } from '@zeal/domains/Country/components/CountrySelector'
import { ImperativeError } from '@zeal/domains/Error'
import { WalletWidgetFork } from '@zeal/domains/Main/features/EntryPoint'
import { getManifest } from '@zeal/domains/Manifest/helpers/getManifest'
import { lock, logout } from '@zeal/domains/Storage/helpers/logout'

import { AppProvider } from './AppProvider'
import { StorageLoaderOnboarding } from './StorageLoaderOnboarding'

type State =
    | { type: 'secret_phrase' }
    | { type: 'onboarding' }
    | { type: 'app' }
    | { type: 'version' }
    | { type: 'input' }
    | { type: 'track_wallet' }
    | { type: 'country' }

async function save(key: string, value: string) {
    try {
        await SecureStore.setItemAsync(key, value, {
            requireAuthentication: false,
        })
    } catch (e) {
        alert('Error saving value: ' + (e as any).message)
    }
}

async function getValueFor(key: string) {
    const result = await SecureStore.getItemAsync(key)
    if (result) {
        alert("🔐 Here's your value 🔐 \n" + result)
    } else {
        alert('No values stored under that key.')
    }
}

const SESSION_STORAGE_KEY = 'sessionPassword_6222'

export const RootComponent = () => {
    React.useEffect(() => {
        switch (ZealPlatform.OS) {
            case 'ios':
            case 'web':
                break

            case 'android':
                NavigationBar.setBackgroundColorAsync(colors.backgroundLight)
                break

            default:
                notReachable(ZealPlatform.OS)
        }
    }, [])

    const [state, setState] = useState<State>({ type: 'version' })

    return (
        <SafeAreaProvider>
            <AppProvider>
                {(() => {
                    switch (state.type) {
                        case 'version':
                            return (
                                <Screen padding="form" background="default">
                                    <Column spacing={8} fill shrink>
                                        <Row spacing={4}>
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textPrimary"
                                            >
                                                {getManifest().version}
                                            </Text>
                                            <Text
                                                variant="paragraph"
                                                weight="regular"
                                                color="textPrimary"
                                            >
                                                {getEnvironment()}
                                            </Text>
                                        </Row>
                                        <Actions variant="column">
                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={() =>
                                                    setState({
                                                        type: 'onboarding',
                                                    })
                                                }
                                            >
                                                go for onboarding
                                            </Button>

                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={() =>
                                                    setState({ type: 'app' })
                                                }
                                            >
                                                go for app
                                            </Button>

                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={() =>
                                                    setState({
                                                        type: 'country',
                                                    })
                                                }
                                            >
                                                go country
                                            </Button>

                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={() =>
                                                    setState({
                                                        type: 'secret_phrase',
                                                    })
                                                }
                                            >
                                                secret_phrase
                                            </Button>

                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={() =>
                                                    setState({ type: 'input' })
                                                }
                                            >
                                                go for input
                                            </Button>

                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={async () => {
                                                    await lock()
                                                }}
                                            >
                                                lock
                                            </Button>
                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={async () => {
                                                    await logout()
                                                }}
                                            >
                                                logout
                                            </Button>
                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={async () => {
                                                    await save(
                                                        SESSION_STORAGE_KEY,
                                                        'woohoo'
                                                    )
                                                }}
                                            >
                                                save
                                            </Button>
                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={async () => {
                                                    await getValueFor(
                                                        SESSION_STORAGE_KEY
                                                    )
                                                }}
                                            >
                                                get
                                            </Button>

                                            <Button
                                                size="regular"
                                                variant="primary"
                                                onClick={async () => {
                                                    setState({
                                                        type: 'track_wallet',
                                                    })
                                                }}
                                            >
                                                track wallet
                                            </Button>
                                        </Actions>
                                    </Column>
                                </Screen>
                            )

                        case 'onboarding':
                            return (
                                <StorageLoaderOnboarding
                                    onMsg={(msg) => {
                                        switch (msg.type) {
                                            case 'on_accounts_create_success_animation_finished':
                                            case 'on_user_skipped_add_assets':
                                                setState({ type: 'app' })
                                                break

                                            case 'from_any_wallet_click':
                                            case 'bank_transfer_click':
                                                // FIXME
                                                throw new ImperativeError(
                                                    'not implemented'
                                                )

                                            /* istanbul ignore next */
                                            default:
                                                notReachable(msg)
                                        }
                                    }}
                                />
                            )

                        case 'app':
                            return <WalletWidgetFork manifest={getManifest()} />
                        case 'input':
                            return (
                                <Screen padding="form" background="default">
                                    <TextTest />
                                </Screen>
                            )

                        case 'track_wallet':
                            return (
                                <TrackWallet
                                    accountsMap={{}}
                                    networkRPCMap={{}}
                                    sessionPassword=""
                                    installationId=""
                                    keyStoreMap={{}}
                                    customCurrencies={{}}
                                    networkMap={{}}
                                    currencyHiddenMap={{}}
                                    variant="track"
                                    onMsg={noop}
                                />
                            )

                        case 'secret_phrase':
                            return (
                                <Layout
                                    initialSecretPhrase=""
                                    sessionPassword=""
                                    onMsg={noop}
                                />
                            )

                        case 'country':
                            return (
                                <CountrySelector
                                    selectedCountry="GB"
                                    countries={values(COUNTRIES_MAP)}
                                    onMsg={noop}
                                />
                            )

                        default:
                            return notReachable(state)
                    }
                })()}
            </AppProvider>
        </SafeAreaProvider>
    )
}
