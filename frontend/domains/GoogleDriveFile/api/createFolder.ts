import { post } from '@zeal/api/googleDrive'

import { object, shape, string } from '@zeal/toolkit/Result'

export const createFolder = ({
    token,
    folderName,
    parents,
}: {
    folderName: string
    token: string
    parents: string[]
}): Promise<{ folderId: string }> =>
    post(
        '/files',
        {
            query: {
                uploadType: 'multipart',
                fields: 'id',
            },
            body: {
                mimeType: 'application/vnd.google-apps.folder',
                name: folderName,
                parents,
            },
        },
        token
    ).then((res) => {
        const id = object(res)
            .andThen((obj) => shape({ id: string(obj.id) }))
            .map(({ id }) => id)
            .getSuccessResultOrThrow(
                'Failed to parse response after creating GoogleDrive folder'
            )

        return { folderId: id }
    })
