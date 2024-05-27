import { post } from '@zeal/api/request'

import { isProduction } from '@zeal/toolkit/Environment'

import { UserEvent } from '@zeal/domains/UserEvents'

// TODO unify with frontend/domains/UserEvents/index.ts - https://discord.com/channels/961390365708009524/1125745846898663597/1232259761790128129
export const postUserEvent = async (userEvent: UserEvent): Promise<void> => {
    try {
        if (isProduction()) {
            await post('/wallet/metrics', { body: userEvent } as any) // we want to disconnect from swagger api as BE did not validate or is source of truth for events
        } else {
            console.table(userEvent) // eslint-disable-line no-console
        }
    } catch (error) {}
}
