import { components } from '@zeal/api/portfolio'

export type ConnectionSafetyCheck =
    components['schemas']['ConnectionSafetyCheck']

export type SuspiciousCharactersCheck = Extract<
    ConnectionSafetyCheck,
    { type: 'SuspiciousCharactersCheck' }
>

export type FailedConnectionSafetyCheck = Extract<
    ConnectionSafetyCheck,
    { state: 'Failed' }
>
