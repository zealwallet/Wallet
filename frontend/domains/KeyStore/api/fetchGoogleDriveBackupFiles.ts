import { fetchFiles } from '@zeal/domains/GoogleDriveFile/api/fetchFiles'
import { ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT } from '@zeal/domains/KeyStore/constants'

export const fetchGoogleDriveBackupFiles = ({ token }: { token: string }) =>
    fetchFiles({ token, nameContains: ZEAL_BACKUP_FILE_EXTENSION_WITH_DOT })
