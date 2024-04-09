import { get } from '@zeal/api/googleDrive'

import { File } from '@zeal/domains/GoogleDriveFile'

type Params = {
    token: string
    file: File
}

export const fetchFileContent = ({ token, file }: Params): Promise<unknown> => {
    return get(
        `/files/${file.id}`,
        {
            query: {
                alt: 'media',
            },
        },
        token
    )
}
