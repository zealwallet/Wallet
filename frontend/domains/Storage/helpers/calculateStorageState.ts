import { ImperativeError } from '@zeal/domains/Error'
import { captureError } from '@zeal/domains/Error/helpers/captureError'
import { Storage, StorageState } from '@zeal/domains/Storage'

export const calculateStorageState = ({
    sessionPassword,
    storage,
}: {
    storage: Storage | null
    sessionPassword: string | null
}): StorageState => {
    if (storage && sessionPassword) {
        return { type: 'unlocked', storage, sessionPassword }
    } else if (storage && !sessionPassword) {
        return { type: 'locked', storage }
    } else if (!storage && !sessionPassword) {
        return { type: 'no_storage' }
    }

    captureError(
        new ImperativeError(
            'Impossible state, no storage but sessionPassword is there'
        )
    )

    return { type: 'no_storage' }
}
