import { useEffect, useState } from 'react'

export const useCurrentTimestamp = ({
    refreshIntervalMs: intervalMs,
}: {
    refreshIntervalMs: number
}) => {
    const [state, setState] = useState<number>(Date.now())

    useEffect(() => {
        const timeout = setTimeout(() => setState(Date.now()), intervalMs)
        return () => clearTimeout(timeout)
    }, [state, intervalMs])

    return state
}
