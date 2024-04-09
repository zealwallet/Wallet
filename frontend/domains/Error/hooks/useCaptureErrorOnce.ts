import { useState } from 'react'

import once from 'lodash.once'

import { captureError } from '@zeal/domains/Error/helpers/captureError'

export const useCaptureErrorOnce = () => {
    const [captureErrorOnce] = useState<typeof captureError>(() =>
        once(captureError)
    )

    return captureErrorOnce
}
