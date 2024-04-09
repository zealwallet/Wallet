import { postUpload } from '@zeal/api/googleDrive'

import { object, parseDate, shape, string } from '@zeal/toolkit/Result'

export const createFile = ({
    token,
    fileName,
    fileData,
    parents,
}: {
    fileName: string
    fileData: string
    token: string
    parents: string[]
}): Promise<{ fileId: string; modifiedTime: number }> => {
    const formData = new FormData()
    formData.append(
        'metadata',
        new Blob(
            [
                JSON.stringify({
                    type: 'application/octet-stream',
                    name: fileName,
                    parents,
                }),
            ],
            { type: 'application/json' }
        ),
        'metadata'
    )
    formData.append(
        'file',
        new Blob([fileData], { type: 'application/octet-stream' }),
        fileName
    )

    return postUpload(
        '/files',
        {
            query: { uploadType: 'multipart', fields: 'id,modifiedTime' },
            body: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
        },
        token
    ).then((res) => {
        const { id, modifiedTime } = object(res)
            .andThen((obj) =>
                shape({
                    id: string(obj.id),
                    modifiedTime: string(obj.modifiedTime)
                        .andThen(parseDate)
                        .map((date) => date.valueOf()),
                })
            )
            .getSuccessResultOrThrow(
                'Failed to parse response after creating GoogleDrive file'
            )

        return { fileId: id, modifiedTime }
    })
}
