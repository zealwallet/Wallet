import { useEffect } from 'react'

import { useFirstMountState } from './useFirstMountState'

export const useUpdateEffect: typeof useEffect = (effect, deps) => {
    const isFirstMount = useFirstMountState()

    useEffect(() => {
        if (!isFirstMount) {
            return effect()
        }
    }, deps) // eslint-disable-line react-hooks/exhaustive-deps
}
