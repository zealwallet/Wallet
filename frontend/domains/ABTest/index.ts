import { useMemo } from 'react'

import { str as hash } from 'crc-32'

import { isProduction } from '@zeal/toolkit/Environment'

export type Feature = 'nbas'

export const useIsFeatureEnabled = (
    installationId: string,
    feature: Feature
): boolean => {
    return useMemo(() => {
        if (!isProduction()) {
            return true
        }
        const featureId = installationId + feature
        const hashed = hash(featureId)
        return hashed % 2 === 0
    }, [installationId, feature])
}
