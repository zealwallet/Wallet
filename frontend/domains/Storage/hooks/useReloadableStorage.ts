import { Dispatch, SetStateAction, useEffect } from 'react'
import { DeviceEventEmitter } from 'react-native'

import { notReachable } from '@zeal/toolkit'
import {
    ReloadableData,
    useReloadableData,
} from '@zeal/toolkit/LoadableData/ReloadableData'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { NetworkMap } from '@zeal/domains/Network'
import { Storage } from '@zeal/domains/Storage'

import { fetchStorage } from '../api/fetchStorage'

type Data = {
    storage: Storage | null
    sessionPassword: string | null
    installationId: string
    networkMap: NetworkMap
}

type Params = undefined

type ReturnType = [
    ReloadableData<Data, Params>,
    Dispatch<SetStateAction<ReloadableData<Data, Params>>>
]

export const useReloadableStorage = (
    initialState:
        | ReloadableData<Data, Params>
        | (() => ReloadableData<Data, Params>)
): ReturnType => {
    const [loadable, setLoadable] = useReloadableData(
        fetchStorage,
        initialState
    )

    useEffect(() => {
        const listener = () => {
            setLoadable((old) => {
                switch (old.type) {
                    case 'loaded':
                    case 'reloading':
                    case 'subsequent_failed':
                        return {
                            type: 'reloading',
                            params: old.params,
                            data: old.data,
                        }

                    case 'loading':
                    case 'error':
                        return {
                            type: 'loading',
                            params: old.params,
                        }

                    /* istanbul ignore next */
                    default:
                        return notReachable(old)
                }
            })
        }

        switch (ZealPlatform.OS) {
            case 'ios':
            case 'android':
                const subscriber = DeviceEventEmitter.addListener(
                    'storageChange',
                    listener
                )
                return () => subscriber.remove()

            case 'web': {
                chrome.storage.onChanged.addListener(listener)

                return () => {
                    chrome.storage.onChanged.removeListener(listener)
                }
            }

            default:
                return notReachable(ZealPlatform.OS)
        }
    }, [loadable, setLoadable])

    useEffect(() => {
        switch (loadable.type) {
            case 'loaded':
            case 'reloading':
            case 'subsequent_failed':
            case 'loading':
                break

            case 'error':
                captureError(loadable.error)
                break

            default:
                notReachable(loadable)
        }
    }, [loadable])

    return [loadable, setLoadable]
}
