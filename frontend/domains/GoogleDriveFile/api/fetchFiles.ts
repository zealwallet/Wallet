import { get } from '@zeal/api/googleDrive'

import { File } from '@zeal/domains/GoogleDriveFile'
import { parseFiles } from '@zeal/domains/GoogleDriveFile/parsers/parseFile'

export const fetchFiles = ({
    token,
    nameContains,
}: {
    token: string
    nameContains: string
}): Promise<File[]> => {
    return get(
        '/files',
        {
            query: {
                q: `not trashed and mimeType != 'application/vnd.google-apps.folder' and name contains '${nameContains}'`,
                fields: 'files(id, name, modifiedTime)',
            },
        },
        token
    ).then((res) =>
        parseFiles(res).getSuccessResultOrThrow('cannot parse google files')
    )
}
