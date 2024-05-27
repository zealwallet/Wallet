import { post } from '@zeal/api/request'
import once from 'lodash/once'

import { notReachable } from '@zeal/toolkit'
import { getEnvironment } from '@zeal/toolkit/Environment'
import { ZealPlatform } from '@zeal/toolkit/OS/ZealPlatform'

import { getManifest } from '@zeal/domains/Manifest/helpers/getManifest'

import { UserEvent } from '..'

export const postUserEvent = async (
    userEvent: UserEvent & { installationId: string }
): Promise<void> => {
    const completeUserEvent = {
        ...userEvent,
        version: getManifest().version,
        platform: ZealPlatform.OS,
    }
    const env = getEnvironment()
    try {
        switch (env) {
            case 'production':
                await post('/wallet/metrics', {
                    body: completeUserEvent,
                } as any) // we want to disconnect from swagger api as BE did not validate or is source of truth for events
                break

            case 'local':
                break

            case 'development':
                logEventToConsole(completeUserEvent)
                break

            default:
                notReachable(env)
        }
    } catch {}
}

const logEventToConsole = (userEvent: unknown) => {
    switch (ZealPlatform.OS) {
        case 'ios':
            // console.error is the only way for this log to appear in Console app. Prefix for easier filtering in Console tool
            console.error('AnalyticsEvent', userEvent) // eslint-disable-line no-console
            break
        case 'android':
            // just JSON in adb output. use `adb logcat "*:S" ReactNativeJS:V` to see it
            console.log('AnalyticsEvent', userEvent) // eslint-disable-line no-console
            break
        case 'web':
            // Look nice, do not pollute console much
            console.table(userEvent) // eslint-disable-line no-console
            break
        default:
            notReachable(ZealPlatform.OS)
    }
}

export const postUserEventOnce = once(postUserEvent)
