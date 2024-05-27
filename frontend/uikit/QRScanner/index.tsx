import React, { useEffect, useState } from 'react'
import { StatusBar, StyleSheet, View } from 'react-native'

import { Camera, CameraView } from 'expo-camera/next'
import * as Linking from 'expo-linking'

import { Screen } from '@zeal/uikit/Screen'

import { notReachable, useLiveRef } from '@zeal/toolkit'
import { ImperativeError } from '@zeal/toolkit/Error'
import { useLoadableData } from '@zeal/toolkit/LoadableData/LoadableData'

import { NoCamLayout } from './NoCamLayout'
import { ViewFinder } from './ViewFinder'

import { Actions } from '../Actions'
import { Button } from '../Button'
import { Column } from '../Column'
import { CameraPermission } from '../Icon/CameraPermission'

type Props = {
    children: React.ReactNode
    actionBar: React.ReactNode

    labels: {
        unlockCamera: string
        tryAgain: string
    }

    onMsg: (msg: Msg) => void
}

type Msg =
    | { type: 'on_qr_code_scanned'; data: string }
    | { type: 'on_permissions_error'; error: unknown }
    | { type: 'close' }

const styles = StyleSheet.create({
    unlockButtonContainer: {
        width: 153,
    },
})

type Permissions = 'granted' | 'denied' | 'denied_without_prompt_allowed'

const fetchPermissions = async (): Promise<Permissions> => {
    const permissions = await Camera.requestCameraPermissionsAsync()

    if (permissions.granted) {
        return 'granted'
    } else if (!permissions.granted) {
        return permissions.canAskAgain
            ? 'denied'
            : 'denied_without_prompt_allowed'
    }

    throw new ImperativeError('Unexpected permissions state', { permissions })
}

export const QRScanner = ({ children, actionBar, labels, onMsg }: Props) => {
    const [submited, setSubmited] = useState<boolean>(false)
    const onMsgLive = useLiveRef(onMsg)
    const [loadable, setLoadable] = useLoadableData(fetchPermissions, {
        type: 'loading',
        params: undefined,
    })

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
                break
            case 'loading':
                break

            case 'error':
                onMsgLive.current({
                    type: 'on_permissions_error',
                    error: loadable.error,
                })
                break

            default:
                notReachable(loadable)
        }
    }, [onMsgLive, loadable])

    return (
        <>
            <StatusBar hidden />
            {(() => {
                switch (loadable.type) {
                    case 'loading':
                        return (
                            <NoCamLayout
                                actionBar={actionBar}
                                bottom={children}
                                content={null}
                                onClose={() => onMsg({ type: 'close' })}
                            />
                        )

                    case 'loaded':
                        switch (loadable.data) {
                            case 'granted':
                                return (
                                    <Screen
                                        padding="form"
                                        background="dark"
                                        onNavigateBack={() =>
                                            onMsg({ type: 'close' })
                                        }
                                    >
                                        <CameraView
                                            style={[StyleSheet.absoluteFill]}
                                            barcodeScannerSettings={{
                                                barcodeTypes: ['qr'],
                                            }}
                                            onBarcodeScanned={(event) => {
                                                setSubmited(true)
                                                return onMsg({
                                                    type: 'on_qr_code_scanned',
                                                    data: event.data,
                                                })
                                            }}
                                        />

                                        {actionBar}

                                        <ViewFinder
                                            color={
                                                submited
                                                    ? 'backgroundAlertSuccess'
                                                    : 'backgroundLight'
                                            }
                                            bottom={children}
                                            content={null}
                                        />
                                    </Screen>
                                )

                            case 'denied':
                                return (
                                    <NoCamLayout
                                        actionBar={actionBar}
                                        bottom={children}
                                        onClose={() => onMsg({ type: 'close' })}
                                        content={
                                            <View
                                                style={
                                                    styles.unlockButtonContainer
                                                }
                                            >
                                                <Column
                                                    spacing={20}
                                                    fill
                                                    alignX="center"
                                                    alignY="center"
                                                >
                                                    <CameraPermission
                                                        size={64}
                                                        color="iconAccent2"
                                                    />

                                                    <Actions>
                                                        <Button
                                                            size="small"
                                                            variant="primary"
                                                            onClick={() =>
                                                                setLoadable({
                                                                    type: 'loading',
                                                                    params: loadable.params,
                                                                })
                                                            }
                                                        >
                                                            {
                                                                labels.unlockCamera
                                                            }
                                                        </Button>
                                                    </Actions>
                                                </Column>
                                            </View>
                                        }
                                    />
                                )

                            case 'denied_without_prompt_allowed':
                                return (
                                    <NoCamLayout
                                        actionBar={actionBar}
                                        bottom={children}
                                        onClose={() => onMsg({ type: 'close' })}
                                        content={
                                            <View
                                                style={
                                                    styles.unlockButtonContainer
                                                }
                                            >
                                                <Column
                                                    spacing={20}
                                                    fill
                                                    alignX="center"
                                                    alignY="center"
                                                >
                                                    <CameraPermission
                                                        size={64}
                                                        color="iconAccent2"
                                                    />

                                                    <Actions>
                                                        <Button
                                                            size="small"
                                                            variant="primary"
                                                            onClick={() => {
                                                                Linking.openSettings()
                                                                setLoadable({
                                                                    type: 'loading',
                                                                    params: loadable.params,
                                                                })
                                                            }}
                                                        >
                                                            {
                                                                labels.unlockCamera
                                                            }
                                                        </Button>
                                                    </Actions>
                                                </Column>
                                            </View>
                                        }
                                    />
                                )
                            default:
                                return notReachable(loadable.data)
                        }

                    case 'error':
                        return (
                            <NoCamLayout
                                actionBar={actionBar}
                                bottom={children}
                                onClose={() => onMsg({ type: 'close' })}
                                content={
                                    <View style={styles.unlockButtonContainer}>
                                        <Column
                                            spacing={20}
                                            fill
                                            alignX="center"
                                            alignY="center"
                                        >
                                            <CameraPermission
                                                size={64}
                                                color="iconAccent2"
                                            />

                                            <Actions>
                                                <Button
                                                    size="small"
                                                    variant="primary"
                                                >
                                                    {labels.tryAgain}
                                                </Button>
                                            </Actions>
                                        </Column>
                                    </View>
                                }
                            />
                        )

                    default:
                        return notReachable(loadable)
                }
            })()}
        </>
    )
}
