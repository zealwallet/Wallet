import { set } from '@zeal/toolkit/Storage/sessionStorage'

import { SESSION_PASSWORD_KEY } from '../constants'

export const saveSessionPassword = (password: string): Promise<void> =>
    set({
        key: SESSION_PASSWORD_KEY,
        value: password,
    })
