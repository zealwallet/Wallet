import { useLayoutEffect, useRef } from 'react'

// see: https://github.com/reakit/reakit/blob/master/packages/reakit-utils/src/useLiveRef.ts
export const useLiveRef = <U>(target: U) => {
    const ref = useRef(target)
    useLayoutEffect(() => {
        ref.current = target
    })
    return ref
}
