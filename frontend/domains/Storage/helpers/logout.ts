// TODO :: consider to move to Entry Point domain

import * as storage from '@zeal/toolkit/Storage'

import {
    INSTALL_ID_STORE_KEY,
    PIN_KEY,
    SESSION_PASSWORD_KEY,
} from '@zeal/domains/Storage/constants'

// I'm not sure about this one... but lets see
export const logout = async () => {
    const keysToDelete = (await storage.local.getAllKeys()).filter(
        (key) => key !== INSTALL_ID_STORE_KEY
    )
    await Promise.all([
        await storage.local.removeMany(keysToDelete),
        await lock(),
        await storage.secure.remove({ key: PIN_KEY }),
    ])
}

export const lock = async () => {
    await storage.session.remove({ key: SESSION_PASSWORD_KEY })
}
