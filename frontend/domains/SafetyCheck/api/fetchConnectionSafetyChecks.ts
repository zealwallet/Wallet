import { components } from '@zeal/api/portfolio'
import { post } from '@zeal/api/request'

import { DAppSiteInfo } from '@zeal/domains/DApp'

export type ConnectionSafetyChecksResponse =
    components['schemas']['ConnectionSafetyChecksResponse']

export const fetchConnectionSafetychecks = (
    dappInfo: DAppSiteInfo
): Promise<ConnectionSafetyChecksResponse> =>
    post('/wallet/safetychecks/connection/', { body: dappInfo })
