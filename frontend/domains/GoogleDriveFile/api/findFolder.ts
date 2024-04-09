import { get } from '@zeal/api/googleDrive'

import { parseFiles } from '@zeal/domains/GoogleDriveFile/parsers/parseFile'

export const findFolder = ({
    token,
    folderName,
}: {
    token: string
    folderName: string
}): Promise<{
    folderId: string
} | null> =>
    get(
        '/files',
        {
            query: {
                q: `not trashed and mimeType = 'application/vnd.google-apps.folder' and name = '${folderName}'`,
                fields: 'files(id, name, modifiedTime)',
            },
        },
        token
    ).then((res) => {
        const files = parseFiles(res).getSuccessResultOrThrow(
            'Failed to parse file list when searching for folder'
        )

        return files.length ? { folderId: files[0].id } : null
    })
