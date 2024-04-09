import { post } from '@zeal/api/request'
import once from 'lodash/once'

import { isProduction } from '@zeal/toolkit/Environment'

import { UserEvent } from '..'

export const postUserEvent = async (
    userEvent: UserEvent & { installationId: string }
): Promise<void> => {
    try {
        if (isProduction()) {
            await post('/wallet/metrics', { body: userEvent } as any) // we want to disconnect from swagger api as BE did not validate or is source of truth for events
        } else {
            console.table(userEvent) // eslint-disable-line no-console
        }
    } catch {}
}

export const postUserEventOnce = once(postUserEvent)
