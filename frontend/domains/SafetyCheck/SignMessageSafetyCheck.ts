import { components } from '@zeal/api/portfolio'

export type SignMessageSafetyCheck =
    components['schemas']['SignMessageSafetyCheck']

export type FailedSignMessageSafetyCheck = Extract<
    SignMessageSafetyCheck,
    { state: 'Failed' }
>
