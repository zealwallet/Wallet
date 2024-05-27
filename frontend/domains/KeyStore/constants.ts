import { ZEAL_WEBSITE } from '@zeal/domains/Main/constants'

export const TERZOR_INIT_CONFIG = {
    lazyLoad: true,
    connectSrc: 'https://connect.trezor.io/9/',
    debug: false,
    manifest: {
        email: 'hi@zeal.app',
        appUrl: ZEAL_WEBSITE,
    },
}

export const TREZOR_EXTENDED_PUBLIC_KEY_PATH = `m/44'/60'/0'/0`

export const DEFAULT_SAFE_BIP_PATH = `m/44'/60'/0'/0/0`

export const ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT = '.zealbackup'

export const ZEAL_BACKUP_FOLDER_NAME = 'Zeal Backups'

export const ZEAL_PASSKEY_DOMAIN = 'passkey.zealwallet.com'
