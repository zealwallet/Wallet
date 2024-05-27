import React, { useState } from 'react'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import { PortalProvider } from '@gorhom/portal'
import * as Linking from 'expo-linking'
import * as NavigationBar from 'expo-navigation-bar'
import * as SplashScreen from 'expo-splash-screen'

import { Actions } from '@zeal/uikit/Actions'
import { Button } from '@zeal/uikit/Button'
import { colors } from '@zeal/uikit/colors'
import { Column } from '@zeal/uikit/Column'
import { Row } from '@zeal/uikit/Row'
import { Screen } from '@zeal/uikit/Screen'
import { Text } from '@zeal/uikit/Text'
import { FontsLoader } from '@zeal/uikit/Text/FontsLoader'

import { noop, notReachable } from '@zeal/toolkit'
import { getEnvironment, isProduction } from '@zeal/toolkit/Environment'
import { keys } from '@zeal/toolkit/Object'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { fromString } from '@zeal/domains/Address/helpers/fromString'
import { GNOSIS_PAY_SUPPORTED_COUNTRIES } from '@zeal/domains/Card/constants'
// eslint-disable-next-line zeal-domains/no-feature-deep-import
import { Onboarded } from '@zeal/domains/Card/features/CardTab/Flow/GnosisCardStatus/Onboarded'
import {
    CountrySelector,
    PRIORITY_COUNTRIES,
    Title,
} from '@zeal/domains/Country/components/CountrySelector'
import { FIAT_CURRENCIES } from '@zeal/domains/Currency/constants'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { WalletWidgetFork } from '@zeal/domains/Main/features/EntryPoint'
import { getManifest } from '@zeal/domains/Manifest/helpers/getManifest'
import { lock, logout } from '@zeal/domains/Storage/helpers/logout'

import { AppProvider } from './AppProvider'

SplashScreen.preventAutoHideAsync()

type State =
    | { type: 'app' }
    | { type: 'version' }
    | { type: 'card' }
    | { type: 'country' }

export const RootComponent = () => (
    <FontsLoader
        onMsg={(msg) => {
            switch (msg.type) {
                case 'on_fonts_loading_finished':
                    switch (msg.result.type) {
                        case 'loaded':
                            ;(async () => {
                                await SplashScreen.hideAsync()
                            })()
                            break
                        case 'error':
                            ;(async () => {
                                await SplashScreen.hideAsync()
                            })()
                            captureError(msg.result.error)
                            break
                        default:
                            notReachable(msg.result)
                    }
                    break

                /* istanbul ignore next */
                default:
                    notReachable(msg.type)
            }
        }}
    >
        <RootLayout />
    </FontsLoader>
)

const RootLayout = () => {
    const url = Linking.useURL()

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

    const [state, setState] = useState<State>(
        isProduction() ? { type: 'app' } : { type: 'version' }
    )

    return (
        <SafeAreaProvider>
            <AppProvider>
                <PortalProvider>
                    {(() => {
                        switch (state.type) {
                            case 'card':
                                return (
                                    <Onboarded
                                        accountsMap={{}}
                                        installationId="some"
                                        encryptedPassword="some encrypted password"
                                        gnosisPayAccountOnboardedState={{
                                            transactions: [],
                                            type: 'onboarded',
                                            gnosisPayLoginInfo: {
                                                type: 'gnosis_pay_login_info',
                                                token: {} as any,
                                            },
                                            card: {
                                                id: 'some',
                                                details: {
                                                    cvv: '123',
                                                    pan: 'some',
                                                    expiryMonth: 'asdf',
                                                    expiryYear: 'asdf',
                                                    pin: '1234',
                                                },
                                                balance: {
                                                    currency:
                                                        FIAT_CURRENCIES['GBP'],
                                                    amount: 11111111111111111111n,
                                                },
                                                safeAddress: fromString(
                                                    '0x25b00a1dcf1812cc99d50e3f197545f0db385777'
                                                ).getSuccessResultOrThrow(''),
                                            },
                                        }}
                                        account={{
                                            avatarSrc: null,
                                            label: 'some',
                                            address: fromString(
                                                '0x25b00a1dcf1812cc99d50e3f197545f0db385777'
                                            ).getSuccessResultOrThrow(''),
                                        }}
                                    />
                                )

                            case 'country': {
                                return (
                                    <GestureHandlerRootView>
                                        <CountrySelector
                                            title={<Title />}
                                            priorityCountries={
                                                PRIORITY_COUNTRIES
                                            }
                                            countries={
                                                GNOSIS_PAY_SUPPORTED_COUNTRIES
                                            }
                                            selectedCountry="UA"
                                            onMsg={noop}
                                        />
                                    </GestureHandlerRootView>
                                )
                            }

                            case 'version':
                                return (
                                    <GestureHandlerRootView>
                                        <Screen
                                            padding="form"
                                            background="default"
                                            onNavigateBack={null}
                                        >
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
                                                    <Text
                                                        variant="paragraph"
                                                        weight="regular"
                                                        color="textPrimary"
                                                    >
                                                        url:[{url}]
                                                    </Text>
                                                </Row>

                                                <Column spacing={4}>
                                                    {(() => {
                                                        const weight: Record<
                                                            NonNullable<
                                                                React.ComponentProps<
                                                                    typeof Text
                                                                >['weight']
                                                            >,
                                                            true
                                                        > = {
                                                            regular: true,
                                                            medium: true,
                                                            semi_bold: true,
                                                            bold: true,
                                                        }

                                                        return keys(weight).map(
                                                            (weight) => (
                                                                <Text
                                                                    key={weight}
                                                                    variant="title3"
                                                                    weight={
                                                                        weight
                                                                    }
                                                                    color="textPrimary"
                                                                >
                                                                    GQ {weight}
                                                                </Text>
                                                            )
                                                        )
                                                    })()}
                                                </Column>
                                                <Actions variant="column">
                                                    <Button
                                                        size="regular"
                                                        variant="primary"
                                                        onClick={() =>
                                                            setState({
                                                                type: 'app',
                                                            })
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
                                                        country
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
                                                        onClick={() => {
                                                            setState({
                                                                type: 'card',
                                                            })
                                                        }}
                                                    >
                                                        Onboarded card
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
                                                </Actions>
                                            </Column>
                                        </Screen>
                                    </GestureHandlerRootView>
                                )

                            case 'app':
                                return (
                                    <WalletWidgetFork
                                        manifest={getManifest()}
                                    />
                                )

                            default:
                                return notReachable(state)
                        }
                    })()}
                </PortalProvider>
            </AppProvider>
        </SafeAreaProvider>
    )
}
